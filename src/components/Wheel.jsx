import { useEffect, useRef, useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import './Wheel.css';

const Wheel = forwardRef(({ entries, onWinner, spinDuration = 5000, colors, wheelSize = 500, soundEnabled = true }, ref) => {
  const canvasRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const targetRotationRef = useRef(0);
  const spinEntriesRef = useRef([]); // Store entries snapshot at spin time
  const lastSegmentRef = useRef(-1); // Track last segment for tick sound
  const audioContextRef = useRef(null);

  const defaultColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    '#F8B739', '#52B788', '#FF8FAB', '#6C5CE7',
    '#A8E6CF', '#FFD93D', '#6BCF7F', '#95A5A6'
  ];

  const wheelColors = colors || defaultColors;

  // Memoize computed values for performance
  const computedValues = useMemo(() => {
    const baseFontSize = wheelSize / 25;
    let fontSize = baseFontSize;

    if (entries.length > 20) {
      fontSize = baseFontSize * 0.6;
    } else if (entries.length > 12) {
      fontSize = baseFontSize * 0.75;
    } else if (entries.length > 8) {
      fontSize = baseFontSize * 0.85;
    }

    return {
      fontSize,
      anglePerSegment: (2 * Math.PI) / (entries.length || 1),
      centerSize: Math.max(30, wheelSize / 16),
    };
  }, [entries.length, wheelSize]);

  // Draw the wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Update canvas size
    canvas.width = wheelSize;
    canvas.height = wheelSize;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context state
    ctx.save();

    // Apply rotation
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    if (entries.length === 0) {
      // Draw empty wheel
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#e0e0e0';
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.restore();
      return;
    }

    // Use memoized values
    const { fontSize, anglePerSegment, centerSize } = computedValues;

    // Helper function to measure and truncate text
    const getTruncatedText = (text, maxWidth) => {
      ctx.font = `bold ${fontSize}px Arial`;
      let truncated = text;
      let metrics = ctx.measureText(truncated);

      if (metrics.width <= maxWidth) {
        return truncated;
      }

      // Binary search for optimal length
      let left = 0;
      let right = text.length;

      while (left < right) {
        const mid = Math.floor((left + right + 1) / 2);
        truncated = text.substring(0, mid) + '...';
        metrics = ctx.measureText(truncated);

        if (metrics.width <= maxWidth) {
          left = mid;
        } else {
          right = mid - 1;
        }
      }

      return text.substring(0, left) + (left < text.length ? '...' : '');
    };

    // Calculate max text width based on segment size
    const maxTextWidth = radius * 0.7;

    // Draw segments - starting from top and going clockwise
    entries.forEach((entry, index) => {
      // Start from -90 degrees (top) and go clockwise
      const startAngle = -Math.PI / 2 + (index * anglePerSegment);
      const endAngle = startAngle + anglePerSegment;

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = wheelColors[index % wheelColors.length];
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + anglePerSegment / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 3;

      // Get truncated text if needed
      const displayText = getTruncatedText(entry.name, maxTextWidth);
      ctx.fillText(displayText, radius - 20, fontSize * 0.35);
      ctx.restore();
    });

    // Draw center circle (with dynamic size)
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerSize, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw spin button text (scaled with wheel)
    ctx.fillStyle = '#333';
    ctx.font = `bold ${Math.max(12, wheelSize / 35)}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('SPIN', centerX, centerY + centerSize * 0.15);

    ctx.restore();
  }, [entries, rotation, wheelColors, wheelSize, computedValues]);

  // Initialize audio context
  useEffect(() => {
    if (soundEnabled && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  }, [soundEnabled]);

  // Play tick sound
  const playTickSound = () => {
    if (!soundEnabled || !audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 600;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
  };

  // Easing function for smooth deceleration
  const easeOutCubic = (t) => {
    return 1 - Math.pow(1 - t, 3);
  };

  // Animation loop
  const animate = (currentTime) => {
    if (!startTimeRef.current) {
      startTimeRef.current = currentTime;
    }

    const elapsed = currentTime - startTimeRef.current;
    const progress = Math.min(elapsed / spinDuration, 1);

    // Apply easing
    const easedProgress = easeOutCubic(progress);
    const currentRotation = targetRotationRef.current * easedProgress;

    setRotation(currentRotation);

    // Play tick sound when crossing segment boundaries
    if (spinEntriesRef.current.length > 0 && progress < 1) {
      const normalizedRotation = ((currentRotation % 360) + 360) % 360;
      const degreesPerSegment = 360 / spinEntriesRef.current.length;
      const currentSegment = Math.floor(normalizedRotation / degreesPerSegment);

      if (currentSegment !== lastSegmentRef.current) {
        lastSegmentRef.current = currentSegment;
        playTickSound();
      }
    }

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Spinning complete
      setIsSpinning(false);
      startTimeRef.current = null;

      // Determine winner using the snapshot of entries from when spin started
      const spinEntries = spinEntriesRef.current;

      // Normalize rotation to 0-360 degrees
      const normalizedRotation = ((currentRotation % 360) + 360) % 360;

      // Degrees per segment
      const degreesPerSegment = 360 / spinEntries.length;

      // When rotation = 0, index 0 is at top (because we start drawing at -90°)
      // As we rotate clockwise (positive rotation), segments move clockwise
      // To find which segment is now at top, we divide rotation by segment size
      // and take the opposite direction (since wheel rotates but pointer stays fixed)

      // Calculate how many segments we've rotated past
      const segmentsRotated = normalizedRotation / degreesPerSegment;

      // Winner is the segment that has rotated to the top
      // We need to go backwards through the array as the wheel rotates forward
      let winnerIndex = Math.floor(spinEntries.length - segmentsRotated);

      // Ensure index is in valid range
      winnerIndex = ((winnerIndex % spinEntries.length) + spinEntries.length) % spinEntries.length;

      if (onWinner && spinEntries[winnerIndex]) {
        onWinner(spinEntries[winnerIndex]);
      }
    }
  };

  const handleSpin = () => {
    if (isSpinning || entries.length === 0) return;

    setIsSpinning(true);

    // Store a snapshot of current entries at the time of spin
    spinEntriesRef.current = [...entries];

    // Random rotation between 1800 and 3600 degrees (5-10 full rotations)
    const randomSpins = 5 + Math.random() * 5;
    const randomDegrees = Math.random() * 360;
    const totalRotation = rotation + (randomSpins * 360) + randomDegrees;

    targetRotationRef.current = totalRotation;
    startTimeRef.current = null;
    lastSegmentRef.current = -1; // Reset for tick sounds

    animationRef.current = requestAnimationFrame(animate);
  };

  // Expose spin method to parent via ref
  useImperativeHandle(ref, () => ({
    spin: handleSpin
  }));

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="wheel-container">
      <div className="wheel-pointer"></div>
      <canvas
        ref={canvasRef}
        onClick={handleSpin}
        className={`wheel-canvas ${isSpinning ? 'spinning' : ''}`}
      />
    </div>
  );
});

Wheel.displayName = 'Wheel';

export default Wheel;
