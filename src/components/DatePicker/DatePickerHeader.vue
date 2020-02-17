<template>
    <div class="date-picker-header">
        <button
            type="button"
            class="btn btn-light"
            @click="previous"
        >
            <ChevronLeftSolid :width="7"/>
        </button>
        <div class="date-picker-header__container">
            <div
                v-if="isShowMonthName"
                class="flex-fill text-right"
            >
                <button
                    type="button"
                    class="btn btn-link pr-1"
                    @click="showYear"
                >
                    {{ monthName }}
                </button>
            </div>
            <div
                v-if="isShowYear"
                class="flex-fill"
                :class="{'text-left': isShowMonthName}"
            >
                <button
                    type="button"
                    class="btn btn-link"
                    :class="{'pl-1': isShowMonthName}"
                    @click="showDecade"
                >
                    {{ shownYear }}
                </button>
            </div>
            <div
                v-if="isShowDecade"
                class="flex-fill"
            >
                <button
                    type="button"
                    class="btn btn-link"
                    @click="showCentury"
                >
                    {{ decadeStartYear }} - {{ decadeFinishYear }}
                </button>
            </div>
            <div
                v-if="isShowCentury"
                class="flex-fill"
            >
                <button
                    type="button"
                    class="btn"
                    disabled
                >
                    {{ centuryStartYear }} - {{ centuryFinishYear }}
                </button>
            </div>
        </div>
        <button
            type="button"
            class="btn btn-light"
            @click="next"
        >
            <ChevronRightSolid :width="7"/>
        </button>
    </div>
</template>

<script>
    import ChevronRightSolid from 'src/components/FontAwesome/ChevronRightSolid';
    import ChevronLeftSolid from 'src/components/FontAwesome/ChevronLeftSolid';
    import {DATE_PICKER_TYPES} from 'src/consts';
    import {SHORT_MONTHS} from 'src/consts';

    export default {
        name: 'DatePickerHeader',
        components: {ChevronLeftSolid, ChevronRightSolid},
        props: {
            type: {
                type: String,
                required: true,
                validator(value) {
                    return Object.values(DATE_PICKER_TYPES).includes(value);
                },
            },
            shownYear: {
                type: Number,
                required: true,
            },
            shownMonth: {
                type: Number,
                required: true,
                validator(value) {
                    return value >= 0 && value <= 11;
                },
            },
        },
        computed: {
            monthName() {
                return SHORT_MONTHS[this.shownMonth];
            },
            isShowMonthName() {
                return this.type === DATE_PICKER_TYPES.MONTH;
            },
            isShowYear() {
                return [DATE_PICKER_TYPES.MONTH, DATE_PICKER_TYPES.YEAR].includes(this.type);
            },
            decadeStartYear() {
                return this.shownYear - this.shownYear % 10;
            },
            decadeFinishYear() {
                return this.decadeStartYear + 9;
            },
            isShowDecade() {
                return this.type === DATE_PICKER_TYPES.DECADE;
            },
            centuryStartYear() {
                if (this.shownYear >= 0) {
                    return this.shownYear - this.shownYear % 100;
                }

                return this.shownYear + (this.shownYear % 100 + 100) * -1;
            },
            centuryFinishYear() {
                return this.centuryStartYear + 99;
            },
            isShowCentury() {
                return this.type === DATE_PICKER_TYPES.CENTURY;
            },
        },
        methods: {
            previous() {
                switch (this.type) {
                    case DATE_PICKER_TYPES.MONTH:
                        if (this.shownMonth === 0) {
                            return this.$emit('shown-month:change', this.shownYear - 1, 11);
                        }

                        return this.$emit('shown-month:change', this.shownYear, this.shownMonth - 1);
                    case DATE_PICKER_TYPES.YEAR:
                        return this.$emit('shown-year:change', this.shownYear - 1);
                    case DATE_PICKER_TYPES.DECADE:
                        return this.$emit('shown-year:change', this.shownYear - 10);
                    case DATE_PICKER_TYPES.CENTURY:
                        return this.$emit('shown-year:change', this.shownYear - 100);
                }
            },
            next() {
                switch (this.type) {
                    case DATE_PICKER_TYPES.MONTH:
                        if (this.shownMonth === 11) {
                            return this.$emit('shown-month:change', this.shownYear + 1, 0);
                        }

                        return this.$emit('shown-month:change', this.shownYear, this.shownMonth + 1);
                    case DATE_PICKER_TYPES.YEAR:
                        return this.$emit('shown-year:change', this.shownYear + 1);
                    case DATE_PICKER_TYPES.DECADE:
                        return this.$emit('shown-year:change', this.shownYear + 10);
                    case DATE_PICKER_TYPES.CENTURY:
                        return this.$emit('shown-year:change', this.shownYear + 100);
                }
            },
            showYear() {
                this.$emit('type:update', DATE_PICKER_TYPES.YEAR);
            },
            showDecade() {
                this.$emit('type:update', DATE_PICKER_TYPES.DECADE);
            },
            showCentury() {
                this.$emit('type:update', DATE_PICKER_TYPES.CENTURY);
            },
        },
    };
</script>
