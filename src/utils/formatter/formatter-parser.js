import {SHORT_DAYS} from '@lapaliv/vue-picker/src/consts';
import {DAYS} from '@lapaliv/vue-picker/src/consts';
import {MONTHS} from '@lapaliv/vue-picker/src/consts';
import {SHORT_MONTHS} from '@lapaliv/vue-picker/src/consts';
import {pascalCase} from '@lapaliv/vue-picker/src/utils/pascal_case';
import {count_days_in_months} from '@lapaliv/vue-picker/src/utils/count-days-in-months';
import {is_leap_year} from '@lapaliv/vue-picker/src/utils/is-leap-year';
import {day_on_first_week_in_year} from '@lapaliv/vue-picker/src/utils/day-on-first-week-in-year';

const FormatterParser = function (format, target) {
    this._year = null;
    this._month = null;
    this._day = null;
    this._hours = null;
    this._minutes = null;
    this._seconds = null;
    this._microseconds = null;
    this._timezone = null;

    this._dayOfWeek = null;
    this._dayOfYear = null;
    this._weekOfYear = null;
    this._leap = null;
    this._am = null;
    this._internetTime = null;
    this._divideHours = null;
    this._offsetSeconds = null;

    this._length = 0;


    const symbols = format.match(/\\?./g);
    const originalTarget = target;

    for (let i = 0; i < symbols.length; i++) {
        const item = symbols[i];
        if (typeof this[item] === 'function' && item.length === 1) {
            target = this[item](target);

            if (target === null) {
                throw new Error('Date format is not correct');
            }
        } else {
            target = target.slice(1);
        }
    }

    if (target || !this.isValidDate()) {
        throw new Error('Date format is not correct');
    }

    this._length = originalTarget.length - (target || originalTarget).length;
    this._compute();
};

FormatterParser.prototype.d = function (target) {
    if (target.match(/^(0[1-9]|[1-2][0-9]|3[0-1])/)) {
        this._day = parseInt(target.slice(0, 2));
        return target.slice(2);
    }

    return null;
};

FormatterParser.prototype.D = function (target) {
    const regexp = new RegExp(`^(${SHORT_DAYS.join('|')})`, 'i');
    const match = target.match(regexp);

    if (match) {
        this._dayOfWeek = SHORT_DAYS.indexOf(pascalCase(match[1]));
        return target.slice(match[1].length);
    }

    return null;
};

FormatterParser.prototype.j = function (target) {
    if (target.match(/^([1-2][0-9]|3[0-1])/)) {
        this._day = parseInt(target.slice(0, 2));
        return target.slice(2);
    } else if (target.match(/^[0-9]/)) {
        this._day = parseInt(target.slice(0, 1));
        return target.slice(1);
    }

    return null;
};

FormatterParser.prototype.l = function (target) {
    const regexp = new RegExp(`^(${DAYS.join('|')})`, 'i');
    const match = target.match(regexp);

    if (match) {
        this._dayOfWeek = DAYS.indexOf(pascalCase(match[1]));
        return target.slice(match[1].length);
    }

    return null;
};

FormatterParser.prototype.N = function (target) {
    const match = target.match(/^[1-7]/);

    if (match) {
        this._dayOfWeek = parseInt(match[1]) - 1;
        return target.slice(1);
    }

    return null;
};

FormatterParser.prototype.S = function (target) {
    if (target.match(/^(st|nd|rd|th)/)) {
        // todo
        return target.slice(2);
    }

    return null;
};

FormatterParser.prototype.w = function (target) {
    const match = target.match(/^[0-6]/);

    if (match) {
        this._dayOfWeek = parseInt(match[1]);
        return target.slice(1);
    }

    return null;
};

FormatterParser.prototype.z = function (target) {
    const regexps = [
        /^([1-2][0-9]{2}|3[0-5][0-9]|36[0-5])/,
        /^([1-9]{2})/,
        /^([1-9])/,
    ];

    for (let i = 0; i < regexps.length; i++) {
        const regexp = regexps[i];
        const match = target.match(regexp);

        if (match) {
            this._dayOfYear = parseInt(match[1]);
            return target.slice(match[1].length);
        }
    }

    return null;
};

