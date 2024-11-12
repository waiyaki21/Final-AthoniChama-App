<template>

    <Head>
        <title>{{ $page.props.route }}</title>
    </Head>

    <!-- breadcrumb  -->
    <maincrumbs ref = "mainCrumbsRefs" :items = navItems></maincrumbs>
    <!-- end breadcrumb  -->

    <!-- body section  -->
    <div class="py-2 font-boldened">
        <!-- info options  -->
        <expensesinfo :percent=percent :project=project @reload=setInfo></expensesinfo>
        <!--end info options  -->

        <!-- tabs  -->
        <div class="text-2xs font-boldened text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 w-full mb-2 mx-2 p-2 justify-between uppercase lg:hidden inline-flex">
            <ul class="flex flex-wrap -mb-px">
                <li class="me-2">
                    <a :class="[classInfo.tab1]" @click="tabSwitch()">
                        {{ classInfo.tab1Name }}
                        <span
                            class="bg-blue-100 text-gray-800 md:text-2xs font-normal mx-1 px-1.5 py-0.5 rounded-full dark:bg-cyan-900 dark:text-white border-base border-cyan-900 dark:border-cyan-500">
                            {{ props.expenses.length }}
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

        <hr-line :color="'dark:border-emerald-300 border-emerald-800'"></hr-line>

        <!-- body panel  -->
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-2">

            <!-- expenses table  -->
            <expensestable :expenses=classInfo.info :project=project :reload=classInfo.isreloading @flash=flashShow
                @view=flashShowView @reload=setInfo v-if="classInfo.tab1show"></expensestable>
            <!-- expenses table  -->

            <!-- expenses form  -->
            <section class="col-span-1 lg:col-span-2" v-if="classInfo.tab2show">
                <div
                    class="bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-md sm:rounded-lg border border-cyan-300 dark:border-cyan-700 p-1">
                    <div class="">
                        <h3
                            class="font-boldened text-4xl text-gray-800 dark:text-gray-300 leading-tight uppercase underline py-1">
                            Add Expenses.
                        </h3>
                        <form @submit.prevent="submit" class="p-1">
                            <div>
                                <InputLabel for="name" value="Expense name" />

                                <TextInput id="name" type="name" v-model="form.name" autofocus />

                                <InputError class="mt-2" :message="form.errors.name" />
                            </div>

                            <div>
                                <InputLabel for="amount" value="Expense amount" />

                                <TextInput id="amount" type="number" v-model="form.amount" autofocus />

                                <InputError class="mt-2" :message="form.errors.amount" />
                            </div>

                            <div>
                                <InputLabel for="cycle_id" value="Select Payment Cycle" />

                                <select id="cycle_id" v-model="form.cycle_id" name="cycle_id"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow"
                                    :placeholder="'Select a payment Cycle'" @keydown.enter="submit">
                                    <option v-for="cycle in props.cycles" :value="cycle.id">
                                        {{ cycle.name }}
                                    </option>
                                </select>

                                <InputError class="mt-2" :message="form.errors.cycle_id" />
                            </div>

                            <div class="flex items-center justify-start mt-4">
                                <SubmitButton :disabled="form.processing" :loading="form.processing" :success="form.wasSuccessful" :failed="form.hasErrors" :editting="form.isDirty">
                                    Submit {{ props.project.name }} Expenses
                                </SubmitButton>
                                <!-- <SubmitButton @click="submit" :loading="form.processing" :success="form.wasSuccessful"
                                    :failed="form.hasErrors" :editting="form.isDirty">
                                    Submit Expenses
                                </SubmitButton> -->
                            </div>
                        </form>
                    </div>
                </div>
            </section>
            <!-- expenses form  -->
        </div>
        <!-- end body panel  -->
    </div>
    <!-- end body section  -->

    <!-- flash alert  -->
    <alert :alertshow=alerts.alertShow :message=alerts.flashMessage :class=alerts.alertBody :type=alerts.alertType
        :title=alerts.alertType :time=alerts.alertDuration></alert>

    <alertview :alertshowview=alerts.alertShowView :message=alerts.flashMessage :class=alerts.alertBody
        :link=alerts.linkName :url=alerts.linkUrl :state=alerts.linkState :type=alerts.alertType></alertview>
    <!-- end flash alerts  -->
</template>

