# Web3 Token Trending List

A real-time trending token list application built with Next.js, TypeScript, and React. Features WebSocket data streaming with updates every 1-3 seconds.

## Features

- ⚡️ Next.js 16 with TypeScript
- ⚛️ React 19 - Latest React features
- 🔄 Real-time WebSocket updates (1-3 second intervals)
- 🎨 Modern dark theme UI inspired by GMGN and Binance Web3
- 📊 Comprehensive token metrics (price, volume, market cap, changes)
- 📱 Fully responsive design
- 🎯 Type-safe with TypeScript
- 🚀 Optimized for Performance

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn
- VPN may be required to access WebSocket data source

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### WebSocket Configuration

The application connects to a real-time WebSocket data source:
- **URL**: `wss://web-t.pinkpunk.io/ws`
- **Chain**: BSC (Binance Smart Chain, chainId: 56)
- **Topic**: trending tokens
- **Updates**: Real-time data pushed at 1-3 second intervals

**Note**: VPN may be required to access the WebSocket endpoint depending on your location.

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Creates an optimized production build
- `npm start` - Starts the production server
- `npm run lint` - Runs ESLint to check code quality

## Project Structure

```
web3/
├── pages/
│   ├── _app.tsx              # Custom App component
│   ├── _document.tsx         # Custom Document
│   └── index.tsx             # Home page with token list
├── components/
│   └── TokenList.tsx         # Token list table component
├── hooks/
│   └── useTokenWebSocket.ts  # WebSocket hook for real-time data
├── types/
│   └── token.ts              # TypeScript type definitions
├── styles/
│   ├── globals.css           # Global styles
│   ├── Home.module.css       # Home page styles
│   └── TokenList.module.css  # Token list styles
├── public/                   # Static files
├── tsconfig.json             # TypeScript configuration
├── next.config.js            # Next.js configuration
├── .gitignore
├── package.json
└── README.md
```

## Features Breakdown

### Token List Display
- **Rank**: Token ranking position
- **Token Info**: Symbol, name, and icon
- **Chain**: Blockchain information
- **Price**: Current token price with smart formatting
- **1h % / 24h %**: Price change percentages
- **24h Vol**: 24-hour trading volume
- **Vol %**: Volume change percentage
- **Market Cap**: Total market capitalization
- **MC %**: Market cap change percentage
- **Age**: Token age information

### Real-time Updates
- WebSocket connection with automatic reconnection (5s retry)
- Live indicator showing connection status
- Updates pushed every 1-3 seconds from real data source
- Automatic heartbeat/pong messages to maintain connection
- GZIP decompression for efficient data transfer
- Smooth data transitions

### UI/UX
- Dark theme optimized for extended viewing
- Color-coded positive (green) and negative (red) changes
- Hover effects on table rows
- Responsive design for mobile and desktop
- Custom scrollbar styling

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial
- [Next.js GitHub repository](https://github.com/vercel/next.js/)

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## License

MIT
