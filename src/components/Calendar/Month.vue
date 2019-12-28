<template>
    <div class="month">
        <div class="month-header">
            <button
                class="btn btn-link text-black-50"
                @click="prevMonth"
            >
                <ChevronLeftSolid
                    style="width: 7px;"
                />
            </button>
            <div class="month-header-text-container">
                <button class="btn btn-link px-1 text-black font-weight-600">{{ monthName }}</button>
                <button class="btn btn-link px-1 text-black font-weight-600">{{ year }}</button>
            </div>
            <button
                class="btn btn-link text-black-50"
                @click="nextMonth"
            >
                <ChevronRightSolid
                    style="width: 7px;"
                />
            </button>
        </div>
        <div class="px-2 pt-1">
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
