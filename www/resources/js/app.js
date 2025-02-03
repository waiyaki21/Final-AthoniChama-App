import './bootstrap';
import '../css/app.css';

import 'flowbite';

import Notifications from '@kyvg/vue3-notification';
import 'animate.css';

import FloatingVue from 'floating-vue';
import 'floating-vue/dist/style.css';

import { createApp, h }                             from 'vue';
import { createInertiaApp, Head, router, Link }     from '@inertiajs/vue3';
import { ZiggyVue }                                 from '../../vendor/tightenco/ziggy/dist/vue.m';

// form imports 
import InputError       from '@/Components/FormComponents/InputError.vue';
import InputLabel       from '@/Components/FormComponents/InputLabel.vue';
import LabelHelper      from '@/Components/FormComponents/LabelHelper.vue';
import SubmitButton     from '@/Components/FormComponents/SubmitButton.vue';
import SubmitFile       from '@/Components/FormComponents/SubmitFile.vue';
import TextInput        from '@/Components/FormComponents/TextInput.vue';
import PrimaryButton    from '@/Components/PrimaryButton.vue';
import SecondaryButton  from '@/Components/SecondaryButton.vue';
import DangerButton     from '@/Components/DangerButton.vue';
import ApplicationLogo  from '@/Components/ApplicationLogo.vue';

//modal
import Modal            from '@/Components/Modal.vue';
import Dropdown         from '@/Components/Dropdown.vue';

//Import the components:
// layout 
import MainLayout       from './Pages/Layouts/AppLayout.vue';
import GuestLayout      from './Pages/Layouts/GuestLayout.vue';

// alerts
import toast            from './Pages/Components/alerts/toast-simple.vue';

// crumbs
import maincrumbs       from './Pages/Components/breadcrumbs/main-crumbs.vue';

// forms
import cycleform        from './Pages/Components/forms/cycle-form.vue';
import infocycle        from './Pages/Components/forms/cycles/infocycle-form.vue';

// members
import membersform      from './Pages/Components/forms/members-form.vue';
import membersMainForm  from './Pages/Components/forms/main-forms/main-members.vue';

// cycle
import MainCycle        from './Pages/Components/forms/main-forms/main-cycle.vue';

// ledger
// import ledgerform       from './Pages/Components//modal-forms/ledger-modalform.vue';

// profile
import DeleteUserForm   from './Pages/Profile/Partials/DeleteUserForm.vue';
import UpdatePasswordForm from './Pages/Profile/Partials/UpdatePasswordForm.vue';
import UpdateProfileInformationForm from './Pages/Profile/Partials/UpdateProfileInformationForm.vue';

// tables
import memberstable     from './Pages/Components/tables/members-table.vue';
import paymentstable    from './Pages/Components/tables/payments-table.vue';
import welfarestable    from './Pages/Components/tables/welfares-table.vue';
import cyclestable      from './Pages/Components/tables/cycles-table.vue';
import expensestable    from './Pages/Components/tables/expenses-table.vue';
import projecttable     from './Pages/Components/tables/project-table.vue';
import CycleExpensesTable from './Pages/Components/tables/cycleExpenses-table.vue';

// infopanels
import infoBlock        from './Pages/Components/infopanel/utilities/infoBlock.vue';
import dashboardinfo    from './Pages/Components/infopanel/dashboard-info.vue';
import cyclesinfo       from './Pages/Components/infopanel/cycles-info.vue';
import ledgerInfo       from './Pages/Components/infopanel/ledger-info.vue';
import membersinfo      from './Pages/Components/infopanel/members-info.vue';
import memberinfo       from './Pages/Components/infopanel/member-info.vue';
import paymentinfo      from './Pages/Components/infopanel/payment-info.vue';
import expensesinfo     from './Pages/Components/infopanel/expenses-info.vue';
import projectinfo      from './Pages/Components/infopanel/project-info.vue';
import MemberTableInfo  from './Pages/Components/infopanel/memberTable-info.vue';

// sidepanels
import memberside       from './Pages/Components/sidepanel/member-side.vue';
import paymentSide      from './Pages/Components/sidepanel/payments-side.vue';