FormatterParser.prototype.W = function (target) {
    const regexps = [
        /^([1-4][0-9]|5[0-2])/,
        /^[0-9]/,
    ];

    for (let i = 0; i < regexps.length; i++) {
        const regexp = regexps[i];
        const match = target.match(regexp);
        if (match) {
            this._weekOfYear = parseInt(match[1]);
            return target.slice(match[1].length);
        }
    }

    return null;
};

FormatterParser.prototype.F = function (target) {
    const regexp = new RegExp(`^(${MONTHS.join('|')})`, 'i');
    const match = target.match(regexp);

    if (match) {
        this._month = MONTHS.indexOf(pascalCase(match[1]));
        return target.slice(match[1].length);
    }

    return null;
};

FormatterParser.prototype.m = function (target) {
    const match = target.match(/^(0[1-9]|1[0-2])/);

    if (match) {
        this._month = parseInt(match[0]) - 1;
        return target.slice(match[0].length);
    }

    return null;
};

FormatterParser.prototype.M = function (target) {
    const regexp = new RegExp(`^(${SHORT_MONTHS.join('|')})`, 'i');
    const match = target.match(regexp);

    if (match.length) {
        this._month = SHORT_MONTHS.indexOf(pascalCase(match[1]));
        return target.slice(match[1].length);
    }

    return null;
};

FormatterParser.prototype.n = function (target) {
    const regexps = [/^1[0-2]/, /^[1-9]/];

    for (let i = 0; i < regexps.length; i++) {
        const regexp = regexps[i];
        const match = target.match(regexp);
        if (match) {
            this._month = parseInt(match[1]);
            return target.slice(match[1].length);
        }
    }

    return null;
};

FormatterParser.prototype.t = function (target) {
    const regexps = [/^([1-2][0-9]|3[0-1])/, /^[1-9]/];

    for (let i = 0; i < regexps.length; i++) {
        const regexp = regexps[i];
        const match = target.match(regexp);
        if (match) {
            this._month = parseInt(match[1]);
            return target.slice(match[1]);
        }
    }

    return null;
};

FormatterParser.prototype.L = function (target) {
    const match = target.match(/^[0-1]/);

    if (match) {
        this._leap = !!parseInt(match[1]);

        return target.slice(1);
    }

    return null;
};

FormatterParser.prototype.o = function (target) {
    return this.Y(target);
};

FormatterParser.prototype.Y = function (target) {
    const match = target.match(/^-?[0-9]{4}/);

    if (match) {
        this._year = parseInt(match[0]);
        return target.slice(match[0].length);
    }

    return null;
};

FormatterParser.prototype.y = function (target) {
    const match = target.match(/^-?[0-9]{2}/);

    if (match) {
        this._year = parseInt(match[1]);
        return target.slice(match[1].length);
    }

    return null;
};

FormatterParser.prototype.a = function (target) {
    const match = target.match(/^(am|pm)/i);

    if (match) {
        this._am = match[1].toLowerCase() === 'am';
        return target.slice(match[1].length);
    }

    return null;
};

FormatterParser.prototype.A = function (target) {
    return this.a(target);
};

FormatterParser.prototype.B = function (target) {
    const match = target.match(/^[0-9]{3}/);

    if (match) {
        this._internetTime = parseInt(match[1]);
        return target.slice(match[1].length);
    }

    return null;
};

FormatterParser.prototype.g = function (target) {
    const regexps = [
        /^1[0-2]/,
        /^[0-9]/,
    ];

    for (let i = 0; i < regexps.length; i++) {
        const regexp = regexps[i];
        const match = target.match(regexp);
        if (match) {
            this._divideHours = parseInt(match[1]);
            return target.slice(match[1].length);
        }
    }

    return null;
};

FormatterParser.prototype.G = function (target) {
    const regexps = [
        /^(1[0-9]|2[0-3])/,
        /^[0-9]/,
    ];

    for (let i = 0; i < regexps.length; i++) {
        const regexp = regexps[i];
        const match = target.match(regexp);
        if (match) {
            this._hours = parseInt(match[1]);
            return target.slice(match[1].length);
        }
    }

    return null;
};

FormatterParser.prototype.h = function (target) {
    if (target.match(/^(0[0-9]|1[0-2])/)) {
        this._hours = parseInt(target.slice(0, 2));
        return target.slice(2);
    }

    return null;
};

