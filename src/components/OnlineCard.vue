<script>
    export default {
        props: ['icons', 'services', 'serviceStatus']
    }
</script>

<template>
    <div class="mx-px md:ml-40 md:mr-40 lg:ml-80 lg:mr-80  bg-white dark:bg-slate-800 rounded-xl card">
        <div class="w-full flex justify-between pt-2 pl-6 pr-6 pb-2">
            <div class="flex items-center sm:text-xl text-xs font-semibold leading-7">
                <span v-html="serviceStatus.icon"></span>
                <p class="ml-3 text-gray-900 dark:text-gray-200">{{ serviceStatus.serviceTitle }}</p>
            </div>
            <div>
                <p class="text-xs text-gray-400">Last updated</p>
                <p class="text-xs text-gray-400 text-end">{{ this.services?.[0]?.last_updated }}</p>
            </div>
        </div>
    </div>
</template>