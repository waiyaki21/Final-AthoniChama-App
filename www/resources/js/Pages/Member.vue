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
        <memberinfo 
            :member         = classInfo.memberInfo 
            @reload         = reloadPayments  
            :border         = classInfo.progressMainBorder 
            :class          = classInfo.progressMainClass      
            :payPercent     = payPercent           
            :welPercent     = welPercent 
            :owePercent     = owePercent 
            @loading        = flashLoading
            @flash          = flashShow
            @hide           = flashHide
            @timed          = flashTimed
            @view           = flashShowView>
        </memberinfo>
    </div>

    <!-- panel, table and form  -->
    <section class="w-full justify-between grid grid-cols-1 lg:grid-cols-5">
        <!-- info panel  -->
        <memberside :member=classInfo.memberInfo :infosection=classInfo.infoSection :infoheader=classInfo.infoHeader :sectionborder=classInfo.sectionBorder></memberside>
        <!-- end info panel  -->

        <!-- body panel  -->
        <div class="py-2 pr-1 col-span-4 flex-row justify-between space-x-2">
            <!-- member tabs  -->
            <div
                class="text-xs font-boldened text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 w-full mb-2 mx-2 p-1 inline-flex justify-between uppercase">
                <ul class="flex flex-row -mb-px overflow-x-scroll">
                    <li class="me-2">
                        <a :class="[classInfo.tab1]" @click="tabSwitch()">
                            {{ classInfo.tab1Name }}
                            <span
                                class="bg-blue-100 text-gray-800 md:text-xs font-normal mx-1 px-1.5 py-0.5 rounded-full dark:bg-cyan-900 dark:text-white border-2 border-cyan-900 dark:border-cyan-500">
                                {{ classInfo.paymentsInfo.length }}
                            </span>
                        </a>
                    </li>

                    <li class="me-2">
                        <a :class="[classInfo.tab3]" @click="tabSwitch3()">
                            {{ classInfo.tab3Name }}
                            <span
                                class="bg-blue-100 text-gray-800 text-xs font-normal mx-1 px-1.5 py-0.5 rounded-full dark:bg-cyan-900 dark:text-white border-2 border-cyan-900 dark:border-cyan-500">
                                {{ classInfo.welfaresInfo.length }}
                            </span>
                        </a>
                    </li>

                    <li class="me-2">
                        <a :class="[classInfo.tab2]" @click="tabSwitch2()">
                            Enter / Upload Info.
                        </a>
                    </li>
                </ul>
            </div>
            <!-- end member tabs  -->

            <!-- payments table  -->
            <div :class="['overflow-hidden rounded-lg md:rounded-md w-full p-1']" v-if="classInfo.tab1show">
                <!-- payments info section  -->
                <section :class="[classInfo.infoSection]">
                    <section
                        :class="['w-full justify-between m-1 p-1 text-left space-x font-boldened grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-1']">
                        <a v-for="(item, index) in paymentInfoBlocks" :key="index" class="block max-w-sm p-2 bg-transparent">
                            <h5 :class="[classInfo.infoHeader, 'text-sm md:text-md']" :title="item.title">
                                <span>{{ item.label }}</span>
                                <info-icon class="flex-shrink-0 inline md:w-4 md:h-4 md:ml-1 w-3 h-3 ml-0.5"></info-icon>
                            </h5>
                            <p :class="classInfo.subHeader" :title="item.value">
                                <small v-if="item.prefix">
                                    {{ item.prefix }}
                                </small>
                                {{ numFormat(item.value) }}
                                <span v-if="item.suffix">{{ item.suffix }}</span>
                            </p>
                        </a>
                    </section>
                </section>

                <div
                    :class="['bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-md rounded-lg md:rounded-md w-full p-2', classInfo.borderClass]">
                    <h3 :class="[classInfo.mainHeader,'justify-between w-full mb-1 grid grid-cols-2 gap-1']">
                        <span class="underline col-span-2">{{ member.name }} Payments.</span>
                    </h3>

                    <!-- payments table  -->
                    <div class="py-2 relative overflow-x-auto">
                        <h2 class="font-normal font-boldened text-3xl text-center text-cyan-800 dark:text-cyan-300 leading-tight uppercase underline py-1"
                            v-if="allPayments.length == 0">
                            ADD MEMBER PAYMENTS!!
                        </h2>

                        <section class="overflow-y-scroll h-auto md:max-h-[35rem]" v-else>
                            <table class="mx-auto w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead
                                    class="text-gray-700 uppercase bg-transparent dark:text-gray-300 font-boldened text-sm">
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
                                            @click="orderByPayments()">
                                            <div class="flex items-center">
                                                Total Paid.
                                                <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"></updown-icon>
                                            </div>
                                        </td>
                                        <td scope="col"
                                            class="px-2 uppercase hover:underline dark:text-gray-400 dark:hover:text-white cursor-pointer"
                                            @click="orderByCycle()">
                                            <div class="flex items-center">
                                                Payment Cycle.
                                                <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"></updown-icon>
                                            </div>
                                        </td>
                                        <td scope="col" class="px-2 uppercase hover:underline dark:hover:text-white hidden md:table-cell">
                                            <div class="flex items-center">
                                                Date
                                            </div>
                                        </td>
                                        <td scope="col" class="px-2 uppercase hover:underline dark:hover:text-white">
                                            <div class="flex items-center">
                                                Options.
                                            </div>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="bg-transparent border-b dark:bg-gray-800 dark:border-gray-700 font-boldened text-sm uppercase"
                                        v-for="(payment, index) in allPayments">
                                        <td scope="row" class="p-2">
                                            <span class="uppercase text-gray-900 whitespace-nowrap dark:text-white">
                                                {{ payment.id }}.
                                            </span>
                                        </td>
                                        <td class="p-2">
                                            <span class="">
                                                <span class="text-green-500 underline text-sm md:text-md">
                                                    ksh {{ numFormat(payment.payment) }}
                                                </span>
                                            </span>
                                        </td>
                                        <td class="p-2">
                                            <ActionButton class="w-full" buttonClass='info' @handleClick="getRoute(payment.cycle_id, payment.cycle.name)" :tooltipText="`Go To Payment Cycle ${payment.cycle.name}`" :buttonText="`${payment.cycle.name}.`">
                                                <calendar-icon class="w-4 h-4 md:w-5 md:h-5"></calendar-icon>
                                            </ActionButton>
                                        </td>
                                        <td class="p-2 hidden md:table-cell">
                                            <div class="pl-1">
                                                <div class="font-normal">
                                                    {{ moment(payment.created_at).format("ddd, Do-MM-YY") }}
                                                </div>
                                                <div class="font-normal text-2xs dark:text-gray-300 underline">
                                                    {{ moment(payment.created_at).fromNow() }}
                                                </div>
                                            </div>
                                        </td>
                                        <td class="p-2">
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
                        </section>
                    </div>
                    <!--end payments table  -->
                </div>
            </div>
            <!-- payments table  -->

            <!-- payments & welfare form  -->
            <section class="w-full overflow-hidden font-boldened flex-row" v-if="classInfo.tab2show">
                <h3 class="font-boldened p-2">
                    <span
                        :class="[classInfo.mainHeader, 'justify-between w-full mb-1 grid grid-cols-2 md:grid-cols-5 gap-1']">
                        <span class="underline col-span-5">Add Member Payments / Welfares.</span>
                    </span>
                </h3>
                <section class="w-full justify-between grid grid-cols-1 md:grid-cols-4 gap-1">
                    <div
                        :class="['p-2 col-span-4 rounded-lg bg-cyan-200/30 dark:bg-gray-800 overflow-hidden shadow-md sm:rounded-lg h-fit', classInfo.borderClass]">
                        <form @submit.prevent="verify" class="p-2">
                            <section class="w-full grid grid-cols-2 gap-2">
                                <div>
                                    <InputLabel for="member_id" value="Member Name" />

                                    <select id="member_id" v-model="form.member_id" name="member_id"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow-md">
                                        <option :value="member.id" selected>
                                            {{ member.name }}
                                        </option>
                                    </select>

                                    <InputError class="mt-2" :message="form.errors.member_id" />
                                </div>

                                <div>
                                    <InputLabel for="cycle_id" value="Payment Cycle Name" />

                                    <select id="cycle_id" v-model="form.cycle_id" name="cycle_id"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow-md"
                                        :placeholder="cycle.name">
                                        <option v-for="cycle in props.cycles" :value="cycle.id"
                                            @click="checkPayments(cycle)">
                                            {{ cycle.name }}
                                        </option>
                                    </select>

                                    <InputError class="mt-2" :message="form.errors.cycle_id" />
                                </div>
                            </section>

                            <section class="w-full grid grid-cols-1 gap-2">
                                <div>
                                    <InputLabel for="payment" value="payment" />

                                    <span
                                        class="text-yellow-300 my-2 py-2 uppercase underline font-boldened font-normal">
                                        Enter <b>0</b> to represent no information
                                    </span>

                                    <TextInput id="payment" type="number" v-model="form.payment" autofocus
                                        v-if="classInfo.paysNo == 0" />

                                    <TextInput id="payment" type="number" v-model="form.payment"
                                        class="cursor-not-allowed" disabled v-else />

                                    <InputError class="mt-2" :message="form.errors.payment"
                                        v-if="classInfo.paysNo == 0" />

                                    <InputError class="mt-2" :message="'The member already has a payment in this cycle'"
                                        v-else />
                                </div>
                            </section>

                            <section class="w-full grid grid-cols-2 gap-2">
                                <div>
                                    <InputLabel for="welfare" value="welfare" />

                                    <TextInput id="welfare" type="number" v-model="form.welfare" autofocus />

                                    <InputError class="mt-2" :message="form.errors.welfare" />
                                </div>

                                <div>
                                    <InputLabel for="type" value="welfare type" />

                                    <select id="type" v-model="form.type" name="type"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow-md"
                                        placeholder="">
                                        <option value="1" selected="true">Welfare Money In</option>
                                        <option value="0">Welfare Money Out</option>
                                    </select>

                                    <InputError class="mt-2" :message="form.errors.type" />
                                </div>
                            </section>

                            <div class="flex items-center justify-start mt-4">
                                
                                <SubmitButton :disabled="form.processing" :loading="form.processing" :success="form.wasSuccessful" :failed="form.hasErrors" :editting="form.isDirty">
                                    Submit {{ classInfo.memberInfo.name }} Info
                                </SubmitButton>
                            </div>
                        </form>
                    </div>
                    <!-- end forms  -->
                </section>
            </section>
            <!-- payments & welfare form  -->

            <!-- welfares table  -->
            <div :class="['overflow-hidden rounded-lg md:rounded-md w-full p-1']" v-if="classInfo.tab3show">
                <!-- welfare info section  -->
                <section :class="[classInfo.infoSection, 'mb-2']">
                    <section
                        :class="['w-full justify-between m-1 p-1 text-left space-x font-boldened grid grid-cols-2 md:grid-cols-4 gap-1']">
                        <a v-for="(item, index) in welfareInfoBlocks" :key="index" class="block max-w-sm p-2 bg-transparent">
                            <h5 :class="[classInfo.infoHeader, 'text-sm md:text-md']" :title="item.title">
                                <span>{{ item.label }}</span>
                                <info-icon class="flex-shrink-0 inline md:w-4 md:h-4 md:ml-1 w-3 h-3 ml-0.5"></info-icon>
                            </h5>
                            <p :class="classInfo.subHeader" :title="item.tooltipInfo">
                                <small v-if="item.prefix">
                                    {{ item.prefix }}
                                </small>
                                {{ numFormat(item.value) }}
                                <span v-if="item.suffix">{{ item.suffix }}</span>
                            </p>
                        </a>
                    </section>
                </section>

                <div
                    :class="['bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-md rounded-lg w-full p-2', classInfo.borderClass]">
                    <h3 :class="[classInfo.mainHeader,'justify-between w-full mb-1 grid grid-cols-10 md:grid-cols-3 gap-2']">
                        <span class="underline col-span-9 md:col-span-2">{{ member.name }} Welfares.</span>
                        <!-- forms  -->
                        <a @click="tabSwitch2()" type="button"
                            class="col-span-1 md:col-span-1 text-white bg-gradient-to-br from-teal-500 to-blue-700 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800 font-medium rounded-lg text-sm p-2 text-center uppercase shadow-md cursor-pointer inline-flex justify-center md:justify-between gap-2 w-fit">
                            <add-icon class="w-4 h-4"></add-icon>
                            <span class="hidden md:block">Add Welfares</span>
                        </a>
                    </h3>

                    <!-- welfares table  -->
                    <div class="py-2 relative overflow-x-auto">
                        <h2 class="font-normal font-boldened text-3xl text-center text-cyan-800 dark:text-cyan-300 leading-tight uppercase underline py-1"
                            v-if="classInfo.welfaresInfo.length == 0">
                            ADD WELFARE PAYMENTS!!
                        </h2>

                        <section class="overflow-y-scroll h-auto md:max-h-[35rem]" v-else>
                            <table class="mx-auto w-full text-xs text-left text-gray-500 dark:text-gray-400">
                                <thead
                                    class="text-gray-700 uppercase bg-transparent dark:text-gray-400 font-boldened text-xs">
                                    <tr>
                                        <td scope="col" class="px-2 uppercase hover:underline">
                                            No.
                                        </td>
                                        <td scope="col" class="px-2 uppercase hover:underline">
                                            <div class="flex items-center">
                                                Amount
                                            </div>
                                        </td>
                                        <td scope="col" class="px-2 uppercase hover:underline">
                                            <div class="flex items-center">
                                                Payment Cycle.
                                            </div>
                                        </td>
                                        <td scope="col" class="px-2 uppercase hover:underline hidden md:table-cell">
                                            <div class="flex items-center">
                                                Date.
                                            </div>
                                        </td>
                                        <td scope="col" class="px-2 uppercase hover:underline">
                                            <div class="flex items-center">
                                                Type
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
                                    <tr class="bg-transparent border-b dark:bg-gray-800 dark:border-gray-700 font-boldened text-sm uppercase"
                                        v-for="(welfare, index) in classInfo.welfaresInfo">
                                        <td scope="row" class="p-2">
                                            <span
                                                class="uppercase text-gray-900 whitespace-nowrap dark:text-gray-300 text-sm"
                                                v-if="welfare.type == 1">
                                                {{ index + 1 }}.
                                            </span>
                                            <span
                                                class="uppercase text-gray-900 whitespace-nowrap dark:text-rose-500 text-sm"
                                                v-else>
                                                {{ index + 1 }}.
                                            </span>
                                        </td>
                                        <td class="p-2">
                                            <div class="text-blue-600 text-sm md:text-md"
                                                v-if="welfare.type == 1">
                                                <div class="font-normal underline">
                                                    ksh {{ numFormat(welfare.payment) }}
                                                </div>
                                            </div>
                                            <div class="text-red-600 text-sm md:text-md" v-else>
                                                <div class="font-normal underline">
                                                    ksh {{ numFormat(welfare.payment) }}
                                                </div>
                                            </div>
                                        </td>
                                        <td class="p-2">
                                            <ActionButton class="w-full" :buttonClass="welfare.type ?'info' : 'danger'" @handleClick="getRoute(welfare.cycle_id, welfare.cycle.name)" :tooltipText="`Go To Payment Cycle ${welfare.cycle.name}`" :buttonText="`${welfare.cycle.name}.`">
                                                <calendar-icon class="w-4 h-4 md:w-5 md:h-5"></calendar-icon>
                                            </ActionButton>
                                        </td>
                                        <td class="p-2 hidden md:table-cell">
                                            <div class="pl-1">
                                                <div class="font-normal">
                                                    {{ moment(welfare.created_at).format("ddd, Do-MM-YY") }}
                                                </div>
                                                <div class="font-normal text-xs dark:text-gray-300 underline">
                                                    {{ moment(welfare.created_at).fromNow() }}
                                                </div>
                                            </div>
                                        </td>
                                        <td class="p-2">
                                            <span v-if="welfare.type == 0">
                                                <span class="text-red-700 underline text-xl">
                                                    OUT
                                                </span>
                                            </span>
                                            <span v-else>
                                                <span class="text-green-700 underline text-xl">
                                                    IN
                                                </span>
                                            </span>
                                        </td>

                                        <td class="p-2">
                                            <div class="inline-flex rounded-md gap-0.5" role="group">
                                                <!-- edit  -->
                                                <button type="button"
                                                    class="inline-flex items-center p-0.5 text-xs font-medium text-cyan-900 bg-transparent rounded-md hover:text-white focus:z-10 focus:ring-1 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:text-cyan-500 dark:hover:text-cyan-400 shadow"
                                                    @click="showWelfare(welfare)">
                                                    <edit-icon class="w-4 h-4"></edit-icon>
                                                    <!-- Edit -->
                                                </button>
                                                <!-- delete  -->
                                                <button type="button"
                                                    class="inline-flex items-center p-0.5 text-xs font-medium text-red-900 bg-transparent rounded-md hover:text-white focus:z-10 focus:ring-1 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:text-red-500 dark:hover:text-red-400 shadow"
                                                    @click="showWelfareDelete(welfare)">
                                                    <delete-icon class="w-4 h-4"></delete-icon>
                                                    <!-- Delete -->
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>
                    </div>
                    <!--end welfares table  -->
                </div>
            </div>
            <!-- welfares table  -->
        </div>
        <!-- end body panel  -->
    </section>
    <!-- end panel, table and form  -->

    <!-- update payment modal  -->
    <paymentsupdate :info=classInfo.modalData :show=classInfo.isOpen :name=props.member.name
        :payment=numFormat(classInfo.modalData.payment) @reload=reloadPayments @close=closePayment @loading = flashLoading @flash = flashShow @hide  = flashHide @timed = flashTimed @view = flashShowView></paymentsupdate>
    <!-- end update payment modal  -->

    <!-- delete payment modal  -->
    <paymentsdelete :info=classInfo.deleteData :show=classInfo.isDeleteOpen :name=props.member.name
        :payment=numFormat(classInfo.deleteData.payment) @reload=reloadPayments @close=closeDelete @loading = flashLoading @flash = flashShow @hide  = flashHide @timed = flashTimed @view = flashShowView></paymentsdelete>
    <!-- end delete payment modal  -->

    <!-- update welfare modal  -->
    <welfaresupdate :info=classInfo.modalData :show=classInfo.isWelfareOpen :name=props.member.name
        :payment=numFormat(classInfo.modalData.payment) @reload=reloadWelfares @close=closeWelfare @loading = flashLoading @flash = flashShow @hide  = flashHide @timed = flashTimed @view = flashShowView></welfaresupdate>
    <!-- end update Welfare modal  -->

    <!-- delete welfare modal  -->
    <welfaresdelete :info=classInfo.deleteData :show=classInfo.isDeleteWelfareOpen :name=props.member.name
        :payment=numFormat(classInfo.deleteData.payment) @reload=reloadWelfares @close=closeWelfareDelete @loading = flashLoading @flash = flashShow @hide  = flashHide @timed = flashTimed @view = flashShowView>
    </welfaresdelete>
    <!-- end delete payment modal  -->

    <!-- toast notification  -->
    <toast ref="toastNotificationRef"></toast>
    <!-- end app body  -->
