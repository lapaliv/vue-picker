export function day_on_first_week_in_year(year) {
    const date = new Date(year, 0, 1);
    if (date.getDay() === 1) {
        return 1;
    } else if (date.getDay() === 0) {
        return 2;
    }

    return 7 - date.getDay() + 2;
}
