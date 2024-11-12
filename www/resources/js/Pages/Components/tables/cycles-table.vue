<template>
    <div class="bg-cyan-50 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg rounded-md col-span-3 border-2 border-cyan-300 dark:border-cyan-700 h-fit">
        <div class="p-2 w-full flex-col">
            <h3 class="font-boldened text-xl md:text-2xl text-gray-800 dark:text-gray-300 leading-tight uppercase  py-1 px-2 whitespace-nowrap">
                <span class="underline text-gray-800 dark:text-gray-300 leading-tight uppercase">Payment Cycles Info.</span> 
                <span class="mx-2 text-sm text-gray-500 dark:text-gray-500 leading-tight">( {{ allCycles.length }} cycles )</span>
            </h3>
            <h3 class="font-boldened text-xl md:text-2xl text-gray-800 dark:text-gray-300 leading-tight uppercase py-1 px-1 grid grid-cols-1 md:grid-cols-5 gap-1">   
                <!-- search  -->
                <searchHelper class="col-span-3" :total=classInfo.info.length :new=allCycles.length name="cycles" @search=setSearch></searchHelper>

                <section class="col-span-2 w-full grid grid-flow-col grid-cols-2 gap-1 pt-1 my-auto">
                    <Dropdown
                        @click      = 'classInfo.selected = true'
                        :name       = "'Cycle Year'"
                        :listsyear  = classInfo.cycleYears
                        @selected   = selectYears
                    ></Dropdown>

                    <Dropdown 
                        @click      = 'classInfo.selected = true'
                        :name       = "'Cycle Month'"
                        :listsmonth = classInfo.cycleMonths
                        @selected   = selectMonths
                    ></Dropdown>
                </section>
            </h3>

            <hr-line class="border-cyan-800 dark:border-cyan-300"></hr-line>

            <!-- cycles table  -->
            <div class="py-2 relative overflow-x-auto overflow-y-scroll h-auto md:max-h-[35rem]" v-if = "!classInfo.isLoading">
                <h2 class="font-normal font-boldened text-2xl text-center text-cyan-800 dark:text-cyan-300 leading-tight uppercase py-1" v-if="allCycles.length == 0">
                    <span v-if="classInfo.search != ''">
                        NO SUCH PAYMENT CYCLE: 
                        <br>
                        <span class="text-orange-500 dark:text-orange-500 underline text-xl">
                            {{ classInfo.search }}!!
                        </span>
                    </span>
                    <span v-else>ADD PAYMENT CYCLEs TO GET STARTED!!</span>
                </h2>
                <table class="mx-auto w-full text-xs text-left text-gray-500 dark:text-gray-400" v-else>
                    <thead class="text-gray-700 uppercase bg-transparent dark:text-gray-400 font-boldened text-xs">
                        <tr>
                            <td scope="col" class="px-1 uppercase hover:underline hover:text-white cursor-pointer" @click="orderByID()">
                                <div class="flex items-center">
                                    No.
                                    <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"  @click="classInfo.ascending = !classInfo.ascending"></updown-icon>
                                </div>
                            </td>
                            <td scope="col" class="px-2 uppercase hover:underline hover:text-white cursor-pointer" @click="orderByName()">
                                <div class="flex items-center">
                                    Name
                                    <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"  @click="classInfo.ascending = !classInfo.ascending"></updown-icon>
                                </div>
                            </td>
                            <td scope="col" class="px-2 uppercase hover:underline hover:text-white cursor-pointer hidden md:table-cell" @click="orderByDate()">
                                <div class="flex items-center">
                                    Date
                                    <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"  @click="classInfo.ascending = !classInfo.ascending"></updown-icon>
                                </div>
                            </td>
                            <td scope="col" class="px-2 uppercase hover:underline hover:text-white cursor-pointer" @click="orderByPaid">
                                <div class="flex items-center">
                                    Paid.
                                    <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"  @click="classInfo.ascending = !classInfo.ascending"></updown-icon>
                                </div>
                            </td>
                            <td scope="col" class="px-2 uppercase hover:underline hover:text-white cursor-pointer" @click="orderByWelfare">
                                <div class="flex items-center">
                                    Welfares.
                                    <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"  @click="classInfo.ascending = !classInfo.ascending"></updown-icon>
                                </div>
                            </td>
                            <td scope="col" class="px-2 uppercase hover:underline hover:text-white cursor-pointer hidden md:table-cell" @click="orderByMembers()">
                                <div class="flex items-center">
                                    Members.
                                    <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"  @click="classInfo.ascending = !classInfo.ascending"></updown-icon>
                                </div>
                            </td>
                            <td scope="col" class="px-2 uppercase hover:underline hover:text-white cursor-pointer">
                                <div class="flex items-center">
                                    Options.
                                </div>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-transparent border-b dark:bg-transparent dark:border-gray-700 font-boldened text-sm uppercase"
                            v-for="(cycle, index) in allCycles">
                            <td scope="row"
                                class="px-1 uppercase text-gray-900 whitespace-nowrap dark:text-white">
                                {{ cycle.id }}.
                            </td>
                            <td scope="row"
                                class="p-2 uppercase text-gray-900 whitespace-nowrap dark:text-white">
                                <!-- progress bar  -->
                                <a @click="getRoute(cycle)">
                                    <span class="hover:underline text-sm md:text-md">{{ cycle.name }}</span>
                                    <!-- progress bar  -->
                                    <progressTable
                                        :percent = cycle.percent
                                        :name    = cycle.name 
                                    ></progressTable>
                                </a>
                                <!-- end progress bar  -->
                            </td>
                            <td class="p-2 hidden md:table-cell">
                                <div class="">
                                    <div class="font-normal text-xs dark:text-gray-300 text-gray-800 whitespace-nowrap overflow-x-hidden text-ellipsis">
                                        {{ moment(cycle.date).format("ddd, Do-MM-YY") }}
                                    </div>
                                    <div class="font-normal text-2xs dark:text-gray-300 text-gray-800 underline">
                                        {{ moment(cycle.date).fromNow() }}
                                    </div>
                                </div>
                            </td>
                            <td class="p-2">
                                <span class="text-blue-500">ksh {{ numFormat(cycle.payments_total) }}</span> 
                            </td>
                            <td class="p-2">
                                <span class="text-purple-600">ksh {{ numFormat(cycle.welfares_total) }}</span> 
                            </td>
                            <td class="p-2 hidden md:table-cell">
                                <span class="text-amber-400">{{cycle.members_no}} Paid.</span> 
                            </td>
                            <td class="p-2">
                                <div class="inline-flex rounded-md shadow-sm gap-1" role="group">
                                    <!-- download  -->
                                    <a @click="downloadSheet(cycle)" type="button" class="inline-flex items-center p-0.5 text-xs font-normal text-amber-500 bg-transparent rounded-md hover:text-gray-500 dark:text-amber-500 dark:hover:text-amber-500" v-tooltip="$tooltip('Download '+ cycle.name+' Excelsheet','top')">
                                        <download-info class="w-5 h-5"></download-info>
                                    </a >
                                    <!-- edit  -->
                                    <button type="button"
                                        class="inline-flex items-center p-0.5 text-xs font-normal text-cyan-900 bg-transparent rounded-md hover:text-gray-500 dark:text-cyan-700 dark:hover:text-cyan-400" @click="showCycle(cycle)">
                                        <edit-icon class="w-5 h-5"></edit-icon>
                                    </button>
                                    <!-- delete  -->
                                    <button type="button"
                                        class="inline-flex items-center p-0.5 text-xs font-normal text-red-900 bg-transparent rounded-md hover:text-gray-500 dark:text-red-700 dark:hover:text-red-400"
                                        @click="showDelete(cycle)">
                                        <delete-icon class="w-5 h-5"></delete-icon>
                                        <!-- Delete -->
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <loadingTable
                v-if     = "classInfo.isLoading"
            ></loadingTable>
            <!--end cycles table  -->
        </div>
    </div>

    <!-- update cycle modal  -->
    <cyclesupdate
        :info   = classInfo.modalData
        :show   = classInfo.isOpen
        @reload = resetCycles
        @close  = closeCycle
        @flash  = flashShow
    ></cyclesupdate>
    <!-- end update cycle modal  -->

    <!-- delete cycle modal  -->
    <cyclesdelete
        :info   = classInfo.deleteData
        :show   = classInfo.isDeleteOpen
        @reload = resetCycles
        @close  = closeDelete
        @flash  = flashShow
    ></cyclesdelete>
    <!-- end delete cycle modal  -->
