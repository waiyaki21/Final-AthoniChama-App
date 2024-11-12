// progressMainPlugin.js
export default {
    install(app) {
        app.config.globalProperties.$progressMain = (classInfo, value, total) => {
            let percentMain = Math.floor((value) / total * 100);

            if (percentMain === 100) {
                classInfo.progressMainClass     = classInfo.progressMainClass100;
                classInfo.progressMainBorder    = classInfo.progressMainBorder100;
                classInfo.infoHeader            = classInfo.infoHeader100;
                classInfo.infoSection           = classInfo.infoSection100;
            } else if (percentMain >= 50) {
                classInfo.progressMainClass     = classInfo.progressMainClassInfo;
                classInfo.progressMainBorder    = classInfo.progressMainBorderInfo;
                classInfo.infoHeader            = classInfo.infoHeaderInfo;
                classInfo.infoSection           = classInfo.infoSectionInfo;
            } else {
                classInfo.progressMainClass     = classInfo.progressMainClassZero;
                classInfo.progressMainBorder    = classInfo.progressMainBorderZero;
                classInfo.infoHeader            = classInfo.infoHeaderZero;
                classInfo.infoSection           = classInfo.infoSectionZero;
            }
        };
    }
};
