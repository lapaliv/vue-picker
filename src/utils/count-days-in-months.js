export function count_days_in_months(leapYear = false) {
    return [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
}
