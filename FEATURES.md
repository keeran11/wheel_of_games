# Wheel of Names - Feature Documentation

## Winner Management Feature

### Auto-Remove Winner with Countdown

When a winner is selected after spinning the wheel, a modal appears with the following options:

#### Features:
1. **10-Second Countdown Timer**
   - Automatically counts down from 10 to 0
   - Displays: "Auto-closing in X seconds..."
   - Visual feedback with fading animation

2. **Action Buttons**

   **Remove from Wheel (Red Button)**
   - Removes the winner from the entries list
   - Useful for:
     - Eliminating winners so they can't win again
     - Progressive elimination games
     - Ensuring each person only wins once

   **Keep in Wheel (Green Button)**
   - Closes the modal
   - Winner remains in the wheel for future spins
   - Useful for:
     - Multiple rounds where same person can win
     - When you just want to see who won this round

3. **Auto-Remove Behavior**
   - If no button is clicked within 10 seconds
   - Winner is **automatically removed** from the wheel
   - Message displays: "Auto-removing winner in X seconds..."
   - This prevents the same person from winning multiple times by default

4. **Manual Close**
   - Click the × button in top-right corner
   - Winner stays in the wheel
   - Stops the countdown timer

#### How It Works Internally:

1. When wheel finishes spinning:
   - A snapshot of entries is taken at spin start time
   - Winner is determined from this snapshot
   - This prevents issues if entries change during spin

2. When "Remove from Wheel" is clicked:
   - Winner's entry is filtered out by ID
   - Entry list updates immediately
   - LocalStorage automatically saves the new list
   - Modal closes with fade animation

3. When "Keep in Wheel" is clicked:
   - Modal closes
   - No changes to entries
   - Ready for next spin

4. Countdown timer:
   - Uses `setInterval` to update every second
   - Automatically cleans up when modal closes
   - Prevents memory leaks

#### Visual Indicators:

- **Red Button**: Destructive action (removes entry)
- **Green Button**: Safe action (keeps entry)
- **Countdown Message**: Subtle fade-in/out animation
- **Button Hover**: Elevates and glows on hover

#### Use Cases:

**Scenario 1: Team Selection**
- Keep winners in wheel to form multiple teams
- Click "Keep in Wheel" after each selection

**Scenario 2: Prize Giveaway**
- Remove winners so they can't win twice
- Click "Remove from Wheel" after each winner

**Scenario 3: Random Order**
- Remove each person as they're selected
- Creates a random ordering of all participants

**Scenario 4: Quick Elimination**
- Don't click anything - let the timer run out
- Winner will be automatically removed after 10 seconds
- Perfect for fast-paced elimination games
