export const ServiceStatus = {
    OPERATIONAL: {
        weight: 1,
        text: "Operational",
        serviceTitle: "All Service Online",
        class: "bg-green-500",
        icon: `<svg class="h-6 w-6 flex-none fill-sky-100 dark:fill-slate-800 stroke-green-500 stroke-2">
                <circle cx="12" cy="12" r="11"></circle>
                <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none"></path>
              </svg>`
    },
    PARTIAL_OUTAGE: {
        weight: 0.5,
        text: "Partial Outage",
        serviceTitle: "Partial Outage",
        class: "bg-yellow-500",
        icon: `<svg class="h-8 w-8 flex-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="orange">
                    <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm0 319.91a20 20 0 1 1 20-20 20 20 0 0 1-20 20zm21.72-201.15-5.74 122a16 16 0 0 1-32 0l-5.74-121.94v-.05a21.74 21.74 0 1 1 43.44 0z"></path>
                </svg>`
    },
    OUTAGE: {
        weight: 0,
        text: "Outage",
        serviceTitle: "Outage",
        class: "bg-red-500",
        icon: `<svg class="h-8 w-8 flex-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="red">
                    <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm0 319.91a20 20 0 1 1 20-20 20 20 0 0 1-20 20zm21.72-201.15-5.74 122a16 16 0 0 1-32 0l-5.74-121.94v-.05a21.74 21.74 0 1 1 43.44 0z"></path>
                </svg>`
    },
    UNKNOWN: {
        weight: 0,
        text: "Unknown",
        serviceTitle: "Loading...",
        class: `bg-gray-400 dark:bg-slate-600`,
        icon: `<svg class="h-6 w-6 flex-none fill-sky-100 dark:fill-slate-800 stroke-gray-500 stroke-2">
                <circle cx="12" cy="12" r="11"></circle>
                <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none"></path>
              </svg>`
    }
}