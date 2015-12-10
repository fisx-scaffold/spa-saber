/**
 * @file fisx 编译的配置文件
 * @author ${author}
 */

var pageFiles = ['index.html'];

// 初始化要编译的样式文件: 只处理页面引用的样式文件
var _ = fis.util;
var styleFiles = _.extractLinkStyleFileSync({
    files: pageFiles
});

var epr = require('edp-provider-rider');
var riderUI = require('rider-ui');
var stylusPlugin = epr.plugin();
fis.addProcessStyleFiles(styleFiles, {
    use: function (stylus) {
        stylus.use(stylusPlugin);
        stylus.use(riderUI());
    }
}, true);

// 启用相对路径
fis.match('index.html', {
    relative: true
}).match('*.js', {
    relative: true
}).match('*.css', {
    relative: true
});

// tpl -> js 模块
fis.match('/src/(**.tpl)', {
    preprocessor: fis.plugin('html2js', {
        format: false
    }),
    useHash: true,
    release: '/asset/$1.tpl',
    rExt: '.js'
});

// 启用 amd 模块编译
fis.hook('amd', {
    config: fis.getModuleConfig()
});

// 启用打包插件
fis.match('::package', {
    packager: fis.plugin('static', {
        // 内联 `require.config`
        inlineResourceConfig: true,
        page: {
            files: pageFiles,
            // 打包页面异步入口模块
            packAsync: true
        }
    })
});
