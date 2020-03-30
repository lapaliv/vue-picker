<template>
    <div class="time-picker">
        <div class="time-picker-column">
            <button
                class="btn btn-light date-time-picker-button mb-3"
                type="button"
                @click="inputHours(hours + 1)"
            >
                <ChevronUpSolid :width="15"/>
            </button>
            <input
                type="text"
                class="form-control text-center"
                :value="hours"
                @input="inputHours"
            />
            <button
                class="btn btn-light date-time-picker-button mt-3"
                type="button"
                @click="inputHours(hours - 1)"
            >
                <ChevronDownSolid :width="15"/>
            </button>
        </div>
        <div class="time-picker-column">
            <div>:</div>
        </div>
        <div class="time-picker-column">
            <button
                class="btn btn-light date-time-picker-button mb-3"
                type="button"
                @click="inputMinutes(minutes + 1)"
            >
                <ChevronUpSolid :width="15"/>
            </button>
            <input
                type="text"
                class="form-control text-center"
                :value="minutes"
                @input="inputMinutes"
            />
            <button
                class="btn btn-light date-time-picker-button mt-3"
                type="button"
                @click="inputMinutes(minutes - 1)"
            >
                <ChevronDownSolid :width="15"/>
            </button>
        </div>
        <div class="time-picker-column">
            <div>:</div>
        </div>
        <div class="time-picker-column">
            <button
                class="btn btn-light date-time-picker-button mb-3"
                type="button"
                @click="inputSeconds(seconds + 1)"
            >
                <ChevronUpSolid :width="15"/>
            </button>
            <input
                type="text"
                class="form-control text-center"
                :value="seconds"
                @input="inputSeconds"
            />
            <button
                class="btn btn-light date-time-picker-button mt-3"
                type="button"
                @click="inputSeconds(seconds - 1)"
            >
                <ChevronDownSolid :width="15"/>
            </button>
        </div>
    </div>
</template>

<script>
    import ChevronUpSolid from 'src/components/FontAwesome/ChevronUpSolid';
    import ChevronDownSolid from 'src/components/FontAwesome/ChevronDownSolid';

    export default {
        name: 'TimePicker',
        components: {ChevronDownSolid, ChevronUpSolid},
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
                return true;
            },
            isShowMinutes() {
                return true;
            },
            isShowSeconds() {
                return true;
            },
        },
        methods: {
            input(hours, minutes, seconds) {
                this.$emit('input', hours, minutes, seconds);
            },
            inputHours(event) {
                const value = typeof event === 'number' ? event : parseInt(event.target.value);
                this.input(value, this.minutes, this.seconds);
            },
            inputMinutes(event) {
                const value = typeof event === 'number' ? event : parseInt(event.target.value);
                this.input(this.hours, value, this.seconds);
            },
            inputSeconds(event) {
                const value = typeof event === 'number' ? event : parseInt(event.target.value);
                this.input(this.hours, this.minutes, value);
            },
        },
    };
</script>

