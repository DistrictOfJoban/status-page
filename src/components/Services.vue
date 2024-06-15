<script>
  import ServicePill from './ServicePill.vue';

  export default {
    props: ['maxHistory', 'services', 'icons'],
    components: {
      ServicePill
    },
    methods: {
        getUptimePercentage(uptime) {
            let filtered = uptime.filter(e => e.status.length > 0);

            let total = 0;
            for(let history of filtered) {
              total += history.summary.weight;
            }
            let ratio = total / filtered.length;
            return Math.floor(ratio * 100);
        }
    }
  }
</script>

<template>
  <p class="my-5 sm:text-lg text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">Uptime History</p>
  <div class="card-body" v-if="services != null">
    <ul>
      <div class="mb-10" v-for="service in services">
        <div class="flex">
          <span v-html="service.uptime[service.uptime.length - 1].status.every(e => e == 'success') ? icons.ok : service.uptime[service.uptime.length - 1].status.every(e => e == 'failed') ? icons.outage : icons.partial_outage"></span>
          <div class="w-full flex justify-between items-baseline">
            <p class="ml-4 text-base font-semibold leading-6 text-gray-900 dark:text-gray-200">{{ service.name }}</p>
            <p class="text-xs text-gray-400 items-baseline self-baseline">{{ getUptimePercentage(service.uptime) }}% operational in last {{ Math.min(service.uptime.filter(e => e.status.length > 0).length, maxHistory) }} days</p>
          </div>
        </div>
        <div class="flex mt-2">
          <ServicePill :dayHistory="dayHistory" v-for="dayHistory in service.uptime" />
        </div>
      </div>
    </ul>
  </div>
  <div class="card-body" v-else>
    
    <div class="load-placeholder relative rounded-lg bg-opacity-5 bg-gray-800 dark:bg-white dark:bg-opacity-5">
        <div class="placeholder-anim"></div>
    </div>
  </div>
</template>