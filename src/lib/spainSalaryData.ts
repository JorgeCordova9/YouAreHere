// Official salary data for Spain from INE (Instituto Nacional de Estadística)
// Data source: Spanish Annual Salary Structure Survey (2023)
// All values in Euros (annual gross salary)

import spainRawData from '../../28191.json';

export interface SpainSalaryData {
  region: string;
  regionCode: string;
  year: number;
  mean: number;
  median: number;
  p10: number;
  p25: number;
  p75: number;
  p90: number;
}

// Parse the JSON data and extract 2023 values
function parseSpainData(): SpainSalaryData[] {
  const result: SpainSalaryData[] = [];
  
  // Group data by region
  const regionMap = new Map<string, Partial<SpainSalaryData>>();
  
  spainRawData.forEach((entry: any) => {
    const metadata = entry.MetaData;
    const data2023 = entry.Data?.find((d: any) => d.Anyo === 2023);
    
    if (!data2023) return;
    
    // Extract region name
    const regionMeta = metadata.find((m: any) => 
      m.T3_Variable === 'Total Nacional' || m.T3_Variable === 'Comunidades y Ciudades Autónomas'
    );
    
    if (!regionMeta) return;
    
    const regionName = regionMeta.Nombre;
    const regionCode = regionMeta.Codigo;
    
    // Extract statistic type
    const statMeta = metadata.find((m: any) => 
      m.T3_Variable === 'Medidas estadísticas' || m.T3_Variable === 'Percentiles simples'
    );
    
    if (!statMeta) return;
    
    const key = `${regionCode}-${regionName}`;
    if (!regionMap.has(key)) {
      regionMap.set(key, {
        region: regionName,
        regionCode: regionCode,
        year: 2023
      });
    }
    
    const regionData = regionMap.get(key)!;
    const value = data2023.Valor;
    
    // Map statistics to our structure
    if (statMeta.Nombre === 'Media') {
      regionData.mean = value;
    } else if (statMeta.Nombre === 'Mediana') {
      regionData.median = value;
    } else if (statMeta.Nombre === 'Percentil 10') {
      regionData.p10 = value;
    } else if (statMeta.Nombre === 'Cuartil inferior') {
      regionData.p25 = value;
    } else if (statMeta.Nombre === 'Cuartil superior') {
      regionData.p75 = value;
    } else if (statMeta.Nombre === 'Percentil 90') {
      regionData.p90 = value;
    }
  });
  
  // Convert to array and filter complete entries
  regionMap.forEach((data) => {
    if (data.mean && data.median && data.p10 && data.p25 && data.p75 && data.p90) {
      result.push(data as SpainSalaryData);
    }
  });
  
  return result;
}

export const spainSalaryData = parseSpainData();

// Calculate percentile based on Spain's official national data
export function calculateSpainPercentile(salary: number): number {
  // Always use national data only
  const data = spainSalaryData.filter(d => d.region === "Total Nacional");
  
  if (data.length === 0) return 50; // Default to median if no data
  
  const regionData = data[0];
  
  // Determine percentile based on where salary falls
  if (salary <= regionData.p10) return 10;
  if (salary <= regionData.p25) {
    // Linear interpolation between P10 and P25
    return 10 + ((salary - regionData.p10) / (regionData.p25 - regionData.p10)) * 15;
  }
  if (salary <= regionData.median) {
    // Linear interpolation between P25 and P50
    return 25 + ((salary - regionData.p25) / (regionData.median - regionData.p25)) * 25;
  }
  if (salary <= regionData.p75) {
    // Linear interpolation between P50 and P75
    return 50 + ((salary - regionData.median) / (regionData.p75 - regionData.median)) * 25;
  }
  if (salary <= regionData.p90) {
    // Linear interpolation between P75 and P90
    return 75 + ((salary - regionData.p75) / (regionData.p90 - regionData.p75)) * 15;
  }
  
  // Above P90
  return Math.min(99, 90 + ((salary - regionData.p90) / (regionData.p90 * 0.2)) * 10);
}

// Get Spain salary statistics (national level only)
export function getSpainStats(): SpainSalaryData | null {
  // Always return national data only
  const national = spainSalaryData.find(d => d.region === "Total Nacional");
  return national || null;
}
