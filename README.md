# Currency Converter

A modern, responsive currency converter application built with Next.js, TypeScript, and Tailwind CSS. Convert between 10 popular currencies with real-time exchange rates.

## Training Challenges

This repository is a hands-on learning platform for AI-assisted development with GitHub Copilot.

**[→ View all challenges](docs/challenges.md)** | **[📖 Copilot Best Practices](docs/copilot-reference.md)**

| Difficulty | Challenges |
|------------|-----------|
| 🟢 Beginner | [Project Creation](docs/1-challenge-project-creation.md), [Copilot Customisation](docs/2-challenge-customisation.md), [Unit Testing](docs/3-challenge-unit-test.md) |
| 🟡 Intermediate | [Bug Fixing](docs/4-challenge-bug-fix.md), [Feature Development](docs/5-challenge-feature.md), [GitHub Issues](docs/6-challenge-agent-issue.md) |
| 🔴 Advanced | [Spec-Kit](docs/7-challenge-spec-kit.md) |

> **Note:** Each branch contains the **completed solution**. Work through challenges using the docs, then check branches to compare your work.

## Features

### Core Functionality

- **Real-time Exchange Rates**: Fetches rates from multiple API sources with automatic fallback
- **10 Popular Currencies**: USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY, INR, MXN
- **Automatic Conversion**: No need to click convert - updates happen automatically
- **Currency Swap**: Quickly swap source and target currencies
- **URL Persistence**: Share conversions via URL parameters

### Advanced Features

- **Conversion History**: Tracks your last 10 conversions
- **History Management**: View, reload, or clear your conversion history
- **Input Validation**: Real-time validation with helpful error messages
- **Responsive Design**: Works perfectly on mobile and desktop devices
- **Error Handling**: Graceful fallback when API services are unavailable
- **Caching**: 1-hour cache for optimal performance

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API Sources**:
  - exchangerate.host
  - exchangerate-api.com
  - open.er-api.com

### Quick Start

```bash
# 1. Clone and install
git clone <repository-url>
npm install

# 2. Read the reference guide, then pick a challenge
cat docs/copilot-reference.md
cat docs/1-challenge-project-creation.md

# 3. Compare with solution (optional)
git checkout main
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd training-currency-converter
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
training-currency-converter/
├── app/
│   ├── api/
│   │   └── rates/
│   │       └── route.ts          # Exchange rates API endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main application page
├── types/
│   └── index.ts                  # TypeScript type definitions
├── utils/
│   ├── currency.ts               # Currency conversion utilities
│   └── storage.ts                # LocalStorage utilities
├── public/                       # Static assets
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Project dependencies
├── README.md                     # This file
└── CHANGELOG.md                  # Version history
```

## Usage

### Basic Conversion

1. Enter an amount in the input field
2. Select the source currency from the first dropdown
3. Select the target currency from the second dropdown
4. The conversion happens automatically

### Swap Currencies

Click the swap button (⇄) between the currency dropdowns to quickly exchange the source and target currencies.

### View History

1. Click the "Show" button in the History section
2. Click on any history item to reload that conversion
3. Use "Clear History" to remove all saved conversions

### Share Conversions

The URL updates automatically with conversion parameters. Copy and share the URL to share a specific conversion:

```
http://localhost:3000?amount=100&from=USD&to=EUR
```

## API Endpoints

### GET /api/rates

Fetches current exchange rates with USD as the base currency.

**Response:**

```json
{
  "success": true,
  "data": {
    "base": "USD",
    "rates": {
      "EUR": 0.85,
      "GBP": 0.73,
      ...
    },
    "timestamp": 1697184000000
  }
}
```

**Caching:** 1 hour (3600 seconds)

## Error Handling

The application handles various error scenarios:

- **Invalid Amount**: Shows validation error under the input field
- **API Failure**: Automatically tries fallback sources
- **Network Timeout**: 10-second timeout with error message
- **SSL Certificate Issues**: Handled with custom HTTPS agent

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **First Load**: ~2-3 seconds (includes API fetch)
- **Subsequent Loads**: Instant (1-hour cache)
- **Bundle Size**: Optimized for production
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices)

## Troubleshooting

### API Not Loading

If exchange rates fail to load:

1. Check your internet connection
2. The app automatically tries 3 different API sources
3. Wait a moment and try again
4. Check browser console for detailed error messages

### History Not Saving

If conversion history doesn't persist:

1. Ensure localStorage is enabled in your browser
2. Check if you're in private/incognito mode
3. Clear browser cache and try again

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Exchange rate data provided by:
  - [exchangerate.host](https://exchangerate.host)
  - [exchangerate-api.com](https://exchangerate-api.com)
  - [open.er-api.com](https://open.er-api.com)
- Built with [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Version**: 1.0.0  
**Last Updated**: October 2025
