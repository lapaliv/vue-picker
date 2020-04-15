import {FormatterParser} from '@lapaliv/vue-picker/src/utils/formatter/formatter-parser';
import {is_leap_year} from '@lapaliv/vue-picker/src/utils/is-leap-year';
import {FormatterBuilder} from '@lapaliv/vue-picker/src/utils/formatter/formatter-builder';

export class Formatter {
    constructor(year, month, day, hours, minutes, seconds, microseconds, timezone) {
        this._year = typeof year === 'number' ? year : null;
        this._month = typeof month === 'number' ? month : null;
        this._day = typeof day === 'number' ? day : null;
        this._hours = typeof hours === 'number' ? hours : 0;
        this._minutes = typeof minutes === 'number' ? minutes : 0;
        this._seconds = typeof seconds === 'number' ? seconds : 0;
        this._microseconds = typeof microseconds === 'number' ? microseconds : 0;
        this._timezone = timezone || 'UTC';
    }

    get year() {
        return this._year;
    }

    get month() {
        return this._month;
    }

    get day() {
        return this._day;
    }

    get hours() {
        return this._hours;
    }

    get minutes() {
        return this._minutes;
    }

    get seconds() {
        return this._seconds;
    }

    get microseconds() {
        return this._microseconds;
    }

    get timezone() {
        return this._timezone;
    }

    get isLeapYear() {
        return is_leap_year(this.year);
    }

    get isToday() {
        const today = new Date();

        return today.getFullYear() === this.year
            && today.getMonth() === this.month
            && today.getDate() === this.day;
    }

    build(format) {
        const builder = new FormatterBuilder(this);
        return builder.build(format);
    }

    toDateString() {
        return this.build('Y-m-d');
    }

    toTimeString() {
        return this.build('Y-m-d');
    }

    toDateTimeString() {
        return this.toDateString() + ' ' + this.toTimeString();
    }

    static parse(format, target) {
        const parser = new FormatterParser(format, target);
        const result = parser.toObject();

        return new Formatter(
            result.year,
            result.month,
            result.day,
            result.hours,
            result.minutes,
            result.seconds,
            result.microseconds,
            result.timezone,
        );
    }
}
