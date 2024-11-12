<template>
    <!-- header  -->
    <section class="font-normal text-cyan-800 dark:text-gray-300 leading-tight uppercase py-1 grid grid-cols-1 md:grid-cols-6">
        <section class="flex flex-col col-span-1 md:col-span-3 w-full">
            <span class="inline-flex justify-start gap-1">
                <span class="underline text-xl md:text-2xl">{{ member.name }}.</span>
            </span>
            <section class="font-normal text-md leading-tight uppercase p-1 w-full inline-flex justify-start gap-1">
                <a :href="`tel:+${telNo(member)}`" :class="[classInfo.infoBadge, 'inline-flex gap-1 justify-start']">
                    <phone-icon class="w-3 h-3 md:w-4 md:h-4"></phone-icon>
                    {{ telNo(member) }}
                </a>

                <span :class="classInfo.successBadge" v-if="member.active">
                    ACTIVE
                </span>
                <span :class="classInfo.failBadge" v-else>
                    INACTIVE
                </span>

                <span :class="classInfo.successBadge" v-if="member.total_investment > 0">
                    {{ member.total_shares }}% - KSH {{ Number(member.total_investment).toLocaleString() }}
                </span>
                <span :class="classInfo.failBadge" v-else>
                    {{ member.total_shares }}% - KSH {{ Number(member.total_investment).toLocaleString() }}
                </span>
            </section>
        </section>
        
        <div class="inline-flex rounded-md shadow-sm gap-1 justify-start md:justify-end col-span-1 md:col-span-3" role="group">
            <!-- clear  -->
            <button type="button" :class="member.welfare_out > 0 ? 'inline-flex items-center p-1 text-xs font-normal text-amber-500 bg-transparent rounded-md hover:text-gray-500 focus:z-10 dark:text-amber-500 dark:hover:text-amber-500' : 'inline-flex items-center p-1 text-xs font-normal text-emerald-900 bg-transparent rounded-md focus:z-10 dark:text-emerald-600 dark:hover:text-emerald-600 hover:opacity-50 cursor-not-allowed'" v-tooltip="$tooltip(classInfo.btn1.toUpperCase(), 'top')"
                @click="member.welfare_out > 0 ? showClearMember(member) : flashShow('Members has no welfare arrears!', 'success')">
                <document-check :class="[classInfo.svgClass]"></document-check>
            </button>
            <!-- edit  -->
            <button type="button" class="inline-flex items-center p-1 text-xs font-normal text-cyan-900 bg-transparent rounded-md hover:text-gray-500 focus:z-10 dark:text-cyan-700 dark:hover:text-cyan-600" v-tooltip="$tooltip(classInfo.btn2.toUpperCase(), 'top')" @click="showMember(member)">
                <edit-icon :class="[classInfo.svgClass]"></edit-icon>
            </button>
            <!-- delete  -->
            <button type="button" class="inline-flex items-center p-1 text-xs font-normal text-red-900 bg-transparent rounded-md hover:text-gray-500 focus:z-10 dark:text-red-700 dark:hover:text-red-600" v-tooltip="$tooltip(classInfo.btn3.toUpperCase(), 'top')" @click="showDelete(member)">
                <delete-icon :class="[classInfo.svgClass]"></delete-icon>
            </button>
            <!-- download  -->
            <a type="button" class="inline-flex items-center p-1 text-xs font-normal text-pink-900 bg-transparent rounded-md hover:text-pink-500 focus:z-10 dark:text-pink-700 dark:hover:text-pink-600" v-tooltip="$tooltip(classInfo.btn4.toUpperCase(), 'left')" @click="downloadLedger(member)">
                <download-info :class="[classInfo.svgClass]"></download-info>
            </a>
        </div>
    </section>
    <!-- end header  -->

    <!-- progress bar  -->
    <progressInfo
        :name1 = '"Investments"'
        :name3 = '"Welfares"'
        :percent1 = payPercent
        :percent3 = welPercent
    ></progressInfo>
    <!-- end progress bar  -->
 
    <!-- clear member arrears modal  -->
    <clearWelfares
        :info   = classInfo.modalData
        :show   = classInfo.isClearOpen
        @reload = resetMembers
        @close  = closeClearMember
        @flash  = flashShow
        @hide   = flashHide
    ></clearWelfares>
    <!-- end clear member arrears modal  -->

    <!-- update member modal  -->
    <membersupdate
        :info   = classInfo.modalData
        :show   = classInfo.isOpen
        @reload = resetMembers
        @close  = closeMember
        @flash  = flashShow
        @hide   = flashHide
    ></membersupdate>
    <!-- end update member modal  -->

    <!-- delete member modal  -->
    <membersdelete
        :info   = classInfo.deleteData
        :show   = classInfo.isDeleteOpen
        :url    = classInfo.deleteURL
        @reload = resetMembers
        @close  = closeDelete
        @flash  = flashShow
        @hide   = flashHide
    ></membersdelete>
    <!-- end delete member modal  -->
