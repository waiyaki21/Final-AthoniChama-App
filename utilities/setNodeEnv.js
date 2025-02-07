const fs        = require('fs');

const { envFilePath } = require("./paths");

const setNodeEnv = (isDev) => {
    // const envFilePath = path.resolve(__dirname, '.env');

    const envContent = `NODE_ENV=${isDev ? 'development' : 'production'}`;

    // Write the NODE_ENV value to the .env file
    fs.writeFileSync(envFilePath, envContent, 'utf8');

    console.log(`NODE_ENV set to ${isDev ? 'development' : 'production'}`);
};

// Read argument from command line (default to false if not provided)
const isDev = process.argv[2] === 'true';
setNodeEnv(isDev);