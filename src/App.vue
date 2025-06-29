<script>
import Services from './components/Services.vue';
import Incidents from './components/Incidents.vue';
import OnlineCard from './components/OnlineCard.vue';
import { ServiceStatus } from './Constants.js'
const MAX_UPTIME_HISTORY = 90;

  export default {
    created() {
        this.fetchUptimeData();
    },
    data() {
        return {
          services: null,
          allServiceStatus: ServiceStatus.UNKNOWN,
          maxUptimeHistory: MAX_UPTIME_HISTORY,
          icons: {
              ok: `<svg class="h-6 w-6 flex-none fill-sky-100 dark:fill-slate-800 stroke-green-500 stroke-2">
                <circle cx="12" cy="12" r="11"></circle>
                <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none"></path>
              </svg>`,
              partial_outage: `<svg class="h-8 w-8 flex-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="orange">
                <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm0 319.91a20 20 0 1 1 20-20 20 20 0 0 1-20 20zm21.72-201.15-5.74 122a16 16 0 0 1-32 0l-5.74-121.94v-.05a21.74 21.74 0 1 1 43.44 0z"></path>
              </svg>`,
              outage: `<svg class="h-8 w-8 flex-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="red">
                      <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm0 319.91a20 20 0 1 1 20-20 20 20 0 0 1-20 20zm21.72-201.15-5.74 122a16 16 0 0 1-32 0l-5.74-121.94v-.05a21.74 21.74 0 1 1 43.44 0z"></path>
                  </svg>`
          }
        }
    },
    components: {
      OnlineCard,
      Services,
      Incidents
    },
    methods: {
      async fetchUptimeData() {
            const respServices = await fetch("https://raw.githubusercontent.com/DistrictOfJoban/status-page/main/public/urls.cfg");
            const serviceTxt = await respServices.text();
            const promises = [];
            for(let line of serviceTxt.split("\n")) {
                if(line.length == 0) continue;

                let serviceName = line.split("=")[0];
                promises.push(this.fetchLog(serviceName));
            }

            const services = await Promise.all(promises);
            const allServiceStatus = services.every(e => e.status === 'success') ? ServiceStatus.OPERATIONAL : services[0].status === "failed" || services.every(e => e.status === 'failed') ? ServiceStatus.OUTAGE : ServiceStatus.PARTIAL_OUTAGE;

            this.services = services;
            this.allServiceStatus = allServiceStatus;
        },
        async fetchLog(serviceName) {
          const response = await fetch(`https://raw.githubusercontent.com/DistrictOfJoban/status-page/main/public/status/${serviceName}_report.log`);
          const text = await response.text();
          const lines = text.split("\n");
          
          let obj = {};
          try {
              const line = lines[lines.length - 2];
              const [created_at, status, _] = line.split(", ");
              obj = {
                  name: serviceName,
                  status: status,
                  uptime: null,
                  last_updated: created_at
              };
          } catch (e) {
              obj = {
                  name: serviceName,
                  status: "unknown",
                  uptime: null,
                  last_updated: undefined
              };
          }

          const today = new Date().toISOString().substring(0, 10);
          let uptime = new Map();

          for(let i = 0; i < this.maxUptimeHistory; i++) {
              const day = new Date(today);
              day.setDate(day.getDate() - i);
              uptime.set(day.toISOString().substring(0, 10), { date: day.toISOString().substring(0, 10), status: [], summary: ServiceStatus.UNKNOWN });
          }

          for(let line of lines) {
              if(line.length == 0) continue;
              const [created_at, status, _] = line.split(", ");
              const date = created_at.substr(0, 10);
              let arr = uptime.get(date)?.status ?? [];
              arr.push(status);
              let summary = arr.every(e => e === 'success') ? ServiceStatus.OPERATIONAL : arr[arr.length-1] === "failed" || arr.every(e => e === 'failed') ? ServiceStatus.OUTAGE : ServiceStatus.PARTIAL_OUTAGE
              uptime.set(date, { date: date, status: arr, summary: summary });
          }
      
          let finalUptimeList = [...uptime.values()]
          .sort((e, f) => new Date(e.date).getTime() - new Date(f.date).getTime());
          console.log(finalUptimeList)

          obj.uptime = finalUptimeList;
          return obj;
      }
    }
  }
</script>

<template>
  <div class="dark:bg-gray-800">
    <div class="h-full w-full">
      <div class="w-full h-40 absolute bg-gradient-to-t from-sky-800 to-sky-600 dark:from-sky-900 dark:to-sky-700">
        <div class="sm:ml-0 ml-5 mr-0 mt-3 md:pl-80 md:pr-80 sm:w-full h-full">
          <span
            style="box-sizing:border-box;display:inline-block;overflow:hidden;width:initial;height:initial;background:none;opacity:1;border:0;margin:0;padding:0;position:relative;max-width:100%"><span
              style="box-sizing:border-box;display:block;width:initial;height:initial;background:none;opacity:1;border:0;margin:0;padding:0;max-width:100%">

              <img style="display:block;max-width:100%;width:initial;height:initial;background:none;opacity:1;border:0;margin:0;padding:0" alt="" aria-hidden="true" src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27380%27%20height=%27100%27/%3e"></span>
              <img src="/doj.svg" decoding="async" class="w-40 h-16" style="position:absolute;top:0;left:0;bottom:0;right:0;box-sizing:border-box;padding:0;border:none;margin:auto;display:block;width:0;height:0;min-width:100%;max-width:100%;min-height:100%;max-height:100%">
          </span>
        </div>
      </div>

      <div class="mt-20 w-full absolute overflow-auto">
        <div class="mt-10">
          <OnlineCard :icons="this.icons" :services="this.services" :serviceStatus="this.allServiceStatus" />

          <div class="mx-px mt-10 md:ml-20 md:mr-20 lg:ml-60 lg:mr-60">
            <Services :maxHistory="this.maxUptimeHistory" :services="this.services" :icons="this.icons"/>
            <p class="mt-10 sm:text-lg text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">Recent incident</p>
            <Incidents :icons="this.icons"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>