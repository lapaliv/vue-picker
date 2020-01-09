<template>
    <div>
        <div class="vue2-datetime-week vue2-datetime-week--header">
            <template v-for="shortDay in shortDays">
                <div
                    :key="shortDay"
                    class="vue2-datetime-week-day"
                >
                    {{ shortDay }}
                </div>
            </template>
        </div>

        <template v-for="(week, index) in weeks">
            <div
                :key="index"
                class="vue2-datetime-week"
            >
                <template v-for="{year, month, day, disabled, muted, isToday, isSelected} in week">
                    <div
                        :key="`${year}_${month}_${day}`"
                        class="vue2-datetime-week-day"
                    >
                        <button
                            class="btn"
                            :disabled="disabled"
                            :class="dayButtonClassName(muted, isToday, isSelected)"
                            @click="selectDay(year, month, day)"
                        >
                            {{ day }}
                        </button>
                    </div>
                </template>
            </div>
        </template>
    </div>
    <!--<table class="text-center mb-0 w-100">-->
    <!--    <thead>-->
    <!--        <tr>-->
    <!--            <template v-for="shortDay in shortDays">-->
    <!--                <th-->
    <!--                    :key="shortDay"-->
    <!--                    class="font-weight-500"-->
    <!--                >-->
    <!--                    {{ shortDay }}-->
    <!--                </th>-->
    <!--            </template>-->
    <!--        </tr>-->
    <!--    </thead>-->
    <!--    <tbody class="month-week-body">-->
    <!--        <template v-for="(week, index) in weeks">-->
    <!--            <tr :key="index">-->
    <!--                <template v-for="{year, month, day, disabled, muted, isToday, isSelected} in week">-->
    <!--                    <td-->
    <!--                        :key="`${year}_${month}_${day}`"-->
    <!--                        class="p-1 text-center align-middle"-->
    <!--                    >-->
    <!--                        <button-->
    <!--                            class="btn w-100 px-1 py-0"-->
    <!--                            :disabled="disabled"-->
    <!--                            :class="dayButtonClassName(muted, isToday, isSelected)"-->
    <!--                            @click="selectDay(year, month, day)"-->
    <!--                        >-->
    <!--                            {{ day }}-->
    <!--                        </button>-->
    <!--                    </td>-->
    <!--                </template>-->
    <!--            </tr>-->
    <!--        </template>-->
    <!--    </tbody>-->
    <!--</table>-->
</template>

<script>
    import {Formatter} from 'src/utils/formatter';
    import {SHORT_DAYS} from 'src/consts';

    export default {
        name: 'Weeks',
        props: {
            year: {
                type: Number,
                required: true,
            },
            month: {
                type: Number,
                required: true,
                validator(value) {
                    return value >= 0 && value < 12;
                },
            },
            selectedYear: {
                required: true,
            },
            selectedMonth: {
                required: true,
            },
            selectedDay: {
                required: true,
            },
        },
        computed: {
            prevMonth() {
                return this.month === 0 ? 11 : this.month - 1;
            },
            nextMonth() {
                return this.month === 11 ? 0 : this.month + 1;
            },
            yearForPrevMonth() {
                return this.prevMonth === 11 ? this.year - 1 : this.year;
            },
            yearForNextMonth() {
                return this.nextMonth === 0 ? this.year + 1 : this.year;
            },
            firstDayInCurrentMonth() {
                return new Date(this.year, this.month).getDay() > 0 ? new Date(this.year, this.month).getDay() : 7;
            },
            countDaysInCurrentMonth() {
                return this.getCountDaysInMonth(this.year, this.month);
            },
            countDaysPrevMonth() {
                return this.firstDayInCurrentMonth - 1;
            },
            countDaysInPrevMonth() {
                return this.getCountDaysInMonth(this.yearForPrevMonth, this.prevMonth);
            },
            firstDayInPrevMonth() {
                return this.countDaysInPrevMonth - this.countDaysPrevMonth + 1;
            },
            countWeeksInCurrentMonth() {
                return Math.ceil((this.countDaysInCurrentMonth + this.countDaysPrevMonth) / 7);
            },
            weeks() {
                let weeks = [];
                let tmpDay = this.firstDayInPrevMonth;
                let tmpYear = this.yearForPrevMonth;
                let tmpMonth = this.prevMonth;

                for (let week = 1; week <= 6; week++) {
                    let arrayWeek = [];
                    for (let day = 1; day <= 7; day++, tmpDay++) {
                        let isLostPrevMonth = week === 1 && tmpDay > this.countDaysInPrevMonth;
                        let isLostCurrentMonth = week >= this.countWeeksInCurrentMonth && tmpDay > this.countDaysInCurrentMonth;
                        if (isLostPrevMonth || isLostCurrentMonth) {
                            tmpDay = 1;
                            tmpYear = isLostPrevMonth ? this.year : this.yearForNextMonth;
                            tmpMonth = isLostPrevMonth ? this.month : this.nextMonth;
                        }
                        arrayWeek.push({
                            year: tmpYear,
                            month: tmpMonth,
                            day: tmpDay,
                            disabled: false,
                            muted: tmpYear !== this.year || tmpMonth !== this.month,
                            isToday: this.isToday(tmpYear, tmpMonth, tmpDay),
                            isSelected: this.isSelected(tmpYear, tmpMonth, tmpDay),
                        });
                    }
                    weeks.push(arrayWeek);
                }

                return weeks;
            },
            shortDays() {
                let result = [];
                for (const dayName of SHORT_DAYS) {
                    result.push(dayName.slice(0, 2));
                }

                return result;
            },
        },
        methods: {
            getCountDaysInMonth(year, month) {
                return 33 - new Date(year, month, 33).getDate();
            },
            selectDay(year, month, day) {
                this.$emit('select', year, month, day);
            },
            isToday(year, month, day) {
                return new Formatter(year, month, day).isToday;
            },
            isSelected(year, month, day) {
                return new Formatter(year, month, day).toDateString() === new Formatter(this.selectedYear, this.selectedMonth, this.selectedDay).toDateString();
            },
            dayButtonClassName(muted, isToday, isSelected) {
                if (isSelected) {
                    return 'btn-primary';
                }

                if (muted) {
                    return 'vue2-datetime-week-day-button text-muted';
                }

                if (isToday) {
                    return 'btn-outline-primary';
                }

                return 'vue2-datetime-week-day-button';
                //return {
                //    'text-muted font-weight-light': muted,
                //    'btn-outline-primary': isToday && !isSelected,
                //    'btn-primary': isSelected && !muted,
                //    'btn-white': !isSelected,
                //    'btn-light font-weight-bold': isSelected && muted
                //};
            }
        },
    };
</script>