</template>

<script setup>
    import { useForm, router } from '@inertiajs/vue3';
    import { defineProps, reactive, onMounted, computed, ref, nextTick } from 'vue'

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
        member: {
            type: Object,
            required: true,
        },
        payments: {
            type: Array,
            required: true,
        },
        welfares: {
            type: Array,
            required: true,
        },
        payPercent: {
            type: String,
            required: true,
        },
        welPercent: {
            type: String,
            required: true,
        },
        owePercent: {
            type: String,
            required: true,
        },
        cycles: {
            type: Array,
            required: true,
        },
        cycle: {
            type: Object,
            required: true,
        },
        pays: {
            type: String,
            required: true,
        },
    });

    const classInfo = reactive({
        isOpen: false,
        isWelfareOpen: false,
    
        modalData: {},
        modalName: '',

        // delete info 
        isDeleteOpen: false,
        isDeleteWelfareOpen: false,
        deleteData: {},
        deleteID: '',
        deletePayURL: '/delete/payment/',
        deleteWelfURL: '/delete/welfare/',

        welfaresInfo: [],
        paymentsInfo: [],
        memberInfo: {},
        excel_file: '',
        fileSelected: '',

        // main progress bar 
        progressMainBorder: 'border border-cyan-500 p-1 overflow-hidden',
        progressMainClass: 'alerts flex h-6 items-center justify-center rounded-full bg-gradient-to-r from-gray-200 via-cyan-400 to-blue-500 text-sm leading-none',
        infoSection: 'm-2 p-2 text-left mx-auto rounded-xl border-2 shadow-md border-2 border-cyan-500 p-1 overflow-hidden bg-cyan-400/10 dark:bg-cyan-400/10',
        infoHeader: 'text-cyan-900 dark:text-cyan-300 mb-1 md:mb-2 md:text-2xl text-xl text-left font-normal underline tracking-tight uppercase',
        sectionBorder: 'w-full flex-col justify-between m-1 p-1 text-left',
        borderClass: 'border-[3px] border-cyan-300 dark:border-cyan-700',
        mainHeader: 'font-boldened md:text-2xl text-xl text-gray-800 dark:text-gray-300 leading-tight uppercase py-1',
        subHeader: 'font-normal text-left md:text-2xl text-xl text-gray-900 dark:text-gray-300 uppercase',

        // tabs 
        tabActive: 'inline-block p-1 text-blue-600 border-b-base border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 text-sm cursor-pointer whitespace-nowrap',
        tabInactive: 'inline-block p-1 border-b-base border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-sm cursor-pointer whitespace-nowrap',
        tab1: '',
        tab2: '',
        tab1show: true,
        tab2show: false,
        tab1Name: 'Payments Info',
        tab3Name: 'Welfares Info',

        templateBtn: '',
        templateInactive: 'text-white bg-gradient-to-r from-rose-500 to-red-500 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-rose-300 dark:focus:ring-rose-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 inline-flex justify-between cursor-not-allowed',
        templateActive: 'text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-1 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 inline-flex justify-between',
        labelClass: 'flex flex-col items-center justify-center w-full h-[15rem] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600',

        clicked: false,

        paysNo: '',

        modalCloseBtn: 'cursor-pointer dark:text-cyan-800 text-cyan-500 transition-transform hover:rotate-180 w-6 h-6 hover:w-8 hover:h-8',

        // sort 
        ascending: true,
        sortBy: 'id',
    })

    const navItems = computed(() => [
        {
            url: '/members',
            label: 'Group Members',
            active: false,
        },
        {
            url: '/member/' + props.member.id,
            label: props.member.name,
            active: true,
        },
    ]);

    const form = useForm({
        member_id: '',
        cycle_id: '',
        payment: '',
        welfare: '',
        type: ''
    })

    onMounted(() => [
        setInfo(),
        setFields(),
        progressMain()
    ])

    const allPayments = computed(() => {
        let tempPayments = classInfo.paymentsInfo

        // Sort Payments
        tempPayments = tempPayments.sort((a, b) => {
            if (classInfo.sortBy == 'id') {
                return a.id - b.id
            } else if (classInfo.sortBy == 'payments') {
                return a.payments - b.payments
            } else if (classInfo.sortBy == 'cycle_id') {
                return a.cycle_id - b.cycle_id
            }
        })

        // Show sorted array in descending or ascending order
        if (!classInfo.ascending) {
            tempPayments.reverse()
        }

        return tempPayments
    })

    const paymentInfoBlocks = computed(() => [
        {
            label: 'Payments No.',
            title: 'Total no of payments',
            value: classInfo.paymentsInfo.length,
            tooltipInfo: `${numFormat(classInfo.paymentsInfo.length)} Payments`,
            prefix: '',
            suffix: 'Payments'
        },
        {
            label: 'Amount Before',
            title: 'Total amount contributed before entering system data',
            value: props.member.amount_before,
            tooltipInfo: 'ksh ' + Number(props.member.amount_before).toLocaleString(),
            prefix: 'KSH',
            suffix: ''
        },
        {
            label: 'T. Contributed',
            title: 'Total amount contributed in all cycles',
            value: props.member.payments_sum,
            tooltipInfo: 'ksh ' + Number(props.member.payments_sum).toLocaleString(),
            prefix: 'KSH',
            suffix: ''
        },
        {
            label: 'Grand Total',
            title: 'Grand Total of all contributions in all cycles',
            value: props.member.payments_total,
            tooltipInfo: 'ksh ' + Number(props.member.payments_total).toLocaleString(),
            prefix: 'KSH',
            suffix: ''
        },
    ]);

    const welfareInfoBlocks = computed(() => [
        {
            label: 'Amount Before',
            title: 'Total Welfare amount contributed before entering system data',
            value: props.member.welfare_before,
            tooltipInfo: 'ksh ' + Number(props.member.welfare_before).toLocaleString(),
            customClass: 'font-normal text-left md:text-2xl text-xl text-yellow-600 dark:text-yellow-300 uppercase',
            prefix: 'KSH',
            suffix: ''
        },
        {
            label: 'T.Welfares In',
            title: 'Total Welfares amount contributed in all cycles',
            value: props.member.welfare_in,
            tooltipInfo: 'ksh ' + Number(props.member.welfare_in).toLocaleString(),
            customClass: classInfo.subHeader,
            prefix: 'KSH ',
            suffix: ''
        },
        {
            label: 'T.Welfares Out',
            title: 'Total Welfare amount given out to the member',
            value: props.member.welfare_out,
            tooltipInfo: 'ksh ' + Number(props.member.welfare_out).toLocaleString(),
            customClass: 'font-normal text-left md:text-2xl text-xl text-red-700 dark:text-red-700 uppercase',
            prefix: 'KSH ',
            suffix: ''
        },
        {
            label: 'Grand Total',
            title: 'Grand Total of all welfare payments in all cycles',
            value: props.member.welfare_total,
            tooltipInfo: 'ksh ' + Number(props.member.welfare_total).toLocaleString(),
            customClass: 'font-normal text-left md:text-2xl text-xl text-blue-700 dark:text-blue-800 uppercase',
            prefix: 'KSH ',
            suffix: ''
        },
    ]);

    function setInfo() {
        classInfo.paymentsInfo = props.payments;
        classInfo.welfaresInfo = props.welfares;
        classInfo.memberInfo   = props.member;

        tabSwitch();
        // checkPayments(props.cycle);
        classInfo.paysNo = props.pays;
    }

    function numFormat(num) {
        if (num < 399999) {
            return Number(num).toLocaleString();
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

    function getRoute(a, b) {
        // create url 
        let url = `/cycle/${a}`;
        // toast Notification 
        flashShow(`Showing Payment Cycle: ${b}`, 'info')
        // router 
        router.get(url);
    }

    function progressMain() {
        classInfo.infoHeader             = classInfo.infoHeader;
        classInfo.infoSection            = classInfo.infoSection;
        classInfo.sectionBorder          = classInfo.sectionBorder;
        classInfo.borderClass            = classInfo.borderClass;
        classInfo.mainHeader             = classInfo.mainHeader;          
    }

    function tabSwitch() {
        resetTabClass();
        classInfo.tab1show = true;
        classInfo.tab2show = false;
        classInfo.tab3show = false;

        classInfo.tab1     = classInfo.tabActive;
    }

    function tabSwitch2() {
        resetTabClass();
        classInfo.tab1show = false;
        classInfo.tab2show = true;
        classInfo.tab3show = false;

        classInfo.tab2     = classInfo.tabActive;
    }

    function tabSwitch3() {
        resetTabClass();
        classInfo.tab1show = false;
        classInfo.tab2show = false;
        classInfo.tab3show = true;

        classInfo.tab3    = classInfo.tabActive;
    }

    function resetTabClass() {
        classInfo.tab1 = classInfo.tabInactive;
        classInfo.tab2 = classInfo.tabInactive;
        classInfo.tab3 = classInfo.tabInactive;
    }
    // end tabs methods 

    // order rows 
    function orderByID() {
        classInfo.ascending = !classInfo.ascending

        classInfo.sortBy = 'id';

        // flash message 
        classInfo.ordername = 'ID';
        if(classInfo.ascending) {
            let type          = 'info';
            let message   = 'Payments Sorted By: ' + classInfo.ordername + ' ascending';
            flashShow(message, type);
        } else {
            let type          = 'info';
            let message   = 'Payments Sorted By: ' + classInfo.ordername + ' descending';
            flashShow(message, type);
        }
    }

    function orderByPayments() {
        classInfo.ascending = !classInfo.ascending

        classInfo.sortBy = 'payments';

        // flash message 
        classInfo.ordername = 'TOTAL PAYMENTS';

        if(classInfo.ascending) {
            let type          = 'info';
            let message   = 'Payments Sorted By: ' + classInfo.ordername + ' ascending';
            flashShow(message, type);
        } else {
            let type          = 'info';
            let message   = 'Payments Sorted By: ' + classInfo.ordername + ' descending';
            flashShow(message, type);
        }
        let type          = 'info';
        
        flashShow(message, type);
    }

    function orderByCycle() {
        classInfo.ascending = !classInfo.ascending

        classInfo.sortBy = 'cycle_id';

        // flash message 
        classInfo.ordername = 'PAYMENT CYCLES';
        if(classInfo.ascending) {
            let type          = 'info';
            let message   = 'Payments Sorted By: ' + classInfo.ordername + ' ascending';
            flashShow(message, type);
        } else {
            let type          = 'info';
            let message   = 'Payments Sorted By: ' + classInfo.ordername + ' descending';
            flashShow(message, type);
        }
    }

    function verify() {
        let amount  = form.payment;
        let welfare = form.welfare;
        if (form.cycle_id == '') {
            alert('Select a cycle for this payment and welfare information!');
        } else {
            if (form.payment == 0 && form.welfare == 0) {
                if (confirm("The payment & welfare value are both 0 ,There is no information to be submitted, proceed?") == true) {
                    let message = 'No Payment or Welfare to Submit both were 0!';
                    let type    = 'warning';
                    flashShow(message, type);
                }   
            } else {
                if (form.payment == 0) {
                    if (confirm("Do you want to enter the welfare of ksh " + welfare +" only, The payment has a value of 0, proceed?") == true) {
                        let message = 'Success!, New Welfare of ksh ' + welfare + ' entered!';
                        let type    = 'warning';
                        flashShow(message, type);
                        submit();
                    }   
                } 
                if (form.welfare == 0) {
                    if (confirm("Do you want to enter the payment of ksh " + payment + " only, The welfare has a value of 0, proceed?") == true) {
                        let message = 'Success!, New Payment of ksh ' + payment + ' entered!';
                        let type    = 'warning';
                        flashShow(message, type);
                        submit();
                    }   
                }
            }
            if (form.payment != 0 && form.welfare != 0) {
                let message   = 'New payment :ksh' + amount + ' & Welfare :ksh ' + welfare + ' Added!';
                let type      = 'success';
                flashShow(message, type);
                submit();
            }
        }
    }

    function submit() {
        let url = '/payment/member/' + props.member.id;

        let message = '';
        let type    = '';
        form.post(url, {
            onFinish: () => clearFields(),

            onSuccess: () => [
                setFields(),
                tabSwitch2(),
                type      = 'info',
                message   = 'Payment Recorded Successfully!',
                flashShow(message, type),
                reloadPayments()
            ],

            onError: () => [
                // console.log(form.errors),
                message   = 'Failed! Try Again',
                type      = 'danger',
                flashShow(message, type),
                tabSwitch2(),
            ] 
        });
    }

    function reloadPayments() {
        let link = 'desc';
        let linkTo = 'created_at/';

        axios.get('/api/getPays/member/'+ props.member.id +'/'+ linkTo + link)
            .then(
                ({ data }) => {
                    classInfo.paymentsInfo = data[0];
                    classInfo.welfaresInfo = data[1];
                    classInfo.memberInfo   = data[2];
                    progressMain();
                });
    }

    function checkPayments(cycle) {
        axios.get('/api/getPays/member/'+ props.member.id +'/'+ cycle.id)
            .then(
                ({ data }) => {
                    classInfo.paysNo = data;
                    if (data == 0) {
                        let message = props.member.name + 'has (ZERO)' + data + ' payments in ' + cycle.name + '!';
                        let type = 'success';  
                        flashShow(message, type);  
                    } else {
                        let message = props.member.name + 'already has ' + data + ' payments in ' + cycle.name + '!';
                        let type = 'info';
                        flashShow(message, type);
                    }
                });
    }

    function cycleFull() {
        let message = 'The Member already has ( ' + classInfo.paysNo + ' ) or more payment(s) for this cycle!';
        let type    = 'danger';
        flashShow(message, type);
    }

    function setFields() {
        form.cycle_id  = '';
        form.member_id = props.member.id;
        if (classInfo.paysNo != 0) {
            form.payment = '0';
        } else {
            form.payment = props.cycle.amount;                    
        }
        form.welfare   = props.cycle.welfare_amnt;
        form.type      = '1';
    }

    function clearFields() {
        form.cycle_id  = '';
        form.member_id = '';
        form.payment   = '';
        form.welfare   = '';
        form.type      = '';
    }

    // payment modals 
    function showPayment(payment) {
        // console.log(payment);
        // formFields(payment);
        classInfo.modalName  = props.member.name;
        classInfo.modalData  = payment;
        classInfo.isOpen     = true;
    }

    function closePayment() {
        classInfo.isOpen             = false;
        classInfo.modalName          = '';
        classInfo.modalData          = {};
    }

    function showDelete(payment) {
        classInfo.deleteData     = payment;
        classInfo.deleteID       = payment.id;
        classInfo.isDeleteOpen   = true;
    }

    function closeDelete() {
        classInfo.isDeleteOpen   = false;
        classInfo.deleteData     = {};
        classInfo.deleteID       = '';
    }

    // welfare modal 
    function showWelfare(welfare) {
        classInfo.modalData = welfare;
        classInfo.isWelfareOpen = true;
    }

    function closeWelfare() {
        classInfo.isWelfareOpen        = false;
        classInfo.modalData            = {};
    }

    function showWelfareDelete(welfare) {
        classInfo.deleteData = welfare;
        classInfo.deleteID = welfare.id;
        classInfo.isDeleteWelfareOpen = true;
    }

    function closeWelfareDelete() {
        classInfo.isDeleteWelfareOpen = false;
        classInfo.deleteData = {};
        classInfo.deleteID = '';
    }

    function reloadWelfares() {
        reloadPayments()
        tabSwitch3()
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

    const flashLoading = () => {
        let info        = 'Loading! Please Wait';
        let type        = 'warning';
        let duration    = 9999999;
        flashTimed(info, type , duration)
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

    const flashHide = () => {
        if (toastNotificationRef.value) {
            toastNotificationRef.value.loadHide();
        }
    }
</script>