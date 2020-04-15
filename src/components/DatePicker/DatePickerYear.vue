<template>
    <div class="date-picker-year">
        <template v-for="(chunk, index) in months">
            <div
                :key="index"
                class="date-picker-year__row"
            >
                <template v-for="month in chunk">
                    <div
                        :key="month.index"
                        class="date-picker-year__item"
                    >
                        <button
                            type="button"
                            :class="className(month.index)"
                            class="btn date-time-picker-button"
                            @click="select(month.index)"
                        >
                            {{ month.title }}
                        </button>
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>

<script>
    import {chunk} from 'lodash';
    import {SHORT_MONTHS} from '@lapaliv/vue-picker/src/consts';

    export default {
        name: 'Year',
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
            currentMonth() {
                return new Date().getMonth();
            },
            months() {
                let result = [];
                for (let i = 0; i < SHORT_MONTHS.length; i++) {
                    result.push({
                        index: i,
                        title: SHORT_MONTHS[i],
                    });
                }

                return chunk(result, 3);
            },
        },
        methods: {
            className(month) {
                let result = [];

                if (this.shownYear === this.currentYear && month === this.currentMonth) {
                    result.push('btn-outline-primary');
                } else {
                    result.push('btn-light');
                }

                return result;
            },
            select(month) {
                this.$emit('shown-month:change', this.shownYear, month);
                this.$emit('close');
            },
        },
    };
</script>
