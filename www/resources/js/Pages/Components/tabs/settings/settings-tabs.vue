<template>
    <div class="flex-col gap-2" id="setup" role="tabpanel" aria-labelledby="setup-tab">
        <section class="w-full space-x rounded-lg grid grid-cols-1 lg:grid-cols-4">
            <!-- enter settings info  -->
            <section :class="['overflow-hidden font-boldened flex-col gap-1 justify-between p-2 m-1 rounded-lg bg-cyan-50 dark:bg-gray-800/50 shadow-md sm:rounded-lg h-fit col-span-1 lg:col-span-2', classInfo.borderClass]">
                <!-- <h3 class="font-boldened  flex-col  w-full flex py-2 px-1">
                    <span :class="[classInfo.mainHeader, 'text-xl']">System Settings</span>
                </h3> -->
                <ol class="relative border-s border-gray-200 dark:border-gray-700 grid grid-cols-2">
                    <li class="mb-2 ms-2 col-span-2">
                        <h3 class="text-sm mb-1 md:my-6 uppercase underline font-normal text-gray-800 dark:text-gray-500 text-center">System
                            Name</h3>
                        <p class="text-3xl font-semibold uppercase underline text-gray-900 dark:text-gray-200 text-center">
                            {{ settings.name }}
                        </p>
                    </li>
                    <hr-line :color="'text-cyan-800 border dark:text-cyan-500/50 dark:border-cyan-500/50 col-span-2 my-1'"></hr-line>
                    <li class="mb-2 ms-2 col-span-1">
                        <h3 class="text-sm mb-1 uppercase underline font-normal text-gray-800 dark:text-gray-500">System
                            Shortname</h3>
                        <p class="text-md font-medium uppercase underline text-cyan-700 dark:text-cyan-400">
                            {{ settings.shortname }}
                        </p>
                    </li>
                    <li class="mb-2 ms-2 col-span-1">
                        <h3 class="text-sm mb-1 uppercase underline font-normal text-gray-800 dark:text-gray-500">
                            Default Payment Amnt.</h3>
                        <p class="text-md font-medium uppercase underline text-cyan-700 dark:text-cyan-400">
                            KSH {{ Number(settings.payment_def).toLocaleString() }}.
                        </p>
                    </li>
                    <li class="mb-2 ms-2 col-span-1">
                        <h3 class="text-sm mb-1 uppercase underline font-normal text-gray-800 dark:text-gray-500">
                            Default Welfare Amnt.</h3>
                        <p class="text-md font-medium uppercase underline text-cyan-700 dark:text-cyan-400">
                            KSH {{ Number(settings.welfare_def).toLocaleString() }}.
                        </p>
                    </li>
                    <li class="mb-2 ms-2 col-span-1">
                        <h3 class="text-sm mb-1 uppercase underline font-normal text-gray-800 dark:text-gray-500">
                            Activation Date.</h3>
                        <p class="text-md font-medium uppercase underline text-cyan-700 dark:text-cyan-400">
                            {{ moment(settings.created_at).format("ddd, Do/MM/YY") }}
                        </p>
                        <p class="text-sm font-medium uppercase text-gray-500 dark:text-gray-400">
                            {{ moment(settings.created_at).fromNow() }}
                        </p>
                    </li>
                </ol>

                <hr-line :color="'text-cyan-800 border dark:text-cyan-500/50 dark:border-cyan-500/50 col-span-2 my-1'"></hr-line>
            </section>

            <!-- enter settings form  -->
            <section
                :class="['overflow-hidden font-boldened flex-col space-y-1 justify-between p-2 m-1 rounded-lg bg-cyan-50 dark:bg-gray-800/50 shadow-md sm:rounded-lg h-fit col-span-1 lg:col-span-2', classInfo.borderClass]">
                <h3 class="font-boldened  flex-col  w-full flex py-2 px-1">
                    <span :class="[classInfo.mainHeader, 'text-xl']">Enter Admin Settings</span>
                </h3>

                <!-- upload sheet & form -->
                <div :class="[]">
                    <!-- settings form  -->
                    <form @submit.prevent="submit">
                        <section class="w-full inline-flex space-x-4 my-2">
                            <div class="w-full">
                                <InputLabel for="name" value="System Name" />

                                <TextInput id="name" type="name" v-model="form.name" :placeholder="form.name"
                                    autofocus />

                                <InputError class="mt-2" :message="form.errors.name" />
                            </div>

                            <div class="w-full">
                                <InputLabel for="shortname" value="System Shortname" />

                                <TextInput id="shortname" type="name" v-model="form.shortname"
                                    :placeholder="form.shortname" autofocus />

                                <InputError class="mt-2" :message="form.errors.shortname" />
                            </div>
                        </section>

                        <section class="w-full inline-flex space-x-4 my-2">
                            <div class="w-full">
                                <InputLabel for="payment_def" value="Cycle Payment Default Amount" />

                                <TextInput id="payment_def" type="name" v-model="form.payment_def"
                                    :placeholder="form.payment_def" autofocus />

                                <InputError class="mt-2" :message="form.errors.payment_def" />
                            </div>

                            <div class="w-full">
                                <InputLabel for="welfare_def" value="Cycle Welfare Default Amount" />

                                <TextInput id="welfare_def" type="name" v-model="form.welfare_def"
                                    :placeholder="form.welfare_def" autofocus />

                                <InputError class="mt-2" :message="form.errors.welfare_def" />
                            </div>
                        </section>

                        <div class="flex items-center justify-start mt-4 w-full">
                            <SubmitButton @click="submit" :disabled="form.processing" :loading="form.processing"
                                :success="form.wasSuccessful" :failed="form.hasErrors" :editting="form.isDirty"
                                v-if="props.updated">
                                Update Settings
                            </SubmitButton>
                            <SubmitButton :class="[{ 'opacity-25': form.processing }, 'w-full']"
                                 :disabled="form.processing" :loading="form.processing" :success="form.wasSuccessful"
                                :failed="form.hasErrors" :editting="form.isDirty" v-else>
                                Proceed With These Settings
                            </SubmitButton>
                        </div>
                    </form>
                </div>
                <!-- end upload sheet & form -->
            </section>
            <!-- end enter settings form  -->
        </section>
    </div>
