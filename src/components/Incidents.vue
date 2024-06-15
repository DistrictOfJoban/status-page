<script>
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "November", "December"];
export default {
    props: ['icons'],
    created() {
        this.fetchIncidentData();
    },
    data() {
        return {
            allIncidents: null,
            dateTimeFormatter: new Intl.DateTimeFormat("en-US", {month: "short", day: "numeric", hour: "numeric", minute: "numeric"})
        }
    },
    methods: {
        toReadableMonth(yearMonth) {
            let [year, month] = yearMonth.split("-");
            return `${months[parseInt(month)-1]} ${year}`
        },
        async fetchIncidentData() {
            const resp = await fetch("https://api.github.com/repos/DistrictOfJoban/status-page/issues?per_page=20&state=all&labels=incident");
            const data = await resp.json();
            const allIncidents = new Map();

            for(let incident of data) {
                let month = incident.created_at.substring(0, 7);
                let arr = allIncidents.get(month) ?? [];
                arr.push({
                    title: incident.title,
                    description: incident.body,
                    state: incident.state,
                    created_at: incident.created_at,
                    closed_at: incident.closed_at
                });
                allIncidents.set(month, arr);
            }
            
            this.allIncidents = allIncidents;
        }
    }
}
</script>

<template>
    <div class="mt-5" v-if="allIncidents != null">
        <div class="mb-10" v-for="([month, incidents]) in allIncidents">
            <p class="mr-5 text-2xl font-semibold leading-6 text-gray-900 dark:text-gray-100">{{ toReadableMonth(month) }}</p>
            <div class="mt-2 flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>

            <div class="ml-6 border-l-4 dark:border-gray-500" v-for="incident in incidents">
                <div class="flex">
                    <div :class="{'bg-gray-300': incident.closed_at !== null, 'bg-yellow-500': incident.closed_at === null}" class="-ml-4 mt-6 flex rounded-full w-7 h-7">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="17" viewBox="0 0 14 14" fill="none" class="m-auto fill-gray-500 text-disrupted">
                            <path d="M6.99999 2.3C10.14 2.3 12.7 4.86 12.7 8C12.7 11.14 10.14 13.7 6.99999 13.7C3.85999 13.7 1.29999 11.14 1.29999 8C1.29999 4.86 3.85999 2.3 6.99999 2.3ZM7 1C3.14 1 0 4.14 0 8C0 11.86 3.14 15 7 15C10.86 15 14 11.86 14 8C14 4.14 10.86 1 7 1ZM8 4H6V9H8V4ZM8 10H6V12H8V10Z"></path>
                        </svg>
                    </div>
                    <div class="items-center ml-3 mt-6">
                    <p class="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">{{ incident.title }}</p>
                    <p v-if="incident.state === 'closed'" class="text-sm text-gray-500">This incident has been resolved.</p>
                    <p v-else class='text-sm text-gray-500 dark:text-gray-400'>This incident is still ongoing.</p>
                    <p v-if="incident.closed_at != null" class="text-sm text-gray-500">{{ dateTimeFormatter.format(new Date(incident.created_at)) }} - {{ dateTimeFormatter.format(new Date(incident.closed_at)) }}</p>
                    <p v-else class="text-sm text-gray-500">Since {{ dateTimeFormatter.format(new Date(incident.created_at)) }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="mt-5" v-else>
        <div class="load-placeholder relative rounded-lg bg-gray-800 bg-opacity-5 dark:bg-white dark:bg-opacity-5">
            <div class="placeholder-anim"></div>
        </div>
    </div>
  </template>