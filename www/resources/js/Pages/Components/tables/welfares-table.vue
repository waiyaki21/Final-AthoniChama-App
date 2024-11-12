<template>
    <h3 :class="[classInfo.mainHeader, 'w-full grid grid-cols-5 md:grid-cols-5']">
        <span class="w-full md:inline-flex flex-col justify-start col-span-3 grid grid-cols-1 md:grid-cols-5">
            <span class="underline md:text-2xl text-xl col-span-3">{{ cycle.name }} Welfares.</span>
        </span>

        <!-- options -->
        <h3 :class="[classInfo.mainHeader, 'inline-flex justify-end md:justify-end col-span-2 lg:col-span-2 my-auto gap-2']">
            <a @click="tabSwitch2()" type="button" :class="[classInfo.welfareOption]"
                v-tooltip="$tooltip(classInfo.btn1.toUpperCase(),'top')">
                <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                    :class="[classInfo.svgOption]">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </a>
            <a @click="welfareAll()" type="button" :class="[classInfo.welfareOption]"
                v-tooltip="$tooltip(classInfo.btn2.toUpperCase(),'top')">
                <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                    :class="[classInfo.svgOption]">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                </svg>
            </a>
            <a @click="welfareIn()" type="button" :class="[classInfo.welfareOption]"
                v-tooltip="$tooltip(classInfo.btn3.toUpperCase(),'top')">
                <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                    :class="[classInfo.svgOption]">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
                </svg>
            </a>
            <a @click="welfareOwed()" type="button" :class="[classInfo.welfareOption]"
                v-tooltip="$tooltip(classInfo.btn4.toUpperCase(),'top')">
                <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                    :class="[classInfo.svgOption]">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
            </a>
        </h3>
    </h3>

    <section class="grid grid-cols-5 lg:grid-cols-10 gap-2">
        <!-- search  -->
        <searchHelper class="col-span-5 lg:col-span-10" :total=classInfo.info.length :new=allWelfares.length name="members" @search=setSearch></searchHelper>
    </section>

    <hr-line class="border-cyan-800 dark:border-cyan-300"></hr-line>

    <!-- welfares table  -->
    <div class="py-2 relative overflow-x-auto overflow-y-scroll h-auto md:max-h-[35rem]" v-if="!classInfo.isLoading">
        <h2 class="font-normal font-boldened text-[3rem] text-center text-amber-500 dark:text-amber-500 leading-tight uppercase underline py-1"
            v-if="allWelfares.length == 0">
            <span v-if="classInfo.search != ''">
                NO SUCH MEMBER IN THIS CYCLE:
                <br>
                <span class="text-amber-500 dark:text-amber-500 underline text-[2rem]">
                    {{ classInfo.search }}!!
                </span>
            </span>
            <span v-else>NO WELFARES IN THIS CYCLE!!</span>
        </h2>
        <table class="mx-auto w-full text-xs text-left text-gray-500 dark:text-gray-400" v-else>
            <thead class="text-gray-700 hover:text-gray-900 uppercase bg-transparent font-boldened text-sm">
                <tr>
                    <td scope="col"
                        class="px-2 uppercase hover:underline dark:text-gray-400 dark:hover:text-white cursor-pointer"
                        @click="orderByID()">
                        <div class="flex items-center">
                            No.
                            <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"></updown-icon>
                        </div>
                    </td>
                    <td scope="col"
                        class="px-2 uppercase hover:underline dark:text-gray-400 dark:hover:text-white cursor-pointer"
                        @click="orderByName()">
                        <div class="flex items-center">
                            Name
                            <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"></updown-icon>
                        </div>
                    </td>
                    <!-- <td scope="col"
                        class="px-2 uppercase hover:underline dark:text-gray-400 dark:hover:text-white cursor-pointer" @click="orderByType()">
                        <div class="flex items-center">
                            Type.
                            <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"></updown-icon>
                        </div>
                    </td> -->
                    <td scope="col"
                        class="px-2 uppercase hover:underline  dark:text-gray-400 dark:hover:text-white hover:cursor-pointer"
                        @click="orderByWelfares()" v-if="classInfo.welfarePaid">
                        <div class="flex items-center">
                            Paid.
                            <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"></updown-icon>
                        </div>
                    </td>
                    <td scope="col"
                        class="px-2 uppercase hover:underline  dark:text-gray-400 dark:hover:text-white hover:cursor-pointer hidden md:table-cell"
                        @click="orderByWelfareOwed()" v-if="classInfo.welfareOwed">
                        <div class="flex items-center">
                            Owed.
                            <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"></updown-icon>
                        </div>
                    </td>
                    <td scope="col"
                        class="px-2 uppercase hover:underline  dark:text-gray-400 dark:hover:text-white hover:cursor-pointer hidden md:table-cell"
                        @click="orderByBefore()">
                        <div class="flex items-center">
                            Welfare B/F.
                            <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"></updown-icon>
                        </div>
                    </td>
                    <td scope="col"
                        class="px-2 uppercase hover:underline dark:text-gray-400 dark:hover:text-white  hover:cursor-pointer hidden md:table-cell"
                        @click="orderByTotal()">
                        <div class="flex items-center">
                            T.Welfares.
                            <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"></updown-icon>
                        </div>
                    </td>
                    <td scope="col"
                        class="px-2 uppercase hover:underline  dark:text-gray-400 dark:hover:text-white hover:cursor-pointer">
                        <div class="flex items-center">
                            Options.
                        </div>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr class="bg-transparent border-b dark:bg-transparent dark:border-gray-700 font-boldened text-sm uppercase"
                    v-for="(welfare, index) in allWelfares">
                    <td scope="row" class="py-4">
                        <span class="uppercase text-gray-900 whitespace-nowrap dark:text-white text-xs">
                            {{ welfare.id }}.
                        </span>
                    </td>
                    <td scope="row" class="p-1">
                        <div class="text-sm flex flex-col">
                            <a @click="getRoute(welfare.member_id)"
                            class="cursor-pointer hover:underline dark:hover:text-cyan-600 uppercase text-gray-900 whitespace-nowrap dark:text-white">
                                <span class="md:text-md text-sm">
                                    {{ welfare.member.name }}
                                </span>
                            </a>
                            <span :class="classInfo.successBadge" v-if="welfare.type">
                                Paid
                            </span>
                            <span :class="classInfo.failBadge" v-else>
                                Owed
                            </span>
                        </div> 
                    </td>
                    <!-- <td class="p-1">
                        <span v-if="welfare.type == 0">
                            <span class="text-rose-500 uppercase underline text-sm">
                                Owed
                            </span>
                        </span>
                        <span v-else>
                            <span class="text-emerald-500 uppercase underline text-sm">
                                Paid
                            </span>
                        </span>
                    </td> -->
                    <td class="p-1" v-if="classInfo.welfarePaid">
                        <div class="text-blue-500 text-sm">
                            <div class="font-normal underline">
                                ksh {{ Number(welfare.payment).toLocaleString() }}
                            </div>
                            <div class="font-normal text-2xs dark:text-gray-300 hidden md:block">
                                {{ moment(welfare.created_at).fromNow() }}
                            </div>
                        </div>
                    </td>
                    <td class="p-1 hidden md:table-cell" v-if="classInfo.welfareOwed">
                        <span v-if="welfare.type == 0">
                            <span class="text-red-500 underline text-sm">
                                ksh {{ Number(welfare.payment).toLocaleString() }}
                            </span>
                        </span>
                        <span v-else>
                            <span class="text-red-500 underline text-sm">
                                ksh 0
                            </span>
                        </span>
                    </td>
                    <td class="p-1 hidden md:table-cell">
                        <div class="text-orange-500 text-sm">
                            <div class="font-normal underline">
                                ksh {{ Number(welfare.member.welfare_before).toLocaleString() }}
                            </div>
                            <div class="font-normal text-2xs dark:text-gray-300">
                                {{ moment(welfare.created_at).fromNow() }}
                            </div>
                        </div>
                    </td>
                    <td class="p-1 hidden md:table-cell">
                        <span class="text-green-500 underline text-sm" v-if="welfare.member.welfare_total > 0">
                            ksh {{ Number(welfare.member.welfare_total).toLocaleString() }}
                        </span>
                        <span class="text-red-500 underline text-sm" v-else>
                            ksh {{ Number(welfare.member.welfare_total).toLocaleString() }}
                        </span>
                    </td>
                    <td class="p-1">
                        <div class="inline-flex rounded-md gap-0.5" role="group">
                            <!-- edit  -->
                            <button type="button"
                                class="inline-flex items-center p-0.5 text-xs font-medium text-cyan-900 bg-transparent rounded-md hover:text-white focus:z-10 focus:ring-1 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:text-cyan-700 dark:hover:text-cyan-400 shadow"
                                @click="showWelfare(welfare)">
                                <edit-icon class="w-4 h-4"></edit-icon>
                                <!-- Edit -->
                            </button>
                            <!-- delete  -->
                            <button type="button"
                                class="inline-flex items-center p-0.5 text-xs font-medium text-red-900 bg-transparent rounded-md hover:text-white focus:z-10 focus:ring-1 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:text-red-700 dark:hover:text-red-400 shadow"
                                @click="showWelfareDelete(welfare)">
                                <delete-icon class="w-4 h-4"></delete-icon>
                                <!-- Delete -->
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <!--end welfares table  -->

    <loadingTable v-else>
    </loadingTable>

    <!-- update welfare modal  -->
    <welfaresupdate :info=classInfo.modalData :show=classInfo.isOpen :name=classInfo.modalName :cycle=props.cycle.name
        :payment=numFormat(classInfo.modalData.payment) @reload=reloadInfo @close=closeWelfare  @flash = flashShow @hide   = flashHide>
    </welfaresupdate>
    <!-- end update Welfare modal  -->

    <!-- delete welfare modal  -->
    <welfaresdelete :info=classInfo.deleteData :show=classInfo.isDeleteOpen :name=classInfo.modalName
        :url=classInfo.deleteWelfURL :payment=numFormat(classInfo.deleteData.payment) @reload=reloadInfo
        @close=closeWelfareDelete  @flash = flashShow @hide = flashHide></welfaresdelete>
    <!-- end delete payment modal  -->
