# Anonymous Metrics Comparison Platform

A privacy-focused web application where users can anonymously submit personal financial data (salary, net worth, rent) and instantly view how they compare to global aggregated statistics through interactive visualizations and percentile rankings.

## Features

### 🔒 Privacy First
- **100% Anonymous**: No accounts, no tracking, no personal data storage
- **Local Storage Only**: Optional browser-based storage for your convenience
- **Aggregated Data**: All comparisons use anonymous, aggregated statistics

### 📊 Interactive Dashboard
- **Percentile Rankings**: See exactly where you stand compared to others
- **Visual Progress Bars**: Color-coded indicators showing your position
- **Distribution Charts**: Interactive bar and line charts powered by Recharts
- **Real-time Comparisons**: Instant feedback on your financial metrics

### 🎯 Smart Filtering
- Filter comparisons by:
  - Industry/Sector
  - Age Range
  - Geographic Location
- Dynamic recalculation of statistics based on filters
- Clear visual indicators for active filters

### 📝 Multi-Step Form
- Clean, intuitive 7-step data entry process
- Progress indicator showing completion status
- Validation at each step
- Support for multiple currencies (USD, EUR, GBP, JPY, AUD, CAD, SGD)

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS with custom design tokens
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Form Handling**: React Hook Form + Zod validation
- **Animations**: Framer Motion + Tailwind CSS animations

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── Dashboard.tsx    # Main dashboard with charts and stats
│   ├── MetricsForm.tsx  # Multi-step form component
│   ├── WelcomeScreen.tsx # Landing page
│   ├── StatCard.tsx     # Reusable stat display card
│   ├── PercentileCard.tsx # Percentile ranking card
│   └── home.tsx         # Main app orchestrator
├── lib/
│   ├── mockData.ts      # Mock database and calculations
│   └── utils.ts         # Utility functions
├── types/
│   ├── metrics.ts       # TypeScript interfaces
│   └── supabase.ts      # Database types (if needed)
└── App.tsx              # Root component with routing
```

## Key Components

### WelcomeScreen
- Hero section with value proposition
- Feature highlights (Anonymous, Real Comparisons, Privacy First)
- Clear call-to-action
- Privacy notice

### MetricsForm
- 7-step progressive form
- Steps: Sector → Age → City → Salary → Currency → Net Worth → Rent
- Real-time validation
- Progress indicator
- Smooth transitions between steps

### Dashboard
- Global statistics cards (average/median values)
- Percentile ranking cards with color-coded progress bars
- Interactive charts with tabs (Salary, Net Worth, Rent distributions)
- Filter panel for refined comparisons
- User profile summary

## Data & Privacy

### Mock Data
The application uses a mock database of anonymous financial metrics for demonstration purposes. In a production environment, this would be replaced with a real backend service.

### Local Storage
User submissions are optionally saved to browser localStorage for convenience. No data is transmitted to external servers beyond what's needed for aggregated statistics.

### Calculations
- **Percentiles**: Calculated by comparing user input against the filtered dataset
- **Statistics**: Average and median values computed from aggregated data
- **Distributions**: Data bucketed into ranges for visualization

## Customization

### Adding New Sectors/Cities
Edit `src/lib/mockData.ts`:
```typescript
export const sectors = [
  "Technology",
  "Finance",
  // Add your sectors here
];
```

### Changing Color Scheme
Modify CSS variables in `src/index.css`:
```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* Customize other colors */
}
```

### Adding New Metrics
1. Update `UserMetrics` interface in `src/types/metrics.ts`
2. Add form step in `MetricsForm.tsx`
3. Update calculation functions in `src/lib/mockData.ts`
4. Add visualization in `Dashboard.tsx`

## Performance

- **Bundle Size**: ~644KB (minified)
- **First Load**: Optimized with code splitting
- **Charts**: Lazy-loaded Recharts components
- **Animations**: GPU-accelerated CSS transitions

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- [ ] Backend integration (Supabase/Firebase)
- [ ] More detailed filtering options
- [ ] Export data as PDF/CSV
- [ ] Historical trend tracking
- [ ] Social sharing (anonymized)
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Accessibility improvements (WCAG 2.1 AA)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
