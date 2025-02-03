module.exports = {
    packagerConfig: {
        icon: 'icons/chama_icon.ico',
        asar: false,
        ignore: [
            'www/node_modules',
            'www/storage/logs/*',
            'www/bootstrap/cache/*',
            'www/public/backup/*',
            'www/backups/*',
            // 'logs',
        ],
    },
    makers: [
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