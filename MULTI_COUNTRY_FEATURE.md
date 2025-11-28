# Multi-Country Salary Comparison Feature

## Overview
The application now supports official government salary data from three countries for accurate international comparisons:

1. **Spain** - INE (Instituto Nacional de Estadística) 2023 data
2. **United States** - BLS (Bureau of Labor Statistics) 2023 data  
3. **United Kingdom** - ONS (Office for National Statistics) 2023 data

## Data Sources

### Spain (INE 2023)
- **Currency**: EUR (€)
- **Mean Salary**: €28,049.94
- **Median Salary**: €23,349.00
- **Source**: Official Spanish government statistics for national income

### United States (BLS 2023)
- **Currency**: USD ($)
- **Mean Salary**: $63,795
- **Median Salary**: $48,060
- **Source**: US Bureau of Labor Statistics wage data

### United Kingdom (ONS 2023)
- **Currency**: GBP (£)
- **Mean Salary**: £35,828
- **Median Salary**: £34,963
- **Source**: UK Office for National Statistics earnings survey

## How It Works

### Data Architecture
The multi-country system uses a unified data structure defined in `/src/lib/countryData.ts`:

```typescript
interface CountrySalaryData {
  country: string;
  year: number;
  currency: string;
  mean: number;
  median: number;
  p10: number;  // 10th percentile
  p25: number;  // 25th percentile
  p75: number;  // 75th percentile
  p90: number;  // 90th percentile
}
```

### Currency Conversion
When comparing salaries across countries, the system automatically converts currencies using exchange rates defined in `countryData.ts`:

- EUR → USD: 1.09
- GBP → USD: 1.27
- All conversions go through USD as the base currency

### Percentile Calculation
The system uses linear interpolation between known percentile points to accurately determine where a user's salary falls within the distribution:

1. User enters salary in their preferred currency
2. System converts to target country's currency (if comparing with official data)
3. Calculates percentile using country-specific distribution
4. Returns ranking (e.g., "You earn more than 67% of people")

## User Interface

### Dashboard Filter
Users can select from four comparison options:
- **Global Data** - Compare with anonymous user submissions
- **Spain (Official INE 2023)** - Compare with Spanish national statistics
- **United States (Official BLS 2023)** - Compare with US national statistics
- **United Kingdom (Official ONS 2023)** - Compare with UK national statistics

### Information Banner
When official country data is selected, an information banner appears showing:
- The country being compared to
- The data source (INE/BLS/ONS)
- The year of the statistics (2023)

## Technical Implementation

### Key Files
- `/src/lib/countryData.ts` - Country data definitions and calculations
- `/src/lib/mockData.ts` - Integration layer connecting country data to app logic
- `/src/components/Dashboard.tsx` - UI for country selection and display

### Data Flow
1. User enters salary in Dashboard filters
2. `calculateUserPercentiles()` checks if country comparison is enabled
3. If enabled, converts user's salary to country currency
4. Calls `calculateCountryPercentile()` with converted amount
5. Returns percentile ranking for display

### Data Separation
User submissions are stored separately and do NOT affect official statistics:
- User data goes to `global_metrics` table (if Supabase configured)
- Official country data remains immutable
- `USE_USER_DATA_IN_STATS = false` flag enforces separation

## Future Enhancements
- Add more countries (Germany, France, Canada, Australia, etc.)
- Regional breakdowns for larger countries
- Industry-specific salary data by country
- Historical trend data (compare 2022 vs 2023)
- PPP (Purchasing Power Parity) adjustments for cost of living
