<template>
    <!-- cycles form  -->
    <form @submit.prevent="submit">

        <div class="items-center justify-center w-full grid grid-cols-1 lg:grid-cols-4 gap-2">
            <section class="col-span-1 lg:col-span-4 mt-2">
                <div>
                    <InputLabel for="name" value="name" />

                    <TextInput id="name" type="name" v-model="form.name" required autofocus
                        v-if="form.errors.name != null" />

                    <TextInput id="name" type="name" v-model="form.name" required autofocus disabled="true" class="hover:cursor-not-allowed opacity-50 uppercase" v-else />

                    <InputError class="mt-2" :message="form.errors.name" />

                    <LabelHelper for="name" value="Automatically Set" v-if="form.errors.name == null" />
                </div>
            </section>
            <section class="col-span-1 lg:col-span-2">
                <InputLabel for="month" value="Cycle Month" class="w-full" />

                <div class="inline-flex items-center justify-center w-full space-x-2">
                    <select id="month" v-model="form.month" name="month"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full uppercase shadow-md"
                        @click="checkExist()">
                        <option :value="moment().startOf('month').format('MMMM')" selected>{{
                            moment().startOf('month').format('MMMM') }}</option>
                        <option :value="month.toUpperCase()" v-for="month in months">{{ month.toUpperCase() }}</option>
                    </select>
                </div>
            </section>
            <section class="col-span-1 lg:col-span-2">
                <InputLabel for="year" value="Cycle year" class="w-full" />

                <select id="year" v-model="form.year" name="year"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full shadow-md"
                    @click="checkExist()">
                    <option :value="moment().year()" selected>{{ moment().year() }}</option>
                    <option :value="moment().year() + 1">{{ moment().year() + 1 }}</option>
                    <option :value="moment().year() + 2">{{ moment().year() + 2 }}</option>
                    <option :value="moment().year() + 3">{{ moment().year() + 3 }}</option>
                </select>
            </section>
            <section class="col-span-1 lg:col-span-4 mt-2">
                <div>
                    <InputLabel for="date" value="date" />

                    <TextInput id="date" type="date" v-model="form.date" required autofocus />

                    <InputError class="mt-2" :message="form.errors.date" />
                </div>
            </section>
            <section class="col-span-1 lg:col-span-4 mt-2">
                <div>
                    <InputLabel for="amount" value="Contribution Amount" />

                    <TextInput id="amount" type="number" v-model="form.amount" autofocus />

                    <InputError class="mt-2" :message="form.errors.amount" />
                </div>
            </section>
            <section class="col-span-1 lg:col-span-4 mt-2">
                <div>
                    <InputLabel for="welfare_amnt" value="Welfare Amount" />

                    <TextInput id="welfare_amnt" type="number" v-model="form.welfare_amnt" autofocus />

                    <InputError class="mt-2" :message="form.errors.welfare_amnt" />
                </div>
            </section>
        </div>

        <div class="flex items-center justify-start mt-4">
            <SubmitButton :disabled="form.processing" :loading="form.processing" :success="form.wasSuccessful"
                :failed="form.hasErrors" :editting="form.isDirty">
                Submit Cycle
            </SubmitButton>
        </div>
    </form>

    <hr-line :color="'border-emerald-500 dark:border-emerald-500'"></hr-line>
</template>

