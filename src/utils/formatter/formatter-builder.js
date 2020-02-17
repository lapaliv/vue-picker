import {SHORT_DAYS} from '@lapaliv/vue-picker/src/consts';
import {DAYS} from '@lapaliv/vue-picker/src/consts';
import {MONTHS} from '@lapaliv/vue-picker/src/consts';
import {SHORT_MONTHS} from '@lapaliv/vue-picker/src/consts';
import {count_days_in_months} from '@lapaliv/vue-picker/src/utils/count-days-in-months';
import {day_on_first_week_in_year} from '@lapaliv/vue-picker/src/utils/day-on-first-week-in-year';

const FormatterBuilder = function (formatter) {
    this.formatter = formatter;
};

FormatterBuilder.prototype.build = function (format) {
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
};

FormatterBuilder.prototype.d = function () {
    const day = this.formatter.day;
    return `${day < 10 ? 0 : ''}${day}`;
};

FormatterBuilder.prototype.D = function () {
    const date = this._date();

    return date.getDay()
        ? SHORT_DAYS[date.getDay() - 1]
        : SHORT_DAYS[SHORT_DAYS.length - 1];
};

FormatterBuilder.prototype.j = function () {
    return `${this.formatter.day}`;
};

FormatterBuilder.prototype.l = function () {
    const date = this._date();

    return date.getDay()
        ? DAYS[date.getDay() - 1]
        : DAYS[DAYS.length - 1];
};

FormatterBuilder.prototype.N = function () {
    const date = this._date();

    return date.getDay() ? date.getDay() : 7;
};

FormatterBuilder.prototype.S = function () {
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
};

FormatterBuilder.prototype.w = function () {
    return this._date().getDay();
};

FormatterBuilder.prototype.z = function () {
    let result = 0;
    for (let month = 0; month < this.formatter.month; month++) {
        result += count_days_in_months(this.formatter.isLeapYear);
    }

    return result + this.formatter.day - 1;
};

FormatterBuilder.prototype.W = function () {
    let days = 0;
    for (let month = 0; month < this.formatter.month; month++) {
        days += count_days_in_months(this.formatter.isLeapYear);
    }

    days += this.formatter.day - day_on_first_week_in_year(this.formatter.year);

    return Math.ceil(days / 7);
};

FormatterBuilder.prototype.F = function () {
    console.log('F month', this.formatter.month);
    return MONTHS[this.formatter.month];
};

FormatterBuilder.prototype.m = function () {
    const month = this.formatter.month + 1;
    return `${month < 10 ? 0 : ''}${month}`;
};

FormatterBuilder.prototype.M = function () {
    return SHORT_MONTHS[this.formatter.month];
};

FormatterBuilder.prototype.n = function () {
    return `${this.formatter.month + 1}`;
};

FormatterBuilder.prototype.t = function () {
    return count_days_in_months(this.formatter.isLeapYear)[this.formatter.month];
};

FormatterBuilder.prototype.L = function () {
    return `${this.formatter.isLeapYear ? 1 : 0}`;
};

FormatterBuilder.prototype.o = function () {
    return this.Y();
};

FormatterBuilder.prototype.Y = function () {
    const abs = Math.abs(this.formatter.year);
    const result = `0000${abs}`.slice(-4);
    return (this.formatter.year < 0 ? '-' : '') + result;
};

FormatterBuilder.prototype.y = function () {
    return `00${this.formatter.year}`.slice(-2);
};

FormatterBuilder.prototype.a = function () {
    return this.formatter.hours < 12 ? 'am' : 'pm';
};

FormatterBuilder.prototype.A = function () {
    return this.a().toUpperCase();
};

FormatterBuilder.prototype.B = function () {
    const maxSeconds = 24 * 60 * 60 + 60 * 60 + 60;
    const actualSeconds = this.formatter.hours * 60 * 60 + this.formatter.minutes * 60 + this.formatter.seconds;
    const result = Math.floor(actualSeconds * 999 / maxSeconds);

    return `00${result}`.slice(-3);
};

FormatterBuilder.prototype.g = function () {
    return this.formatter.hours < 13
        ? `${this.formatter.hours}`
        : `${this.formatter.hours - 12}`;
};

FormatterBuilder.prototype.G = function () {
    return `${this.formatter.hours}`;
};

FormatterBuilder.prototype.h = function () {
    const result = parseInt(this.g());
    return `0${result}`.slice(-2);
};

FormatterBuilder.prototype.H = function () {
    return `0${this.formatter.hours}`.slice(-2);
};

FormatterBuilder.prototype.i = function () {
    return `0${this.formatter.seconds}`.slice(-2);
};

FormatterBuilder.prototype.s = function () {
    return `0${this.formatter.minutes}`.slice(-2);
};

FormatterBuilder.prototype.u = function () {
    return `000000${this.formatter.microseconds}`.slice(-6);
};

FormatterBuilder.prototype.v = function () {
    return `000${this.formatter.microseconds}`.slice(-6, 3);
};


FormatterBuilder.prototype.c = function () {
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
};

FormatterBuilder.prototype.r = function () {
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
};

FormatterBuilder.prototype.U = function () {
    return this._date().getTime();
};

FormatterBuilder.prototype._date = function () {
    return new Date(
        this.formatter.year,
        this.formatter.month,
        this.formatter.day,
        this.formatter.hours,
        this.formatter.minutes,
        this.formatter.seconds,
    );
};

export default FormatterBuilder;