</template>

<script setup>
    import { reactive, computed, defineEmits, onMounted, defineProps, watch} from 'vue';
    import { router } from '@inertiajs/vue3';

    import moment from 'moment';
    
    const props = defineProps({
        cycle: {
            type: Object,
            required: true,
        },
    })

    const type = computed(() => props.cycle);

    watch(type, (newValue) => {
        classInfo.isLoading = true;
        getInfo();
    })

    const classInfo = reactive ({
        btn1: 'Add Welfares',
        btn2: 'Show All Welfares',
        btn3: 'Show All Paid Welfares',
        btn4: 'Show All Welfares Owed',

        infoSection: 'w-full m-2 p-2 text-left mx-auto rounded-xl border-2 shadow-md border border-cyan-500 p-1 overflow-hidden bg-cyan-400/10 dark:bg-cyan-400/10',
        infoHeader: 'text-cyan-300 mb-2 text-md text-left font-normal underline tracking-tight uppercase',
        borderClass: 'border-[3px] border-cyan-300 dark:border-cyan-700',
        mainHeader: 'font-boldened text-xl text-gray-800 dark:text-gray-300 leading-tight uppercase py-1',

        info: [],
        welfareOption: 'text-gray-800 text-sm dark:text-white bg-transparent dark:bg-transparent hover:text-slate-500 dark:hover:text-teal-300 p-0.5 md:p-1 text-center cursor-pointer',
        svgOption: 'w-5 h-5 md:w-6 md:h-6',

        // search
        search: '',
        link: '',

        // order 
        nameOrder: true,
        paidOrder: false,
        welfareOrder: false,
        totalOrder: false,
        ordername: '',
        ordertype: '',

        // page: 1
        isOpen: false,
        isOpenInfo: false,
        modalData: {},

        // delete info 
        isDeleteOpen: false,
        deleteData: {},
        deleteID: '',
        deletePayURL: '/delete/welfare/',

        // sort 
        ascending: true,
        sortBy: 'id',

        alertType: '',
        flashMessage: '',

        welfarePaid: true,
        welfareOwed: true,
        isLoading: true,

        successBadge : 'text-black dark:text-black md:text-xs text-2xs border dark:border-green-900 border-black bg-green-400 rounded-md shadow-md py-0.5 px-1 my-auto w-fit',
        failBadge : 'text-black dark:text-black md:text-xs text-2xs border dark:border-red-900 border-black bg-rose-400 rounded-md shadow-md py-0.5 px-1 my-auto w-fit',
    })

    const allWelfares = computed(() => {
        let tempWelfares = classInfo.info

        // search rows 
        if (classInfo.search != '' && classInfo.search) {
            tempWelfares = tempWelfares.filter((welfare) => {
                return welfare.member.name
                    .toUpperCase()
                    .includes(classInfo.search.toUpperCase())
            })
        }

        // Sort Welfares
        tempWelfares = tempWelfares.sort((a, b) => {
            if (classInfo.sortBy == 'name') {
                let fa = a.member.name.toLowerCase(), fb = b.member.name.toLowerCase()

                if (fa < fb) {
                    return -1
                }
                if (fa > fb) {
                    return 1
                }
                return 0

            } else if (classInfo.sortBy == 'id') {
                return a.id - b.id
            } else if (classInfo.sortBy == 'type') {
                return a.type - b.type
            } else if (classInfo.sortBy == 'payment') {
                return a.payment - b.payment
            } else if (classInfo.sortBy == 'welfare_before') {
                return a.member.welfare_before - b.member.welfare_before
            } else if (classInfo.sortBy == 'welfare_total') {
                return a.member.welfare_total - b.member.welfare_total
            }
        })

        // Show sorted array in descending or ascending order
        if (!classInfo.ascending) {
            tempWelfares.reverse()
        }

        return tempWelfares
    })

    onMounted(() => {
        classInfo.isLoading = true;
        getInfo();
    })

    const emit = defineEmits(['flash', 'progress', 'switch']);

    function setSearch(i) {
        classInfo.search = i;
    }

    function getInfo() {
        axios.get('/api/getCycle/'+ props.cycle.id)
            .then(
                ({ data }) => {
                    classInfo.info    = data[2];
                    classInfo.isLoading = false;
                    orderByType();
                });
    }

    function reloadInfo() {
        axios.get('/api/getCycle/'+ props.cycle.id)
            .then(
                ({ data }) => {
                    classInfo.info    = data[2];
                    classInfo.isLoading = false;
                    // orderByType();
                });
    }

    function numFormat(num) {
        if (num < 19999) {
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

    function clearBalance([member, payment]) {
        // info 
        let balance = Number(props.cycle.amount - payment.payment).toLocaleString();
        let message = 'Clear '+ member.name + ': balance of ksh ' + balance + '?';

        // confirm clearance
        if (confirm(message) == true) {
            axios.get('/clear/balance/' + props.cycle.id + '/' + member.id)
                .then(
                    ({ data }) => {
                        classInfo.info       = data[0];
                        classInfo.cycleinfo  = data[1];
                        progressMain();

                        // flashMessage 
                        classInfo.flashMessage   = member.name + ' balance: ksh ' + balance + ' cleared!';
                        classInfo.alertType      = 'info';
                        LoadingOff();
                    });
        }
    }

    function LoadingOn() {
        classInfo.ascending = !classInfo.ascending;
        classInfo.isLoading = true 
    }

    function LoadingOff() {
        emit('flash', classInfo.flashMessage, classInfo.alertType);
        classInfo.isLoading = false
    }

    // order rows 
    function orderBy(sortBy, ordername) {
        LoadingOn();

        classInfo.sortBy = sortBy;
        classInfo.ordername = ordername;
        
        classInfo.flashMessage = `Welfares Sorted By: ${ordername.toLowerCase()} ${classInfo.ascending ? 'ascending' : 'descending'}`;
        classInfo.alertType = classInfo.ascending ? 'asc' : 'desc';

        LoadingOff();
    }

    // Usage examples
    function orderByID() {
        orderBy('id', 'ID');
    }

    function orderByType() {
        orderBy('type', 'type');
    }

    function orderByName() {
        orderBy('name', 'NAME');
    }

    function orderByWelfares() {
        orderBy('payments', 'TOTAL WELFARES', false, true);
    }

    function orderByWelfareOwed() {
        orderBy('payments_sum', 'TOTAL WELFARES OWED', true, false);
    }

    function orderByBefore() {
        orderBy('welfare_before', 'TOTAL WELFARES CONTRIBUTED BEFORE');
    }

    function orderByTotal() {
        orderBy('welfare_total', 'TOTAL WELFARES AMOUNT');
    }
    // end order rows

    function tabSwitch2() {
        emit('switch');
    }

    function getRoute(a) {
        let url = '/member/' + a;

        router.visit(url, { preserveScroll: true });
    }

    function welfareAll() {
        getInfo();
        classInfo.welfareOwedClass    = false;
        classInfo.welfareInClass      = false;

        classInfo.welfarePaid = true;
        classInfo.welfareOwed = true;

        classInfo.flashMessage   = 'Showing All '+ props.cycle.name +' ( ' + classInfo.info.length + ' ) Welfares!';
        classInfo.alertType      = 'info';
        LoadingOff();
    }
    
    function welfareIn() {
        LoadingOn();
        classInfo.welfarePaid = true;
        classInfo.welfareOwed = false;
        axios.get('/api/getWelfares/in/'+ props.cycle.id)
            .then(
                ({ data }) => {
                    classInfo.info = data[0];
                    classInfo.welfareOwedClass = false;
                    classInfo.welfareInClass   = true; 
                    classInfo.flashMessage   = 'Showing All Paid '+ props.cycle.name +' ( ' + classInfo.info.length + ' ) Welfares!';
                    classInfo.alertType      = 'success';
                    LoadingOff();
                });
    }

    function welfareOwed() {
        LoadingOn();
        classInfo.welfarePaid = false;
        classInfo.welfareOwed = true;
        axios.get('/api/getWelfares/out/'+ props.cycle.id)
            .then(
                ({ data }) => {
                    classInfo.info = data[0];
                    classInfo.welfareOwedClass = true;
                    classInfo.welfareInClass   = false; 
                    classInfo.flashMessage   = 'Showing All Owed '+ props.cycle.name +' ( ' + classInfo.info.length + ' ) Welfares!';
                    classInfo.alertType      = 'danger';
                    LoadingOff();
                });
    }

    // welfare modal 
    function showWelfare(welfare) {
        classInfo.modalData = welfare;
        classInfo.isOpen = true;
        classInfo.modalName = welfare.member.name;
    }

    function closeWelfare() {
        classInfo.isOpen        = false;
        classInfo.modalData            = {};
    }

    function showWelfareDelete(welfare) {
        classInfo.deleteData = welfare;
        classInfo.deleteID = welfare.id;
        classInfo.isDeleteOpen = true;
        classInfo.modalName = welfare.member.name;
    }

    function closeWelfareDelete() {
        classInfo.isDeleteOpen = false;
        classInfo.deleteData = {};
        classInfo.deleteID = '';
    }

    // flash messages 
    function flashShow(message, body) {
        emit('flash', message, body)
    }

    function flashHide() {
        emit('hide')
    }
</script>