<script setup>
    import { useForm, router } from '@inertiajs/vue3';
    import { computed, reactive, onMounted, watch , onUnmounted, ref } from 'vue';

    //moment 
    import moment from 'moment';

    const props = defineProps({
        name: {
            type: String,
            required: true,
        },
        route: {
            type: String,
            required: true,
        },
        project: {
            type: String,
            required: true,
        },
        expenses: {
            type: Array,
            required: true,
        },
        cycles: {
            type: Array,
            required: true,
        },
    });

    const navItems = computed(() => [
        {
            url: '/projects',
            label: 'Projects',
            active: false,
        },
        {
            url: '/project/' + props.project.id ,
            label: `${props.project.name}`,
            active: true,
        },
    ]);

    const form = useForm({
        name: '',
        amount: '',
        cycle_id: ''
    }) 

    const classInfo = reactive ({
        // modal info
        isOpen:                 false,
        isProjectOpen:          false,
        modalData: {},

        // delete info 
        isDeleteOpen: false,
        deleteData: {},
        deleteID: '',

        // expenses 
        info: [],

        // flash 
        isOpenAlert: true,
        flashMessage: '',
        alertBg: 'bg-gray-50 dark:bg-gray-600',

        isreloading: true,

        // tabs 
        tabActive: 'inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-sky-500 dark:border-blue-500 text-xs md:text-sm cursor-pointer',
        tabInactive: 'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:text-gray-300 dark:hover:text-gray-50 text-xs md:text-sm cursor-pointer',
        tab1: '',
        tab2: '',
        tab1show: true,
        tab2show: false,
        tab1Name: 'Expenses Info',
        tab2Name: 'Enter Expenses',
    })

    // alerts classes 
    const alerts = reactive({
        // alerts
        alertShow: false,
        alertShowView: false,
        alertDuration: 15000,
        alertType: '',
        flashMessage: '',
        alertBody: 'border-b-[5px] border-gray-500 shadow-gray-900 dark:shadow-gray-900 bg-gray-100 dark:bg-gray-500',
        alertSuccess: 'border-b-[5px] border-emerald-800 dark:border-emerald-800 shadow-green-900 dark:shadow-green-900 bg-green-100 dark:bg-green-500',
        alertInfo: 'border-b-[5px] border-blue-800 dark:border-blue-800 shadow-blue-900 dark:shadow-blue-900 bg-blue-100 dark:bg-blue-500',
        alertWarning: 'border-b-[5px] border-orange-800 dark:border-orange-800 shadow-orange-900 dark:shadow-orange-900 bg-orange-100 dark:bg-orange-500',
        alertDanger: 'border-b-[5px] border-red-800 dark:border-red-800 shadow-red-900 dark:shadow-red-900 bg-red-100 dark:bg-red-500',
        linkName: '',
        linkUrl: '',
        linkState: false,
    })

    const screenWidth = ref(window.innerWidth)

    const updateWidth = () => {
        screenWidth.value = window.innerWidth;
    }

    onMounted(() => {
        window.addEventListener('resize', updateWidth);
        classInfo.isLoading = true;
        setInfo()
        // getInfo()
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

    const reset = computed(() => form.amount);

    watch(reset, (newValue) => {
        checkPayment(form.amount);
    })

    const percent = computed(() => {
        if (props.project.total_expenses == 0) {
            return 0;
        } else {
            // return Number((props.project.total_expenses) / props.project.target * 100).toFixed(2);
            return Math.floor((props.project.total_expenses) / props.project.target * 100);
        }
    })

    function setInfo() {
        updateWidth();

        classInfo.info = props.project.expenses;

        if (screenWidth.value >= 1024) {
            allSwitch();
        } else {
            tabSwitch();
        }
    }

    function closeExpense() {
        classInfo.isOpen = false;
        clearFields();
        classInfo.modalData          = {};
    }

    function clearFields() {
        form.name          = '';
        form.amount        = '';
        form.cycle_id        = '';
    }

    function submit() {
        let url = '/expense/' + props.project.id;
        
        form.post(url, {
            onFinish: () => form.reset(['name', 'amount', 'cycle_id']),
            
            onSuccess: () => [
                clearFields(),
                alerts.flashMessage = 'Expense entered Successfully!',
                alerts.alertType    = 'success',
                flashShow(alerts.flashMessage, alerts.alertType),
                classInfo.isreloading = !classInfo.isreloading
            ]
        });
    }

    function showDelete(expense) {
        classInfo.deleteData     = expense;
        classInfo.deleteID       = expense.id;
        classInfo.isDeleteOpen   = true;
    }

    function closeDelete() {
        classInfo.isDeleteOpen   = false;
        classInfo.deleteData     = {};
        classInfo.deleteID       = '';
    }

    function deleteProject() {
        let url = '/delete/project/' + classInfo.deleteID;
        router.delete(url, {
            method: 'delete',
        })
        closeDelete();
    }

    function checkPayment (a) {
        // console.log(a);
        let balance = props.project.target - props.project.total_expenses;

        if (a > balance) {
            let diff                 = a - balance;

            alerts.flashMessage  = 'Amount Entered is larger than the Project Balance by ' + diff;
            alerts.alertType     = 'warning';
            alerts.alertBody     = alerts.alertWarning; 
            alerts.alertShow     = !alerts.alertShow;
        } else {
            if (a == balance) {
                alerts.flashMessage  = 'Amount Entered is equal to the Project Balance';
                alerts.alertType     = 'info';
                alerts.alertBody     = alerts.alertInfo; 
                alerts.alertShow     = !alerts.alertShow;
            }
        } 
    }

    function flashShow(message, body) {
        alerts.flashMessage = message;
        alerts.alertType = body;

        if (body == 'success') {
            alerts.alertBody = alerts.alertSuccess;
        }
        if (body == 'info') {
            alerts.alertBody = alerts.alertInfo;
        }
        if (body == 'warning') {
            alerts.alertBody = alerts.alertWarning;
        }
        if (body == 'danger') {
            alerts.alertBody = alerts.alertDanger;
        }

        alerts.alertShow = !alerts.alertShow;
    }

    function flashShowView(message, body, cycle) {
        alerts.flashMessage   = message;
        alerts.alertType      = body;

        alerts.linkName       = cycle.name +' Download Excelsheet';
        alerts.linkUrl        = '/download/current/' + cycle.id
        alerts.linkState      = true;

        if (body == 'success') {
            alerts.alertBody = alerts.alertSuccess; 
        } 
        if(body == 'info') {
            alerts.alertBody = alerts.alertInfo;
        } 
        if(body == 'warning') {
            alerts.alertBody = alerts.alertWarning;
        } 
        if(body == 'danger') {
            alerts.alertBody = alerts.alertDanger; 
        }

        alerts.alertShowView  = !alerts.alertShowView;
    }

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
</script>