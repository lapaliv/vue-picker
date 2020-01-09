<template>
    <div class="vue2-datetime-month">
        <div class="vue2-datetime-month-header">
            <button
                class="btn btn-link"
                @click="prevMonth"
            >
                <ChevronLeftSolid
                    style="width: 7px;"
                />
            </button>
            <div class="vue2-datetime-month-header-text-container">
                <button class="btn btn-link">{{ monthName }}</button>
                <button class="btn btn-link">{{ year }}</button>
            </div>
            <button
                class="btn btn-link"
                @click="nextMonth"
            >
                <ChevronRightSolid
                    style="width: 7px;"
                />
            </button>
        </div>
        <div class="vue2-datetime-month-body">
            <Weeks
                :month="month"
                :year="year"
                :selected-year="selectedYear"
                :selected-month="selectedMonth"
                :selected-day="selectedDay"
                @select="selectDay"
            />
        </div>
    </div>
</template>

<script>
    import Weeks from './Month/Weeks';
    import ChevronLeftSolid from 'src/components/FontAwesome/ChevronLeftSolid';
    import ChevronRightSolid from 'src/components/FontAwesome/ChevronRightSolid';
    import {Formatter} from 'src/utils/formatter';

    export default {
        name: 'Month',
        components: {ChevronRightSolid, ChevronLeftSolid, Weeks},
        props: {
            year: {
                type: Number,
                required: true,
                validator(value) {
                    return value > 0;
                },
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
            monthName() {
                const formatter = new Formatter(this.year, this.month, 1);
                return formatter.build('M');
            },
        },
        methods: {
            selectDay(year, month, day) {
                this.$emit('select', year, month, day);
            },
            prevMonth() {
                if (this.month === 0) {
                    this.$emit('show', this.year - 1, 11);
                } else {
                    this.$emit('show', this.year, this.month - 1);
                }
            },
            nextMonth() {
                if (this.month === 11) {
                    this.$emit('show', this.year + 1, 0);
                } else {
                    this.$emit('show', this.year, this.month + 1);
                }
            },
        },
    };
</script>
