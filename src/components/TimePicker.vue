<template>
    <div
        class="time-picker"
        :style="styles"
    >
        <div
            v-if="isShowHours"
            class="time-picker-column"
        >
            <div
                class="time-picker-column__container"
                ref="hours"
            >
                <template v-for="hour in 24">
                    <div
                        :key="hour"
                        ref="hour"
                        class="btn time-picker-column__container-item"
                        :class="{'btn-light': hours !== hour - 1, 'btn-primary': hours === hour - 1}"
                        @click="inputHours(hour - 1)"
                    >
                        {{ getNumberForPrint(hour - 1) }}
                    </div>
                </template>
            </div>
        </div>
        <div
            v-if="isShowMinutes"
            class="time-picker-column"
        >
            <div
                class="time-picker-column__container"
                ref="minutes"
            >
                <template v-for="minute in 60">
                    <div
                        :key="minute"
                        ref="minute"
                        class="btn time-picker-column__container-item"
                        :class="{'btn-light': minutes !== minute - 1, 'btn-primary': minutes === minute - 1}"
                        @click="inputMinutes(minute - 1)"
                    >
                        {{ getNumberForPrint(minute - 1) }}
                    </div>
                </template>
            </div>
        </div>
        <div
            v-if="isShowSeconds"
            class="time-picker-column"
        >
            <div
                class="time-picker-column__container"
                ref="seconds"
            >
                <template v-for="second in 60">
                    <div
                        :key="second"
                        ref="second"
                        class="btn time-picker-column__container-item"
                        :class="{'btn-light': seconds !== second - 1, 'btn-primary': seconds === second - 1}"
                        @click="inputSeconds(second - 1)"
                    >
                        {{ getNumberForPrint(second - 1) }}
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'TimePicker',
        props: {
            format: {
                type: String,
                required: true,
            },
            hours: {
                type: Number,
                required: true,
            },
            minutes: {
                type: Number,
                required: true,
            },
            seconds: {
                type: Number,
                required: true,
            },
        },
        computed: {
            isShowHours() {
                const target = ['a', 'A', 'g', 'G', 'h', 'H'];
                for (const symbol of target) {
                    if (this.hasSymbol(this.format, symbol)) {
                        return true;
                    }
                }

                return false;
            },
            isShowMinutes() {
                return this.hasSymbol(this.format, 'i');
            },
            isShowSeconds() {
                return this.hasSymbol(this.format, 's');
            },
            styles() {
                let width = 0;

                if (this.isShowHours) {
                    width += 80;
                }

                if (this.isShowMinutes) {
                    width += 80;
                }

                if (this.isShowSeconds) {
                    width += 80;
                }

                return {width: `${width}px`};
            },
        },
        mounted() {
            this.scrollAllRefs();
        },
        updated() {
            this.scrollAllRefs();
        },
        methods: {
            input(hours, minutes, seconds) {
                this.$emit('input', hours, minutes, seconds);
            },
            inputHours(hours) {
                this.input(hours, this.minutes, this.seconds);
            },
            inputMinutes(minutes) {
                this.input(this.hours, minutes, this.seconds);
            },
            inputSeconds(seconds) {
                this.input(this.hours, this.minutes, seconds);
            },
            hasSymbol(format, symbol) {
                return Array.isArray(
                    format.match(
                        new RegExp(`(^|[^\\\\])${symbol}`)
                    )
                );
            },
            getNumberForPrint(number) {
                return `${number < 10 ? 0 : ''}${number}`;
            },
            scrollTo(element, to, duration = 150) {
                if (duration <= 0) return;
                const difference = to - element.scrollTop;
                const perTick = difference / duration * 10;

                setTimeout(() => {
                    element.scrollTop = element.scrollTop + perTick;
                    if (element.scrollTop === to) return;
                    this.scrollTo(element, to, duration - 10);
                }, 10);
            },
            scrollAllRefs() {
                if (this.isShowHours) {
                    this.scrollTo(this.$refs.hours, this.$refs.hour[this.hours].offsetTop);
                }

                if (this.isShowMinutes) {
                    this.scrollTo(this.$refs.minutes, this.$refs.minute[this.minutes].offsetTop);
                }

                if (this.isShowSeconds) {
                    this.scrollTo(this.$refs.seconds, this.$refs.second[this.seconds].offsetTop);
                }
            }
        },
    };
</script>

