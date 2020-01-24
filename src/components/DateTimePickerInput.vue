<template>
    <div
        v-if="showIconPrepend || showIconAppend"
        class="input-group"
    >
        <slot name="prepend">
            <div
                v-if="showIconPrepend"
                class="input-group-prepend"
            >
                <span class="input-group-text">
                    <CalendarAltSolid/>
                </span>
            </div>
        </slot>
        <input
            type="text"
            class="form-control"
            v-model="model"
            :placeholder="placeholder"
            @focus="focus"
        />
        <slot name="append">
            <div
                v-if="showIconAppend"
                class="input-group-append"
            >
                <span class="input-group-text">
                    <CalendarAltSolid/>
                </span>
            </div>
        </slot>
    </div>
    <input
        v-else
        type="text"
        class="form-control"
        :placeholder="placeholder"
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
            showIconPrepend: {
                type: Boolean,
                default: false,
            },
            showIconAppend: {
                type: Boolean,
                default: true,
            },
            placeholder: {
                default: null,
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