</template>

<script setup>
    import { router, useForm } from '@inertiajs/vue3';

    //moment 
    import moment from 'moment';

    import { defineProps, reactive, onMounted, defineEmits } from "vue";
 
    const props = defineProps({
        settings: {
            type: Object,
            required: true,
        },
        show: {
            type: Boolean,
            required: true,
        },
        updated: {
            type: Boolean,
            required: true,
        }
    })

    const form = useForm({
        name: '',
        shortname: '',
        payment_def: '',
        welfare_def: ''
    })

    const classInfo = reactive ({
        info: [],

        infoSection: 'w-full m-2 p-2 text-left mx-auto rounded-xl border-2 shadow-md border border-cyan-500 p-1 overflow-hidden bg-cyan-400/10 dark:bg-cyan-400/10',
        infoHeader: 'text-cyan-300 mb-2 text-md text-left font-normal underline tracking-tight uppercase',
        borderClass: 'border-[3px] border-cyan-600 dark:border-cyan-700',
        mainHeader: 'font-boldened text-md text-gray-800 dark:text-gray-300 leading-tight uppercase underline py-1',

        // alerts
        alertShow: false,
        alertType: '',
        flashMessage: '',
        alertBody: 'border-b-[4px] border-gray-500 shadow-gray-900 dark:shadow-gray-900 bg-gray-100 dark:bg-gray-500',
        alertSuccess: 'border-b-[4px] border-emerald-800 dark:border-emerald-800 shadow-green-900 dark:shadow-green-900 bg-green-100 dark:bg-green-500',
        alertInfo: 'border-b-[4px] border-blue-800 dark:border-blue-800 shadow-blue-900 dark:shadow-blue-900 bg-blue-100 dark:bg-blue-500',
        alertWarning: 'border-b-[4px] border-orange-800 dark:border-orange-800 shadow-orange-900 dark:shadow-orange-900 bg-orange-100 dark:bg-orange-500',
        alertDanger: 'border-b-[4px] border-red-800 dark:border-red-800 shadow-red-900 dark:shadow-red-900 bg-red-100 dark:bg-red-500',

        link: '',

        // tabs settings 
        viewShow: true,
        headerMain: 'font-normal text-xl text-cyan-800 dark:text-gray-300 leading-tight uppercase py-1 w-full inline-flex justify-between my-1 hover:text-cyan-500 dark:hover:text-cyan-500 cursor-pointer',
        
        // template btns 
        templateInactive: 'text-white bg-gradient-to-r from-rose-500 to-red-500 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-rose-300 dark:focus:ring-rose-800 font-medium rounded-lg text-xs px-4 py-2.5 text-center me-2 mb-2 inline-flex justify-between cursor-not-allowed',
        templateActive: 'text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-xs px-4 py-2.5 text-center me-2 mb-2 inline-flex justify-between',
        labelClass: 'flex flex-col items-center justify-center w-full h-[30rem] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'
    })

    const emit = defineEmits(['changed', 'reload', 'switch', 'flash']);

    onMounted(() => {
        settingsCheck()
        setFields()
    })

    function settingsCheck() {
        if (props.settings.created_at == props.settings.updated_at) {
            form.hasErrors = true;
        } else {
            form.hasErrors = false;
        }
    }

    function flashShow(message, body) {
        emit('flash');
        emit('reload');
    }

    function setFields() {
        form.name          = props.settings.name;
        form.shortname     = props.settings.shortname;
        form.payment_def   = props.settings.payment_def;
        form.welfare_def   = props.settings.welfare_def;
    }

    function clearFields() {
        form.name          = '';
        form.shortname     = '';
        form.payment_def   = '';
        form.welfare_def   = '';
    }

    function submit() {
        let url = '/update/settings/';

        form.put(url, {
            onFinish: () => clearFields(),

            onSuccess: () => [
                classInfo.flashMessage = 'System Settings Updated!',
                classInfo.alertType = 'success',
                flashShow(classInfo.flashMessage, classInfo.alertType),
                setFields(),
                // emit('switch'),
                router.get('/settings')
            ],

            onError: () => [
                classInfo.flashMessage = 'Failed! Try Again',
                classInfo.alertType = 'danger',
                flashShow(classInfo.flashMessage, classInfo.alertType),
            ]
        });
    }
</script>