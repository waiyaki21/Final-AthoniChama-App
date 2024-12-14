export default{
    loaded: function(app){
        this.formInfo = [
            {  
                labelclass: 'block my-2 text-sm font-normal text-gray-900 dark:text-gray-400',
                formsuccess: false,
                buttoninfo: 'Submit',
                buttoninfoIcon: 'fas fa-paper-plane fa-1x',
                bluebtnClass: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-normal rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 align-items-end",
                whitebtnClass: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-normal rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 align-items-end",
                submitbtnClass: 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-normal rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 align-items-end',
                iconreloadclass: 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
                inputclass: 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
                infoText: "mt-2 text-sm text-gray-500 dark:text-gray-400",
            },
        ]
        return this.formInfo[0];
    },

    loading: function(app){
        this.formInfo = [
            {
                labelclass: 'block my-2 text-sm font-normal text-gray-900 dark:text-gray-400 text-orange',
                buttoninfo: 'Loading',
                buttoninfoIcon: 'fas fa-spinner fa-spin fa-15x',
                bluebtnClass: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-normal rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 align-items-end",
                whitebtnClass: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-normal rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 align-items-end",
                submitbtnClass: 'text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-normal rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700',
                iconreloadclass: 'fas fa-spinner fa-spin',
                inputclass: 'border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 form-warning',
            },
        ]
        return this.formInfo[0];
    },

    failed: function(app){
        this.formInfo = [
            {  
                labelErrorclass: 'block my-2 text-sm font-normal text-gray-900 dark:text-gray-400 text-danger',
                buttoninfo: 'Resubmit',
                buttoninfoIcon: 'fas fa-times fa-1x',
                bluebtnClass: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-normal rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 align-items-end",
                whitebtnClass: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-normal rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 align-items-end",
                submitbtnClass: 'text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-normal rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-red-700 dark:hover:bg-red-700 dark:focus:ring-red-800 align-items-end',
                iconreloadclass: 'fas fa-times px-2',
                inputclass: 'border text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-red-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500 form-danger option-font',
                infoText: "mt-2 font-normal text-sm text-danger",
            },
        ]
        return this.formInfo[0];
    },

    success: function(app){
        this.formInfo = [
            { 
                labelclass: 'block my-2 text-sm font-normal text-gray-900 dark:text-gray-400 text-success',
                formsuccess: true,
                buttoninfo: 'Success',
                buttoninfoIcon: 'fas fa-check fa-1x',
                bluebtnClass: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-normal rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 align-items-end",
                whitebtnClass: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-normal rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 align-items-end",
                submitbtnClass: 'focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-normal rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800',
                iconreloadclass: 'fas fa-check',
                inputclass: 'border text-green-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-green-700 dark:border-green-600 dark:placeholder-green-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500 form-success',
            },
        ]
        return this.formInfo[0];
    }
}