interface RenewableData {
  solar: {
    monthlyRadiation: Record<number, number>; // Monthly solar irradiance values
    meanRadiation: number; // Annual mean
    cloudCover: number; // Average cloud cover
    temperature: number; // Average temperature
  };
  wind: {
    speed10m: {
      monthly: Record<number, number>; // Monthly wind speed at 10m
      mean: number; // Annual mean at 10m
    };
    speed50m: {
      monthly: Record<number, number>; // Monthly wind speed at 50m
      mean: number; // Annual mean at 50m
    };
    turbulence?: number;
    airDensity: number;
  };
  hydro: {
    elevation?: number;
    rainfall: {
      monthly: Record<number, number>; // Monthly rainfall values
      annual: number; // Total annual rainfall
    };
    slope?: number; // Optional slope data if available
  };
}

// Helper function to calculate mean safely
function calculateMean(values: number[]): number {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
}

// NASA POWER API for solar, wind, hydro data
export async function getRenewableData(
  lat: number,
  lng: number
): Promise<RenewableData> {
  const year = new Date().getFullYear() - 1; // Use previous year for complete data
  const params = [
    "ALLSKY_SFC_SW_DWN", // Solar radiation
    "CLOUD_AMT", // Cloud cover
    "T2M", // Temperature at 2m
    "WS10M", // Wind speed at 10m
    "WS50M", // Wind speed at 50m
    "PS", // Surface pressure for air density
    "PRECTOT", // Precipitation
  ].join(",");

  const url = `https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=${params}&community=SB&longitude=${lng}&latitude=${lat}&start=${year}&end=${year}&format=JSON`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const apiData = data.properties.parameter;

    const monthlyRadiation: Record<number, number> = {};
    const monthlyWind10m: Record<number, number> = {};
    const monthlyWind50m: Record<number, number> = {};
    const monthlyRainfall: Record<number, number> = {};
    const monthlyAirDensity: Record<number, number> = {};

    const R = 287.05; // Gas constant for dry air (J/kg/K)

    for (let month = 1; month <= 12; month++) {
      const monthStr = month.toString().padStart(2, "0");
      const key = `${year}${monthStr}`;

      monthlyRadiation[month] = apiData.ALLSKY_SFC_SW_DWN[key];
      monthlyWind10m[month] = apiData.WS10M[key];
      monthlyWind50m[month] = apiData.WS50M[key];
      monthlyRainfall[month] = apiData.PRECTOT[key];

      // Air density calculation (PS is in kPa → convert to Pa)
      const P = apiData.PS[key] * 100; // ✅ fix: kPa → Pa
      const T = apiData.T2M[key] + 273.15; // °C → K
      monthlyAirDensity[month] = P / (R * T);
    }

    const meanAirDensity = calculateMean(Object.values(monthlyAirDensity));

    return {
      solar: {
        monthlyRadiation,
        meanRadiation: calculateMean(Object.values(monthlyRadiation)),
        cloudCover: calculateMean(Object.values(apiData.CLOUD_AMT)),
        temperature: calculateMean(Object.values(apiData.T2M)),
      },
      wind: {
        speed10m: {
          monthly: monthlyWind10m,
          mean: calculateMean(Object.values(monthlyWind10m)),
        },
        speed50m: {
          monthly: monthlyWind50m,
          mean: calculateMean(Object.values(monthlyWind50m)),
        },
        airDensity: meanAirDensity,
      },
      hydro: {
        rainfall: {
          monthly: monthlyRainfall,
          annual: Object.values(monthlyRainfall).reduce((a, b) => a + b, 0),
        },
      },
    };
  } catch (error) {
    console.error("Error fetching NASA POWER data:", error);
    throw error;
  }
}
