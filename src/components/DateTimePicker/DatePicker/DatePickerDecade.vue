<template>
    <div class="date-picker-decade">
        <template v-for="(chunk, index) in years">
            <div
                :key="index"
                class="date-picker-decade__row"
            >
                <template v-for="year in chunk">
                    <div
                        :key="year"
                        class="date-picker-decade__item"
                    >
                        <button
                            class="btn date-time-picker-button"
                            :class="className(year)"
                            @click="select(year)"
                        >
                            {{ year }}
                        </button>
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>

<script>
    import {chunk} from 'lodash';

    export default {
        name: 'Decade',
        props: {
            shownYear: {
                type: Number,
                required: true,
            },
        },
        computed: {
            currentYear() {
                return new Date().getFullYear();
            },
            startYear() {
                return this.shownYear - this.shownYear % 10;
            },
            finishYear() {
                return this.startYear + 9;
            },
            years() {
                let result = [];

                for (let i = this.startYear - 1; i <= this.finishYear + 1; i++) {
                    result.push(i);
                }

                return chunk(result, 3);
            },
        },
        methods: {
            yearIsMuted(year) {
                return year < this.startYear || year > this.finishYear;
            },
            className(year) {
                let result = [];

                if (this.yearIsMuted(year)) {
                    result.push('date-time-picker-button--muted');
                }

                if (this.currentYear === year) {
                    result.push('btn-outline-primary');
                } else {
                    result.push('btn-light');
                }


                return result;
            },
            select(year) {
                this.$emit('shown-year:change', year);

                if (!this.yearIsMuted(year)) {
                    this.$emit('close');
                }
            },
        }
    };
</script>
