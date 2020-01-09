<template>
    <div id="app" class="w-50 mx-auto mt-5">
        <Calendar/>
    </div>
</template>

<script>
    import Calendar from './components/Calendar';
    import './scss/dev.scss';

    export default {
        name: 'app',
        components: {
            Calendar,
        }
    };
</script>