</template>

<script setup>
    import { reactive, onMounted, defineEmits ,defineProps, watch, computed } from 'vue';
    import { router } from '@inertiajs/vue3';

    //moment 
    import moment           from 'moment';

    const props = defineProps({
        cycles : {
            type: Array,
            required: true
        },
        cycleinfo: {
            type: Array,
            required: true,
        }
    })

    const classInfo = reactive ({
        // search
        search: '',
        messgae: '',

        // order 
        nameOrder: true,
        dateOrder: false,
        totalOrder: false,
        percentOrder: false,

        // sort 
        ascending: false,
        sortBy: 'id',

        // loading 
        isLoading: true,

        // classess 
        infoSection: 'w-full m-2 p-2 text-left mx-auto rounded-xl border-2 shadow-md border border-cyan-500 p-1 overflow-hidden bg-cyan-400/10 dark:bg-cyan-400/10',
        infoHeader: 'text-cyan-300 mb-2 text-md text-left font-normal underline tracking-tight uppercase',
        borderClass: 'overflow-hidden font-boldened flex-col justify-between p-2 md:m-2 sm:m-1 sm:my-1 rounded-lg bg-gray-300 dark:bg-gray-800/50 shadow-md sm:rounded-lg border-[3px] border-cyan-300 dark:border-cyan-700',
        mainHeader: 'font-boldened text-gray-800 dark:text-gray-300 leading-tight uppercase underline py-1 md:text-xl text-md',

        info: [],
        cycleYears: [],
        cycleMonths: [],

        // search
        link: '',

        ordername: '',

        // page: 1
        isOpen: false,
        isOpenInfo: false,
        modalData: {},

        // delete info 
        isDeleteOpen: false,
        deleteData: {},
        deleteID: '',
        deleteURL: '/delete/cycle/',

        selected: false
    })

    const type = computed(() => props.cycles);

    watch(type, (newValue) => {
        classInfo.isLoading = true;
        resetCycles();
    })

    // computed 
    const allCycles = computed(() => {
        let tempCycles = classInfo.info

            // search rows 
            if (classInfo.search != '' && classInfo.search) {
                tempCycles = tempCycles.filter((cycle) => {
                    return cycle.name
                        .toUpperCase()
                        .includes(classInfo.search.toUpperCase())
                })
            }

            // Sort by orders
            tempCycles = tempCycles.sort((a, b) => {
                if (classInfo.sortBy == 'name') {
                    let fa = a.name.toLowerCase(), fb = b.name.toLowerCase()

                    if (fa < fb) {
                        return -1
                    }
                    if (fa > fb) {
                        return 1
                    }
                    return 0

                } else if (classInfo.sortBy == 'id') {
                    return a.id - b.id
                } else if (classInfo.sortBy == 'payments_total') {
                    return a.payments_total - b.payments_total
                } else if (classInfo.sortBy == 'welfares_total') {
                    return a.welfares_total - b.welfares_total
                } else if (classInfo.sortBy == 'members_no') {
                    return a.members_no - b.members_no
                } else if (classInfo.sortBy == 'total_amount') {
                    return a.total_amount - b.total_amount
                } else if (classInfo.sortBy == 'created_at') {
                    return a.created_at - b.created_at
                }
            })

            // Show sorted array in descending or ascending order
            if (!classInfo.ascending) {
                tempCycles.reverse()
            }

            return tempCycles
    })

    onMounted(() => {
        setInfo()
    })

    const emit = defineEmits(['flash','reload', 'view'])

    function setSearch(i) {
        classInfo.search = i;
    }

    function setInfo() {
        classInfo.info      = props.cycles;

        classInfo.sortBy    = 'id';

        // sort message
        classInfo.message   = allCycles.length + ' Cycles Sorted by: ';

        // flash message 
        classInfo.ordername = 'ID';
        if(classInfo.ascending) {
            if (allCycles.length != 0) {
                classInfo.flashMessage = classInfo.message + classInfo.ordername + ' ascending';
                classInfo.alertBody = 'info';
            }  
        }

        classInfo.cycleYears    = props.cycleinfo[0]
        classInfo.cycleMonths   = props.cycleinfo[1]

        LoadingOff();
    }

    function selectYears(a) {
        LoadingOn();
        axios.get('/api/getCyclesBy/year/' + a)
            .then(
                ({ data }) => {
                    classInfo.info      = data[0];
                    classInfo.flashMessage   =  a + ' :Payment Cycles!';
                    classInfo.alertBody      = 'info';
                    flashShow(classInfo.flashMessage, classInfo.alertBody);
                    LoadingOff();
                });
    }

    function selectMonths(a) {
        LoadingOn();
        axios.get('/api/getCyclesBy/month/' + a)
            .then(
                ({ data }) => {
                    classInfo.info           = data[0];
                    classInfo.flashMessage   = a + ' :Payment Cycles!';
                    classInfo.alertBody      = 'info';
                    flashShow(classInfo.flashMessage, classInfo.alertBody);
                    LoadingOff();
                });
    }

    function numFormat(num) {
        if (num < 9999) {
            return num;
        } else {
            if (num > 999999) {
                let x = Number(num / 1000000).toFixed(2);
                let y = x + ' m';
                return y;
            } else {
                let x = Number(num / 1000).toFixed(1);
                let y = x + ' k';
                return y;
            } 
        }
    }

    function getRoute(a) {
        let url = '/cycle/' + a.id;

        router.visit(url, { preserveScroll: true });
    }

    function downloadSheet(cycle) {
        let url     = '/download/current/all/' + cycle.id;
        let header  = cycle.name +' All Members!';
        let button  = `All Members Sheet`;
        let body    = 'info';
        let message = 'Download ' + cycle.name +' With All Members Excelsheet!';

        emit('view', message, body, header, url, button, 15000, false);
    }

    // order rows 
    function orderBy(sortBy, ordername) {
        LoadingOn();

        classInfo.sortBy = sortBy;
        classInfo.ordername = ordername;
        classInfo.flashMessage = `Cycles Sorted By: ${ordername.toLowerCase()} ${classInfo.ascending ? 'ascending' : 'descending'}`;
        classInfo.alertType = classInfo.ascending ? 'asc' : 'desc';

        flashShow(classInfo.flashMessage, classInfo.alertBody);

        LoadingOff();
    }

    // Usage examples
    function orderByID() {
        orderBy('id', 'ID');
    }

    function orderByName() {
        orderBy('name', 'NAME');
    }

    function orderByDate() {
        orderBy('date', 'DATE');
    }

    function orderByPaid() {
        orderBy('payments_total', 'TOTAL PAYMENTS');
    }

    function orderByWelfare() {
        orderBy('welfares_total', 'TOTAL WELFARE');
    }

    function orderByTotal() {
        orderBy('total_amount', 'TOTAL AMOUNT');
    }

    function orderByMembers() {
        orderBy('members_no', 'No of MEMBERS CONTRIBUTED');
    }

    // end order rows

    // loading
    function LoadingOn() {
        classInfo.ascending = !classInfo.ascending;
        classInfo.isLoading = true 
    }

    function LoadingOff() {
        classInfo.isLoading = false
    }

    // modal functions 
    function showCycle(cycle) {
        classInfo.modalData = cycle;
        classInfo.isOpen    = true;
    }

    function closeCycle() {
        classInfo.isOpen    = false;
        classInfo.modalData = {};
    }

    function showDelete(cycle) {
        classInfo.deleteData   = cycle;
        classInfo.deleteID     = cycle.id;
        classInfo.isDeleteOpen = true;
    }

    function closeDelete() {
        classInfo.isDeleteOpen = false;
        classInfo.deleteData   = {};
        classInfo.deleteID     = '';
    }

    function resetCycles() {
        let link = 'desc';
        let linkTo = 'id/';

        axios.get('/api/getCycles/' + linkTo + link)
            .then(
                ({ data }) => {
                    classInfo.info      = data[0];
                    classInfo.sortBy    = 'id';

                    LoadingOff();
                });
    }

    function flashShow(message, body) {
        emit('flash', message, body)
    }
    // end modal functions 
</script>