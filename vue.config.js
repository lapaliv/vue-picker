module.exports = {
    publicPath: `./`,
    configureWebpack: {
        resolve: {
            alias: {
                '@lapaliv/vue-picker': __dirname,
            }
        }
    },
    filenameHashing: false,
};
