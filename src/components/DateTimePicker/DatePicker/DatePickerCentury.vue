<template>
    <div class="date-picker-century">
        <template v-for="(chunk, index) in decades">
            <div
                :key="index"
                class="date-picker-century__column"
            >
                <template v-for="decade in chunk">
                    <div
                        :key="decade.startYearOfDecade + decade.finishYearOfDecade"
                        class="date-picker-century__item"
                    >
                        <button
                            :class="className(decade.startYearOfDecade, decade.finishYearOfDecade)"
                            class="btn date-time-picker-button"
                            @click="select(decade.startYearOfDecade, decade.finishYearOfDecade)"
                        >
                            {{ decade.startYearOfDecade }} - {{ decade.finishYearOfDecade }}
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
        name: 'Century',
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
                if(this.shownYear >= 0) {
                    return this.shownYear - this.shownYear % 100;
                }

                return this.shownYear + (this.shownYear % 100 + 100) * -1;
            },
            finishYear() {
                return this.startYear + 99;
            },
            decades() {
                let result = [];
                for (let startYearOfDecade = this.startYear - 10; startYearOfDecade <= this.finishYear + 9; startYearOfDecade += 10) {
                    result.push({
                        startYearOfDecade,
                        finishYearOfDecade: startYearOfDecade + 9,
                    });
                }

                return chunk(result, Math.ceil(result.length / 2));
            },
        },
        methods: {
            decadeIsMuted(startYearOfDecade, finishYearOfDecade) {
                return finishYearOfDecade < this.startYear || startYearOfDecade > this.finishYear;
            },
            className(startYearOfDecade, finishYearOfDecade) {
                let result = [];

                if (this.decadeIsMuted(startYearOfDecade, finishYearOfDecade)) {
                    result.push('date-time-picker-button--muted');
                }

                if (this.currentYear >= startYearOfDecade && this.currentYear <= finishYearOfDecade) {
                    result.push('btn-outline-primary');
                } else {
                    result.push('btn-light');
                }

                return result;
            },
            select(startYearOfDecade, finishYearOfDecade) {
                this.$emit('shown-year:change', startYearOfDecade);

                if (!this.decadeIsMuted(startYearOfDecade, finishYearOfDecade)) {
                    this.$emit('close');
                }
            },
        },
    };
</script>
