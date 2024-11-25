const path = require('path');

module.exports = {
    packagerConfig: {
        icon: 'icons/chama_icon.ico',
        asar: true,
        ignore: [
            'www/node_modules',
            'www/storage/logs/*',
            'www/tests/*',
            'php',
            'www',
            'logs',
            'prev-main.js',
            'main copy.js'
        ],
        extraResource: [
            path.join(__dirname, 'php'), // Include the PHP binary and related files
            path.join(__dirname, 'www'),
        ],
    },
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                name: 'athonichama_app',
                setupIcon: 'icons/chama_icon.ico',
                setupExe: 'AthoniChamaAppSetup.exe',
                shortcutName: 'Athoni Chama App'
            }
        }
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
