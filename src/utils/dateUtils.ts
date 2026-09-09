// Clean native JavaScript date utilities without external heavy libraries

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatShortDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

export function formatDayName(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function getTodayString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isToday(dateStr: string): boolean {
  return dateStr === getTodayString();
}

export function isPastDate(dateStr: string): boolean {
  if (!dateStr) return false;
  const todayStr = getTodayString();
  return dateStr < todayStr;
}

export function getDaysDifference(dateStr1: string, dateStr2: string = getTodayString()): number {
  const d1 = new Date(dateStr1 + 'T00:00:00').getTime();
  const d2 = new Date(dateStr2 + 'T00:00:00').getTime();
  const diffTime = d2 - d1;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

// Check if shoot is overdue (Shoot date passed & Shoot status != Shot & Shoot status != Cancelled)
export function isShootOverdue(shootDate: string, shootStatus: string): boolean {
  if (shootStatus === 'Shot' || shootStatus === 'Cancelled') return false;
  return isPastDate(shootDate);
}

// Check if post is overdue (Post date passed & Post status != Posted & Post status != Cancelled)
export function isPostOverdue(postDate: string, postStatus: string): boolean {
  if (postStatus === 'Posted' || postStatus === 'Cancelled') return false;
  return isPastDate(postDate);
}

export function getWeekDays(referenceDate: Date = new Date()): { dateStr: string; dayName: string; dayNum: number; isToday: boolean }[] {
  const curr = new Date(referenceDate);
  const day = curr.getDay();
  // Set to Monday of current week (assuming Monday start)
  const diff = curr.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(curr.setDate(diff));

  const days = [];
  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(monday);
    nextDay.setDate(monday.getDate() + i);
    const y = nextDay.getFullYear();
    const m = String(nextDay.getMonth() + 1).padStart(2, '0');
    const d = String(nextDay.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    days.push({
      dateStr,
      dayName: nextDay.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: nextDay.getDate(),
      isToday: dateStr === getTodayString()
    });
  }
  return days;
}

export function getMonthCalendarGrid(year: number, month: number): { dateStr: string; dayNum: number; isCurrentMonth: boolean; isToday: boolean }[] {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  let startingDayOfWeek = firstDayOfMonth.getDay() - 1; // Monday start
  if (startingDayOfWeek === -1) startingDayOfWeek = 6;

  const totalDaysInMonth = lastDayOfMonth.getDate();
  const grid = [];

  // Prev month padding
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const m = String(prevMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const dateStr = `${prevYear}-${m}-${d}`;
    grid.push({
      dateStr,
      dayNum: day,
      isCurrentMonth: false,
      isToday: dateStr === getTodayString()
    });
  }

  // Current month
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const dateStr = `${year}-${m}-${d}`;
    grid.push({
      dateStr,
      dayNum: day,
      isCurrentMonth: true,
      isToday: dateStr === getTodayString()
    });
  }

  // Next month padding to fill grid to 35 or 42 cells
  const remaining = (7 - (grid.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const m = String(nextMonth + 1).padStart(2, '0');
    const d = String(i).padStart(2, '0');
    const dateStr = `${nextYear}-${m}-${d}`;
    grid.push({
      dateStr,
      dayNum: i,
      isCurrentMonth: false,
      isToday: dateStr === getTodayString()
    });
  }

  return grid;
}
