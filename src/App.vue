<template>
    <div
        id="app"
        class="w-50 mx-auto mt-5"
    >
        <div class="mb-3">
            <strong>{{ date }}</strong>
            <span
                class="text-danger"
                v-if="!dateIsValid"
            >
                no valid
            </span>
            <span
                class="text-success"
                v-else
            >
                valid
            </span>
        </div>

        <input v-model="date" class="form-control mb-3" />

        <DateTimePicker
            v-model="date"
            print-format="d.m.Y H:i:s"
            @is-valid="isValidDate"
            class="mb-3"
        />

        {{ date2 }}
        <DateTimePicker
            v-model="date2"
            print-format="d.m.Y H:i"
            format="Y-m-d H:i"
            @is-valid="isValidDate"
            class="mb-3"
        />
    </div>
</template>

<script>
    import "bootstrap/scss/bootstrap.scss";
    import 'src/scss/date-time-picker.scss';

    import DateTimePicker from 'src/DateTimePicker';

    export default {
        name: 'app',
        data() {
            return {
                date: null,
                date2: null,
                dateIsValid: false,
            };
        },
        components: {
            DateTimePicker,
        },
        methods: {
            isValidDate(payload) {
                this.dateIsValid = payload;
            },
        },
    };
</script>