<script setup>
    import { useForm } from '@inertiajs/vue3';

    //moment 
    import moment from 'moment';

    import { defineProps, reactive, computed, onBeforeMount, defineEmits } from 'vue';

    const emit = defineEmits(['reload', 'loading', 'view', 'flash', 'timed', 'hide'])
    
    const props = defineProps({
        settings: {
            type: Object,
            required: true,
        },
    })

    const months = computed(() => {
        // Get the current month using moment
        const currentMonthIndex = moment().month(); // Month is 0-indexed in moment (0 = January)
        
        // Array to hold the list of months starting from the current one
        const monthsArray = [];

        // Loop through 12 months starting from the current month
        for (let i = 0; i < 12; i++) {
            // Use moment's month manipulation to get the correct month name
            monthsArray.push(moment().month(currentMonthIndex + i).format('MMMM'));
        }

        return monthsArray;
    });

    const getName = computed(() => {
        let month = form.month;
        let year  = form.year;

        let name  = month +' '+ year;

        return name;
    })

    const downloadState = computed(() => {
        if (classInfo.month != '' && classInfo.year != '') {
            classInfo.submitBtn = classInfo.templateActive;
            return classInfo.submitBtn;
        } else {
            classInfo.submitBtn = classInfo.templateInactive;
            return classInfo.submitBtn;
        }
    })

    const form = useForm({
        name: '',
        date: '',
        month: '',
        year: '',
        amount: '',
        welfare_amnt: ''
    })

    const classInfo = reactive({
        isLoading: false,
        info: [],

        infoSection: 'w-full m-2 p-2 text-left mx-auto rounded-xl border-2 shadow-md border border-cyan-500 p-1 overflow-hidden bg-cyan-400/10 dark:bg-cyan-400/10',
        infoHeader: 'text-cyan-300 mb-2 text-2xl text-left font-normal underline tracking-tight uppercase',
        borderClass: 'overflow-hidden font-boldened flex-col  space-y-1 justify-between p-2 lg:m-2 sm:m-0.5 sm:my-1 rounded-lg bg-gray-300 dark:bg-gray-800/50 shadow-md sm:rounded-lg border-[3px] border-cyan-300 dark:border-cyan-700',
        mainHeader: 'font-boldened text-gray-800 dark:text-gray-300 leading-tight uppercase underline py-1 lg:text-3xl text-xl',

        year: moment().year(),
        monthTrue: false,
        yearTrue: true,
        
        // template btns 
        submitBtn: '',
        templateInactive: 'text-white bg-gradient-to-r from-rose-500 to-red-500 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-rose-300 dark:focus:ring-rose-800 font-medium rounded-lg text-sm px-4 py-3 text-center me-2 inline-flex justify-center cursor-not-allowed w-full',
        templateActive: 'text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-base px-4 py-3 text-center me-2 inline-flex justify-center uppercase w-full',

        // exist records 
        exist: false,
        members_existing : '',
        members_left     : '',
        members_count    : '',
    })

    onBeforeMount(() => {
        setFields()
    })

    function checkExist() {
        axios.get('/cycle/exist/' + form.month + '/' + form.year)
            .then(
                ({ data }) => {
                    if (data[0] > 0) {
                        classInfo.cycle_exist = true;
                        // reset
                        // classInfo.month = '';
                        classInfo.monthTrue = false;
                        // flashMessage 
                        let message = data[1];
                        let type = 'danger';
                        flashShow(message, type);
                    } else {
                        classInfo.cycle_exist = false;
                        // flashMessage 
                        let message = data[1];
                        let type = 'success';
                        flashShow(message, type);
                    }
                });
    }

    function setFields() {
        form.name            = getName;
        form.date            = new Date().toISOString().slice(0, 10);
        form.month           = moment().startOf("month").format('MMMM');
        form.year            = moment().year();
        form.amount          = props.settings.payment_def;
        form.welfare_amnt    = props.settings.welfare_def;
        classInfo.labelClass = classInfo.labelDef;
    }

    function submit() {
        flashLoading('Loading, Please Wait..')
        let url = '/cycle/';
        let name = form.name;

        let message = '';
        let type = '';

        form.post(url, {

            onSuccess: () => [
                message = 'New cycle: ' + name + ' Added!',
                type    = 'success',
                flashShow(message, type),
                emit('reload')
            ],

            onError: () => [
                // formErrors(form),

                // let allErrors = form.errors,

                // allErrors.forEach(error => {
                //     let message = error,
                //     let type = 'danger',
                //     flashShow(message, type),    
                // })
                
            ],

            onFinish: () => setFields(),
        });
    }

    function formErrors(form) {
        // if (form.hasErrors) {
            if (form.errors.name) {
                let message = form.errors.name;
                let type = 'danger';
                flashShow(message, type); 
            }
            if (form.errors.date) {
                let message = form.errors.date;
                let type = 'danger';
                flashShow(message, type); 
            }
            if (form.errors.amount) {
                let message = form.errors.amount;
                let type = 'danger';
                flashShow(message, type); 
            }
            if (form.errors.welfare_amnt) {
                let message = form.errors.welfare_amnt;
                let type = 'danger';
                flashShow(message, type); 
            }
        // }
    }

    function getAllCycles(id, name) {
        flashAllHide();
        let url     = '/cycle/'+id;
        let header  = 'View Payment Cycles';
        let button  = 'View '+ name;
        let body    = 'success';
        let message = 'View ' + name + ' Cycle!';

        flashShowView(message, body, header, url, button, 15000, true);
    }

    // flash messages 
    function flashShow(message, body) {
        flashHide();
        emit('flash', message, body)
    }

    function flashLoading(message) {
        flashTimed(message, 'warning', 15000)
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