module.exports = {

    // 配置跨域请求
    devServer: {
        port: 8080,
        host: 'localhost',
        open: true,
        https: false,
        proxy: {
            '/api': {
                target: 'http://1.117.164.153:8888/',
                // target: 'http://localhost:8888/',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}
