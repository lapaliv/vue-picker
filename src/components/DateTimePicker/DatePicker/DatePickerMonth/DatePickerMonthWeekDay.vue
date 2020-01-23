<template>
    <div class="date-picker-month__week-day">
        <button
            class="btn date-time-picker-button"
            :class="className"
            @click="select"
        >
            {{ day }}
        </button>
    </div>
</template>

<script>
    export default {
        name: 'DatePickerMonthWeekDay',
        props: {
            year: {
                type: Number,
                required: true,
            },
            month: {
                type: Number,
                required: true,
                validator(value) {
                    return value >= 0 && value <= 11;
                },
            },
            day: {
                type: Number,
                required: true,
                validator(value) {
                    return value > 0 && value <= 31;
                },
            },
            shownYear: {
                type: Number,
                required: true,
            },
            shownMonth: {
                type: Number,
                required: true,
                validator(value) {
                    return value >= 0 && value <= 11;
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
            currentYear() {
                return new Date().getFullYear();
            },
            currentMonth() {
                return new Date().getMonth();
            },
            currentDay() {
                return new Date().getDate();
            },
            dateFromOtherMonth() {
                return this.year !== this.shownYear || this.month !== this.shownMonth;
            },
            wasSelected() {
                return this.selectedYear === this.year
                    && this.selectedMonth === this.month
                    && this.selectedDay === this.day;
            },
            isToday() {
                return this.currentYear === this.year
                    && this.currentMonth === this.month
                    && this.currentDay === this.day;
            },
            className() {
                if (this.wasSelected) {
                    return 'btn-primary';
                }

                if (this.dateFromOtherMonth) {
                    return 'btn-light date-time-picker-button--muted';
                }

                if (this.isToday) {
                    return 'btn-outline-primary';
                }

                return 'btn-light';
            },
        },
        methods: {
            select() {
                this.$emit('select', this.year, this.month, this.day);
            },
        },
    };
</script>
