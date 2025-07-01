module.exports = {
    apps: [
        {
            name: 'email-extractor-api',
            script: './app.js',
            instances: 'max',
            exec_mode: 'cluster',
            watch: false,
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
};
