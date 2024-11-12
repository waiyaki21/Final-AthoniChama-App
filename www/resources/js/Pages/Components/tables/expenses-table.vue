<template>
    <div
        class="bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-md sm:rounded-lg rounded-md col-span-1 lg:col-span-3 border-2 border-cyan-300 dark:border-cyan-700 h-fit">
        <div class="p-2 w-full flex-col">
            <h3
                class="font-boldened lg:text-3xl md:text-2xl text-xl text-gray-800 dark:text-gray-300 leading-tight uppercase py-1 px-1 whitespace-nowrap">
                <span class="underline text-gray-800 dark:text-gray-300 leading-tight uppercase">Expenses
                    Info.</span>
                <span class="mx-2 lg:text-md md:text-base text-sm text-gray-500 dark:text-gray-500 leading-tight">( {{ allExpenses.length }}
                    expenses )</span>
            </h3>

            <!-- search  -->
            <searchHelper :total=classInfo.info.length :new=allExpenses.length name="expenses" @search=setSearch></searchHelper>

            <!-- expenses table  -->
            <div class="py-2 relative overflow-x-auto overflow-y-scroll h-auto max-h-[35rem]" v-if="!classInfo.isLoading">
                <h2 class="font-normal font-boldened text-[3.4rem] text-center text-cyan-800 dark:text-cyan-300 leading-tight uppercase py-1"
                    v-if="allExpenses.length == 0">
                    <span v-if="classInfo.search != ''">
                        NO SUCH PROJECT Expense:
                        <br>
                        <span class="text-orange-500 dark:text-orange-500 underline text-[2rem]">
                            {{ classInfo.search }}!!
                        </span>
                    </span>
                    <span v-else>ADD Project Expenses TO GET STARTED!!</span>
                </h2>
                <table class="mx-auto w-full text-xs text-left text-gray-500 dark:text-gray-400" v-else>
                    <thead class="text-gray-700 uppercase bg-transparent dark:text-gray-400 font-boldened text-xs">
                        <tr>
                            <td scope="col" class="px-1 uppercase hover:underline hover:text-white cursor-pointer"
                                @click="orderByID()">
                                <div class="flex items-center">
                                    No.
                                    <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"  @click="classInfo.ascending = !classInfo.ascending"></updown-icon>
                                </div>
                            </td>
                            <td scope="col" class="px-2 uppercase hover:underline hover:text-white cursor-pointer"
                                @click="orderByName()">
                                <div class="flex items-center">
                                    Name
                                    <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"  @click="classInfo.ascending = !classInfo.ascending"></updown-icon>
                                </div>
                            </td>
                            <td scope="col" class="px-2 uppercase hover:underline hover:text-white cursor-pointer hidden md:table-cell"
                                @click="orderByPaid">
                                <div class="flex items-center">
                                    Paid.
                                    <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"  @click="classInfo.ascending = !classInfo.ascending"></updown-icon>
                                </div>
                            </td>
                            <td scope="col"
                                class="px-2 uppercase hover:underline dark:text-gray-400 dark:hover:text-white cursor-pointer"
                                @click="orderByCycle()">
                                <div class="flex items-center">
                                    Payment Cycle.
                                    <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"  @click="classInfo.ascending = !classInfo.ascending"></updown-icon>
                                </div>
                            </td>
                            <td scope="col"
                                class="px-2 uppercase hover:underline hover:text-white cursor-pointer hidden md:table-cell"
                                @click="orderByDate()">
                                <div class="flex items-center">
                                    Date
                                    <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"  @click="classInfo.ascending = !classInfo.ascending"></updown-icon>
                                </div>
                            </td>
                            <td scope="col" class="px-2 uppercase hover:underline">
                                <div class="flex items-center">
                                    Options.
                                </div>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-transparent border-b dark:bg-transparent dark:border-gray-700 text-sm uppercase"
                            v-for="(expense, index) in allExpenses">
                            <td scope="row" class="p-2 uppercase text-gray-900 whitespace-nowrap dark:text-white">
                                {{ expense.id }}.
                            </td>
                            <td scope="row"
                                class="p-2 uppercase text-gray-900 whitespace-nowrap dark:text-white text-sm hover:underline">
                                {{ expense.name }}
                            </td>
                            <td
                                class="p-2 uppercase text-cyan-700 underline whitespace-nowrap dark:text-cyan-700 text-md hidden md:table-cell">
                                ksh {{ Number(expense.amount).toLocaleString() }}
                            </td>
                            <td class="p-2">
                                <div class="">
                                    <a @click="getRoute(expense.cycle_id)"
                                    class="text-white bg-gradient-to-r from-cyan-600 to-blue-700 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg p-2 text-center me-2 mb-2 flex w-full justify-between cursor-pointer">
                                        <span class="md:text-md sm:text-sm ml-4">
                                            {{ expense.cycle.name }}
                                        </span>
                                        <calendar-icon class="w-4 h-4"></calendar-icon>
                                    </a>
                                    <div class="font-normal text-2xs text-cyan-800 dark:text-cyan-300 flex w-full justify-end gap-4 md:hidden">
                                        <span class="underline">Paid: </span>ksh {{ Number(expense.amount).toLocaleString() }}
                                    </div>
                                </div>
                            </td>
                            <td class="p-2 hidden md:table-cell">
                                <div class="">
                                    <div class="font-normal">
                                        {{ moment(expense.created_at).format("ddd, Do-MM-YY") }}
                                    </div>
                                    <div class="font-normal text-2xs dark:text-gray-300 underline">
                                        {{ moment(expense.created_at).fromNow() }}
                                    </div>
                                </div>
                            </td>
                            <td class="p-2">
                                <div class="inline-flex rounded-md gap-0.5" role="group">
                                    <!-- edit  -->
                                    <button type="button"
                                        class="inline-flex items-center p-0.5 text-2xs font-medium text-cyan-900 bg-transparent rounded-md hover:text-white focus:z-10 focus:ring-1 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:text-cyan-700 dark:hover:text-cyan-400 shadow"
                                        @click="showExpense(expense)">
                                        <edit-icon class="w-4 h-4"></edit-icon>
                                        <!-- Edit -->
                                    </button>
                                    <!-- delete  -->
                                    <button type="button"
                                        class="inline-flex items-center p-0.5 text-2xs font-medium text-red-900 bg-transparent rounded-md hover:text-white focus:z-10 focus:ring-1 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:text-red-700 dark:hover:text-red-400 shadow"
                                        @click="showDelete(expense)">
                                        <delete-icon class="w-4 h-4"></delete-icon>
                                        <!-- Delete -->
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <loadingTable v-if="classInfo.isLoading"></loadingTable>
            <!--end expenses table  -->
        </div>
    </div>

    <!-- update expenses modal  -->
    <expensesupdate
        :info   = classInfo.modalData
        :show   = classInfo.isOpen
        :name   = classInfo.modalName
        :payment= numFormat(classInfo.modalData.payment)
        @reload = getInfo
        @close  = closeExpense
    ></expensesupdate>
    <!-- end update expenses modal  -->

    <!-- delete expenses modal  -->
    <expensesdelete
        :info   = classInfo.deleteData
        :show   = classInfo.isDeleteOpen
        :name   = classInfo.modalName
        :amount = numFormat(classInfo.deleteData.amount)
        @reload = getInfo
        @close  = closeDelete
    ></expensesdelete>
    <!-- end delete expenses modal  -->
