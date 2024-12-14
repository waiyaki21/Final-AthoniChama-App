<template>
    <div class="w-full m-2 text-left mx-auto rounded-xl border-2 shadow-md border-cyan-500 p-2 overflow-hidden bg-gray-400/10 dark:bg-gray-800/10">
        <h2 class="font-normal font-boldened text-[3.5rem] text-cyan-800 dark:text-cyan-300 leading-tight uppercase underline mb-2">
            System Documents.
        </h2>

        <!--documents tabs  -->
        <div class="mb-4 border-b border-gray-200 dark:border-gray-700">
            <ul class="flex flex-wrap -mb-px text-xl font-medium text-center" id="default-tab" data-tabs-toggle="#default-tab-content" role="tablist">
                <li class="me-2" role="presentation">
                    <button class="inline-block p-4 border-b-2 rounded-t-lg uppercase" id="ledger-tab" data-tabs-target="#ledger" type="button" role="tab" aria-controls="ledger" aria-selected="false">Ledger</button>
                </li>
                <li class="me-2" role="presentation">
                    <button class="inline-block p-4 border-b-2 rounded-t-lg uppercase" id="member-tab" data-tabs-target="#member" type="button" role="tab" aria-controls="member" aria-selected="false">Members</button>
                </li>
                <li class="me-2" role="presentation">
                    <button class="inline-block p-4 border-b-2 rounded-t-lg uppercase hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" id="cycles-tab" data-tabs-target="#cycles" type="button" role="tab" aria-controls="cycles" aria-selected="false">Contribution Cycles</button>
                </li>
                <li class="me-2" role="presentation">
                    <button class="inline-block p-4 border-b-2 rounded-t-lg uppercase hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" id="expenses-tab" data-tabs-target="#expenses" type="button" role="tab" aria-controls="expenses" aria-selected="false">Expenses</button>
                </li>
                <li role="presentation">
                    <button class="inline-block p-4 border-b-2 rounded-t-lg uppercase hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" id="projects-tab" data-tabs-target="#projects" type="button" role="tab" aria-controls="projects" aria-selected="false">Projects</button>
                </li>
            </ul>
        </div>
        <div id="default-tab-content">
            <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="ledger" role="tabpanel" aria-labelledby="ledger-tab">
                <p class="text-xl text-gray-500 dark:text-gray-400">This is some placeholder content the <strong class="font-medium text-gray-800 dark:text-white">Profile tab's associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.</p>
            </div>

            <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="member" role="tabpanel" aria-labelledby="member-tab">
                <p class="text-xl text-gray-500 dark:text-gray-400">This is some placeholder content the <strong class="font-medium text-gray-800 dark:text-white">Profile tab's associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.</p>
            </div>
            
            <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="cycles" role="tabpanel" aria-labelledby="cycles-tab">
                <p class="text-xl text-gray-500 dark:text-gray-400">This is some placeholder content the <strong class="font-medium text-gray-800 dark:text-white">cycles tab's associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.</p>
                <!--excel sheets card  -->
                <div class="bg-gray-300 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border border-cyan-300 dark:border-cyan-700 inline-flex justify-between w-full p-2 my-4">
                    <section class="w-1/2 m-2 border-r-2 dark:border-cyan-700" v-if="current != NULL">
                        <h4 class="font-normal font-boldened text-[1.5rem] text-gray-800 dark:text-gray-300 leading-tight uppercase underline mb-2">
                            Download Current Cycle Sheet
                        </h4>
                        <a :href="'/download/current/' + current.id" type="button" class="inline-flex justify-between p-2 text-base font-medium text-gray-900 bg-transparent border dark:border-gray-300 rounded-md hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:text-white dark:hover:text-cyan-700 dark:hover:bg-transparent/10 dark:focus:bg-cyan-700 hover:dark:border-cyan-700 uppercase w-[90%]">
                            Download {{ current.name }} Excelsheet
                            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </a >
                    </section>
                    <section class="w-1/2 m-2" v-if="current != NULL">
                        <h4 class="font-normal font-boldened text-[1.5rem] text-gray-800 dark:text-gray-300 leading-tight uppercase underline mb-2">
                            Upload New Cycle Sheet
                        </h4>
                        <button type="button" class="inline-flex justify-between p-2 text-base font-medium text-gray-900 bg-transparent border dark:border-gray-300 rounded-md hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:text-white dark:hover:text-cyan-700 dark:hover:bg-transparent/10 dark:focus:bg-cyan-700 hover:dark:border-cyan-700 uppercase w-[90%]" @click="showCycle">
                            Upload new cycle Excelsheet
                            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                        </button>
                    </section>
                </div>
            </div>

            <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="expenses" role="tabpanel" aria-labelledby="expenses-tab">
                <p class="text-xl text-gray-500 dark:text-gray-400">This is some placeholder content the <strong class="font-medium text-gray-800 dark:text-white">expenses tab's associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.</p>
            </div>

            <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="projects" role="tabpanel" aria-labelledby="projects-tab">
                <p class="text-xl text-gray-500 dark:text-gray-400">This is some placeholder content the <strong class="font-medium text-gray-800 dark:text-white">projects tab's associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: [
            'current'
        ],

        data() {
            return {

            }
        },

        computed: {

        },

        mounted() {

        },

        methods: {

        }
    }
</script>