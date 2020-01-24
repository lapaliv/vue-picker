<template>
    <div
        v-if="showIcon"
        class="input-group"
    >
        <input
            type="text"
            class="form-control"
            v-model="model"
            @focus="focus"
        />
        <div class="input-group-append">
            <span class="input-group-text">
                <CalendarAltSolid/>
            </span>
        </div>
    </div>
    <input
        v-else
        type="text"
        class="form-control"
        v-model="model"
        @focus="focus"
    />
</template>

<script>
    import CalendarAltSolid from '@lapaliv/vue-picker/src/components/FontAwesome/CalendarAltSolid';

    export default {
        name: 'DateTimePickerInput',
        components: {CalendarAltSolid},
        props: {
            value: {
                type: null,
                required: true,
            },
            showIcon: {
                type: Boolean,
                default: true,
            },
        },
        computed: {
            model: {
                get() {
                    return this.value;
                },
                set(value) {
                    this.$emit('input', value);
                },
            },
        },
        methods: {
            focus() {
                this.$emit('focus');
            },
        },
    };
</script>
