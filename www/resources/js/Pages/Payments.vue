<template>

    <Head>
        <title>{{ props.route }}</title>
    </Head>
 
    <!-- breadcrumb  -->
    <maincrumbs ref = "mainCrumbsRefs" :items = navItems></maincrumbs>
    <!-- end breadcrumb  -->

    <!-- body section  -->
    <div class="py-2 font-boldened">
        <!-- info panel  -->
        <paymentinfo :cycle=classInfo.cycleInfo :state=props.state :percent=classInfo.cycleInfo.percent @editCycle=showCycle @deleteCycle=showCycleDelete @view=flashShowView :border=classInfo.progressMainBorder
            :class=classInfo.progressMainClass></paymentinfo>

        <!-- panel, table and form  -->
        <section class="w-full justify-between grid grid-cols-1 lg:grid-cols-5">
            <!-- info panel  -->
            <paymentSide :cycle=classInfo.cycleInfo></paymentSide>

            <!-- body panel  -->
            <div class="py-2 pr-1 col-span-4 flex-row justify-between space-x-2">
                <!-- cycle tabs  -->
                <div
                    class="inline-flex flex-wrap text-sm md:text-[0.9rem] font-boldened text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 w-full m-2 p-2 justify-between uppercase">
                    <ul class="flex flex-row -mb-px overflow-x-scroll py-1">
                        <li class="me-2">
                            <a :class="[classInfo.tab1]" @click="tabSwitch()">
                                {{ classInfo.tab1Name }}
                                <span
                                    :class="classInfo.cycleInfo.payments_count ? classInfo.badge1Class : classInfo.badgeDangerClass">
                                    {{ classInfo.cycleInfo.payments_count }}
                                </span>
                            </a>
                        </li>

                        <li class="me-2">
                            <a :class="[classInfo.tab3]" @click="tabSwitch3()">
                                {{ classInfo.tab3Name }}
                                <span
                                    :class="classInfo.cycleInfo.welfares_count ? classInfo.badge3Class : classInfo.badgeDangerClass">
                                    {{ classInfo.cycleInfo.welfares_count }}
                                </span>
                            </a>
                        </li>

                        <li class="me-2">
                            <a :class="[classInfo.tab4]" @click="tabSwitch4()">
                                {{ classInfo.tab4Name }}
                                <span
                                    :class="classInfo.cycleInfo.projects_count ? classInfo.badge4Class : classInfo.badgeDangerClass">
                                    {{ classInfo.cycleInfo.projects_count }}
                                </span>
                            </a>
                        </li>

                        <li class="me-2">
                            <a :class="[classInfo.tab5]" @click="tabSwitch5()">
                                {{ classInfo.tab5Name }}
                                <span
                                    :class="classInfo.cycleInfo.cycle_expenses_count ? classInfo.badge5Class : classInfo.badgeDangerClass">
                                    {{ classInfo.cycleInfo.cycle_expenses_count }}
                                </span>
                            </a>
                        </li>

                        <li class="me-2">
                            <a :class="[classInfo.tab2]" @click="tabSwitch2()">
                                Upload Info
                                <span
                                    :class="classInfo.unpaidMembers.length > 0 ? classInfo.badgeDangerClass : classInfo.badgeAmberClass">
                                    {{ classInfo.unpaidMembers.length }}
                                </span>
                            </a>
                        </li>

                        <li class="me-2">
                            <StyleButton :class="'py-1 h-fit my-auto rounded-lg hover:shadow-xl'"
                                :buttonClass="'info'"
                                @handleClick="() => { $downloadFile('/download/template/' + cycle.id); tabswitch2(); }"
                                :tooltipText="`Download ${cycle.name} Monthly Template`"
                                :buttonText="`Download ${cycle.name} Template.`">
                                <downtray-icon :class="['w-5 h-5 flex-shrink-0']"></downtray-icon>
                            </StyleButton>
                        </li>
                    </ul>
                </div>
                <!-- end cycle tabs  -->

                <!-- payments table  -->
                <div :class="['bg-cyan-50 dark:bg-gray-900 overflow-hidden shadow-md sm:rounded-lg rounded-md w-full', classInfo.borderClass]"
                    v-if="classInfo.tab1show">
                    <div class="p-2 w-full">
                        <!-- payments table  -->
                        <paymentstable :ref="paymentsRefs" :cycle=classInfo.cycleInfo @flash=flashShow
                            @switch2=tabSwitch2 @progress=progressMain></paymentstable>
                        <!--end payments table  -->
                    </div>
                </div>
                <!-- payments table  -->

                <!-- payments & welfare form  -->
                <section class="w-full overflow-hidden font-boldened flex-row" v-if="classInfo.tab2show">
                    <h3 class="font-boldened p-2">
                        <span :class="[classInfo.mainHeader, 'w-full inline-flex justify-between']">
                            <span class="underline">Add Cycle Payments</span>
                        </span>
                    </h3>
                    <section class="w-full justify-between grid grid-cols-1 md:grid-cols-2">
                        <div
                            :class="['p-2 m-2 rounded-lg bg-cyan-50 dark:bg-gray-900 overflow-hidden shadow-md sm:rounded-lg h-fit', classInfo.borderClass]">
                            <!-- upload sheet  -->
                                <maincycle-form  @loading=flashLoading @flash=flashShow @hide=flashHide @timed=flashTimed   @view=flashShowView @reload=reloadInfo></maincycle-form>
                        </div>
                        <!-- end upload sheet  -->
                        <!-- forms  -->
                        <div
                            :class="['p-2 m-2 rounded-lg bg-cyan-50 dark:bg-gray-900 overflow-hidden shadow-md sm:rounded-lg h-fit', classInfo.borderClass]">
                            <h3 :class="[classInfo.mainHeader,'underline']">
                                Enter Member Payments.
                            </h3>
                            <span
                                class="w-full inline-flex justify-between text-xs uppercase text-gray-300 dark:text-gray-300 mb-1 opacity-50">
                                Remaining Members:
                                <span class="underline text-rose-500">{{ classInfo.unpaidMembers.length }}
                                    Members</span>
                            </span>
                            <form @submit.prevent="submit" class="p-1">
                                <div>
                                    <InputLabel for="member_id" value="Member Name" />

                                    <select id="member_id" v-model="form.member_id" name="member_id"
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            required @change="getname(form.member_id)">
                                        <option v-if="props.cycle.percent == 100">All members entered</option>
                                        <option v-else disabled>Select a member</option>
                                        <option v-for="(member, index) in classInfo.unpaidMembers" :key="member.id" :value="member.id">
                                            {{ member.name }}
                                        </option>
                                    </select>

                                    <InputError class="mt-2" :message="form.errors.member_id" />
                                </div>

                                <div>
                                    <InputLabel for="payment" value="payment" />

                                    <TextInput id="payment" type="number" v-model="form.payment" required autofocus />

                                    <InputError class="mt-2" :message="form.errors.payment" />
                                </div>

                                <div>
                                    <InputLabel for="welfare" value="welfare in" />

                                    <TextInput id="welfare" type="number" v-model="form.welfare" required autofocus />

                                    <InputError class="mt-2" :message="form.errors.welfare" />
                                </div>

                                <div>
                                    <InputLabel for="welfare_owed" value="welfare owed" />

                                    <TextInput id="welfare_owed" type="number" v-model="form.welfare_owed" required
                                        autofocus />

                                    <InputError class="mt-2" :message="form.errors.welfare_owed" />
                                </div>

                                <div class="flex items-center justify-start mt-4">
                                    <button
                                        class="text-white bg-gradient-to-br from-rose-600 to-red-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-rose-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-4 py-2.5 text-center mr-2 mb-2 uppercase inline-flex justify-between cursor-not-allowed"
                                        @click="submitAnyway" v-if="classInfo.unpaidMembers.length == 0">
                                        Cycle Payment Complete
                                    </button>
                                    <button
                                        class="text-white bg-gradient-to-br from-cyan-600 to-green-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-4 py-2.5 text-center mr-2 mb-2 uppercase inline-flex justify-between w-full"
                                        @click="submit" v-else>
                                        Submit {{ props.cycle.name }} Payment
                                        <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                            class="w-6 h-6" v-if="!form.processing">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                        </svg>

                                        <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                            class="w-6 h-6 animate-spin" v-else>
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                        </svg>
                                    </button>
                                    <SubmitButton @click="submit" :disabled="form.processing" :loading="form.processing" :success="form.wasSuccessful" :failed="form.hasErrors" :editting="form.isDirty" v-else>
                                        Submit {{ props.cycle.name }} Payment
                                    </SubmitButton>
                                </div>
                            </form>
                        </div>
                        <!-- end forms  -->
                    </section>
                </section>
                <!-- payments & welfare form  -->

                <!-- welfares table  -->
                <div :class="['bg-cyan-50 dark:bg-gray-900 overflow-hidden shadow-md sm:rounded-lg rounded-md w-full', classInfo.borderClass]"
                    v-if="classInfo.tab3show">
                    <div class="p-2 w-full">
                        <!-- welfares table  -->
                        <welfarestable :ref="welfaresRefs" :cycle=classInfo.cycleInfo @flash=flashShow
                            @switch=tabSwitch2 @progress=progressMain></welfarestable>
                        <!--end welfares table  -->
                    </div>
                </div>
                <!-- welfares table  -->

                <!-- projects table  -->
                <div :class="['bg-transparent dark:bg-transparent overflow-hidden w-full']"
                    v-if="classInfo.tab4show">
                    <div class="w-full">
                        <!-- projects table  -->
                        <projecttable :ref="projectsRefs" :cycle=classInfo.cycleInfo @flash=flashShow @hide=flashHide @reload=reloadInfo></projecttable>
                        <!--end projects table  -->
                    </div>
                </div>
                <!-- projects table  -->

                <!-- cycle expenses table  -->
                <div :class="['bg-transparent dark:bg-transparent overflow-hidden w-full']"
                    v-if="classInfo.tab5show">
                    <div class="w-full">
                        <!-- cycle expenses table  -->
                        <cycleExpensestable :ref="CycleExpensesRefs" :cycleexpenses=classInfo.cycleExpenses :cycle=classInfo.cycleInfo @flash=flashShow @hide=flashHide @reload=reloadInfo></cycleExpensestable>
                        <!--end cycle expenses table  -->
                    </div>
                </div>
                <!-- cycle expenses table  -->
            </div>
            <!-- end body panel  -->
        </section>
        <!-- end panel, table and form  -->
    </div>
    <!-- end body section  -->

    <!-- update cycle modal  -->
    <cyclesupdate :info=classInfo.modalData :show=classInfo.isCycleOpen @reload=reloadInfo @close=closeCycle @flash = flashShow>
    </cyclesupdate>
    <!-- end update cycle modal  -->

    <!-- delete cycle modal  -->
    <cyclesdelete :info=classInfo.deleteData :show=classInfo.isDeleteCycleOpen @reload=reloadInfo @close=closeCycleDelete @flash = flashShow>
    </cyclesdelete>
    <!-- end delete cycle modal  -->

    <!-- toast notification  -->
    <toast ref="toastNotificationRef"></toast>
