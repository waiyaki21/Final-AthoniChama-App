<template>
    <div class="text-2xs font-boldened text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 w-full mb-2 mx-2 p-2 justify-between uppercase lg:hidden inline-flex">
        <ul class="flex flex-wrap -mb-px">
            <li class="me-2">
                <a :class="[classInfo.tab1]" @click="tabSwitch()">
                    {{ classInfo.tab1Name }}
                    <span
                        class="bg-blue-100 text-gray-800 md:text-2xs font-normal mx-1 px-1.5 py-0.5 rounded-full dark:bg-cyan-900 dark:text-white border-base border-cyan-900 dark:border-cyan-500 my-auto">
                        {{ classInfo.info.length }}
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
        <!-- projects table  -->
        <div :class="classInfo.projectsPage ? classInfo.projectsClass : classInfo.cyclesClass" v-if="classInfo.tab1show">
            <div class="w-full p-1">
                <h3 class="font-boldened md:text-2xl text-md text-gray-800 dark:text-gray-300 leading-tight uppercase p-1 w-full flex-col justify-between space-y-1 whitespace-nowrap">
                    <span class="w-full inline-flex justify-start gap-1">
                        <span class="underline mr-1" v-html="classInfo.projectsPage ? `All Projects Info.` : `${ cycle.name } projects.`"></span>
                        <span class="text-gray-500 dark:text-gray-500 md:text-sm sm:text-xs md:mt-4 sm:mt-1">
                            ( {{ allProjects.length }} ) projects
                        </span>
                    </span>
                </h3>

                <!-- search  -->
                <searchHelper :total=classInfo.info.length :new=allProjects.length name="projects" @search=setSearch></searchHelper>

                <hr-line :color="allProjects.length == 0 ? 'border-red-500/50 dark:border-red-500/50' : 'border-blue-500/50 dark:border-blue-500/50'"></hr-line>

                <div class="py-2 relative overflow-x-auto overflow-y-scroll h-auto max-h-[35rem]" v-if="!classInfo.isLoading">
                    <h2 class="font-normal font-boldened text-2xl text-center text-red-800 dark:text-red-600 leading-tight uppercase underline py-1"
                        v-if="allProjects.length == 0">
                        <span v-if="classInfo.search != ''">
                            NO SUCH PROJECT IN THIS CYCLE:
                            <br>
                            <span class="text-amber-500 dark:text-amber-500 underline text-xl">
                                {{ classInfo.search }}!!
                            </span>
                        </span>
                        <span v-else>NO PROJECTS IN THIS CYCLE!!</span>
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
                                    @click="orderByTarget()">
                                    <div class="flex items-center">
                                        Target
                                        <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"  @click="classInfo.ascending = !classInfo.ascending"></updown-icon>
                                    </div>
                                </td>
                                <td scope="col" class="px-1 uppercase hover:underline hover:text-white cursor-pointer"
                                    @click="orderByExp()">
                                    <div class="flex items-center">
                                        T. Expenses.
                                        <updown-icon class="w-3 h-3 md:w-4 md:h-4 ml-0.5"  @click="classInfo.ascending = !classInfo.ascending"></updown-icon>
                                    </div>
                                </td>
                                <td scope="col" class="px-1 uppercase hover:underline hidden md:table-cell">
                                    <div class="flex items-center">
                                        Balances.
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
                                v-for="(project, index) in allProjects" preserve-scroll>
                                <td class="px-1 text-gray-900 whitespace-nowrap dark:text-white">
                                    {{ index + 1 }}.
                                </td>
                                <td scope="row" class="p-1 uppercase text-gray-900 whitespace-nowrap dark:text-white">
                                    <!-- progress bar  -->
                                    <a @click="viewProject(project)" class="cursor-pointer">
                                        <span class="hover:underline text-sm md:text-md">
                                            {{ project.name }}
                                        </span>
                                        <!-- progress bar  -->
                                        <progressTable :percent=percentProject(project) :name=project.name></progressTable>
                                    </a>
                                    <!-- end progress bar  -->
                                </td>
                                <td class="p-1 text-blue-600 hidden md:table-cell">
                                    ksh {{ Number(project.target).toLocaleString() }}
                                </td>
                                <td class="p-1 text-orange-500">
                                    ksh {{ Number(project.total_expenses).toLocaleString() }}
                                </td>
                                <td class="p-1 inlne-flex hidden md:table-cell">
                                    <section class="inline-flex justify-start uppercase font-medium text-sm">
                                        <span class="text-green-600"
                                            v-if="percentProject(project) >= 100">
                                            cleared
                                        </span>
                                        <span class="text-red-600" v-else>
                                            ksh {{ Number(project.target - project.total_expenses).toLocaleString() }}
                                        </span>
                                        <check-icon class="w-5 h-5 ml-1 text-green-600" v-if="percentProject(project) >= 100"></check-icon>
                                        <times-icon class="w-5 h-5 ml-1 text-red-600" v-else></times-icon>
                                    </section>
                                </td>
                                <td class="p-2">
                                    <div class="inline-flex rounded-md gap-0.5" role="group">
                                        <!-- edit  -->
                                        <button type="button"
                                            class="inline-flex items-center p-0.5 text-2xs font-medium text-cyan-900 bg-transparent rounded-md hover:text-white focus:z-10 focus:ring-1 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:text-cyan-700 dark:hover:text-cyan-400 shadow"
                                            @click="showProject(project)">
                                            <edit-icon class="w-4 h-4"></edit-icon>
                                            <!-- Edit -->
                                        </button>
                                        <!-- delete  -->
                                        <button type="button"
                                            class="inline-flex items-center p-0.5 text-2xs font-medium text-red-900 bg-transparent rounded-md hover:text-white focus:z-10 focus:ring-1 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:text-red-700 dark:hover:text-red-400 shadow"
                                            @click="showDelete(project)">
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

        <!-- projects form  -->
        <section class="col-span-1" v-if="classInfo.tab2show">
            <div
                class="bg-cyan-100 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg rounded-md font-boldened border-base border-cyan-300 dark:border-cyan-700">
                <div class="p-1">
                    <h3
                        class="font-boldened lg:text-3xl md:text-2xl text-xl text-gray-800 dark:text-gray-300 leading-tight uppercase py-1 px-1 whitespace-nowrap">
                        Add New projects.
                    </h3>
                    <form @submit.prevent="submit" class="p-1">
                        <div>
                            <InputLabel for="name" value="name" />

                            <TextInput id="name" type="name" v-model="form.name" autofocus />

                            <InputError class="mt-1" :message="form.errors.name" />
                        </div>

                        <div>
                            <InputLabel for="target" value="Project Target" />

                            <TextInput id="target" type="number" v-model="form.target" autofocus />

                            <InputError class="mt-1" :message="form.errors.target" />
                        </div>

                        <div class="flex items-center justify-start mt-2">
                            <SubmitButton :loading="form.processing" :success="form.wasSuccessful" :failed="form.hasErrors" :editting="form.isDirty">
                                Submit Projects
                            </SubmitButton>
                        </div>
                    </form>
                </div>
            </div>
        </section>
        <!-- projects form  -->
    </div>

    <!-- update project modal  -->
    <projectsupdate :info=classInfo.modalData :show=classInfo.isOpen @reload=getInfo @close=closeProject @flash = flashShow @hide = flashHide>
    </projectsupdate>
    <!-- end update project modal  -->

    <!-- delete project modal  -->
    <projectsdelete :info=classInfo.deleteData :show=classInfo.isDeleteOpen :url=classInfo.deleteURL @reload=getInfo @close=closeDelete @flash = flashShow @hide = flashHide></projectsdelete>
    <!-- end delete project modal  -->