// modals
import membersadd       from './Pages/Components/modals/members/members-add.vue';
import membersupdate    from './Pages/Components/modals/members/members-update.vue';
import membersdelete    from './Pages/Components/modals/members/members-delete.vue';
import membersactive    from './Pages/Components/modals/members/members-active.vue';
import clearWelfares    from './Pages/Components/modals/members/member-clearWelfares.vue';
import paymentsupdate   from './Pages/Components/modals/payments/payments-update.vue';
import paymentsdelete   from './Pages/Components/modals/payments/payments-delete.vue';
import expensesupdate   from './Pages/Components/modals/expenses/expenses-update.vue';
import expensesdelete   from './Pages/Components/modals/expenses/expenses-delete.vue';
import welfaresupdate   from './Pages/Components/modals/welfares/welfares-update.vue';
import welfaresdelete   from './Pages/Components/modals/welfares/welfares-delete.vue';
import projectsupdate   from './Pages/Components/modals/projects/projects-update.vue';
import projectsdelete   from './Pages/Components/modals/projects/projects-delete.vue';
import cyclesupdate     from './Pages/Components/modals/cycles/cycles-update.vue';
import cyclesdelete     from './Pages/Components/modals/cycles/cycles-delete.vue';
import cyclesaddModal   from './Pages/Components/modals/cycles/cycles-addModal.vue';
import ledgersaddModal  from './Pages/Components/modals/ledgers/ledgers-addModal.vue';
import autoSetup        from './Pages/Components/modals/setup/autoSetup-modal.vue';
import CycleExpensesUpdate from './Pages/Components/modals/cycleExpenses/cycleExpenses-update.vue';
import CycleExpensesDelete from './Pages/Components/modals/cycleExpenses/cycleExpenses-delete.vue';
import CycleExpensesNamesUpdate from './Pages/Components/modals/cycleExpensesNames/cycleExpensesNames-update.vue';
import CycleExpensesNamesDelete from './Pages/Components/modals/cycleExpensesNames/cycleExpensesNames-delete.vue';

// main tabs 
import MainMembersTabs  from './Pages/Components/tabs/MainTabs/members-tabs.vue';
import MainCycleTabs    from './Pages/Components/tabs/MainTabs/cycle-tabs.vue';
import MainSettingTabs  from './Pages/Components/tabs/MainTabs/settings-tabs.vue';
import MainLedgerTabs   from './Pages/Components/tabs/MainTabs/ledger-tabs.vue';

// others
import progressTable    from './Pages/Components/progress/progressTable.vue';
import progressInfo     from './Pages/Components/progress/progressInfo.vue';
import progressForm     from './Pages/Components/progress/progressForm.vue';
import loading          from './Pages/Utilities/LoadingBody.vue';
import loadingTable     from './Pages/Utilities/LoadingTable.vue';
import ledgerDrop       from './Pages/Utilities/DropdownCycles.vue';

import search           from './Pages/Utilities/search/searchHelper.vue';

// GlobalMethods 
import GlobalMethods    from './Pages/Globals/GlobalMethods.js';

// utilities icons
import infoIcon         from './Pages/Utilities/icons/infoIcon.vue';
import LoaderIcon       from './Pages/Utilities/icons/loaderIcon.vue';
import CloudIcon        from './Pages/Utilities/icons/cloudIcon.vue';
import hrLine           from './Pages/Utilities/hrLine/hrLine.vue';

// utilities table
import NotFound         from './Pages/Utilities/Tables/Table-NotFound.vue';

// buttons 
import actionButton     from './Pages/Utilities/Button/actionButton.vue';
import styleButton      from './Pages/Utilities/Button/styleButton.vue';
import tabButton        from './Pages/Utilities/Button/tabButton.vue';
import ModalHeader      from './Pages/Utilities/Modals/ModalHeader.vue';
import viewToggle       from './Pages/Utilities/Dashboard/viewToggle.vue';

