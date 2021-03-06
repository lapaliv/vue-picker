export function day_on_first_week_in_year(year) {
    const date = new Date(year, 0, 1);
    const dateDay = date.getDay() || 0;

    if (dateDay === 1) {
        return 1;
    } else if (dateDay === 0) {
        return 2;
    }

    return 9 - dateDay;
}