</template>

<script setup>
    import { defineProps, defineEmits, reactive, onMounted } from 'vue'

    const emit = defineEmits(['reload', 'flash', 'loading', 'view', 'hide', 'timed'])

    const props = defineProps({
        member: {
            type: String,
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
        }
    });

    const classInfo = reactive({
        btn1: '',
        btn2: '',
        btn3: '',
        btn4: '',

        isOpen: false,
        isClearOpen: false,
        isOpenInfo: false,
        isDebtOpen: false,
        modalData: {},

        // delete info 
        isDeleteOpen: false,
        deleteData: {},
        deleteID: '',
        deleteURL: '/delete/member/reset/',

        svgClass: 'md:w-6 md:h-6 w-6 h-6',

        successBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-green-900 border-black bg-green-400 rounded-md shadow-md py-1 px-2 my-auto',
        infoBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-cyan-900 border-black bg-cyan-400 rounded-md shadow-md py-1 px-2 my-auto',
        failBadge : 'text-black dark:text-black md:text-sm text-2xs border dark:border-red-900 border-black bg-rose-400 rounded-md shadow-md py-1 px-2 my-auto',
    })

    onMounted(() => {
        set()
    })

    function telNo(member) {
        // Check if member.telephone is defined and is a string
        if (member.telephone && typeof member.telephone === 'string') {
            // If it doesn't start with "0", add it
            if (member.telephone[0] !== '0') {
                member.telephone = '0' + member.telephone;
            }
            return member.telephone;
        } else {
            return 0;
        }
    }

    function set() {
        let name = 'Member';

        classInfo.btn1 = 'Clear '+ name + ' Welfares';
        classInfo.btn2 = 'Update '+ name;
        classInfo.btn3 = 'Delete '+ name;
        classInfo.btn4 = 'Download '+ name + ' Excelsheet';
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

    function showClearMember(member) {
        classInfo.modalData = member;
        classInfo.isClearOpen    = true;
    }

    function closeClearMember() {
        classInfo.isClearOpen    = false;
        classInfo.modalData = {};
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

    function downloadLedger(member) {
        let name    = member.name;
        let url     = '/download/current/member/' + member.id;
        let header  = `Download Member Spreadsheet!`;
        let button  = `Download Sheet`;
        let body    = 'file';
        let message = 'Download ' + name + ' Payments and Welfare Ledger and records!';

        flashShowView(message, body, header, url, button, 15000, false);
    } 

    // reset
    function resetMembers() {
        // let link = 'desc';
        // let linkTo = 'id/';

        // axios.get('/api/getMembers/' + linkTo + link)
        //     .then(
        //         ({ data }) => {
        //             classInfo.info = data[0];
        //             // orderByID();
        //         });

        emit('reload')
    }
    // end modal functions 

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
</script>