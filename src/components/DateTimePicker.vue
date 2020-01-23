<template>
    <div class="date-time-picker">
        <DateTimePickerInput
            v-model="printDate"
            :show-icon="showIcon"
            @focus="showPicker"
            @blur="hidePicker"
        />
        <div
            v-if="isShowPicker"
            class="date-time-picker-popup"
            tabindex="0"
        >
            <DatePicker
                :year="shownYear"
                :month="shownMonth"
                :selected-year="selectedYear"
                :selected-month="selectedMonth"
                :selected-day="selectedDay"
                @select="selectDay"
                @show="showDate"
            />
        </div>
    </div>
</template>

<script>
    import {Formatter} from 'src/utils/formatter';
    import DateTimePickerInput from 'src/components/DateTimePicker/DateTimePickerInput';
    import DatePicker from 'src/components/DateTimePicker/DatePicker';

    export default {
        name: 'DateTimePicker',
        components: {DatePicker, DateTimePickerInput},
        props: {
            showIcon: {
                type: Boolean,
                default: true,
            },
            value: {
                required: false,
            },
            format: {
                type: String,
                default: 'Y-m-d',
            },
            printFormat: {
                default: null,
            },
        },
        data() {
            return {
                isShowPicker: false,

                shownYear: null,
                shownMonth: null,

                selectedYear: null,
                selectedMonth: null,
                selectedDay: null,

                printDate: null,
                resultDate: null,
            };
        },
        computed: {
            targetResultFormat() {
                return this.format;
            },
            targetPrintFormat() {
                return this.printFormat || this.format;
            },
        },
        watch: {
            selectedDay(day) {
                if (day) {
                    const formatter = new Formatter(this.selectedYear, this.selectedMonth, this.selectedDay);
                    this.printDate = formatter.build(this.targetPrintFormat);
                    this.resultDate = formatter.build(this.targetResultFormat);
                }
            },
            printDate(value) {
                if (this.value !== value) {
                    try {
                        const parser = Formatter.parse(this.targetPrintFormat, value);
                        this.selectDay(parser.year, parser.month, parser.day);
                    } catch (e) {
                        this.resultDate = value;
                        this.cleanSelectedData();
                    }
                } else {
                    this.resultDate = value;
                    this.cleanSelectedData();
                }
            },
            value: {
                handler(value) {
                    try {
                        const parser = Formatter.parse(this.targetResultFormat, value);
                        this.selectDay(parser.year, parser.month, parser.day);
                    } catch (e) {
                        this.printDate = value;
                        this.cleanSelectedData();
                    }
                },
                immediate: true,
            },
            resultDate(value) {
                if (value !== this.value) {
                    this.$emit('input', value);
                }

                this.$emit('is-valid', this.selectedDay !== null);
            },
        },
        beforeMount() {
            this.defineShownData();
            this.listenDocumentClickEvent();
        },
        beforeDestroy() {
            document.removeEventListener('click', this.listenerDocumentClick, true);
        },
        methods: {
            selectDay(year, month, day) {
                this.selectedYear = year;
                this.selectedMonth = month;
                this.selectedDay = day;

                this.showDate(year, month);
                this.hidePicker();
            },
            showDate(year, month) {
                this.shownYear = Math.max(1, year);
                if (typeof month === 'number') {
                    this.shownMonth = Math.max(0, Math.min(11, month));
                }
            },
            showPicker() {
                this.isShowPicker = true;
                this.defineShownData();
            },
            hidePicker() {
                this.isShowPicker = false;
            },
            listenDocumentClickEvent() {
                document.addEventListener('click', this.listenerDocumentClick, true);
            },
            listenerDocumentClick(event) {
                const hasTarget = !!event.target;
                const componentContainsTarget = hasTarget && this.$el.contains(event.target);
                const componentEqualsTarget = hasTarget && this.$el === event.target;

                if (!componentContainsTarget && !componentEqualsTarget) {
                    this.hidePicker();
                }
            },
            cleanSelectedData() {
                this.selectedYear = null;
                this.selectedMonth = null;
                this.selectedDay = null;
            },
            defineShownData() {
                const now = new Date();

                this.shownYear = this.selectedYear || now.getFullYear();
                this.shownMonth = this.selectedMonth || now.getMonth();
            },
        },
    };
</script>