FormatterParser.prototype.H = function (target) {
    if (target.match(/^([0-1][0-9]|2[0-3])/)) {
        this._hours = parseInt(target.slice(0, 2));
        return target.slice(2);
    }

    return null;
};

FormatterParser.prototype.i = function (target) {
    if (target.match(/^([0-5][0-9])/)) {
        this._minutes = parseInt(target.slice(0, 2));
        return target.slice(2);
    }

    return null;
};

FormatterParser.prototype.s = function (target) {
    if (target.match(/^([0-5][0-9])/)) {
        this._seconds = parseInt(target.slice(0, 2));
        return target.slice(2);
    }

    return null;
};

FormatterParser.prototype.u = function (target) {
    if (target.match(/^([0-9]{6})/)) {
        this._microseconds = parseInt(target.slice(0, 6));
        return target.slice(6);
    }

    return null;
};

FormatterParser.prototype.v = function (target) {
    if (target.match(/^([0-9]{3})/)) {
        this._microseconds = parseInt(target.slice(0, 3) + '000');
        return target.slice(3);
    }

    return null;
};

FormatterParser.prototype.O = function (target) {
    const match = target.match(/^[-+]([0-1][0-9]|2[0-3])([0-5][0-9])/);

    if (match) {
        this._offsetSeconds = parseInt(match[1]) * 60 + parseInt(match[2]);
        return target.slice(5);
    }

    return null;
};

FormatterParser.prototype.P = function (target) {
    const match = target.match(/^[-+]([0-1][0-9]|2[0-3]):([0-5][0-9])/);

    if (match) {
        this._offsetSeconds = parseInt(match[1]) * 60 + parseInt(match[2]);
        return target.slice(5);
    }

    return null;
};

FormatterParser.prototype.c = function (target) {
    return this._complex('Y-m-d\\TH:i:sP', target);
};

FormatterParser.prototype.r = function (target) {
    return this._complex('D, d M Y H:i:s O', target);
};

FormatterParser.prototype.U = function (target) {
    const match = target.match(/^(-?[0-9]+)/);
    if (match) {
        const date = new Date(match[0]);

        this._year = date.getFullYear();
        this._month = date.getMonth();
        this._day = date.getDate();
        this._hours = date.getHours();
        this._minutes = date.getMinutes();
        this._seconds = date.getSeconds();
        this._microseconds = 0;

        return target.slice(match[1].length);
    }

    return null;
};

FormatterParser.prototype._complex = function (format, target) {
    try {
        const parser = new FormatterParser(format, target);
        const parseResult = parser.toObject();

        this._year = parseResult.year;
        this._month = parseResult.month;
        this._day = parseResult.day;
        this._hours = parseResult.hours;
        this._minutes = parseResult.minutes;
        this._seconds = parseResult.seconds;
        this._timezone = parseResult.timezone || this._timezone;

        return target.slice(parser._length);
    } catch (e) {
        return null;
    }
};

FormatterParser.prototype._compute = function () {
    if (!this._day) {

        if (this._weekOfYear && this._dayOfWeek !== null && this._year) {
            this._dayOfYear = this._weekOfYear * 7 + day_on_first_week_in_year(this._year) + this._dayOfWeek;
        }

        if (this._dayOfYear && this._year) {
            let isLeapYear = false;

            // a leap year
            if (is_leap_year(this._year)) {
                isLeapYear = true;
            }

            const countDaysInMonths = count_days_in_months(isLeapYear);
            let sum = 0;
            for (let month = 0; month < 12; month++) {
                if (sum + countDaysInMonths[month] >= this._dayOfYear) {
                    this._month = month;
                    this._day = this._dayOfYear - sum;
                    break;
                }
            }
        }

        if (this._am !== null && this._divideHours !== null) {
            this._hours = this._am
                ? this._divideHours
                : this._divideHours + 12;

        }
    }
};

FormatterParser.prototype.toObject = function () {
    return {
        year: this._year,
        month: this._month,
        day: this._day,
        hours: this._hours,
        minutes: this._minutes,
        seconds: this._seconds,
        microseconds: this._microseconds,
        timezone: this._timezone,
    };
};

FormatterParser.prototype.isValidDate = function () {
    const date = new Date(this._year, this._month, this._day);

    return date.getFullYear() === this._year
        && date.getMonth() === this._month
        && date.getDate() === this._day;
};

export default FormatterParser;