</template>

<script setup>
    import { reactive, onMounted, defineEmits ,defineProps, watch, computed, onBeforeMount } from 'vue';
    import { router, useForm } from '@inertiajs/vue3';

    //moment 
    import moment           from 'moment';

    const props = defineProps({
        expenses : {
            type: Array,
            required: true
        },
        project: {
            type: Array,
            required: true,
        },
        reload: {
            type: Boolean,
            required: true
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
        infoHeader: 'text-cyan-300 mb-2 text-xl text-left font-normal underline tracking-tight uppercase',
        borderClass: 'overflow-hidden font-boldened flex-col justify-between p-2 md:m-2 sm:m-1 sm:my-1 rounded-lg bg-gray-100 dark:bg-gray-800/50 shadow-md sm:rounded-lg border-[3px] border-cyan-300 dark:border-cyan-700',
        mainHeader: 'font-boldened text-gray-800 dark:text-gray-300 leading-tight uppercase underline py-1 md:text-2xl text-xl',

        info: [],

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
        deleteURL: '/delete/expense/',

        selected: false
    })

    const type = computed(() => props.expenses);

    watch(type, (newValue) => {
        classInfo.isLoading = true;
        getInfo();
    })

    const reset = computed(() => props.reload);

    watch(reset, (newValue) => {
        classInfo.isLoading = true;
        getInfo();
    })

    // computed 
    const allExpenses = computed(() => {
        let tempExpenses = classInfo.info

            // search rows 
            if (classInfo.search != '' && classInfo.search) {
                tempExpenses = tempExpenses.filter((expense) => {
                    return expense.name
                        .toUpperCase()
                        .includes(classInfo.search.toUpperCase())
                })
            }

            // Sort by orders
            tempExpenses = tempExpenses.sort((a, b) => {
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
                tempExpenses.reverse()
            }

            return tempExpenses
    })

    onMounted(() => {
        getInfo()
        setInfo()
    })

    const emit = defineEmits(['flash','reload', 'view'])

    function setSearch(i) {
        classInfo.search = i;
    }

    function setInfo() {
        classInfo.sortBy    = 'id';

        // sort message
        classInfo.message   = allExpenses.length + ' Expenses Sorted by: ';

        // flash message 
        classInfo.ordername = 'ID';
        if(classInfo.ascending) {
            if (allExpenses.length != 0) {
                classInfo.flashMessage = classInfo.message + classInfo.ordername + ' ascending';
                classInfo.alertBody = 'info';
            }  
        }
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
        let url = '/cycle/' + a;

        router.visit(url, { preserveScroll: true });
    }

    // order rows 
    function orderBy(sortBy, ordername) {
        LoadingOn();

        classInfo.sortBy = sortBy;
        classInfo.ordername = ordername;
        classInfo.flashMessage = `Members Sorted By: ${ordername.toLowerCase()} ${classInfo.ascending ? 'ascending' : 'descending'}`;
        classInfo.alertType = classInfo.ascending ? 'asc' : 'desc';

        emit('flash', classInfo.flashMessage, classInfo.alertBody);

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
        orderBy('created_at', 'DATE');
    }

    function orderByPaid() {
        orderBy('amount', 'PAYMENTS');
    }

    function orderByCycle() {
        orderBy('cycle_id', 'PAYMENT CYCLES');
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
    function showExpense(expense) {
        classInfo.modalName = expense.name;
        classInfo.modalData = expense;
        classInfo.isOpen    = true;
    }

    function closeExpense() {
        classInfo.isOpen             = false;
        classInfo.modalName          = '';
        classInfo.modalData          = {};
    }

    function showDelete(expense) {
        classInfo.modalName      = expense.name;
        classInfo.deleteData     = expense;
        classInfo.deleteID       = expense.id;
        classInfo.isDeleteOpen   = true;
    }

    function closeDelete() {
        classInfo.isDeleteOpen   = false;
        classInfo.deleteData     = {};
        classInfo.deleteID       = '';
        classInfo.modalName      = '';
    }
    // end modal functions 

    // get all 
    function getInfo() {
        axios.get('/api/getExpenses/' + props.project.id)
            .then(
                ({ data }) => {
                    classInfo.info      = data[0];
                    classInfo.sortBy    = 'id';

                    LoadingOff();
                });
    }
</script>