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
            print-format="d.m.Y"
            @is-valid="isValidDate"
        />
    </div>
</template>

<script>
    import './assets/dev.scss';
    import DateTimePicker from 'src/components/DateTimePicker';

    export default {
        name: 'app',
        data() {
            return {
                date: null,
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
