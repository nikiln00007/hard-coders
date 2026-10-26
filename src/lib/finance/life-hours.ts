// ============================================================
// Life-Hours Calculation Engine
// ============================================================

export interface LifeHoursConfig {
  monthlyIncome: number;
  workingDaysPerMonth: number;
  workingHoursPerDay: number;
}

export interface LifeHoursResult {
  hourlyRate: number;
  totalHours: number;
  totalDays: number;
  hoursComponent: number;
  minutesComponent: number;
  daysComponent: number;
  remainingHoursAfterDays: number;
  formatted: string;
  formattedShort: string;
}

/**
 * Calculate hourly earnings rate
 */
export function calculateHourlyRate(config: LifeHoursConfig): number {
  const { monthlyIncome, workingDaysPerMonth, workingHoursPerDay } = config;
  if (monthlyIncome <= 0 || workingDaysPerMonth <= 0 || workingHoursPerDay <= 0) {
    return 0;
  }
  return monthlyIncome / (workingDaysPerMonth * workingHoursPerDay);
}

/**
 * Convert a monetary amount to working hours
 */
export function amountToLifeHours(amount: number, config: LifeHoursConfig): LifeHoursResult {
  const hourlyRate = calculateHourlyRate(config);

  if (hourlyRate <= 0 || amount <= 0) {
    return {
      hourlyRate: 0,
      totalHours: 0,
      totalDays: 0,
      hoursComponent: 0,
      minutesComponent: 0,
      daysComponent: 0,
      remainingHoursAfterDays: 0,
      formatted: '0 hours',
      formattedShort: '0h',
    };
  }

  const totalHours = amount / hourlyRate;
  const totalDays = totalHours / config.workingHoursPerDay;

  const hoursComponent = Math.floor(totalHours);
  const minutesComponent = Math.round((totalHours - hoursComponent) * 60);

  const daysComponent = Math.floor(totalDays);
  const remainingHoursAfterDays = Math.round((totalDays - daysComponent) * config.workingHoursPerDay * 10) / 10;

  let formatted: string;
  let formattedShort: string;

  if (totalDays >= 2) {
    formatted = daysComponent > 0
      ? `${daysComponent} day${daysComponent !== 1 ? 's' : ''}${remainingHoursAfterDays > 0 ? ` ${remainingHoursAfterDays} hr${remainingHoursAfterDays !== 1 ? 's' : ''}` : ''}`
      : `${Math.round(totalHours * 10) / 10} hours`;
    formattedShort = `${Math.round(totalDays * 10) / 10}d`;
  } else if (totalHours >= 1) {
    formatted = `${hoursComponent} hr${hoursComponent !== 1 ? 's' : ''}${minutesComponent > 0 ? ` ${minutesComponent} min` : ''}`;
    formattedShort = `${Math.round(totalHours * 10) / 10}h`;
  } else {
    formatted = `${minutesComponent} min`;
    formattedShort = `${minutesComponent}m`;
  }

  return {
    hourlyRate,
    totalHours,
    totalDays,
    hoursComponent,
    minutesComponent,
    daysComponent,
    remainingHoursAfterDays,
    formatted,
    formattedShort,
  };
}

/**
 * Format life-hours as a short readable string for badges/tags
 */
export function formatLifeHoursTag(amount: number, config: LifeHoursConfig): string {
  const result = amountToLifeHours(amount, config);
  if (result.totalHours <= 0) return '';
  return `⏱ ${result.formattedShort} of work`;
}
