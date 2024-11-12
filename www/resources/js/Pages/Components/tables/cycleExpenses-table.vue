<template>
    <div class="text-2xs font-boldened text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 w-full mb-2 mx-2 p-2 justify-between uppercase lg:hidden inline-flex">
        <ul class="flex flex-wrap -mb-px">
            <li class="me-2">
                <a :class="[classInfo.tab1]" @click="tabSwitch()">
                    {{ classInfo.tab1Name }}
                    <span
                        class="bg-blue-100 text-gray-800 md:text-2xs font-normal mx-1 px-1.5 py-0.5 rounded-full dark:bg-cyan-900 dark:text-white border-base border-cyan-900 dark:border-cyan-500 my-auto">
                        {{ allCycleExpenses.length }}
                    </span>
                </a>
            </li>

            <li class="me-2">
                <a :class="[classInfo.tab2]" @click="tabSwitch2()">
                    {{ classInfo.tab2Name }}
                </a>
            </li>
        </ul>
    </div>

    <!-- <hr-line :color="'dark:border-emerald-300 border-emerald-800'"></hr-line> -->

    <!-- table and form  -->
    <div class="p-1 w-full grid grid-cols-1 lg:grid-cols-3 gap-2">
        <!-- cycleExpenses form  -->
        <section class="col-span-1 flex flex-col gap-1" v-if="classInfo.tab2show">
            <div class="bg-cyan-100 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg rounded-md font-boldened border-base border-cyan-300 dark:border-cyan-700" v-if="!classInfo.showTypes">
                <div class="p-1">
                    <h3 class="font-boldened md:text-2xl text-md text-gray-800 dark:text-gray-300 leading-tight uppercase p-1 w-full flex-col justify-between space-y-1 whitespace-nowrap">
                        <span class="w-full inline-flex justify-start gap-1">
                            <span class="underline mr-1" v-html="`Add Expenses.`"></span>
                        </span>
                    </h3>
                    <h5>
                        <span :class="classInfo.successBadge" v-html="`Add Expenses to this monthly payment cycle.`">
                        </span>
                    </h5>
                    <form @submit.prevent="submit" class="p-1">
                        <div>
                            <section class="w-full inline-flex justify-between my-0.5">
                                <InputLabel for="name_id" value="Expense Type" />

                                <a @click="classInfo.showTypes = !classInfo.showTypes" :class="[!classInfo.showTypes ? classInfo.infoBadge : classInfo.failBadge, 'inline-flex gap-1 justify-start']">
                                    <add-icon class="w-2 h-2 md:w-3 md:h-3"></add-icon>
                                    <span v-html="!classInfo.showTypes ? `Add Expense Type` : `Add Expenses`"></span>
                                </a>
                            </section>
                            
                            <select id="name_id" v-model="form.name_id" name="name_id"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full">
                                <option v-for="name in classInfo.names" :value="name.id">
                                    <span>{{ name.name }}</span>
                                </option>
                            </select>

                            <InputError class="mt-1" :message="form.errors.name" />
                        </div>

                        <div>
                            <InputLabel for="amount" value="Amount" />

                            <TextInput id="amount" type="number" v-model="form.amount" autofocus />

                            <InputError class="mt-1" :message="form.errors.amount" />
                        </div>

                        <div class="flex items-center justify-start mt-2">
                            <SubmitButton :loading="form.processing" :success="form.wasSuccessful" :failed="form.hasErrors" :editting="form.isDirty">
                                Submit Monthly Expense
                            </SubmitButton>
                        </div>
                    </form>
                </div>
            </div>

            <div
                class="bg-cyan-100 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg rounded-md font-boldened border-base border-cyan-300 dark:border-cyan-700" v-else>
                <div class="p-1">
                    <h3 class="font-boldened md:text-2xl text-md text-gray-800 dark:text-gray-300 leading-tight uppercase p-1 w-full flex-col justify-between space-y-1 whitespace-nowrap">
                        <span class="w-full inline-flex justify-start gap-1">
                            <span class="underline mr-1" v-html="`Add Expense Types.`"></span>
                        </span>
                    </h3>
                    <h5>
                        <span :class="classInfo.successBadge" v-html="`Add Expense Types that you can group expenses into`">
                        </span>
                    </h5>
                    <form @submit.prevent="submitList" class="p-1">
                        <div>
                            <section class="w-full inline-flex justify-between my-0.5">
                                <InputLabel for="name" value="Expense Type Name" />

                                <a @click="classInfo.showTypes = !classInfo.showTypes" :class="[!classInfo.showTypes ? classInfo.infoBadge : classInfo.failBadge, 'inline-flex gap-1 justify-start']">
                                    <add-icon class="w-2 h-2 md:w-3 md:h-3"></add-icon>
                                    <span v-html="!classInfo.showTypes ? `Add Expense Type` : `Add Expenses`"></span>
                                </a>
                            </section>

                            <TextInput id="name" type="text" v-model="formList.name" autofocus />

                            <InputError class="mt-1" :message="formList.errors.name" />
                        </div>

                        <div class="flex items-center justify-start mt-2">
                            <SubmitButton :loading="formList.processing" :success="formList.wasSuccessful" :failed="formList.hasErrors" :editting="formList.isDirty">
                                Submit Expense Type
                            </SubmitButton>
                        </div>
                    </form>
                </div>
            </div>

            <div
                class="bg-cyan-100 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg rounded-md font-boldened border-base border-cyan-300 dark:border-cyan-700">
                <div class="p-1">
                    <h3 class="font-boldened md:text-2xl text-md text-gray-800 dark:text-gray-300 leading-tight uppercase p-1 w-full flex-col justify-start whitespace-nowrap">
                        <span class="w-full inline-flex justify-between gap-1">
                            <span class="underline mr-1" v-html="`Expense Types.`"></span>
                            <a @click="showAll" :class="[classInfo.infoBadge, 'inline-flex gap-1 justify-start']">
                                <loading-icon class="w-2 h-2 md:w-3 md:h-3"></loading-icon>
                                <span>Show All</span>
                            </a>
                        </span>
                    </h3>
                    <div class="py-2 relative overflow-x-auto overflow-y-scroll h-auto max-h-[20rem]" v-if="!classInfo.isLoading">
                        <h2 class="font-normal font-boldened text-2xl text-center text-red-800 dark:text-red-600 leading-tight uppercase underline py-1"
                            v-if="classInfo.names.length == 0">
                            <span>No Expense Types!!</span>
                        </h2>
                        <table class="mx-auto w-full text-xs md:text-sm text-left text-gray-500 dark:text-gray-400" v-else>
                            <thead class="text-gray-700 uppercase bg-transparent dark:text-gray-400 font-boldened text-xs md:text-sm">
                                <tr>
                                    <td scope="col" class="px-0 uppercase hover:underline hover:text-white cursor-pointer">
                                        <div class="flex items-center">
                                            ID.
                                        </div>
                                    </td>
                                    <td scope="col" class="px-1 uppercase hover:underline hover:text-white cursor-pointer">
                                        <div class="flex items-center">
                                            Name.
                                        </div>
                                    </td>
                                    <td scope="col" class="px-1 uppercase hover:underline">
                                        <div class="flex items-center">
                                            Options.
                                        </div>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="bg-transparent border-b dark:bg-transparent dark:border-gray-700 font-boldened text-xs md:text-sm uppercase"
                                    v-for="(name, index) in classInfo.names" preserve-scroll>
                                    <td class="px-1 text-gray-900 whitespace-nowrap dark:text-white">
                                        {{ index + 1 }}.
                                    </td>
                                    <td scope="row" class="p-1 uppercase text-gray-900 whitespace-nowrap dark:text-white">
                                        <!-- progress bar  -->
                                        <a class="cursor-pointer" @click="filterByNameId(name.name)">
                                            <span class="hover:underline text-xs md:text-sm">
                                                {{ name.name }}
                                            </span>
                                        </a>
                                        <!-- end progress bar  -->
                                    </td>
                                    <td class="p-2">
                                        <div class="inline-flex rounded-md gap-0.5" role="group">
                                            <!-- edit  -->
                                            <button type="button"
                                                class="inline-flex items-center p-0.5 text-2xs font-medium text-cyan-900 bg-transparent rounded-md hover:text-white focus:z-10 focus:ring-1 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:text-cyan-700 dark:hover:text-cyan-400 shadow"
                                                @click="showNameExpense(name)">
                                                <edit-icon class="w-3 h-3"></edit-icon>
                                                <!-- Edit -->
                                            </button>
                                            <!-- delete  -->
                                            <button type="button"
                                                class="inline-flex items-center p-0.5 text-2xs font-medium text-red-900 bg-transparent rounded-md hover:text-white focus:z-10 focus:ring-1 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:text-red-700 dark:hover:text-red-400 shadow"
                                                @click="showNameDelete(name)">
                                                <delete-icon class="w-3 h-3"></delete-icon>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
        <!-- cycleExpenses form  -->

        <!-- cycleExpenses table  -->
        <div :class="classInfo.cycleExpensesPage ? classInfo.cycleExpensesClass : classInfo.cyclesClass" v-if="classInfo.tab1show">
            <div class="w-full p-1">
                <h3 class="font-boldened md:text-2xl text-md text-gray-800 dark:text-gray-300 leading-tight uppercase p-1 w-full flex-col justify-between space-y-1 whitespace-nowrap">
                    <span class="w-full inline-flex justify-start gap-1">
                        <span class="underline mr-1" v-html="classInfo.cycleExpensesPage ? `All Monthly Expenses Info.` : `${ cycle.name } Monthly Expenses.`"></span>
                        <span class="text-gray-500 dark:text-gray-500 md:text-sm sm:text-xs md:mt-4 sm:mt-1">
                            ( {{ allCycleExpenses.length }} ) Monthly Expenses
                        </span>
                    </span>
                </h3>

                <!-- search  -->
                <searchHelper :total=classInfo.info.length :new=allCycleExpenses.length name="Monthly Expenses" @search=setSearch></searchHelper>

                <hr-line :color="allCycleExpenses.length == 0 ? 'border-red-500/50 dark:border-red-500/50' : 'border-blue-500/50 dark:border-blue-500/50'"></hr-line>

                <div class="py-2 relative overflow-x-auto overflow-y-scroll h-auto max-h-[35rem]" v-if="!classInfo.isLoading">
                    <h2 class="font-normal font-boldened text-2xl text-center text-red-800 dark:text-red-600 leading-tight uppercase underline py-1"
                        v-if="allCycleExpenses.length == 0">
                        <span v-if="classInfo.search != ''">
                            NO SUCH Monthly Expense IN THIS CYCLE:
                            <br>
                            <span class="text-amber-500 dark:text-amber-500 underline text-xl">
                                {{ classInfo.search }}!!
                            </span>
                        </span>
                        <span v-else>NO Monthly Expense IN THIS CYCLE!!</span>
                    </h2>
                    <table class="mx-auto w-full text-xs md:text-sm text-left text-gray-500 dark:text-gray-400" v-else>
                        <thead class="text-gray-700 uppercase bg-transparent dark:text-gray-400 font-boldened text-xs md:text-sm">
                            <tr>
                                <td scope="col" class="px-0 uppercase hover:underline hover:text-white cursor-pointer"
                                    @click="orderByID()">
                                    <div class="flex items-center">
                                        ID.
                                        <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"  @click="classInfo.ascending = !classInfo.ascending"></updown-icon>
                                    </div>
                                </td>
                                <td scope="col" class="px-1 uppercase hover:underline hover:text-white cursor-pointer"
                                    @click="orderByName()">
                                    <div class="flex items-center">
                                        Name.
                                        <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"  @click="classInfo.ascending = !classInfo.ascending"></updown-icon>
                                    </div>
                                </td>
                                <td scope="col" class="px-1 uppercase hover:underline hover:text-white cursor-pointer hidden md:table-cell"
                                    @click="orderByAmount()">
                                    <div class="flex items-center">
                                        Amount
                                        <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"  @click="classInfo.ascending = !classInfo.ascending"></updown-icon>
                                    </div>
                                </td>
                                <td scope="col" class="px-1 uppercase hover:underline">
                                    <div class="flex items-center">
                                        Options.
                                    </div>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="bg-transparent border-b dark:bg-transparent dark:border-gray-700 font-boldened text-xs md:text-sm uppercase"
                                v-for="(cycleExpense, index) in allCycleExpenses" preserve-scroll>
                                <td class="px-1 text-gray-900 whitespace-nowrap dark:text-white">
                                    {{ index + 1 }}.
                                </td>
                                <td scope="row" class="p-1 uppercase text-gray-900 whitespace-nowrap dark:text-white">
                                    <!-- progress bar  -->
                                    <a class="cursor-pointer">
                                        <span class="hover:underline text-sm md:text-md">
                                            {{ cycleExpense.name }}
                                        </span>
                                    </a>
                                    <!-- end progress bar  -->
                                </td>
                                <td class="p-1 text-blue-600 hidden md:table-cell">
                                    ksh {{ Number(cycleExpense.amount).toLocaleString() }}
                                </td>
                                <td class="p-2">
                                    <div class="inline-flex rounded-md gap-0.5" role="group">
                                        <!-- edit  -->
                                        <button type="button"
                                            class="inline-flex items-center p-0.5 text-2xs font-medium text-cyan-900 bg-transparent rounded-md hover:text-white focus:z-10 focus:ring-1 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:text-cyan-700 dark:hover:text-cyan-400 shadow"
                                            @click="showCycleExpense(cycleExpense)">
                                            <edit-icon class="w-4 h-4"></edit-icon>
                                            <!-- Edit -->
                                        </button>
                                        <!-- delete  -->
                                        <button type="button"
                                            class="inline-flex items-center p-0.5 text-2xs font-medium text-red-900 bg-transparent rounded-md hover:text-white focus:z-10 focus:ring-1 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:text-red-700 dark:hover:text-red-400 shadow"
                                            @click="showDelete(cycleExpense)">
                                            <delete-icon class="w-4 h-4"></delete-icon>
                                            <!-- Delete -->
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <loadingTable v-else></loadingTable>
            </div>
        </div>
    </div>

    <!-- update cycleExpense modal  -->
    <cyclesExpensesupdate :info=classInfo.modalData :names=classInfo.names :show=classInfo.isOpen @reload=getInfo @close=closeCycleExpense @flash = flashShow @hide = flashHide>
    </cyclesExpensesupdate>
    <!-- end update cycleExpense modal  -->

    <!-- delete cycleExpense modal  -->
    <cyclesExpensesdelete :info=classInfo.deleteData :show=classInfo.isDeleteOpen :url=classInfo.deleteURL @reload=getInfo @close=closeDelete @flash = flashShow @hide = flashHide></cyclesExpensesdelete>
    <!-- end delete cycleExpense modal  -->

     <!-- update cycleExpenseName modal  -->
    <cyclesExpensesNamesupdate :info=classInfo.modalData :names=classInfo.names :show=classInfo.isNameOpen @reload=getInfo @close=closeNameExpense @flash = flashShow @hide = flashHide>
    </cyclesExpensesNamesupdate>
    <!-- end update cycleExpenseName modal  -->

    <!-- delete cycleExpenseName modal  -->
    <cyclesExpensesNamesdelete :info=classInfo.deleteData :show=classInfo.isNameDeleteOpen :url=classInfo.deleteNameURL @reload=getInfo @close=closeNameDelete @flash = flashShow @hide = flashHide></cyclesExpensesNamesdelete>
    <!-- end delete cycleExpenseName modal  -->
