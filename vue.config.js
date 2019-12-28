module.exports = {
    publicPath: `./`,
    configureWebpack: {
        resolve: {
            alias: {
                src: __dirname + '/src',
            }
        }
    }
};
