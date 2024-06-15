<script>
    export default {
        props: ['dayHistory'],
        data() {
            return {
                hovered: false
            }
        }
    }
</script>

<template>
    <div @mouseenter="hovered = true" @mouseleave="hovered = false" :class="this.dayHistory?.summary?.class" class="ml-0.5 sm:rounded-lg flex-1 h-8 relative">
        <div v-if="hovered" class="absolute card mt-10 pl-5 pr-5 whitespace-nowrap z-10">
            <p>Date: {{ dayHistory.date }}</p>
            <p>Status: {{ dayHistory.summary.text }}</p>
        </div>
    </div>
</template>