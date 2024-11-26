const release = require('gh-release');
const fs = require('fs');

const options = {
    owner: 'waiyaki21',
    repo: 'Final-AthoniChama-App',
    tag_name: `v${new Date().toISOString().split('T')[0]}`,
    target_commitish: 'main',
    name: 'New Release',
    body: 'Automated release via npm.',
    draft: false,
    prerelease: false,
    assets: fs.readdirSync('./dist').map(file => `./dist/${file}`)
};

release(options, (err, result) => {
    if (err) {
        console.error('Failed to create release:', err);
    } else {
        console.log('Release created successfully:', result.html_url);
    }
});
