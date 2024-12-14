<template>
    <section :class="[classInfo.borderClass, 'col-span-3 h-fit']">
        <!-- members table -->
        <div class="text-xs font-boldened text-center text-gray-500 dark:text-gray-400 w-full mb-2 p-1">
            <div class="w-full">
                <h3 class="font-boldened md:text-2xl text-md text-gray-800 dark:text-gray-300 leading-tight uppercase py-1 w-full flex-col justify-between space-y-1 whitespace-nowrap">
                    <span class="w-full inline-flex justify-start">
                        <span class="underline mr-1">Members' Information.</span>
                        <span class="text-gray-500 dark:text-gray-500 md:text-sm sm:text-xs md:mt-4 sm:mt-1">
                            ( {{ allMembers.length }} ) members
                        </span>
                    </span>
                    <label for="table-search" class="sr-only">Search</label>
                    <div class="relative w-full">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input type="text" id="table-search-users" v-model="classInfo.search" class="w-full block p-2 pl-8 text-sm text-gray-900 border border-gray-300 rounded-lg  bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-fit shadow-md placeholder:text-base placeholder:font-normal" placeholder="Search for members">
                    </div>
                </h3>

                <hr-line :color="'border-cyan-500/50 dark:border-cyan-500/50'"></hr-line>

                <!-- members table  -->
                <div class="py-2 relative overflow-x-auto overflow-y-scroll h-auto max-h-[30rem]"  v-if = "!classInfo.isLoading">
                    <h2 class="font-normal font-boldened text-[3rem] text-center text-cyan-800 dark:text-cyan-300 leading-tight uppercase py-1" v-if="allMembers.length == 0">
                        <span v-if="classInfo.search != ''">
                            NO SUCH MEMBER: 
                            <br>
                            <span class="text-orange-500 dark:text-orange-500 underline text-[2rem]">
                                {{ classInfo.search }}!!
                            </span>
                        </span>
                        <span v-else>ADD MEMBERS TO GET STARTED!!</span>
                    </h2>

                    <table class="mx-auto w-full text-xs text-left text-gray-500 dark:text-gray-400" v-else>
                        <thead class="text-gray-700 uppercase bg-transparent dark:text-gray-400 font-boldened text-xs">
                            <tr class="" preserve-scroll>
                                <td scope="col" class="px-0 uppercase hover:underline hover:text-white cursor-pointer" @click="orderByID()">
                                    <div class="flex items-center">
                                        ID.
                                        <updown-icon class="w-3 h-3 md:w-4 md:h-4"></updown-icon>
                                    </div>
                                </td>
                                <td scope="col" class="px-1 uppercase hover:underline hover:text-white cursor-pointer" @click="orderByName()">
                                    <div class="flex items-center">
                                        Name.
                                        <updown-icon class="w-3 h-3 md:w-4 md:h-4"></updown-icon>
                                    </div>
                                </td>
                                <td scope="col" class="px-1 uppercase hover:underline hover:text-white cursor-pointer" @click="orderByPercent()">
                                    <div class="flex items-center">
                                        %Age.
                                    </div>
                                </td>
                                <td scope="col" class="px-1 uppercase hover:underline hover:text-white cursor-pointer hidden md:table-cell" @click="orderByPaid()">
                                    <div class="flex items-center">
                                        T.Paid.
                                    </div>
                                </td>
                                <td scope="col" class="px-1 uppercase hover:underline hover:text-white cursor-pointer hidden md:table-cell" @click="orderByWelfare()">
                                    <div class="flex items-center">
                                        T.Welfare.
                                    </div>
                                </td>
                                <td scope="col" class="px-1 uppercase hover:underline hover:text-white cursor-pointer hidden md:table-cell" @click="orderByTotal()">
                                    <div class="flex items-center">
                                        T.Investment.
                                    </div>
                                </td>
                                <td scope="col" class="px-1 uppercase hover:text-white cursor-pointer">
                                    <div class="flex justify-center underline">
                                        Options.
                                    </div>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="bg-transparent border-b dark:bg-transparent dark:border-gray-700 font-boldened text-xs uppercase" v-for="(member, index) in allMembers" preserve-scroll>
                                <td scope="row" class="p-0.5 uppercase text-gray-900 md:whitespace-nowrap sm:whitespace-normal dark:text-white text-xs">
                                    {{ member.id }}.
                                </td>
                                <td scope="row" class="sm:p-1 md:p-1.5 uppercase text-gray-900 md:whitespace-nowrap sm:whitespace-normal dark:text-white flex flex-col">
                                    <a class="text-sm md:text-sm hover:underline hover:cursor-pointer inline-flex w-full justify-start gap-0.5 md:gap-2 focus:ring-0">
                                        <span @click="getRoute(member)">{{ member.name }}.</span>
                                        <button class="hover:cursor-pointer" @click="showActive(member)">
                                            <checksolid-icon class="w-3 h-3 md:w-4 md:h-4 text-emerald-600 hover:text-emerald-500 cursor-pointer transition-transform hover:rotate-360" v-if="member.active" v-tooltip="$tooltip(`${member.name}  Active!`, 'top')"></checksolid-icon>
                                            <timessolid-icon class="w-3 h-3 md:w-4 md:h-4 text-rose-600 hover:text-rose-500 cursor-pointer transition-transform hover:rotate-360" v-if="!member.active" v-tooltip="$tooltip(`${member.name}  Inactive!`, 'top')"></timessolid-icon>
                                        </button>
                                    </a>
                                    
                                    <span class="uppercase underline text-gray-800 dark:text-gray-300 text-xs">
                                        {{ member.telephone }}
                                    </span>
                                </td>
                                <td scope="row" class="p-0.5 uppercase text-gray-900 md:whitespace-nowrap sm:whitespace-normal dark:text-white text-xs">
                                    <span v-if="member.total_shares == 0" class="text-rose-500">{{ Number(member.total_shares).toFixed(0) }}%.</span>
                                    <span v-else class="text-emerald-500">{{ Number(member.total_shares).toFixed(1) }}%.</span>
                                </td>
                                <td class="sm:p-1 md:p-1.5 hidden md:table-cell">
                                    <span class="uppercase underline text-cyan-800 dark:text-cyan-800 text-sm whitespace-nowrap">
                                        ksh {{ numFormat(member.payments_total) }}
                                    </span>
                                </td>
                                <td class="sm:p-1 md:p-1.5 text-center hidden md:table-cell">
                                    <span class="uppercase underline text-orange-800 dark:text-orange-600 text-sm whitespace-nowrap">
                                        ksh {{ numFormat(member.welfare_total) }}
                                    </span>
                                </td>
                                <td class="sm:p-1 md:p-1.5 text-center hidden md:table-cell">
                                    <span class="uppercase underline text-green-800 dark:text-green-600 text-sm whitespace-nowrap">
                                        ksh {{ numFormat(member.total_investment) }}
                                    </span>
                                </td>
                                <td class="sm:p-1 md:p-1.5">
                                    <div class="inline-flex rounded-md shadow-sm gap-1" role="group">
                                        <!-- download  -->
                                        <a @click="downloadSheet(member)" type="button" class="inline-flex items-center p-0.5 text-xs font-normal text-amber-500 bg-transparent rounded-md hover:text-gray-500 dark:text-amber-500 dark:hover:text-amber-500" v-tooltip="$tooltip(`Download ${member.name} Excelsheet`, 'top')">
                                            <download-info class="w-3 h-3 md:w-4 md:h-4"></download-info>
                                        </a >
                                        <!-- edit  -->
                                        <button type="button"
                                            class="inline-flex items-center p-0.5 text-xs font-medium text-cyan-900 bg-transparent rounded-md hover:text-gray-500 dark:text-cyan-700 dark:hover:text-cyan-400" @click="showMember(member)" preserve-scroll>
                                            <edit-icon class="w-3 h-3 md:w-4 md:h-4"></edit-icon>
                                            <!-- Edit -->
                                        </button>
                                        <!-- delete  -->
                                        <button type="button"
                                            class="inline-flex items-center p-0.5 text-xs font-medium text-red-900 bg-transparent rounded-md hover:text-gray-500 dark:text-red-700 dark:hover:text-red-400"
                                            @click="showDelete(member)" preserve-scroll>
                                            <delete-icon class="w-3 h-3 md:w-4 md:h-4"></delete-icon>
                                            <!-- Delete -->
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <loadingTable
                    v-else
                ></loadingTable>

                <!--end members table  -->
                <hr-line :color="'border-teal-500/50 dark:border-teal-500/50'"></hr-line>
            </div>
        </div>
    </section>

    <!-- update member modal  -->
    <membersupdate
        :info   = classInfo.modalData
        :show   = classInfo.isOpen
        @flash  = flashShow
        @hide   = flashHide
        @reload = resetMembers
        @close  = closeMember
    ></membersupdate>
    <!-- end update member modal  -->

    <!-- delete member modal  -->
    <membersdelete
        :info   = classInfo.deleteData
        :show   = classInfo.isDeleteOpen
        @flash  = flashShow
        @hide   = flashHide
        @reload = resetMembers
        @close  = closeDelete
    ></membersdelete>
    <!-- end delete member modal  -->

    <!-- toggle active member modal  -->
    <membersactive
        :info   = classInfo.activeData
        :show   = classInfo.isActiveOpen
        @flash  = flashShow
        @hide   = flashHide
        @reload = resetMembers
        @close  = closeActive
    ></membersactive>
    <!-- end toggle active member modal  -->
