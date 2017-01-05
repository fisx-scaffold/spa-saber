/**
 * @file 本地 web server 配置文件，更多信息见如下链接：
 *       https://github.com/ecomfe/edp-webserver
 *       https://github.com/wuhy/autoresponse
 *       https://github.com/wuhy/watchreload
 *
 *       TIP:
 *       1) 以发布目录进行调试查看，同时支持修改浏览器自动刷新命令：
 *          fisx release -wL
 *          fisx server start --release
 * @author ${#author#}
 */

/* global redirect:false */
/* global content:false */
/* global empty:false */
/* global home:false */
/* global autoless:false */
/* global html2js:false */
/* global file:false */
/* global less:false */
/* global stylus:false */
/* global livereload:false */
/* global php:false */
/* global proxyNoneExists:false */
/* global requireConfigInjector:false */
/* global autoresponse:false */

exports.port = 8848;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;

// 引入 rider 支持
var epr = require('edp-provider-rider');
var riderUI = require('rider-ui');

// 初始化 stylus 插件
epr.stylusPlugin = epr.plugin({

    // 隐式引入 rider
    implicit: true,

    // 是否解析 url 中的路径
    resolveUrl: true,

    // 追加 stylus 配置，可在此处引入 stylus 插件
    // @see: http://stylus-lang.com/docs/js.html#usefn
    use: function (style) {
        // 若引入 CSS 文件，內联文件内容
        style.set('include css', true);
    },

    // husl 插件，需要时启用
    // @see: http://www.boronine.com/husl/
    // husl: true,

    // autoprefixer 配置
    // @see: https://github.com/postcss/autoprefixer-core#usage
    autoprefixer: [
        'Android >= 2.3',
        'iOS >= 6',
        'ExplorerMobile >= 10'
    ]
});

// 指定匹配版本的 stylus
exports.stylus = epr.stylus;

exports.getLocations = function () {
    var requireInjector = requireConfigInjector();

    return [
        {
            location: /\/$/,
            handler: [
                home('index.html'),
                requireInjector
            ]
        },
        {
            location: /\.less($|\?)/,
            handler: [
                file(),
                less()
            ]
        },
        {
            location: /\.styl($|\?)/,
            handler: [
                file(),
                stylus({
                    stylus: epr.stylus,
                    use: function (style) {
                        style.use(epr.plugin());
                        // style.use(riderUI());
                    }
                })
            ]
        },

        {
            location: /^[^\?]+?\.tpl\.js($|\?)/,
            handler: [
                html2js()
            ]
        },

        // 添加 mock 处理器
        autoresponse('edp', {
            logLevel: 'debug',
            root: __dirname,
            handlers: requireInjector
        }),

        {
            location: /^.*$/,
            handler: [
                file(),
                proxyNoneExists()
            ]
        }
    ];
};

exports.injectRes = function (res) {
    for (var key in res) {
        if (res.hasOwnProperty(key)) {
            global[key] = res[key];
        }
    }
};

// disable watchreload setting false
exports.watchreload = {
    hmr: false,
    files: [
        'src/**/*',
        'index.html'
    ]
};
