<template>
    <div class="date-picker">
        <DatePickerHeader
            :type="type"
            :shown-month="shownMonth"
            :shown-year="shownYear"
            @type:update="changeType"
            @shown-month:change="changeShownMonth"
            @shown-year:change="changeShownYear"
        />

        <DatePickerMonth
            v-if="isMonth"
            :year="year"
            :month="month"
            :selected-year="selectedYear"
            :selected-month="selectedMonth"
            :selected-day="selectedDay"
            :shown-year="shownYear"
            :shown-month="shownMonth"
            @shown-month:change="changeShownMonth"
            @select="selectDate"
            @close="nextType"
        />
        <DatePickerYear
            v-if="isYear"
            :shown-year="shownYear"
            @shown-month:change="changeShownMonth"
            @close="nextType"
        />
        <DatePickerDecade
            v-else-if="isDecade"
            :shown-year="shownYear"
            @shown-year:change="changeShownYear"
            @close="nextType"
        />
        <DatePickerCentury
            v-else-if="isCentury"
            :shown-year="shownYear"
            @shown-year:change="changeShownYear"
            @close="nextType"
        />
    </div>
</template>

<script>
    import DatePickerMonth from 'src/components/DateTimePicker/DatePicker/DatePickerMonth';
    import DatePickerCentury from 'src/components/DateTimePicker/DatePicker/DatePickerCentury';
    import DatePickerDecade from 'src/components/DateTimePicker/DatePicker/DatePickerDecade';
    import DatePickerYear from 'src/components/DateTimePicker/DatePicker/DatePickerYear';
    import {DATE_PICKER_TYPES} from 'src/consts';
    import DatePickerHeader from 'src/components/DateTimePicker/DatePicker/DatePickerHeader';

    export default {
        name: 'DatePicker',
        components: {DatePickerHeader, DatePickerYear, DatePickerDecade, DatePickerCentury, DatePickerMonth},
        props: {
            year: {
                type: null,
                required: true,
                validator(value) {
                    return typeof value === 'number' || value === null;
                },
            },
            month: {
                type: null,
                required: true,
                validator(value) {
                    return typeof value === 'number' || value === null;
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
        data() {
            return {
                shownYear: null,
                shownMonth: null,

                type: DATE_PICKER_TYPES.MONTH,
            };
        },
        computed: {
            isMonth() {
                return this.type === DATE_PICKER_TYPES.MONTH;
            },
            isYear() {
                return this.type === DATE_PICKER_TYPES.YEAR;
            },
            isDecade() {
                return this.type === DATE_PICKER_TYPES.DECADE;
            },
            isCentury() {
                return this.type === DATE_PICKER_TYPES.CENTURY;
            },
        },
        watch: {
            year: {
                handler(year) {
                    this.shownYear = year === null ? new Date().getFullYear() : year;
                },
                immediate: true,
            },
            month: {
                handler(month) {
                    this.shownMonth = month === null ? new Date().getMonth() : month;
                },
                immediate: true,
            },
        },
        methods: {
            changeShownYear(year) {
                this.shownYear = year;
            },
            changeShownMonth(year, month) {
                this.shownYear = year;
                this.shownMonth = month;
            },
            selectDate(year, month, day) {
                this.$emit('select', year, month, day);
            },
            changeType(type) {
                this.type = type;
            },
            nextType() {
                switch (this.type) {
                    case DATE_PICKER_TYPES.CENTURY:
                        return this.changeType(DATE_PICKER_TYPES.DECADE);
                    case DATE_PICKER_TYPES.DECADE:
                        return this.changeType(DATE_PICKER_TYPES.YEAR);
                }

                return this.changeType(DATE_PICKER_TYPES.MONTH);
            },
        },
    };
</script>