</template>

<script setup>
    import { reactive, defineEmits ,defineProps, watch, computed, onMounted } from 'vue';
    import { router } from '@inertiajs/vue3';

    const props = defineProps({
        members : {
            type: Array,
            required: true
        },

        loading : {
            type: Boolean,
            required: true
        }
    })

    const classInfo = reactive ({
        // search
        search: '',

        // sort 
        ascending: true,
        sortBy: 'id',

        // loading 
        isLoading: true,

        // classess 
        borderClass: 'overflow-hidden font-boldened flex-col justify-between p-1 md:p-2 rounded-lg bg-cyan-50 dark:bg-gray-800/50 shadow-md sm:rounded-lg border-base border-cyan-300 dark:border-cyan-700',
        mainHeader: 'font-boldened text-gray-800 dark:text-gray-300 leading-tight uppercase underline py-1 md:text-2xl text-xl',

        info: [],
        message: '',

        // search
        link: '',

        svgOrder: '<svg class="w-3 h-3 ml-1" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24"><path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" /></svg>',
        svgSize: 'w-3 h-3',

        // page: 1
        isOpen: false,
        isOpenInfo: false,
        modalData: {},

        // active info 
        isActiveOpen: false,
        activeData: {},
        activeID: '',
        activeURL: '/active/member/',

        // delete info 
        isDeleteOpen: false,
        deleteData: {},
        deleteID: '',
        deleteURL: '/delete/member/',

        // alerts
        alertType: '',
        flashMessage: '',
    })

    const type = computed(() => props.members);

    watch(type, (newValue) => {
        classInfo.isLoading = true;
        setInfo();
    })

    const allMembers = computed(() => {
        
        let tempMembers = classInfo.info

        // search rows 
        if (classInfo.search != '' && classInfo.search) {
            tempMembers = tempMembers.filter((member) => {
                return member.name
                    .toUpperCase()
                    .includes(classInfo.search.toUpperCase())
            })
        }

        // Sort members
        tempMembers = tempMembers.sort((a, b) => {
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
            } else if (classInfo.sortBy == 'welfare_total') {
                return a.welfare_total - b.welfare_total
            } else if (classInfo.sortBy == 'total_amount') {
                return a.total_amount - b.total_amount
            } else if (classInfo.sortBy == 'last_pay') {
                return a.last_pay.payment - b.last_pay.payment
            } else if (classInfo.sortBy == 'active') {
                return  Number(a.active) - Number(b.active)
            } else if (classInfo.sortBy == 'total_shares') {
                return  Number(a.total_shares) - Number(b.total_shares)
            }
        })

        // Show sorted array in descending or ascending order
        if (!classInfo.ascending) {
            tempMembers.reverse()
        }

        return tempMembers
    })

    onMounted(() => {
        if (router.page.component != 'Settings') {
            classInfo.isLoading = true;
            resetMembers()
        }
    })

    const emit = defineEmits(['flash', 'loading', 'view', 'hide', 'timed'])

    function setInfo() {
        classInfo.isLoading = true;
        classInfo.info      = props.members;
        classInfo.sortBy    = 'id';

        // sort message
        classInfo.message   = classInfo.info.length + ' Members Sorted by: ';

        classInfo.isLoading = false
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
                let x = Number(num / 1000).toFixed(2);
                let y = x + ' k';
                return y;
            } 
        }
    }

    function getRoute(member) {
        // let url = '/member/' + a;

        // router.visit(url , { preserveScroll: true });

        // create url 
        let url = `/member/${member.id}`;
        // toast Notification 
        flashShow(`Now Showing ${member.name}`, 'info')
        // router 
        router.get(url);
    }

    function downloadSheet(member) {
        let name    = member.name;
        let url     = '/download/current/member/' + member.id;
        let header  = `Download Member Spreadsheet!`;
        let button  = `Download`;
        let body    = 'file';
        let message = 'Download ' + name + ' Payments and Welfare Ledger and records!';

        flashShowView(message, body, header, url, button, 15000, false);
    }

    // order rows 
    function orderBy(sortBy, ordername) {
        LoadingOn();

        classInfo.sortBy = sortBy;
        classInfo.ordername = ordername;
        classInfo.flashMessage = `Members Sorted By: ${ordername.toLowerCase()} ${classInfo.ascending ? 'ascending' : 'descending'}`;
        classInfo.alertType = classInfo.ascending ? 'asc' : 'desc';

        LoadingOff();
    }

    // Usage examples
    function orderByID() {
        orderBy('id', 'ID');
    }

    function orderByName() {
        orderBy('name', 'NAME');
    }

    function orderByPercent() {
        orderBy('total_shares', 'Percentage Shares');
    }

    function orderByPaid() {
        orderBy('payments_total', 'TOTAL PAYMENTS');
    }

    function orderByWelfare() {
        orderBy('welfare_total', 'TOTAL WELFARE');
    }

    function orderByTotal() {
        orderBy('total_investment', 'TOTAL INVESTED');
    }


    function LoadingOn() {
        classInfo.ascending = !classInfo.ascending;
        classInfo.isLoading = true 
    }

    function LoadingOff() {
        flashShow(classInfo.flashMessage, classInfo.alertType);
        classInfo.isLoading = false;
    }

    // flash messages 
    function flashShow(message, body) {
        emit('flash', message, body)
    }

    function flashLoading(message) {
        classInfo.isLoading      = true;
        emit('timed', message, 'warning', 100000000)
    }

    function flashHide() {
        emit('hide')
    }

    function flashTimed(message, body, duration) {
        emit('timed', message, body, duration)
    }

    function flashShowView(message, body, header, url, button, duration, linkState) {
        emit('view', message, body, header, url, button, duration, linkState);
    }

    // modal functions 
    function showMember(member) {
        classInfo.modalData = member;
        classInfo.isOpen    = true;
    }

    function closeMember() {
        classInfo.isOpen    = false;
        classInfo.modalData = {};
    }

    function showActive(member) {
        classInfo.activeData   = member;
        classInfo.activeID     = member.id;
        classInfo.isActiveOpen = true;
    }

    function closeActive() {
        classInfo.isActiveOpen = false;
        classInfo.activeData   = {};
        classInfo.activeID     = '';
    }

    function showDelete(member) {
        classInfo.deleteData   = member;
        classInfo.deleteID     = member.id;
        classInfo.isDeleteOpen = true;
    }

    function closeDelete() {
        classInfo.isDeleteOpen = false;
        classInfo.deleteData   = {};
        classInfo.deleteID     = '';
    }

    function resetMembers() {
        // emit('reload');
        let link = 'asc';
        let linkTo = 'id/';

        axios.get('/api/getMembers/' + linkTo + link)
            .then(
                ({ data }) => {
                    classInfo.info = data[0];
                    classInfo.isLoading = false;
                    // orderByID();
                });
    }
    // end modal functions 
</script>