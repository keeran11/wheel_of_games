# Wheel of Names Game

A fully-featured, React-based "Wheel of Names" application inspired by wheelofnames.com. Spin the wheel to randomly select winners from a list of entries!

## Features

### Core Functionality
- **Interactive Spinning Wheel** - Click the wheel to spin and randomly select a winner
- **Smooth Physics Animation** - Realistic acceleration and deceleration with easing
- **Random Selection** - True randomization with 5-10 full rotations plus random degrees

### Entry Management
- **Add/Edit/Remove Entries** - Full CRUD operations for wheel entries
- **Bulk Add** - Add multiple names at once (one per line)
- **Inline Editing** - Edit names directly in the list
- **Clear All** - Remove all entries with confirmation

### Customization
- **Custom Colors** - Click on color squares to customize each segment
- **Adjustable Spin Duration** - Control how long the wheel spins (2-10 seconds)
- **Sound Effects** - Toggle celebratory sounds on/off
- **Dark Mode** - Easy on the eyes for low-light environments

### Visual Effects
- **Confetti Animation** - Celebratory confetti when a winner is selected
- **Winner Modal** - Beautiful gradient modal displaying the winner
- **Smooth Animations** - Polished UI with transitions throughout

### Data Persistence
- **Local Storage** - All settings and entries saved automatically
- **Export/Import** - Save wheel configurations as JSON files
- **Share Wheels** - Export and share your wheel setups with others

## Technology Stack

- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Canvas API** - High-performance wheel rendering
- **Web Audio API** - Sound effects generation
- **LocalStorage API** - Data persistence

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies
```bash
npm install
```

2. Start the development server
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## Usage

1. **Add Names** - Enter names in the entry manager on the right
2. **Customize** - Change colors by clicking the color squares
3. **Configure** - Open settings to adjust spin duration, sounds, and theme
4. **Spin** - Click anywhere on the wheel to spin
5. **Winner** - Watch the confetti and see who won!

## Features Breakdown

### Wheel Component
- Canvas-based rendering for smooth performance
- Dynamic segment sizing based on number of entries
- Pointer indicator at the top
- Click-to-spin interaction

### Entry Manager
- Single entry input
- Bulk add via textarea
- Color picker for each entry
- Remove individual entries
- Clear all functionality

### Settings Panel
- Spin duration slider (2-10 seconds)
- Sound effects toggle
- Dark mode toggle
- Export wheel configuration
- Import wheel configuration

### Winner Display
- Animated modal with gradient background
- Pulsing winner name
- Confetti celebration
- Click to close

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers supported

## License

MIT

## Acknowledgments

Inspired by [Wheel of Names](https://wheelofnames.com/)
