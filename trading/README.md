# Trading Platform

A web-based trading platform with advanced charting capabilities, market data integration, and trading tools.

## Project Structure

```
├── index.html          # Main HTML file
├── assets/
│   ├── css/           # Stylesheet files
│   │   ├── style.css      # Global styles
│   │   ├── chart.css      # Chart-specific styles
│   │   ├── layout.css     # Layout and grid styles
│   │   ├── themes.css     # Theme configuration
│   │   └── components.css # Reusable component styles
│   ├── js/            # JavaScript files
│   │   ├── app.js        # Main application logic
│   │   ├── chart.js      # Chart rendering and management
│   │   ├── indicators.js # Technical indicators
│   │   ├── marketData.js # Market data handling
│   │   ├── watchlist.js  # Watchlist functionality
│   │   ├── utils.js      # Utility functions
│   │   ├── drawing.js    # Chart drawing tools
│   │   └── auth.js       # Authentication handling
│   └── img/           # Image assets
│       ├── logo.svg      # Platform logo
│       └── icons/        # UI icons
```

## API Integration

This project uses the [Finnhub API](https://finnhub.io/) for real-time market data. To use the platform:

1. Sign up for a free account at [Finnhub.io](https://finnhub.io/register)
2. Get your API key from the dashboard
3. Replace `YOUR_FINNHUB_API_KEY` in `assets/js/marketData.js` with your actual API key

### Finnhub API Features Used:
- Real-time stock quotes
- WebSocket for live price updates
- Symbol lookup
- Historical candle data
- Company information

## Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Add your Finnhub API key to the `.env` file:
```
FINNHUB_API_KEY=your_api_key_here
```

### Development
The project includes a development API key with limited rate for testing purposes. 
For development:
- Use the included API key in `.env`
- The key has limited rate: 30 calls/minute
- WebSocket limited to 10 symbols

### Production
For production use:
1. Sign up at [Finnhub.io](https://finnhub.io/register)
2. Get your API key from the dashboard
3. Update your `.env` file with the production key

### Environment Files
- `.env`: Contains actual API keys (not committed to git)
- `.env.example`: Template file (committed to git)
- `.gitignore`: Configured to ignore `.env` file

## Getting Started

1. Clone the repository
2. Get your Finnhub API key as described above
3. Open index.html in your browser
4. Start developing!

## Features
- Real-time price updates via WebSocket
- Multiple chart types (candlestick, line, area)
- Technical indicators (SMA, EMA, Bollinger Bands, RSI)
- Drawing tools
- Watchlists with real-time updates
- Dark/Light theme support
- Market overview and economic calendar

## Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

## API Rate Limits
- Free tier: 60 API calls/minute
- WebSocket: 50 symbols per connection

## Note
Make sure to keep your API key secure and never commit it to version control. Consider using environment variables for production deployments.