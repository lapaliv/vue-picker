<template>
    <div class="date-time-picker">
        <slot name="input">
            <DateTimePickerInput
                v-model="printDate"
                :show-icon-prepend="showIconPrepend"
                :show-icon-append="showIconAppend"
                :placeholder="placeholder"
                @focus="showPicker"
            >
                <template
                    v-if="$slots['input-prepend']"
                    v-slot:prepend
                >
                    <slot name="input-prepend"/>
                </template>

                <template
                    v-if="$slots['input-append']"
                    v-slot:append
                >
                    <slot name="input-append"/>
                </template>
            </DateTimePickerInput>
        </slot>
        <div
            v-if="isShowPicker"
            class="date-time-picker-popup"
            tabindex="0"
        >
            <DatePicker
                v-if="hasDate"
                :year="shownYear"
                :month="shownMonth"
                :selected-year="selectedYear"
                :selected-month="selectedMonth"
                :selected-day="selectedDay"
                @select="selectDay"
                @show="showDate"
            />
            <TimePicker
                v-if="hasTime"
                :format="targetPrintFormat"
                :hours="hours"
                :minutes="minutes"
                :seconds="seconds"
                @input="setTime"
            />
        </div>
    </div>
</template>

<script>
    import DateTimePickerInput from 'src/components/DateTimePickerInput';
    import DatePicker from 'src/components/DatePicker';
    import TimePicker from 'src/components/TimePicker';
    import DateTimeFormatter from '@lapaliv/datetime-formatter';

    export default {
        name: 'DateTimePicker',
        components: {TimePicker, DatePicker, DateTimePickerInput},
        props: {
            showIconPrepend: {
                type: Boolean,
                default: false,
            },
            showIconAppend: {
                type: Boolean,
                default: false,
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
            placeholder: {
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
                hours: 0,
                minutes: 0,
                seconds: 0,

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
            hasDate() {
                const target = ['d', 'D', 'j', 'l', 'N', 'S', 'w', 'z', 'W', 'F', 'm', 'M', 'n', 't', 'L', 'o', 'Y', 'y'];
                for (let targetSymbol of target) {
                    if (this.hasSymbol(this.targetPrintFormat, targetSymbol)) {
                        return true;
                    }
                }

                return false;
            },
            hasTime() {
                const target = ['a', 'A', 'B', 'g', 'G', 'h', 'H', 'i', 's', 'u', 'v'];
                for (let targetSymbol of target) {
                    if (this.hasSymbol(this.targetPrintFormat, targetSymbol)) {
                        return true;
                    }
                }

                return false;
            },
        },
        watch: {
            selectedDay() {
                this.definePrintDate();
            },
            printDate(value) {
                if (this.value !== value) {
                    try {
                        const parser = DateTimeFormatter.createFromFormat(this.targetPrintFormat, value);
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
                        const parser = DateTimeFormatter.createFromFormat(this.targetResultFormat, value);
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
            hours() {
                this.definePrintDate();
            },
            minutes() {
                this.definePrintDate();
            },
            seconds() {
                this.definePrintDate();
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
            hasSymbol(format, symbol) {
                return Array.isArray(
                    format.match(
                        new RegExp(`(^|[^\\\\])${symbol}`)
                    )
                );
            },
            setTime(hours, minutes, seconds) {
                this.hours = hours;
                this.minutes = minutes;
                this.seconds = seconds;
            },
            definePrintDate() {
                if (this.selectedYear && this.selectedMonth && this.selectedDay) {
                    const formatter = new DateTimeFormatter(
                        this.selectedYear,
                        this.selectedMonth,
                        this.selectedDay,
                        this.hours,
                        this.minutes,
                        this.seconds
                    );
                    this.printDate = formatter.format(this.targetPrintFormat);
                    this.resultDate = formatter.format(this.targetResultFormat);
                }
            },
        },
    };
</script>
