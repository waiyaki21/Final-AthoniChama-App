// const path = require('path');

module.exports = {
    packagerConfig: {
        icon: 'icons/chama_icon.ico',
        asar: false,
        ignore: [
            'www/node_modules',
        //     'www/storage/logs/*',
        //     'www/tests/*',
        //     'php',
        //     'www',
        //     'logs',
        //     'prev-main.js',
        //     'main-new.js',
        //     /node_modules\/.*(?!node-php-server)/, // Include node-php-server in the build
        //     /node_modules\/.*(?!electron-log)/, // Include node-php-server in the build
        ],
        // extraResource: [
        //     path.join(__dirname, 'php'), // Include the PHP binary and related files
        //     path.join(__dirname, 'www'),
        //     path.join(__dirname, 'utilities'),
        //     path.join(__dirname, 'node_modules', 'node-php-server'),
        //     path.join(__dirname, 'node_modules', 'electron-log'),
        // ],
    },
    makers: [
        // {
        //     name: '@electron-forge/maker-zip', // Generic ZIP installer
        //     platforms: ['win32'],
        // },
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                name: 'athonichama_app',
                setupIcon: 'icons/chama_icon.ico',
                setupExe: 'AthoniChamaAppSetup.exe',
                shortcutName: 'Athoni Chama App',
                // loadingGif: 'icons/loading_icon.gif'
            },
        },
    ],
    publishers: [
        {
            name: '@electron-forge/publisher-github',
            config: {
                repository: {
                    owner: 'waiyaki21',
                    name: 'Final-AthoniChama-App'
                },
                prerelease: false,
                draft: true,
                generateReleaseNotes: true,
                force: true,
                tagPrefix: 'v',
            }
        }
    ]
};