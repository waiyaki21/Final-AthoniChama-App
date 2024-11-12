<template> 
    <h3 :class="[classInfo.mainHeader, 'w-full grid grid-cols-4 md:grid-cols-4']">
        <span class="w-full md:inline-flex flex-col justify-start col-span-3 grid grid-cols-1 md:grid-cols-5">
            <span class="underline md:text-2xl text-xl col-span-3">{{ cycle.name }} Payments.</span>
        </span>

        <h3 :class="['font-boldened text-xl text-gray-800 dark:text-gray-300 leading-tight uppercase py-1 inline-flex justify-end w-full gap-2']">
            <ActionButton :class="'p-0.5 h-fit my-auto rounded-lg hover:shadow-md'"
                :buttonClass="'danger'"
                @handleClick="clearAllBalances()"
                :tooltipText="`This will pay the default amount for each member who has not contributed`"
                :buttonText="`Clear All Balances.`"
                v-if="props.percent >= props.cycle.members_no">
                <warning-icon :class="['w-4 h-4 flex-shrink-0']"></warning-icon>
            </ActionButton>
            <!-- forms  -->
            <ActionButton :class="'p-0.5 h-fit my-auto rounded-lg hover:shadow-md'"
                :buttonClass="'info'"
                @handleClick="formSwitch()"
                :tooltipText="`Add Member Payments`"
                :buttonText="`Add Payments.`">
                <add-icon :class="['w-4 h-4 flex-shrink-0']"></add-icon>
            </ActionButton>
        </h3>
    </h3>

    <!-- search  -->
    <searchHelper :total=classInfo.info.length :new=allPayments.length name="members" @search=setSearch></searchHelper>

    <hr-line class="border-cyan-800 dark:border-cyan-300"></hr-line>

    <!-- payments table  -->
    <div class="p-2 relative overflow-x-auto h-fit md:max-h-[540px] overflow-y-scroll"  v-if = "!classInfo.isLoading">
        <h2 class="font-normal font-boldened text-3xl text-center text-amber-500 dark:text-amber-500 leading-tight uppercase underline py-1" v-if="allPayments.length == 0">
            <span v-if="classInfo.search != ''">
                NO SUCH MEMBER IN THIS CYCLE: 
                <br>
                <span class="text-amber-500 dark:text-amber-500 underline text-2xl">
                    {{ classInfo.search }}!!
                </span>
            </span>
            <span v-else>NO PAYMENTS IN THIS CYCLE!!</span>
        </h2>
        <table class="mx-auto w-full text-xs text-left text-gray-500 dark:text-gray-400" v-else>
            <thead class="text-gray-700 hover:text-gray-900 uppercase bg-transparent font-boldened text-sm">
                <tr>
                    <td scope="col" class="px-2 uppercase hover:underline dark:text-gray-400 dark:hover:text-white cursor-pointer" @click="orderByID()">
                        <div class="flex items-center">
                            Name
                            <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"></updown-icon>
                        </div>
                    </td>
                    <td scope="col" class="px-2 uppercase hover:underline  dark:text-gray-400 dark:hover:text-white hover:cursor-pointer" @click="orderByPayments()">
                        <div class="flex items-center">
                            Paid.
                            <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"></updown-icon>
                        </div>
                    </td>
                    <td scope="col" class="px-2 uppercase hover:underline  dark:text-gray-400 dark:hover:text-white hover:cursor-pointer hidden md:table-cell" @click="orderByPaymentSum()">
                        <div class="flex items-center">
                            T.Contr.
                            <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"></updown-icon>
                        </div>
                    </td>
                    <td scope="col" class="px-2 uppercase hover:underline  dark:text-gray-400 dark:hover:text-white hover:cursor-pointer hidden md:table-cell" @click="orderByBefore()">
                        <div class="flex items-center">
                            Amnt B/F.
                            <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"></updown-icon>
                        </div>
                    </td>
                    <td scope="col" class="px-2 uppercase hover:underline dark:text-gray-400 dark:hover:text-white  hover:cursor-pointer" @click="orderByTotal()">
                        <div class="flex items-center">
                            G.Total.
                            <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"></updown-icon>
                        </div>
                    </td>
                    <!-- <td scope="col" class="px-2 uppercase hover:underline  dark:text-gray-400 dark:hover:text-white hover:cursor-pointer hidden md:table-cell">
                        <div class="flex items-center">
                            Date
                        </div>
                    </td> -->
                    <td scope="col" class="px-2 uppercase hover:underline  dark:text-gray-400 dark:hover:text-white hover:cursor-pointer">
                        <div class="flex items-center">
                            Options.
                        </div>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr class="bg-transparent border-b dark:bg-transparent dark:border-gray-700 font-boldened text-sm uppercase" v-for="(payment, index) in allPayments" preserve-scroll>
                    <td scope="row" class="sm:p-1 md:p-1.5 uppercase text-gray-900 md:whitespace-nowrap sm:whitespace-normal dark:text-white">
                        <span class="uppercase text-gray-900 whitespace-nowrap dark:text-white mr-1 text-2xs md:text-xs">
                            {{ index + 1 }}.
                        </span>
                        <a @click="getRoute(payment.member_id)" class="cursor-pointer hover:underline dark:hover:text-cyan-600 uppercase text-gray-900 whitespace-nowrap dark:text-white md:text-md text-base">{{ payment.member.name }}</a>.
                        <br>
                        <span class="uppercase underline text-cyan-800 dark:text-cyan-300 text-2xs">
                            {{ payment.member.telephone }}
                        </span>
                    </td>
                    <!-- <td class="p-1" v-if="payment.payment > cycle.amount"> -->
                    <td class="p-1">
                        <span class="text-green-500 underline text-sm whitespace-nowrap">
                            ksh {{ numFormat(payment.payment) }}
                        </span>
                    </td>
                    <!-- <td class="p-1 flex flex-col" v-else>
                            <span class="mb-1">Paid: 
                            <span class="text-green-500 underline text-sm">
                                ksh {{ Number(payment.payment).toLocaleString() }}
                            </span>
                        </span>
                        <button type="button" class="bg-rose-100 text-gray-800 text-xs text-left font-normal px-2.5 py-1.5 rounded-md dark:bg-rose-900 dark:text-gray-300 border-2 border-rose-900 dark:border-rose-500 cursor-pointer w-2/3" @click="clearBalance([payment.member, payment])">
                            Clear Balance: ksh {{ Number(cycle.amount - payment.payment).toLocaleString() }}
                        </button>
                    </td> -->
                    <td class="p-1 hidden md:table-cell">
                        <span class="text-blue-500 underline text-sm whitespace-nowrap">
                            ksh {{ numFormat(payment.member.payments_sum) }}
                        </span>
                    </td>
                    <td class="p-1 hidden md:table-cell">
                        <span class="text-amber-500 underline text-sm whitespace-nowrap">
                            ksh {{ numFormat(payment.member.amount_before) }}
                        </span>
                    </td>
                    <td class="p-1">
                        <span class="text-rose-500 underline text-sm whitespace-nowrap">
                            ksh {{ numFormat(payment.member.payments_total) }}
                        </span>
                    </td>
                    <!-- <td class="p-1 hidden md:table-cell">
                        <div class="pl-1">
                            <div class="font-normal">
                                {{ moment(payment.created_at).format("ddd, Do-MM-YY") }}
                            </div>
                            <div class="font-normal text-2xs dark:text-gray-300 underline">
                                {{ moment(payment.created_at).fromNow() }}
                            </div>
                        </div>
                    </td> -->
                
                    <td class="p-1">
                        <div class="inline-flex rounded-md gap-0.5" role="group">
                            <!-- edit  -->
                            <button type="button"
                                class="inline-flex items-center p-0.5 text-xs font-medium text-cyan-900 bg-transparent rounded-md hover:text-white focus:z-10 focus:ring-1 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:text-cyan-700 dark:hover:text-cyan-400 shadow"
                                @click="showPayment(payment)">
                                <edit-icon class="w-4 h-4"></edit-icon>
                                <!-- Edit -->
                            </button>
                            <!-- delete  -->
                            <button type="button"
                                class="inline-flex items-center p-0.5 text-xs font-medium text-red-900 bg-transparent rounded-md hover:text-white focus:z-10 focus:ring-1 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:text-red-700 dark:hover:text-red-400 shadow"
                                @click="showDelete(payment)">
                                <delete-icon class="w-4 h-4"></delete-icon>
                                <!-- Delete -->
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <!--end payments table  -->

    <loadingTable v-else
    ></loadingTable>

    <!-- update payment modal  -->
    <paymentsupdate
        :info   = classInfo.modalData
        :show   = classInfo.isOpen
        :name   = classInfo.modalName
        :payment= numFormat(classInfo.modalData.payment)
        @reload = reloadInfo
        @close  = closePayment
        @flash  = flashShow
    ></paymentsupdate>
    <!-- end update payment modal  -->

    <!-- delete payment modal  -->
    <paymentsdelete
        :info   = classInfo.deleteData
        :show   = classInfo.isDeleteOpen
        :name   = classInfo.modalName
        :payment= numFormat(classInfo.deleteData.payment)
        @reload = reloadInfo
        @close  = closeDelete
        @flash  = flashShow
    ></paymentsdelete>
    <!-- end delete payment modal  -->