</template>

<script setup>
    import { useForm } from '@inertiajs/vue3';
    import { defineProps, defineEmits, reactive, computed, onMounted, watch , onUnmounted, ref } from 'vue'

    const props = defineProps({
        cycleexpenses: {
            type: Array,
            required: true,
        },
        cycle: {
            type: Object,
            required: true,
        },
    })

    const emit = defineEmits(['flash', 'hide', 'reload']);

    const type = computed(() => props.cycle);

    watch(type, (newValue) => {
        classInfo.isLoading = true;
        getInfo();
    })

    const screenWidth = ref(window.innerWidth)

    const updateWidth = () => {
        screenWidth.value = window.innerWidth;
    }

    onMounted(() => {
        window.addEventListener('resize', updateWidth);
        classInfo.isLoading = true;
        getInfo()
    })

    onUnmounted(() => {
        window.removeEventListener('resize', updateWidth);
    })

    // Watch screenWidth and update the active tab based on its value
    watch(screenWidth, (newWidth) => {
        if (newWidth > 1024) {
            allSwitch();
        } else {
            tabSwitch();
        }
    })

    const form = useForm({
        name: '',
        amount: '',
        name_id: '',
    })

    const formList = useForm({
        name: '',
    })

    const classInfo = reactive ({
        // search
        search: '',
        // sort 
        ascending: true,
        sortBy: 'id',
        showTypes: false,

        // form-data 
        isOpen: false,
        isNameOpen: false,
        modalData: {},

        alertType: '',
        flashMessage: '',

        // delete info 
        isDeleteOpen: false,
        isNameDeleteOpen: false,
        deleteData: {},
        deleteID: '',
        deleteURL: '/delete/cycleExpense/',
        deleteNameURL: '/delete/cycleExpenseName/',

        // cycleExpenses data 
        info: [],
        names: [],

        // order 
        nameOrder: true,
        amountOrder: false,

        isLoading: true,

        cycleExpensesPage: true,

        cycleExpensesClass: 'bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-md sm:rounded-lg rounded-md border-base border-cyan-300 dark:border-cyan-700 h-fit w-full col-span-1 lg:col-span-2',
        cyclesClass: 'bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-md sm:rounded-lg rounded-md border-base border-blue-300 dark:border-blue-700 h-fit w-full col-span-1 lg:col-span-2',

        // tabs 
        tabActive: 'inline-block p-2 text-blue-600 border-b-base border-blue-600 rounded-t-lg active dark:text-sky-500 dark:border-blue-500 text-2xs md:text-2xs cursor-pointer',
        tabInactive: 'inline-block p-2 border-b-base border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:text-gray-300 dark:hover:text-gray-50 text-2xs md:text-2xs cursor-pointer',
        tab1: '',
        tab2: '',
        tab1show: true,
        tab2show: false,
        tab1Name: 'Monthly Expenses Info',
        tab2Name: 'Enter Monthly Expenses',

        successBadge : 'text-black dark:text-black md:text-xs text-2xs border dark:border-green-900 border-black bg-green-400 rounded-md shadow-md py-0.5 px-1 my-auto',
        infoBadge : 'text-black dark:text-black md:text-xs text-2xs border dark:border-cyan-900 border-black bg-cyan-400 rounded-md shadow-md py-0.5 px-1 my-auto',
        failBadge : 'text-black dark:text-black md:text-xs text-2xs border dark:border-red-900 border-black bg-red-400 rounded-md shadow-md py-0.5 px-1 my-auto',
    })

    // Watch for changes in form.name_id and update form.name accordingly
    watch(() => form.name_id, (newId) => {
        const selectedName = classInfo.names.find(name => name.id === newId);
        form.name = selectedName ? selectedName.name : '';
    })

    const selectedNameId = ref(null);

    const filterByNameId = (name) => {
        selectedNameId.value = name;
        flashShow(`Now Showing ${name} expenses`, 'info');
    };

    const showAll = () => {
        selectedNameId.value = null;
        flashShow(`Now Showing All expenses`, 'success');
    };

    // computed 
    const allCycleExpenses = computed(() => {
        let tempCycleExpenses = classInfo.info

        // Filter by selected name ID if one is set
        if (selectedNameId.value !== null) {
            tempCycleExpenses = tempCycleExpenses.filter(
                (cycleExpense) => cycleExpense.name === selectedNameId.value
            );
        }

        // search rows 
        if (classInfo.search != '' && classInfo.search) {
            tempCycleExpenses = tempCycleExpenses.filter((cycleExpense) => {
                return cycleExpense.name
                    .toUpperCase()
                    .includes(classInfo.search.toUpperCase())
            })
        }

        // Sort CycleExpenses
        tempCycleExpenses = tempCycleExpenses.sort((a, b) => {
            if (classInfo.sortBy == 'id') {
                let fa = a.name.toLowerCase(), fb = b.name.toLowerCase()

                if (fa < fb) {
                    return -1
                }
                if (fa > fb) {
                    return 1
                }
                return 0

            } else if (classInfo.sortBy == 'name') {
                return a.id - b.id
            } else if (classInfo.sortBy == 'amount') {
                return a.amount - b.amount
            }
        })

        // Show sorted array in descending or ascending order
        if (!classInfo.ascending) {
            tempCycleExpenses.reverse()
        }

        return tempCycleExpenses
    })

    function setSearch(i) {
        classInfo.search = i;
    }

    function getInfo() {
        updateWidth();

        if (screenWidth.value >= 1024) {
            allSwitch();
        } else {
            tabSwitch();
        }

        classInfo.info = [];
        let link = '';
        let linkTo = 'id/';

        if (classInfo.nameOrder == true) {
            link = 'desc';
        } else {
            link = 'asc';
        }

        if (route().current() == 'View Cycle Payments') {
            classInfo.cycleExpensesPage = false;
            let url = '/api/getCycleExpenses/' + props.cycle.id

            axios.get(url)
                .then(
                    ({ data }) => {
                        classInfo.info = data[0];
                        classInfo.names = data[1];
                        classInfo.isLoading = false
                    });
        } else {
            let url = '/api/getCycleExpenses/' + props.cycle.id

            axios.get(url)
                .then(
                    ({ data }) => {
                        classInfo.info = data[0];
                        classInfo.isLoading = false
                    });
        }  
    }

    const isSubmitting = ref(false);

    function submit() {
        let name = form.name +' KSH '+ Number(form.amount).toLocaleString();
        // Prevent function from running if already submitting
        if (isSubmitting.value) return;

        LoadingOn();

        isSubmitting.value = true; // Set submitting flag to true

        flashShow('Loading Please Wait..', 'loading');

        axios.post('/cycleExpense/' + props.cycle.id, form)
            .then(({ data }) => {
                classInfo.flashMessage   = 'New Monthly Expense: ' + name + ' Added!';
                classInfo.alertType      = 'success';
                getInfo();
                emit('reload');
                flashShow(classInfo.flashMessage, classInfo.alertType);
                clearFields();
                LoadingOff();
            })
            .catch(error => {
                LoadingOff();
                let time = 5000;
                const message = error.response?.data.message || 'An error occurred';
                const type = 'danger';

                if (error.response?.data.errors) {
                    const errors = error.response.data.errors;

                    // Iterate over the keys of the errors object
                    Object.keys(errors).forEach(key => {
                        errors[key].forEach(errMsg => {
                            time += 1000; // Increase delay
                            emit('flash', errMsg, 'danger'); // Emit flash message
                        });
                    });
                }

                flashShow(message, type);
            })
            .finally(() => {
                isSubmitting.value = false; // Reset the submitting flag after completion
            });
    }

    function submitList() {
        let name = formList.name;
        // Prevent function from running if already submitting
        if (isSubmitting.value) return;

        LoadingOn();

        isSubmitting.value = true; // Set submitting flag to true

        flashShow('Loading Please Wait..', 'loading');

        axios.post('/cycleExpenseName/', formList)
            .then(({ data }) => {
                classInfo.flashMessage   = 'New Expense Type: ' + name + ' Added!';
                classInfo.alertType      = 'success';
                getInfo();
                emit('reload');
                flashShow(classInfo.flashMessage, classInfo.alertType);
                clearFields();
                LoadingOff();
            })
            .catch(error => {
                LoadingOff();
                let time = 5000;
                const message = error.response?.data.message || 'An error occurred';
                const type = 'danger';

                if (error.response?.data.errors) {
                    const errors = error.response.data.errors;

                    // Iterate over the keys of the errors object
                    Object.keys(errors).forEach(key => {
                        errors[key].forEach(errMsg => {
                            time += 1000; // Increase delay
                            emit('flash', errMsg, 'danger'); // Emit flash message
                        });
                    });
                }

                flashShow(message, type);
            })
            .finally(() => {
                isSubmitting.value = false; // Reset the submitting flag after completion
            });
    }

    function LoadingOn() {
        classInfo.ascending = !classInfo.ascending;
        classInfo.isLoading = true 
    }

    function LoadingOff() {
        flashShow(classInfo.flashMessage, classInfo.alertType);
        classInfo.isLoading = false
    }

    // order rows 
    function orderBy(sortBy, ordername) {
        LoadingOn();

        classInfo.sortBy = sortBy;
        classInfo.ordername = ordername;

        classInfo.flashMessage = `Monthly Expenses Sorted By: ${ordername.toLowerCase()} ${classInfo.ascending ? 'ascending' : 'descending'}`;
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

    function orderByAmount() {
        orderBy('amount', 'AMOUNT');
    }

    function clearFields() {
        form.name = '';
        form.amount = '';
        formList.name = '';
    }

    // modals 
    function showCycleExpense(cycleExpense) {
        classInfo.modalData = cycleExpense;
        classInfo.isOpen    = true;
    }

    function closeCycleExpense() {
        classInfo.isOpen    = false;
        classInfo.modalData = {};
    }

    function showDelete(cycleExpense) {
        classInfo.deleteData    = cycleExpense;
        classInfo.deleteID      = cycleExpense.id;
        classInfo.isDeleteOpen  = true;
    }

    function closeDelete() {
        classInfo.isDeleteOpen  = false;
        classInfo.deleteData    = {};
        classInfo.deleteID      = '';
    }

    function showNameExpense(name) {
        classInfo.modalData = name;
        classInfo.isNameOpen    = true;
    }

    function closeNameExpense() {
        classInfo.isNameOpen    = false;
        classInfo.modalData = {};
    }

    function showNameDelete(name) {
        classInfo.deleteData    = name;
        classInfo.deleteID      = name.id;
        classInfo.isNameDeleteOpen  = true;
    }

    function closeNameDelete() {
        classInfo.isNameDeleteOpen  = false;
        classInfo.deleteData    = {};
        classInfo.deleteID      = '';
    }
    // end modals 

    // tabs
    function resetTabClass() {
        classInfo.tab1 = classInfo.tabInactive;
        classInfo.tab2 = classInfo.tabInactive;
    }

    function allSwitch() {
        resetTabClass();
        classInfo.tab1show = true;
        classInfo.tab2show = true;

        classInfo.tab1     = classInfo.tabActive;
        classInfo.tab2     = classInfo.tabActive;
    }
    
    function tabSwitch() {
        resetTabClass();
        classInfo.tab1show = true;
        classInfo.tab2show = false;

        classInfo.tab1     = classInfo.tabActive;
    }

    function tabSwitch2() {
        resetTabClass();
        classInfo.tab1show = false;
        classInfo.tab2show = true;

        classInfo.tab2     = classInfo.tabActive;
    }

    // flash messages 
    function flashShow(message, body) {
        emit('flash', message, body)
    }

    function flashHide() {
        emit('hide')
    }
</script>