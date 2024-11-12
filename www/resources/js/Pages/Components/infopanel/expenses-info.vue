<template>
    <!-- header  -->
    <section class="font-normal text-cyan-800 dark:text-gray-300 leading-tight uppercase py-1 grid grid-cols-1 md:grid-cols-6">
        <section class="flex flex-col col-span-1 md:col-span-3 w-full">
            <span class="inline-flex justify-start gap-1">
                <span class="underline text-xl md:text-2xl">{{ project.name }} Info.</span>
            </span>
            <section class="font-normal text-md leading-tight uppercase p-1 w-full inline-flex justify-start gap-1">
                <span :class="classInfo.successBadge" v-if="project.total_percent == 100">
                    Completed
                </span>
                <span :class="classInfo.amberBadge" v-if="project.total_percent > 100">
                    Completed & Surpassed
                </span>
                <span :class="classInfo.infoBadge" v-if="project.total_percent > 1 && project.total_percent < 100">
                    Ongoing
                </span>
                <span :class="classInfo.failBadge" v-if="project.total_percent == 0">
                    Not Started
                </span>
            </section>
        </section>
        
        <div class="inline-flex rounded-md shadow-sm gap-1 justify-start md:justify-end col-span-1 md:col-span-3" role="group">
            <!-- edit  -->
            <button type="button" class="inline-flex items-center p-1 text-xs font-normal text-cyan-900 bg-transparent rounded-md hover:text-gray-500 focus:z-10 dark:text-cyan-700 dark:hover:text-cyan-600" v-tooltip="$tooltip(classInfo.btn2.toUpperCase(), 'top')" @click="showProject(project)">
                <edit-icon :class="[classInfo.svgClass]"></edit-icon>
            </button>
            <!-- delete  -->
            <button type="button" class="inline-flex items-center p-1 text-xs font-normal text-red-900 bg-transparent rounded-md hover:text-gray-500 focus:z-10 dark:text-red-700 dark:hover:text-red-600" v-tooltip="$tooltip(classInfo.btn3.toUpperCase(), 'top')" @click="showDelete(project)">
                <delete-icon :class="[classInfo.svgClass]"></delete-icon>
            </button>
            <!-- download  -->
            <a type="button" class="inline-flex items-center p-1 text-xs font-normal text-amber-600 bg-transparent rounded-md hover:text-amber-500 focus:z-10 dark:text-yellow-400 dark:hover:text-yellow-300" v-tooltip="$tooltip(classInfo.btn4.toUpperCase(), 'left')" :href="'/download/project/' + project.id">
                <download-info :class="[classInfo.svgClass]"></download-info>
            </a>
        </div>
    </section>
    <!-- end header  -->

    <!-- info panel  -->
    <section :class="[classInfo.infoSection]"> 
        <section class="w-full m-1 p-1 text-left grid grid-cols-2 md:grid-cols-3 gap-1">
            <a class="block max-w-sm p-2 bg-transparent">
                <h5
                    :class="[classInfo.infoHeader]"  v-tooltip="$tooltip('Total no of incomplete / ongoing projects' ,'top')">
                    <span>Total Expected.</span>
                    <info-icon class="flex-shrink-0 inline w-3 h-3 ml-0.5"></info-icon> 
                </h5>
                <p class="font-normal text-left md:text-2xl text-xl text-orange-700 dark:text-orange-600 uppercase" v-tooltip="$tooltip('KSH ' + Number(project.target).toLocaleString() ,'top')">
                    ksh {{ numFormat(project.target) }}
                </p>
            </a>

            <a class="block max-w-sm p-2 bg-transparent">
                <h5 :class="[classInfo.infoHeader]"  v-tooltip="$tooltip('Total amount contributed' ,'top')">
                    <span>Total Expenses.</span>
                    <info-icon class="flex-shrink-0 inline w-3 h-3 ml-0.5"></info-icon> 
                </h5>
                <p class="font-normal text-left md:text-2xl text-xl text-green-700 dark:text-green-600 uppercase" v-tooltip="$tooltip('KSH ' + Number(project.total_expenses).toLocaleString() ,'top')">
                    ksh {{ numFormat(project.total_expenses) }}
                </p>
            </a>

            <a class="block max-w-sm p-2 bg-transparent">
                <h5
                    :class="[classInfo.infoHeader]"  v-tooltip="$tooltip('Total Project Balance' ,'top')">
                    <span>T. Balance</span>
                    <info-icon class="flex-shrink-0 inline w-3 h-3 ml-0.5"></info-icon> 
                </h5>
                <p class="font-normal text-left md:text-2xl text-xl text-purple-700 dark:text-purple-600 uppercase" v-tooltip="$tooltip(`KSH ${Number(props.project.target - props.project.total_expenses).toLocaleString()}` ,'top')">
                    ksh {{ numFormat(props.project.target - props.project.total_expenses) }}
                </p>
            </a>

            <a class="block max-w-sm p-2 bg-transparent">
                <h5 :class="[classInfo.infoHeader]"  v-tooltip="$tooltip('Total Expense Percentage contributed' ,'top')">
                    <span>% Expenses.</span>
                    <info-icon class="flex-shrink-0 inline w-3 h-3 ml-0.5"></info-icon> 
                </h5>
                <p class="font-normal text-left md:text-2xl text-xl text-green-700 dark:text-green-600 uppercase" v-tooltip="$tooltip(`${Number(percent).toLocaleString()} %`, 'top')">
                    <span class="text-red-500 dark:text-red-200" v-if="percent = 0">
                        0%
                    </span>
                    <span class="text-green-500 dark:text-green-200" v-else>
                        {{ percent }} %
                    </span>
                </p>
            </a>

            <a class="block max-w-sm p-2 bg-transparent">
                <h5
                    :class="[classInfo.infoHeader]"  v-tooltip="$tooltip('Total Percentage Balance' ,'top')">
                    <span>% Balance</span>
                    <info-icon class="flex-shrink-0 inline w-3 h-3 ml-0.5"></info-icon> 
                </h5>
                <p class="font-normal text-left md:text-2xl text-xl text-purple-700 dark:text-purple-600 uppercase" v-tooltip="$tooltip(`${balance} %}`, 'top')">
                    <span class="text-amber-500 dark:text-amber-500">
                        {{ balance }} %
                    </span>
                </p>
            </a>

            <a class="block max-w-sm p-2 bg-transparent">
                <h5
                    :class="[classInfo.infoHeader]"  v-tooltip="$tooltip('No of Expenses Paid' ,'top')">
                    <span>Expenses No.</span>
                    <info-icon class="flex-shrink-0 inline w-3 h-3 ml-0.5"></info-icon> 
                </h5>
                <p class="font-normal text-left md:text-2xl text-xl text-red-700 dark:text-red-600 uppercase">
                    {{ Number(project.expenses.length).toLocaleString() }}
                </p>
            </a>
        </section>
    </section>

    <!-- progress bar  -->
    <progressInfo
        :name1 = '"Paid"'
        :name3 = '"Balance"'
        :percent1 = project.total_percent
        :percent3 = '100 - project.total_percent'
    ></progressInfo>
    <!-- end progress bar  -->

    <!-- update project modal  -->
    <projectsupdate
        :info   = classInfo.modalData
        :show   = classInfo.isOpen
        @reload = resetProjects
        @close  = closeProject
    ></projectsupdate>
    <!-- end update project modal  -->

    <!-- delete project modal  -->
    <projectsdelete
        :info   = classInfo.deleteData
        :show   = classInfo.isDeleteOpen
        :url    = classInfo.deleteURL
        @reload = resetProjects
        @close  = closeDelete
    ></projectsdelete>
    <!-- end delete project modal  -->