</template>

<script setup>
    import { reactive, computed, defineEmits, onMounted, watch } from 'vue';
    import { router } from '@inertiajs/vue3';
    
    const props = defineProps({
        cycle: {
            type: Object,
            required: true,
        }
    })

    const type = computed(() => props.cycle);

    watch(type, (newValue) => {
        classInfo.isLoading = true;
        getInfo();
    })

    const classInfo = reactive ({
        infoSection: 'w-full m-2 p-2 text-left mx-auto rounded-xl border-2 shadow-md border border-cyan-500 p-1 overflow-hidden bg-cyan-400/10 dark:bg-cyan-400/10',
        infoHeader: 'text-cyan-300 mb-2 text-md text-left font-normal underline tracking-tight uppercase',
        borderClass: 'border-[3px] border-cyan-300 dark:border-cyan-700',
        mainHeader: 'font-boldened text-xl text-gray-800 dark:text-gray-300 leading-tight uppercase py-1',

        info: [],

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
        deletePayURL: '/delete/payment/',

        // sort 
        ascending: true,
        sortBy: 'id',

        alertType: '',
        flashMessage: '',
        isLoading: true,
    })

    const allPayments = computed(() => {
        if (!classInfo.info) {
            return [];
        }

        let tempPayments = classInfo.info

        // search rows 
        if (classInfo.search != '' && classInfo.search) {
            tempPayments = tempPayments.filter((payment) => {
                return payment.member.name
                    .toUpperCase()
                    .includes(classInfo.search.toUpperCase())
            })
        }

        // Sort Payments
        tempPayments = tempPayments.sort((a, b) => {
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
            } else if (classInfo.sortBy == 'payments') {
                return a.payments - b.payments
            } else if (classInfo.sortBy == 'payments_sum') {
                return a.member.payments_sum - b.member.payments_sum
            } else if (classInfo.sortBy == 'amount_before') {
                return a.member.amount_before - b.member.amount_before
            } else if (classInfo.sortBy == 'payments_total') {
                return a.member.payments_total - b.member.payments_total
            }
        })

        // Show sorted array in descending or ascending order
        if (!classInfo.ascending) {
            tempPayments.reverse()
        }

        return tempPayments
    })

    onMounted(() => {
        classInfo.isLoading = true;
        getInfo()
    })

    const emit = defineEmits(['flash','progress','switch2']);

    function getInfo() {
        let link    = 'asc';
        let linkTo  = 'created_at/';

        axios.get('/api/getPayments/'+ props.cycle.id + '/' + linkTo + link)
            .then(
                ({ data }) => {
                    classInfo.info = data[0];
                    classInfo.isLoading = false
                });
    }

    function reloadInfo() {
        let link    = 'asc';
        let linkTo  = 'created_at/';

        axios.get('/api/getPayments/'+ props.cycle.id + '/' + linkTo + link)
            .then(
                ({ data }) => {
                    classInfo.info = data[0];
                    classInfo.isLoading = false
                });
    }

    function setSearch(i) {
        classInfo.search = i;
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
                    });
        }

        // flashMessage 
        classInfo.flashMessage   = member.name + ' balance: ksh ' + balance + ' cleared!';
        classInfo.alertType      = 'info';
        LoadingOff();
    }

    function clearAllBalances() {
        let message = 'Automatically fill in all member balances?';
        if (confirm(message) == true) {
            axios.get('/clear/all/balances/' + props.cycle.id)
                .then(
                    ({ data }) => {
                        classInfo.info       = data[0];
                        classInfo.cycleinfo  = data[1];
                        progressMain();
                    });
        }
    }

    function formSwitch() {
        emit('switch2');
    }

    function progressMain() {
        emit('progress');
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

        classInfo.flashMessage = `Payments Sorted By: ${ordername.toLowerCase()} ${classInfo.ascending ? 'ascending' : 'descending'}`;
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

    function orderByPayments() {
        orderBy('payments', 'TOTAL PAYMENTS');
    }

    function orderByPaymentSum() {
        orderBy('payments_sum', 'TOTAL PAYMENTS CONTRIBUTED');
    }

    function orderByBefore() {
        orderBy('amount_before', 'TOTAL AMOUNT CONTRIBUTED BEFORE');
    }

    function orderByTotal() {
        orderBy('payments_total', 'GRAND TOTAL AMOUNT');
    }
    // end order row

    function getRoute(a) {
        let url = '/member/' + a;

        router.visit(url, { preserveScroll: true });
    }

    // modals 
    // payment modals 
    function showPayment(payment) {
        // console.log(payment);
        // formFields(payment);
        classInfo.modalName  = payment.member.name;
        classInfo.modalData  = payment;
        classInfo.isOpen     = true;
    }

    function closePayment() {
        classInfo.isOpen             = false;
        classInfo.modalName          = '';
        classInfo.modalData          = {};
    }

    function showDelete(payment) {
        classInfo.modalName      = payment.member.name;
        classInfo.deleteData     = payment;
        classInfo.deleteID       = payment.id;
        classInfo.isDeleteOpen   = true;
    }

    function closeDelete() {
        classInfo.isDeleteOpen   = false;
        classInfo.deleteData     = {};
        classInfo.deleteID       = '';
        classInfo.modalName      = '';
    }

    // flash messages 
    function flashShow(message, body) {
        emit('flash', message, body)
    }

    function flashLoading(message) {
        classInfo.isLoading      = true;
        emit('timed', message, 'warning', 60000)
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
</script>