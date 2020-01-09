<template>
    <div class="vue2-datetime w-100">

        {{ resultDate }}
        <div class="input-group">
            <input
                type="text"
                class="form-control"
                v-model="printDate"
            >
            <div class="input-group-append">
                <span class="input-group-text">
                    <CalendarAltSolid/>
                </span>
            </div>
        </div>
        <div
            class="vue2-datetime-calendar"
            tabindex="0"
        >
            <Month
                :year="shownYear"
                :month="shownMonth"
                :selected-year="selectedYear"
                :selected-month="selectedMonth"
                :selected-day="selectedDay"
                @select="selectDay"
                @show="showDate"
            />
            <div class="vue2-datetime-calendar-footer">
                <button class="btn btn-link">
                    Today
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import Month from './Calendar/Month';
    import CalendarAltSolid from 'src/components/FontAwesome/CalendarAltSolid';
    import {Formatter} from 'src/utils/formatter';

    export default {
        name: 'Calendar',
        components: {CalendarAltSolid, Month},
        data() {
            return {
                shownYear: null,
                shownMonth: null,

                selectedYear: null,
                selectedMonth: null,
                selectedDay: null,

                printDate: null,
                resultDate: null,
            };
        },
        beforeMount() {
            this.shownYear = new Date().getFullYear();
            this.shownMonth = new Date().getMonth();
        },
        watch: {
            selectedDay(day) {
                if (day) {
                    const formatter = new Formatter(this.selectedYear, this.selectedMonth, this.selectedDay);
                    this.printDate = formatter.build('d/m/Y');
                }
            },
            printDate() {
                const formatter = new Formatter(this.selectedYear, this.selectedMonth, this.selectedDay);
                this.resultDate = formatter.build('Y-m-d H:i:s');
            }
        },
        methods: {
            selectDay(year, month, day) {
                this.selectedYear = year;
                this.selectedMonth = month;
                this.selectedDay = day;

                this.showDate(year, month);
            },
            showDate(year, month) {
                this.shownYear = Math.max(1, year);
                this.shownMonth = Math.max(0, Math.min(11, month));
            },
        },
    };
</script>
