import {SHORT_DAYS} from 'src/consts';
import {DAYS} from 'src/consts';
import {MONTHS} from 'src/consts';
import {SHORT_MONTHS} from 'src/consts';
import {pascalCase} from 'src/utils/pascal_case';
import {count_days_in_months} from 'src/utils/count-days-in-months';
import {is_leap_year} from 'src/utils/is-leap-year';
import {day_on_first_week_in_year} from 'src/utils/day-on-first-week-in-year';

export class FormatterParser {
    constructor(format, target) {
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

        for (const symbol of symbols) {
            if (typeof this[symbol] === 'function' && symbol.length === 1) {
                target = this[symbol](target);

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
    }

    d(target) {
        if (target.match(/^(0[1-9]|[1-2][0-9]|3[0-1])/)) {
            this._day = parseInt(target.slice(0, 2));
            return target.slice(2);
        }

        return null;
    }

    D(target) {
        const regexp = new RegExp(`^(${SHORT_DAYS.join('|')})`, 'i');
        const match = target.match(regexp);

        if (match) {
            this._dayOfWeek = SHORT_DAYS.indexOf(pascalCase(match[1]));
            return target.slice(match[1].length);
        }

        return null;
    }

    j(target) {
        if (target.match(/^([1-2][0-9]|3[0-1])/)) {
            this._day = parseInt(target.slice(0, 2));
            return target.slice(2);
        } else if (target.match(/^[0-9]/)) {
            this._day = parseInt(target.slice(0, 1));
            return target.slice(1);
        }

        return null;
    }

    l(target) {
        const regexp = new RegExp(`^(${DAYS.join('|')})`, 'i');
        const match = target.match(regexp);

        if (match) {
            this._dayOfWeek = DAYS.indexOf(pascalCase(match[1]));
            return target.slice(match[1].length);
        }

        return null;
    }

    N(target) {
        const match = target.match(/^[1-7]/);

        if (match) {
            this._dayOfWeek = parseInt(match[1]) - 1;
            return target.slice(1);
        }

        return null;
    }

    S(target) {
        if (target.match(/^(st|nd|rd|th)/)) {
            // todo
            return target.slice(2);
        }

        return null;
    }

    w(target) {
        const match = target.match(/^[0-6]/);

        if (match) {
            this._dayOfWeek = parseInt(match[1]);
            return target.slice(1);
        }

        return null;
    }

    z(target) {
        const regexps = [
            /^([1-2][0-9]{2}|3[0-5][0-9]|36[0-5])/,
            /^([1-9]{2})/,
            /^([1-9])/,
        ];

        for (const regexp of regexps) {
            const match = target.match(regexp);

            if (match) {
                this._dayOfYear = parseInt(match[1]);
                return target.slice(match[1].length);
            }
        }

        return null;
    }

    W(target) {
        const regexps = [
            /^([1-4][0-9]|5[0-2])/,
            /^[0-9]/,
        ];

        for (const regexp of regexps) {
            const match = target.match(regexp);
            if (match) {
                this._weekOfYear = parseInt(match[1]);
                return target.slice(match[1].length);
            }
        }

        return null;
    }

    F(target) {
        const regexp = new RegExp(`^(${MONTHS.join('|')})`, 'i');
        const match = target.match(regexp);

        if (match) {
            this._month = MONTHS.indexOf(pascalCase(match[1]));
            return target.slice(match[1].length);
        }

        return null;
    }

    m(target) {
        const match = target.match(/^(0[1-9]|1[0-2])/);

        if (match) {
            this._month = parseInt(match[0]) - 1;
            return target.slice(match[0].length);
        }

        return null;
    }

    M(target) {
        const regexp = new RegExp(`^(${SHORT_MONTHS.join('|')})`, 'i');
        const match = target.match(regexp);

        if (match.length) {
            this._month = SHORT_MONTHS.indexOf(pascalCase(match[1]));
            return target.slice(match[1].length);
        }

        return null;
    }

    n(target) {
        const regexps = [/^1[0-2]/, /^[1-9]/];

        for (const regexp of regexps) {
            const match = target.match(regexp);
            if (match) {
                this._month = parseInt(match[1]);
                return target.slice(match[1].length);
            }
        }

        return null;
    }

    t(target) {
        const regexps = [/^([1-2][0-9]|3[0-1])/, /^[1-9]/];

        for (const regexp of regexps) {
            const match = target.match(regexp);
            if (match) {
                this._month = parseInt(match[1]);
                return target.slice(match[1]);
            }
        }

        return null;
    }

    L(target) {
        const match = target.match(/^[0-1]/);

        if (match) {
            this._leap = !!parseInt(match[1]);

            return target.slice(1);
        }

        return null;
    }

    o(target) {
        return this.Y(target);
    }

    Y(target) {
        const match = target.match(/^-?[0-9]{4}/);

        if (match) {
            this._year = parseInt(match[0]);
            return target.slice(match[0].length);
        }

        return null;
    }

    y(target) {
        const match = target.match(/^-?[0-9]{2}/);

        if (match) {
            this._year = parseInt(match[1]);
            return target.slice(match[1].length);
        }

        return null;
    }

    a(target) {
        const match = target.match(/^(am|pm)/i);

        if (match) {
            this._am = match[1].toLowerCase() === 'am';
            return target.slice(match[1].length);
        }

        return null;
    }

    A(target) {
        return this.a(target);
    }

    B(target) {
        const match = target.match(/^[0-9]{3}/);

        if (match) {
            this._internetTime = parseInt(match[1]);
            return target.slice(match[1].length);
        }

        return null;
    }

    g(target) {
        const regexps = [
            /^1[0-2]/,
            /^[0-9]/,
        ];

        for (const regexp of regexps) {
            const match = target.match(regexp);
            if (match) {
                this._divideHours = parseInt(match[1]);
                return target.slice(match[1].length);
            }
        }

        return null;
    }

    G(target) {
        const regexps = [
            /^(1[0-9]|2[0-3])/,
            /^[0-9]/,
        ];

        for (const regexp of regexps) {
            const match = target.match(regexp);
            if (match) {
                this._hours = parseInt(match[1]);
                return target.slice(match[1].length);
            }
        }

        return null;
    }

    h(target) {
        if (target.match(/^(0[0-9]|1[0-2])/)) {
            this._hours = parseInt(target.slice(0, 2));
            return target.slice(2);
        }

        return null;
    }

    H(target) {
        if (target.match(/^([0-1][0-9]|2[0-3])/)) {
            this._hours = parseInt(target.slice(0, 2));
            return target.slice(2);
        }

        return null;
    }

    i(target) {
        if (target.match(/^([0-5][0-9])/)) {
            this._minutes = parseInt(target.slice(0, 2));
            return target.slice(2);
        }

        return null;
    }

    s(target) {
        if (target.match(/^([0-5][0-9])/)) {
            this._seconds = parseInt(target.slice(0, 2));
            return target.slice(2);
        }

        return null;
    }

    u(target) {
        if (target.match(/^([0-9]{6})/)) {
            this._microseconds = parseInt(target.slice(0, 6));
            return target.slice(6);
        }

        return null;
    }

    v(target) {
        if (target.match(/^([0-9]{3})/)) {
            this._microseconds = parseInt(target.slice(0, 3) + '000');
            return target.slice(3);
        }

        return null;
    }

    O(target) {
        const match = target.match(/^[-+]([0-1][0-9]|2[0-3])([0-5][0-9])/);

        if (match) {
            this._offsetSeconds = parseInt(match[1]) * 60 + parseInt(match[2]);
            return target.slice(5);
        }

        return null;
    }

    P(target) {
        const match = target.match(/^[-+]([0-1][0-9]|2[0-3]):([0-5][0-9])/);

        if (match) {
            this._offsetSeconds = parseInt(match[1]) * 60 + parseInt(match[2]);
            return target.slice(5);
        }

        return null;
    }

    c(target) {
        return this._complex('Y-m-d\\TH:i:sP', target);
    }

    r(target) {
        return this._complex('D, d M Y H:i:s O', target);
    }

    U(target) {
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
    }

    _complex(format, target) {
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
    }

    _compute() {
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
    }

    toObject() {
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
    }

    isValidDate() {
        const date = new Date(this._year, this._month, this._day);

        return date.getFullYear() === this._year
            && date.getMonth() === this._month
            && date.getDate() === this._day;
    }
}
