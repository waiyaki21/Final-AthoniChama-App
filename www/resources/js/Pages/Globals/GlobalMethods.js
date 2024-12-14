// resources/js/Globals/GlobalMethods.js

// import { reactive } from "vue";

export default {
    install(app) {
        // Global goTo function using Inertia router
        app.config.globalProperties.$goTo = (url) => {
            app.config.globalProperties.$inertia.visit(url, { method: 'get', preserveScroll: true });
        };

        // Global tooltip function
        app.config.globalProperties.$tooltip = (content, placement = 'top', customClass = '') => {
            const basePopperClass = 'v-popper__theme-main animate__animated animate__fadeIn text-2xs';
            return {
                content: content,
                placement: placement,
                trigger: 'hover',
                distance: '10',
                skidding: '0',
                popperClass: `${basePopperClass} ${customClass}`.trim(), // Combine base and custom class
            };
        };

        // Global download file function using Axios
        app.config.globalProperties.$downloadFile = async (url) => {
            try {
                const response = await axios.get(url, {
                    responseType: 'blob' // Important for file download
                });

                // Create a Blob from the response
                const blob = new Blob([response.data], { type: response.headers['content-type'] });

                // Try to extract the filename from the Content-Disposition header
                const contentDisposition = response.headers['content-disposition'];
                let filename = '';
                if (contentDisposition && contentDisposition.includes('filename=')) {
                    filename = contentDisposition.split('filename=')[1].replace(/['"]/g, '');
                } else {
                    // Fallback to the filename from the URL
                    filename = url.split('/').pop();
                }

                // Create a temporary link element
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = filename;

                // Append the link, trigger the download, and remove the link
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                URL.revokeObjectURL(link.href); // Release memory
            } catch (error) {
                console.error('File download failed:', error);
            }
        };

        // Reactive global infoClasses
        // app.config.globalProperties.$infoClasses = reactive({
        //     infoSection: '',
        //     infoSectionInfo: 'w-full m-2 p-2 text-left mx-auto rounded-xl border-base shadow-md border border-cyan-500 p-1 overflow-hidden bg-cyan-400/10 dark:bg-cyan-400/10',
        //     infoSection100: 'w-full m-2 p-2 text-left mx-auto rounded-xl border-base shadow-md border border-emerald-500 p-1 overflow-hidden bg-emerald-400/10 dark:bg-emerald-400/10',
        //     infoSectionZero: 'w-full mx-2 mb-2 p-2 text-left mx-auto rounded-xl border-base shadow-md border border-rose-500 overflow-hidden bg-rose-400/10 dark:bg-rose-400/10',
        // });

        // // Global progressMain function
        // app.config.globalProperties.$progressClass = (percent) => {
        //     let percentMain     = percent;

        //     const infoClasses  = app.config.globalProperties.$infoClasses;

        //     if (percentMain === 100) {
        //         infoClasses.infoSection           = infoClasses.infoSection100;
        //     } else if (percentMain >= 50) {
        //         infoClasses.infoSection           = infoClasses.infoSectionInfo;
        //     } else {
        //         infoClasses.infoSection           = infoClasses.infoSectionZero;
        //     }
        // };
    }
};