</template>

<script setup>
    import { useForm } from '@inertiajs/vue3';
    import { defineProps, reactive, onBeforeMount, computed, ref, nextTick, watch } from 'vue'


    const props = defineProps({
        name: {
            type: String,
            required: true,
        },
        route: {
            type: String,
            required: true,
        },
        cycle: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        unpaid: {
            type: Array,
            required: true,
        },
        unpaidWel: {
            type: Array,
            required: true,
        },
        unpaidActive: {
            type: String,
            required: true,
        },
        unpaidActiveWels: {
            type: String,
            required: true,
        },
    });

    const navItems = computed(() => [
        {
            url: '/cycles',
            label: 'Payment Cycles',
            active: false,
        },
        {
            url: '/cycle/' + props.cycle.id ,
            label: `${props.cycle.name}`,
            active: true,
        },
    ]);

    const form = useForm({
        name: '',
        member_id: '',
        cycle_id: '',
        payment: '',
        welfare: '',
        welfare_owed: '',
    })

    const classInfo = reactive ({
        isOpen: false,
        isCycleOpen: false,
        isWelfareOpen: false,
    
        modalData: {},
        modalName: '',

        cycleInfo: {},

        // delete info 
        isDeleteOpen: false,
        isDeleteCycleOpen: false,
        isDeleteWelfareOpen: false,
        deleteData: {},
        deleteID: '',

        info: [],
        welfareinfo: [],
        unpaidMembers:[],
        unpaidMembersWels: [],
        unpaidActive:[],
        unpaidActiveWels: [],
        cycleExpenses: [],
        state: '',
        excel_file: '',
        fileSelected: '',

        // main progress bar 
        progressMainBorder: 'border border-cyan-500 p-1 overflow-hidden',
        progressMainClass: 'alerts flex h-6 items-center justify-center rounded-l-full bg-gradient-to-r from-gray-200 via-cyan-400 to-blue-500 text-sm leading-none',
        infoSection: 'm-2 p-2 text-left mx-auto rounded-xl border-2 shadow-md border-2 border-cyan-500 p-1 overflow-hidden bg-cyan-400/10 dark:bg-cyan-400/10',
        infoHeader: 'text-cyan-300 mb-2 text-xl text-left font-normal underline tracking-tight uppercase',
        sectionBorder: 'w-full flex-col justify-between m-1 p-1 text-left',
        borderClass: 'border-base border-cyan-300 dark:border-cyan-700',
        mainHeader: 'font-boldened md:text-2xl text-xl text-gray-800 dark:text-gray-300 leading-tight uppercase py-1',
        badgeClass: 'bg-blue-100 text-gray-800 text-2xs font-normal mx-0.5 px-1 py-0.5 rounded-full dark:bg-cyan-900 dark:text-gray-300 border-base border-cyan-900 dark:border-cyan-500',
        badgeDangerClass: 'bg-red-100 text-gray-800 text-2xs font-normal mx-0.5 px-1 py-0.5 rounded-full dark:bg-red-900 dark:text-gray-300 border-base border-red-900 dark:border-red-500',
        badgeAmberClass: 'bg-amber-100 text-gray-800 text-2xs font-normal mx-0.5 px-1 py-0.5 rounded-full dark:bg-amber-900 dark:text-gray-300 border-base border-amber-900 dark:border-amber-500',
        badgeSuccessClass: 'bg-emerald-100 text-gray-800 text-2xs font-normal mx-0.5 px-1 py-0.5 rounded-full dark:bg-emerald-900 dark:text-gray-300 border-base border-emerald-900 dark:border-emerald-500',
        badge1Class: '',
        badge2Class: '',
        badge3Class: '',
        badge4Class: '',
        badge5Class: '',

        // tabs 
        tabActive: 'inline-block p-1 pb-2 text-emerald-600 border-b-base border-emerald-600 rounded-t-lg active text-emerald-500 dark:text-emerald-500 dark:border-emerald-500 text-sm md:text-[15px] cursor-pointer whitespace-nowrap',
        tabInactive: 'inline-block p-1 pb-2 border-b-base border-transparent rounded-t-lg text-gray-500 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-sm md:text-[15px] cursor-pointer whitespace-nowrap',
        tabAmber: 'inline-block p-1 pb-2 border-b-base border-transparent rounded-t-lg text-amber-500 hover:text-amber-600 hover:border-amber-300 dark:hover:text-amber-300 text-sm md:text-[15px] cursor-pointer whitespace-nowrap',
        tab1: '',
        tab2: '',
        tab3: '',
        tab4: '',
        tab5: '',
        tab1show: true,
        tab2show: false,
        tab3show: false,
        tab4show: false,
        tab5show: false,
        tab1Name: 'Payments Info',
        tab3Name: 'Welfares Info',
        tab4Name: 'Projects Info',
        tab5Name: 'Monthly Expenses Info',

        templateBtn: '',
        templateInactive: 'text-white bg-gradient-to-r from-rose-500 to-red-500 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-rose-300 dark:focus:ring-rose-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 inline-flex justify-between cursor-not-allowed w-full uppercase',
        templateActive: 'text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 inline-flex justify-between w-full uppercase',
        labelClass: 'flex flex-col items-center justify-center w-full h-[13.5rem] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600',

        clicked: false,

        // welfare state
        welfareAllClass: true,
        welfareInClass: true,
        welfareOwedClass: false,

        file_size: '',
        file_name: '',
        upload_info: '',

        isWelfareOpen: false,
        isLoading: false
    })

    watch(
        () => classInfo.unpaidMembers,
            (newMembers) => {
                if (newMembers.length > 0 && !form.member_id) {
                    form.member_id = newMembers[0].id; // Set the first member's ID as the default selected
                }
            },
        { immediate: true } // Trigger the watch immediately on component mount
    );

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
        alertWarning: 'border-b-[5px] border-amber-500 dark:border-amber-500 shadow-amber-500 dark:shadow-amber-500 bg-amber-500 dark:bg-amber-500',
        alertDanger: 'border-b-[5px] border-red-800 dark:border-red-800 shadow-red-900 dark:shadow-red-900 bg-red-100 dark:bg-red-500',
        linkName: '',
        linkUrl: '',
        linkState: false,
    })

    onBeforeMount(() => [
        getInfo()
    ])

    function setInfo() {
        classInfo.cycleInfo          = props.cycle;
        classInfo.unpaidMembers      = props.unpaid;
        classInfo.unpaidMembersWels  = props.unpaidWel;
        classInfo.state              = props.state;
        classInfo.unpaidActive       = props.unpaidActive;
        classInfo.unpaidActiveWels   = props.unpaidActiveWels;

        tabSwitch();
    }

    function getInfo() {
        axios.get('/api/getCycle/'+ props.cycle.id)
            .then(
                ({ data }) => {
                    classInfo.cycleInfo             = data[0]; 
                    classInfo.unpaidMembers         = data[3];
                    classInfo.unpaidMembersWels     = data[4];
                    classInfo.state                 = data[5];
                    classInfo.unpaidActive          = data[6];
                    classInfo.unpaidActiveWels      = data[7];
                    classInfo.cycleExpenses         = data[8];
                    tabSwitch();
                });
    }

    function reloadInfo() {
        axios.get('/api/getCycle/'+ props.cycle.id)
            .then(
                ({ data }) => {
                    classInfo.cycleInfo             = data[0]; 
                    classInfo.unpaidMembers         = data[3];
                    classInfo.unpaidMembersWels     = data[4];
                    classInfo.state                 = data[5];
                    classInfo.unpaidActive          = data[6];
                    classInfo.unpaidActiveWels      = data[7];
                    classInfo.cycleExpenses         = data[8];
                });
    }

    // tabs methods
    function tabSwitch() {
        resetTabClass();
        classInfo.tab1show = true;

        classInfo.tab1     = classInfo.tabActive;
        classInfo.badge1Class = classInfo.badgeSuccessClass;
    }

    function tabSwitch2() {
        resetTabClass();
        setFields();
        classInfo.tab2show = true;

        classInfo.tab2    = classInfo.tabActive;
        classInfo.badge2Class = classInfo.badgeAmber;
    }

    function tabSwitch3() {
        resetTabClass();
        classInfo.tab3show = true;

        classInfo.tab3    = classInfo.tabActive;
        classInfo.badge3Class = classInfo.badgeSuccessClass;
    }

    function tabSwitch4() {
        resetTabClass();
        classInfo.tab4show = true;

        classInfo.tab4    = classInfo.tabActive;
        classInfo.badge4Class = classInfo.badgeSuccessClass;
    }

    function tabSwitch5() {
        resetTabClass();
        classInfo.tab5show = true;

        classInfo.tab5    = classInfo.tabActive;
        classInfo.badge5Class = classInfo.badgeSuccessClass;
    }

    function resetTabClass() {
        classInfo.tab1show = false;
        classInfo.tab2show = false;
        classInfo.tab3show = false;
        classInfo.tab4show = false;
        classInfo.tab5show = false;

        classInfo.tab1 = classInfo.tabInactive;
        classInfo.tab2 = classInfo.tabAmber;
        classInfo.tab3 = classInfo.tabInactive;
        classInfo.tab4 = classInfo.tabInactive;
        classInfo.tab5 = classInfo.tabInactive;

        classInfo.badge1Class = classInfo.badgeClass;
        classInfo.badge2Class = classInfo.badgeClass;
        classInfo.badge3Class = classInfo.badgeClass;
        classInfo.badge4Class = classInfo.badgeClass;
        classInfo.badge5Class = classInfo.badgeClass;
    }
    // end tabs methods 
    function getname(id) {
        // Find the member with the matching id from classInfo.unpaidMembers
        const member = classInfo.unpaidMembers.find(member => member.id === id);

        // If a member with the given id is found, set form.name to member.name
        if (member) {
            form.name = member.name;
        } else {
            console.log(`Member with id ${id} not found`);
        }

        // Log the member or error for debugging
        console.log(member); 
    }

    function setFields() {
        form.name           = '';
        form.member_id      = '';
        form.cycle_id       = props.cycle.id;
        form.payment        = props.cycle.amount;
        form.welfare        = props.cycle.welfare_amnt;
        form.welfare_owed   = '0';
    }

    function submit() {
        let amount  = form.payment;
        let welfare = form.welfare;
        let nameMember    = form.name;

        let url = '/payment/' + props.cycle.id;
        form.post(url, {
            onSuccess: () => [
                // flashMessage 
                alerts.flashMessage   = nameMember + ' ksh' + amount + ' & Welfare ksh '+ welfare +' Added!',
                alerts.alertType      = 'success',
                flashShow(alerts.flashMessage, alerts.alertType),

                getInfo(),
                console.log(2, form.name)
                
            ],

            onFinish: () => [
                console.log(1, form.name),
                
                setFields()
            ],
        });
    }

    function submitAnyway() {
        if (confirm("Everyone has already contributed for this cycle and we are at 100%, do you wish to continue with this action") == true) {
            submit();
        }
    }

    function submitSheetAnyway() {
        if (confirm("Everyone has already contributed for this cycle and we are at 100%, do you wish to continue with this action") == true) {
            submit();
        }
    }

    function submitTemplateAnyway() {
        confirm("A template cant be created as Everyone has already contributed for this cycle and we are at 100%");
    }

    function showCycleDelete(cycle) {
        classInfo.deleteData = cycle;
        classInfo.deleteID = cycle.id;
        classInfo.isDeleteCycleOpen = true;
    }

    function closeCycleDelete() {
        classInfo.isDeleteCycleOpen = false;
        classInfo.deleteData = {};
        classInfo.deleteID = '';
    }

    function handleclick() {
        if (!classInfo.clicked) {
            console.log("click");
            classInfo.clicked = true;
        }
    }

    // on file change 
    function onChangeFile(event) {
        classInfo.fileSelected   = event.target.files.length;
        classInfo.excel_file     = event.target.files[0];
        console.log('Uploaded sheet', classInfo.excel_file, classInfo.fileSelected);

        classInfo.file_name      = event.target.files[0].name;
        classInfo.file_size      = Number(event.target.files[0].size/ (1024 * 1024)).toFixed(2);
        classInfo.upload_info    = 'File Name ' + classInfo.file_name + ' ' + classInfo.file_size + ' MBs';
    }

    function clearFile() {
        classInfo.fileSelected   = '';
        classInfo.excel_file     = '';
        classInfo.file_name      = '';
        classInfo.file_size      = '';
        classInfo.upload_info    = '';
    }

    // submit product Sheet
    function submitSheet() {
        classInfo.isLoading = true;
        // flashMessage 
        alerts.flashMessage   = 'Loading! Please Wait';
        alerts.alertType      = 'info';
        flashShow(alerts.flashMessage, alerts.alertType);

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }

        let file = classInfo.excel_file;

        // get file name
        let fileName = file.name;
        let fileData = file;
        let data = new FormData();
        data
            .append('excel', fileData);
        axios
            .post('/cycle/excel/add/' + props.cycle.id, data, config)
            .then(
                ({ data }) => {
                    clearFile();
                    alerts.flashMessage = fileName + ' Upload Successful!';
                    alerts.alertType    = 'success';
                    flashShow(alerts.flashMessage, alerts.alertType);
                    classInfo.isLoading = false;
                    getInfo();
                });
    }

    // cycle modal 
    function showCycle(cycle) {
        classInfo.modalData = cycle;
        classInfo.isCycleOpen = true;
    }

    function closeCycle() {
        classInfo.isCycleOpen        = false;
        classInfo.modalData          = {};
    }

    // Reference for toast notification
    const toastNotificationRef = ref(null);

    // Flash message function
    const flashShow = (info, type) => {
        flashHide();
        nextTick(() => {
            if (toastNotificationRef.value) {
                toastNotificationRef.value.toastOn([info, type]);
            }
        })
    }

    const flashLoading = (info) => {
        flashTimed(info, 'loading', 9999999)
    }

    // Method to trigger a timed flash message
    const flashTimed = (message, type, duration) => {
        if (toastNotificationRef.value) {
            toastNotificationRef.value.toastOnTime([message, type, duration]);
        }
    }

    const flashShowView = (message, body, header, url, button, duration, linkState) => {
        if (toastNotificationRef.value) {
            toastNotificationRef.value.toastClick([message, body, header, url, button, duration, linkState]);
        }
    }

    // Method to hide the loading flash message after a delay
    const flashHide = () => {
        if (toastNotificationRef.value) {
            toastNotificationRef.value.loadHide();
        }
    }

    // Method to hide all messages after a delay
    const flashAllHide = () => {
        if (toastNotificationRef.value) {
            toastNotificationRef.value.allHide();
        }
    }
</script>