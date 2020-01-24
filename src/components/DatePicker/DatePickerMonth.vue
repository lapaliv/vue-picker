<template>
    <div class="date-picker-month">
        <div class="date-picker-month__header">
            <template v-for="shortDay in shortDays">
                <div
                    :key="shortDay"
                    class="date-picker-month__header-item"
                >
                    {{ shortDay }}
                </div>
            </template>
        </div>

        <template v-for="(week, index) in weeks">
            <div
                :key="index"
                class="date-picker-month__week"
            >
                <template v-for="day in week">
                    <DatePickerMonthWeekDay
                        :key="day.key"
                        :year="day.year"
                        :month="day.month"
                        :day="day.day"
                        :selected-year="selectedYear"
                        :selected-month="selectedMonth"
                        :selected-day="selectedDay"
                        :shown-year="shownYear"
                        :shown-month="shownMonth"
                        @select="selectDay"
                    />
                </template>
            </div>
        </template>

        <div
            class="date-picker-month__footer"
            @click="selectToday"
        >
            <button class="btn btn-link">
                Today
            </button>
        </div>
    </div>
</template>

<script>
    import {Formatter} from '@lapaliv/vue-picker/src/utils/formatter';
    import {SHORT_DAYS} from '@lapaliv/vue-picker/src/consts';
    import DatePickerMonthWeekDay from '@lapaliv/vue-picker/src/components/DatePicker/DatePickerMonth/DatePickerMonthWeekDay';

    export default {
        name: 'DatePickerMonth',
        components: {DatePickerMonthWeekDay},
        props: {
            selectedYear: {
                required: true,
            },
            selectedMonth: {
                required: true,
            },
            selectedDay: {
                required: true,
            },
            shownYear: {
                type: Number,
                required: true,
            },
            shownMonth: {
                type: Number,
                required: true,
                validator(value) {
                    return value >= 0 && value < 12;
                },
            },
        },
        computed: {
            prevMonth() {
                return this.shownMonth === 0 ? 11 : this.shownMonth - 1;
            },
            nextMonth() {
                return this.shownMonth === 11 ? 0 : this.shownMonth + 1;
            },
            yearForPrevMonth() {
                return this.prevMonth === 11 ? this.shownYear - 1 : this.shownYear;
            },
            yearForNextMonth() {
                return this.nextMonth === 0 ? this.shownYear + 1 : this.shownYear;
            },
            firstDayInCurrentMonth() {
                return new Date(this.shownYear, this.shownMonth).getDay() > 0
                    ? new Date(this.shownYear, this.shownMonth).getDay()
                    : 7;
            },
            countDaysInCurrentMonth() {
                return this.getCountDaysInMonth(this.shownYear, this.shownMonth);
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
                        const isLostPrevMonth = week === 1 && tmpDay > this.countDaysInPrevMonth;
                        const isLostCurrentMonth = week >= this.countWeeksInCurrentMonth && tmpDay > this.countDaysInCurrentMonth;

                        if (isLostPrevMonth || isLostCurrentMonth) {
                            tmpDay = 1;
                            tmpYear = isLostPrevMonth ? this.shownYear : this.yearForNextMonth;
                            tmpMonth = isLostPrevMonth ? this.shownMonth : this.nextMonth;
                        }

                        arrayWeek.push({
                            year: tmpYear,
                            month: tmpMonth,
                            day: tmpDay,
                            key: `${tmpYear}-${tmpMonth}-${tmpDay}`,
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
            selectToday() {
                const now = new Date();
                this.selectDay(now.getFullYear(), now.getMonth(), now.getDate());
            },
        },
    };
</script>
