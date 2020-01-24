module.exports = {
    publicPath: `./`,
    configureWebpack: {
        resolve: {
            alias: {
                '@lapaliv/vue-picker/src': __dirname + '/src',
            }
        }
    },
    filenameHashing: false,
};