</template>

<script setup>
    import { useForm , router } from '@inertiajs/vue3';
    import { defineProps, defineEmits, reactive, computed, onMounted, watch , onUnmounted, ref } from 'vue'

    const props = defineProps({
        projects: {
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
        setInfo()
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

    // alerts classes 
    const alerts = reactive({
        alertType: '',
        flashMessage: '',
    })

    const form = useForm({
        name: '',
        target: '',
    })

    const classInfo = reactive ({
        // search
        search: '',
        // sort 
        ascending: true,
        sortBy: 'id',

        // form-data 
        isOpen: false,
        modalData: {},

        // delete info 
        isDeleteOpen: false,
        deleteData: {},
        deleteID: '',
        deleteURL: '/delete/project/',

        // projects data 
        info: [],

        // order 
        nameOrder: true,
        targetOrder: false,
        expOrder: false,
        percentOrder: false,

        isLoading: true,

        projectsPage: true,

        projectsClass: 'bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-md sm:rounded-lg rounded-md border-base border-cyan-300 dark:border-cyan-700 h-fit w-full col-span-1 lg:col-span-2',
        cyclesClass: 'bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-md sm:rounded-lg rounded-md border-base border-blue-300 dark:border-blue-700 h-fit w-full col-span-1 lg:col-span-2',

        // tabs 
        tabActive: 'inline-block p-2 text-blue-600 border-b-base border-blue-600 rounded-t-lg active dark:text-sky-500 dark:border-blue-500 text-2xs md:text-2xs cursor-pointer',
        tabInactive: 'inline-block p-2 border-b-base border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:text-gray-300 dark:hover:text-gray-50 text-2xs md:text-2xs cursor-pointer',
        tab1: '',
        tab2: '',
        tab1show: true,
        tab2show: false,
        tab1Name: 'Projects Info',
        tab2Name: 'Enter Projects',
    })

    // computed 
    const allProjects = computed(() => {
        let tempProjects = classInfo.info

        // search rows 
        if (classInfo.search != '' && classInfo.search) {
            tempProjects = tempProjects.filter((project) => {
                return project.name
                    .toUpperCase()
                    .includes(classInfo.search.toUpperCase())
            })
        }

        // Sort Projects
        tempProjects = tempProjects.sort((a, b) => {
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
            } else if (classInfo.sortBy == 'target') {
                return a.target - b.target
            } else if (classInfo.sortBy == 'total_expenses') {
                return a.total_expenses - b.total_expenses
            }
        })

        // Show sorted array in descending or ascending order
        if (!classInfo.ascending) {
            tempProjects.reverse()
        }

        return tempProjects
    })

    function setSearch(i) {
        classInfo.search = i;
    }

    function setInfo() {
        updateWidth();

        classInfo.info = props.projects;

        if (screenWidth.value >= 1024) {
            allSwitch();
        } else {
            tabSwitch();
        }
    }

    function percentProject(project) {
        let percent = Math.floor(project.total_expenses / project.target * 100);
        return percent;
    }

    function viewProject(project) {
        let url = '/project/' + project.id;
        router.visit(url, {
            preserveScroll: true
        })
    }

    function submit() {
        let name = form.name;
        let url = '/project/';

        form.post(url, {
            onFinish: () => form.reset(['name', 'target']),
            onSuccess: () => [
                alerts.flashMessage   = 'New Project: ' + name + ' Added!',
                alerts.alertType      = 'success',
                getInfo(),
                emit('reload'),
                flashShow(alerts.flashMessage, alerts.alertType),
                clearFields(),
            ],
        });
    }

    function getInfo() {
        classInfo.info = [];
        let link = '';
        let linkTo = 'id/';

        if (classInfo.nameOrder == true) {
            link = 'desc';
        } else {
            link = 'asc';
        }

        if (route().current() == 'View Cycle Payments') {
            classInfo.projectsPage = false;
            let url = '/api/getCycleProjects/' + props.cycle.id

            axios.get(url)
                .then(
                    ({ data }) => {
                        classInfo.info = data[0];
                        classInfo.isLoading = false
                    });
        } else {
            classInfo.projectsPage = true;
            let url = '/api/getProjects/' + linkTo + link

            axios.get(url)
                .then(
                    ({ data }) => {
                        classInfo.info = data[0];
                        classInfo.isLoading = false
                    });
        }  
    }

    function LoadingOn() {
        classInfo.ascending = !classInfo.ascending;
        classInfo.isLoading = true 
    }

    function LoadingOff() {
        flashShow(alerts.flashMessage, alerts.alertType);
        classInfo.isLoading = false
    }

    // order rows 
    function orderBy(sortBy, ordername) {
        LoadingOn();

        classInfo.sortBy = sortBy;
        classInfo.ordername = ordername;

        classInfo.flashMessage = `Projects Sorted By: ${ordername.toLowerCase()} ${classInfo.ascending ? 'ascending' : 'descending'}`;
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

    function orderByTarget() {
        orderBy('target', 'TARGET');
    }

    function orderByExp() {
        orderBy('total_expenses', 'TOTAL EXPENSES');
    }


    function clearFields() {
        form.name = '';
        form.target = '';
    }

    // modals 
    function showProject(project) {
        classInfo.modalData = project;
        classInfo.isOpen    = true;
    }

    function closeProject() {
        classInfo.isOpen    = false;
        classInfo.modalData = {};
    }

    function showDelete(project) {
        classInfo.deleteData    = project;
        classInfo.deleteID      = project.id;
        classInfo.isDeleteOpen  = true;
    }

    function closeDelete() {
        classInfo.isDeleteOpen  = false;
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