import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, CheckIcon, XMarkIcon, HomeIcon, DocumentCheckIcon, PencilIcon, TrashIcon, FolderArrowDownIcon, PhoneIcon, ChevronUpDownIcon, CalendarDaysIcon, PlusIcon, TableCellsIcon, DocumentPlusIcon, MagnifyingGlassIcon, BellAlertIcon, ArrowPathIcon, CurrencyDollarIcon, ClockIcon, MoonIcon, LightBulbIcon, UserGroupIcon, ArrowUpTrayIcon, ArrowDownTrayIcon, HandRaisedIcon, PaperAirplaneIcon, SparklesIcon, UserPlusIcon, DocumentArrowDownIcon, CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon, HomeModernIcon, XCircleIcon, PresentationChartLineIcon, Cog8ToothIcon, UserIcon, ArrowUpCircleIcon, ArrowDownCircleIcon, ArrowLeftCircleIcon, ArrowRightCircleIcon, UserMinusIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon, Bars3Icon } from '@heroicons/vue/24/solid';

const appName       = import.meta.env.VITE_APP_NAME;
const appShortName  = process.env.PACKAGE_NAME;
const appVersion    = process.env.PACKAGE_VERSION;

createInertiaApp({
    title: (title) => `${title} - ${appShortName} v${appVersion}`,
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.vue', { eager: true })
        let page    = pages[`./Pages/${name}.vue`]
        page.default.layout = page.default.layout || MainLayout;
        // page.default.layout = MainLayout;

        return page;
    },
    setup({ el, App, props, plugin }) {
        return createApp({ render: () => h(App, props) })
            // external imports
            .use(plugin)
            .use(ZiggyVue, Ziggy)
            .use(Notifications)
            .use(FloatingVue)

            // icons 
            .component('updown-icon',       ChevronUpDownIcon)
            .component('download-icon',     DocumentArrowDownIcon)
            .component('download-info',     FolderArrowDownIcon)
            .component('down-icon',         ChevronDownIcon)
            .component('left-icon',         ChevronLeftIcon)
            .component('right-icon',        ChevronRightIcon)
            .component('up-icon',           ChevronUpIcon)
            .component('home-icon',         HomeIcon)
            .component('times-icon',        XMarkIcon)
            .component('check-icon',        CheckIcon)
            .component('info-icon',         infoIcon)
            .component('hr-line',           hrLine)
            .component('delete-icon',       TrashIcon)
            .component('edit-icon',         PencilIcon)
            .component('phone-icon',        PhoneIcon)
            .component('document-check',    DocumentCheckIcon)
            .component('calendar-icon',     CalendarDaysIcon)
            .component('add-icon',          PlusIcon)
            .component('sheets-icon',       TableCellsIcon)
            .component('tempDown-icon',     DocumentPlusIcon)
            .component('search-icon',       MagnifyingGlassIcon)
            .component('loader-icon',       LoaderIcon)
            .component('loading-icon',      ArrowPathIcon)
            .component('bell-icon',         BellAlertIcon)
            .component('warning-icon',      ExclamationTriangleIcon)
            .component('money-icon',        CurrencyDollarIcon)
            .component('stop-icon',         HandRaisedIcon)
            .component('clock-icon',        ClockIcon)
            .component('loading-icon',      ArrowPathIcon)
            .component('dark-icon',         MoonIcon)
            .component('light-icon',        LightBulbIcon)
            .component('members-icon',      UserGroupIcon)
            .component('upload-icon',       ArrowUpTrayIcon)
            .component('downtray-icon',     ArrowDownTrayIcon)
            .component('cloud-icon',        CloudIcon)
            .component('checksolid-icon',   CheckCircleIcon)
            .component('timessolid-icon',   XCircleIcon)
            .component('submit-icon',       PaperAirplaneIcon)
            .component('star-icon',         SparklesIcon)
            .component('newmember-icon',    UserPlusIcon)
            .component('up-arrow',          ArrowUpCircleIcon)
            .component('down-arrow',        ArrowDownCircleIcon)
            .component('left-arrow',        ArrowLeftCircleIcon)
            .component('right-arrow',       ArrowRightCircleIcon)
            .component('warningsolid-icon', ExclamationCircleIcon)
            .component('homesolid-icon',    HomeModernIcon)
            .component('chart-icon',        PresentationChartLineIcon)
            .component('settings-icon',     Cog8ToothIcon)
            .component('user-icon',         UserIcon)
            .component('logout-icon',       UserMinusIcon)
            .component('expand-icon',       ArrowsPointingOutIcon)
            .component('inward-icon',       ArrowsPointingInIcon)
            .component('bars-icon',         Bars3Icon)

        
            // inertia js components 
            .component('router', router)
            .component('Link', Link)
            .component('Head', Head)

            // defaults form and modal 
            .component('InputError', InputError)
            .component('InputLabel', InputLabel)
            .component('LabelHelper', LabelHelper)
            .component('SubmitButton', SubmitButton)
            .component('SubmitFile', SubmitFile)
            .component('PrimaryButton', PrimaryButton)
            .component('SecondaryButton', SecondaryButton)
            .component('DangerButton', DangerButton)
            .component('TextInput', TextInput)
            .component('Modal', Modal)
            .component('Dropdown', Dropdown)
            .component('ledgerDrop',ledgerDrop)
            .component('ApplicationLogo', ApplicationLogo)

            // alerts
            .component('toast', toast)

            // crumbs
            .component('maincrumbs', maincrumbs)

            // info 
            .component('infoBlock', infoBlock)
            .component('dashboardinfo', dashboardinfo)
            .component('cyclesinfo', cyclesinfo)
            .component('ledgerInfo', ledgerInfo)
            .component('membersinfo', membersinfo)
            .component('memberinfo', memberinfo)
            .component('paymentinfo', paymentinfo)
            .component('expensesinfo', expensesinfo)
            .component('projectinfo', projectinfo)
            .component('memberTableInfo', MemberTableInfo)

            // sides
            .component('memberside', memberside)
            .component('paymentSide', paymentSide)

            // modals
            .component('membersadd',    membersadd)
            .component('membersupdate', membersupdate)
            .component('membersdelete', membersdelete)
            .component('membersactive', membersactive)
            .component('clearWelfares', clearWelfares)
            .component('paymentsupdate', paymentsupdate)
            .component('paymentsdelete', paymentsdelete)
            .component('expensesupdate', expensesupdate)
            .component('expensesdelete', expensesdelete)
            .component('welfaresupdate', welfaresupdate)
            .component('welfaresdelete', welfaresdelete)
            .component('projectsupdate', projectsupdate)
            .component('projectsdelete', projectsdelete)
            .component('cyclesupdate',   cyclesupdate)
            .component('cyclesdelete',   cyclesdelete)
            .component('cyclesaddModal',   cyclesaddModal)
            .component('ledgersaddModal',  ledgersaddModal)
            // .component('autoSetup',        autoSetup)
            .component('cyclesExpensesupdate', CycleExpensesUpdate)
            .component('cyclesExpensesdelete', CycleExpensesDelete)
            .component('cyclesExpensesNamesupdate', CycleExpensesNamesUpdate)
            .component('cyclesExpensesNamesdelete', CycleExpensesNamesDelete)
            .component('ModalHeader',               ModalHeader)

            // forms
            // members
            .component('membersform', membersform)
            .component('mainmembers-form', membersMainForm)

            // ledger
            // .component('ledgerform', ledgerform)

            // cycles
            .component('cycleform', cycleform)
            .component('maincycle-form', MainCycle)
            .component('infocycle', infocycle)

            // profile
            .component('DeleteUserForm', DeleteUserForm)
            .component('UpdatePasswordForm', UpdatePasswordForm)
            .component('UpdateProfileInformationForm', UpdateProfileInformationForm)

            // tables
            .component('memberstable', memberstable)
            .component('paymentstable', paymentstable)
            .component('welfarestable', welfarestable)
            .component('cyclestable', cyclestable)
            .component('expensestable', expensestable)
            .component('projecttable', projecttable)
            .component('cycleExpensestable', CycleExpensesTable)

            .component('notFound',      NotFound)

            // main tabs
            .component('mainMemberTabs',  MainMembersTabs)
            .component('mainCycleTabs',   MainCycleTabs)
            .component('mainSettingTabs', MainSettingTabs)
            .component('mainLedgerTabs',  MainLedgerTabs)

            // progress bar
            .component('progressTable', progressTable)
            .component('progressInfo', progressInfo)
            .component('progressForm', progressForm)
            .component('loading', loading)
            .component('loadingTable', loadingTable)

            // search
            .component('searchHelper', search)

            // buttons
            .component('ActionButton', actionButton)
            .component('StyleButton', styleButton)
            .component('tabButton', tabButton)
            .component('viewToggle', viewToggle)

            // plugins 
            .use(GlobalMethods)
            .mount(el);
    },
    progress: {
        color: '#079cba',
        showSpinner: true
    },
});
