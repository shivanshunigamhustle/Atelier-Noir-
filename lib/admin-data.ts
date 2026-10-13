function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export interface SalesPoint {
  label: string;
  value: number;
}

export function generateSalesTrend(days: number): SalesPoint[] {
  const points: SalesPoint[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const base = 1800 + Math.sin(i / 4) * 500;
    const noise = seededRandom(d.getDate() + d.getMonth() * 31 + days) * 700;
    points.push({
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: Math.max(200, Math.round(base + noise)),
    });
  }
  return points;
}

export function generateWeeklyRevenue(weeks: number): SalesPoint[] {
  const points: SalesPoint[] = [];
  for (let i = 0; i < weeks; i++) {
    const base = 9000 + Math.sin(i / 2) * 2400;
    const noise = seededRandom(i * 7 + weeks) * 3200;
    points.push({ label: `Wk ${i + 1}`, value: Math.max(1200, Math.round(base + noise)) });
  }
  return points;
}

export function rangeToDays(range: "7" | "30" | "90"): number {
  return Number(range);
}