</template>

<script setup>
    import { defineProps, defineEmits, reactive, computed, onMounted } from 'vue'

    const emit = defineEmits(['reload'])

    const props = defineProps({
        project: {
            type: Object,
            required: true,
        }
    });

    const classInfo = reactive({
        progressMainBorder: '',
        progressMainClass: '',
        infoSection: '',
        infoHeader: '',

        // main progress bar 
        progressMainBorderInfo: 'border border-cyan-500 p-1 overflow-hidden',
        progressMainClassInfo: 'alerts flex h-6 items-center justify-center rounded-full bg-gradient-to-r from-gray-200 via-cyan-400 to-blue-500 text-base leading-none',
        infoSectionInfo: 'w-full m-2 p-2 text-left mx-auto rounded-xl border-2 shadow-md border border-cyan-500 p-1 overflow-hidden bg-cyan-400/10 dark:bg-cyan-400/10',
        infoHeaderInfo: 'text-cyan-900 dark:text-cyan-300 mb-2 md:text-xl text-md md:text-left sm:text-left font-normal underline tracking-tight uppercase',

        progressMainBorder100: 'border border-emerald-500 p-1 overflow-hidden',
        progressMainClass100: 'alerts flex h-1 items-center justify-center rounded-full bg-gradient-to-r from-grey-300 via-emerald-400 to-green-600 text-base leading-none',
        infoSection100: 'w-full m-2 p-2 text-left mx-auto rounded-xl border-2 shadow-md border border-emerald-500 p-1 overflow-hidden bg-emerald-400/10 dark:bg-emerald-400/10',
        infoHeader100: 'text-emerald-300 mb-2 md:text-xl text-md md:text-left sm:text-left font-normal underline tracking-tight uppercase',

        progressMainBorderZero: 'border border-red-500 p-1 overflow-hidden',
        progressMainClassZero: 'alerts flex h-6 items-center justify-center rounded-full bg-gradient-to-r from-orange-300 via-rose-400 to-red-500 text-base leading-none',
        infoSectionZero: 'w-full mx-2 mb-2 p-2 text-left mx-auto rounded-xl border-2 shadow-md border border-rose-500 overflow-hidden bg-rose-400/10 dark:bg-rose-400/10',
        infoHeaderZero: 'text-red-300 mb-2 md:text-xl text-md md:text-left sm:text-left font-normal underline tracking-tight uppercase',

        isOpen: false,
        isOpenInfo: false,
        isDebtOpen: false,
        modalData: {},

        // delete info 
        isDeleteOpen: false,
        deleteData: {},
        deleteID: '',
        deleteURL: '/delete/project/',

        svgClass: 'md:w-6 md:h-6 w-6 h-6',

        btn2: '',
        btn3: '',
        btn4: '',

        successBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-green-900 border-black bg-green-500 rounded-md shadow-md py-1 px-2 my-auto',
        infoBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-cyan-900 border-black bg-cyan-500 rounded-md shadow-md py-1 px-2 my-auto',
        failBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-red-900 border-black bg-red-500 rounded-md shadow-md py-1 px-2 my-auto',
        amberBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-amber-900 border-black bg-amber-500 rounded-md shadow-md py-1 px-2 my-auto',
    })

    onMounted(() => {
        set()
        progressMain()
    })

    function numFormat(num) {
        if (num < 9999) {
            return Number(num).toLocaleString();
        } else {
            if (num > 999999) {
                let x = Number(num / 1000000).toFixed(1);
                let y = x + ' m';
                return y;
            } else {
                let x = Number(num / 1000).toFixed(1);
                let y = x + ' k';
                return y;
            } 
        }
    }

    function set() {
        let name = 'Project';

        classInfo.btn2 = 'Update '+ name;
        classInfo.btn3 = 'Delete '+ name;
        classInfo.btn4 = 'Download '+ name + ' Excelsheet';
    }

    function progressMain() {
        let percentMain = Number(props.project.total_expenses / props.project.target * 100).toFixed(1)
        
        if (percentMain == 100) {
            classInfo.progressMainClass = classInfo.progressMainClass100;
            classInfo.progressMainBorder = classInfo.progressMainBorder100;
            classInfo.infoHeader = classInfo.infoHeader100;
            classInfo.infoSection = classInfo.infoSection100;
        } else {
            if (percentMain >= 50) {
                // No change needed since classInfo already holds these values
                classInfo.progressMainClass = classInfo.progressMainClassInfo;
                classInfo.progressMainBorder = classInfo.progressMainBorderInfo;
                classInfo.infoHeader = classInfo.infoHeaderInfo;
                classInfo.infoSection = classInfo.infoSectionInfo;
            } else {
                classInfo.progressMainClass = classInfo.progressMainClassZero;
                classInfo.progressMainBorder = classInfo.progressMainBorderZero;
                classInfo.infoHeader = classInfo.infoHeaderZero;
                classInfo.infoSection = classInfo.infoSectionZero;
            }
        }
    }

    // computed 
    const percent = computed(() => {
        let percent = Number(props.project.total_expenses / props.project.target * 100).toFixed(1) 

        return percent
    })
    const balance = computed(() => {
        let percent = Number(props.project.total_expenses / props.project.target * 100).toFixed(1) 

        let balance = Number(100 - percent).toFixed(1)

        return balance
    })
    const left = computed(() => {
        let left = Number(props.project.target - props.project.total_expenses).toLocaleString()

        return left
    })

    // modal functions 
    function showProject(project) {
        classInfo.modalData = project;
        classInfo.isOpen    = true;
    }

    function closeProject() {
        classInfo.isOpen    = false;
        classInfo.modalData = {};
    }

    function showDelete(project) {
        classInfo.deleteData   = project;
        classInfo.deleteID     = project.id;
        classInfo.isDeleteOpen = true;
    }

    function closeDelete() {
        classInfo.isDeleteOpen = false;
        classInfo.deleteData   = {};
        classInfo.deleteID     = '';
    }

    // reset
    function resetProjects() {
        emit('reload')
    }
    // end modal functions 
</script>