// src/plugins/tooltip.js
export default {
    install(app) {
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
    },
};
