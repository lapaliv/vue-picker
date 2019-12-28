import {SHORT_DAYS} from 'src/consts';
import {DAYS} from 'src/consts';
import {MONTHS} from 'src/consts';
import {SHORT_MONTHS} from 'src/consts';
import {count_days_in_months} from 'src/utils/count-days-in-months';
import {day_on_first_week_in_year} from 'src/utils/day-on-first-week-in-year';

export class FormatterBuilder {
    constructor(formatter) {
        this.formatter = formatter;
    }

    build(format) {
        const symbols = format.match(/\\?./g);
        let result = '';

        for (const symbol of symbols) {
            if (typeof this[symbol] === 'function' && symbol.length === 1) {
                result += this[symbol]();
            } else {
                result += symbol;
            }
        }

        return result;
    }

    d() {
        const day = this.formatter.day;
        return `${day < 10 ? 0 : ''}${day}`;
    }

    D() {
        const date = this._date();

        return date.getDay()
            ? SHORT_DAYS[date.getDay() - 1]
            : SHORT_DAYS[SHORT_DAYS.length - 1];
    }

    j() {
        return `${this.formatter.day}`;
    }

    l() {
        const date = this._date();

        return date.getDay()
            ? DAYS[date.getDay() - 1]
            : DAYS[DAYS.length - 1];
    }

    N() {
        const date = this._date();

        return date.getDay() ? date.getDay() : 7;
    }

    S() {
        if (`${this.formatter.day}`.slice(-1) === '1' && `${this.formatter.day}`.slice(-2) !== '11') {
            return 'st';
        }

        if (`${this.formatter.day}`.slice(-1) === '2' && `${this.formatter.day}`.slice(-2) !== '12') {
            return 'nd';
        }

        if (`${this.formatter.day}`.slice(-1) === '3' && `${this.formatter.day}`.slice(-2) !== '13') {
            return 'rd';
        }

        return 'th';
    }

    w() {
        return this._date().getDay();
    }

    z() {
        let result = 0;
        for (let month = 0; month < this.formatter.month; month++) {
            result += count_days_in_months(this.formatter.isLeapYear);
        }

        return result + this.formatter.day - 1;
    }

    W() {
        let days = 0;
        for (let month = 0; month < this.formatter.month; month++) {
            days += count_days_in_months(this.formatter.isLeapYear);
        }

        days += this.formatter.day - day_on_first_week_in_year(this.formatter.year);

        return Math.ceil(days / 7);
    }

    F() {
        console.log('F month', this.formatter.month);
        return MONTHS[this.formatter.month];
    }

    m() {
        const month = this.formatter.month + 1;
        return `${month < 10 ? 0 : ''}${month}`;
    }

    M() {
        return SHORT_MONTHS[this.formatter.month];
    }

    n() {
        return `${this.formatter.month + 1}`;
    }

    t() {
        return count_days_in_months(this.formatter.isLeapYear)[this.formatter.month];
    }

    L() {
        return `${this.formatter.isLeapYear ? 1 : 0}`;
    }

    o() {
        return this.Y();
    }

    Y() {
        return this.formatter.year;
    }

    y() {
        return `${this.formatter.year}`.slice(-2);
    }

    a() {
        return this.formatter.hours < 12 ? 'am' : 'pm';
    }

    A() {
        return this.a().toUpperCase();
    }

    B() {
        const maxSeconds = 24 * 60 * 60 + 60 * 60 + 60;
        const actualSeconds = this.formatter.hours * 60 * 60 + this.formatter.minutes * 60 + this.formatter.seconds;
        const result = Math.floor(actualSeconds * 999 / maxSeconds);

        return `00${result}`.slice(-3);
    }

    g() {
        return this.formatter.hours < 13
            ? `${this.formatter.hours}`
            : `${this.formatter.hours - 12}`;
    }

    G() {
        return `${this.formatter.hours}`;
    }

    h() {
        const result = parseInt(this.g());
        return `0${result}`.slice(-2);
    }

    H() {
        return `0${this.formatter.hours}`.slice(-2);
    }

    i() {
        return `0${this.formatter.seconds}`.slice(-2);
    }

    s() {
        return `0${this.formatter.minutes}`.slice(-2);
    }

    u() {
        return `000000${this.formatter.microseconds}`.slice(-6);
    }

    v() {
        return `000${this.formatter.microseconds}`.slice(-6, 3);
    }


    c() {
        return [
            [
                this.Y(),
                this.m(),
                this.d(),
            ].join('-'),
            'T',
            [
                this.H(),
                this.i(),
                this.s(),
            ].join(':'),
            '+00:00',
        ].join('');
    }

    r() {
        return [
            this.D() + ',',
            this.d(),
            this.M(),
            this.Y(),
            [
                this.H(),
                this.i(),
                this.s(),
            ].join(':'),
            '+0000',
        ].join(' ');
    }

    U() {
        return this._date().getTime();
    }

    _date() {
        return new Date(
            this.formatter.year,
            this.formatter.month,
            this.formatter.day,
            this.formatter.hours,
            this.formatter.minutes,
            this.formatter.seconds,
        );
    }
}
