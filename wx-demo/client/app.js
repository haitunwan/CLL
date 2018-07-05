//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl)
    },
    globalData: {
        day: '',
        defaultCity: '',
        defaultCounty: '',
        heWeatherBase: "https://free-api.heweather.com",
        doubanBase: "http://localhost",  //https://api.douban.com
        juhetoutiaoBase: "https://v.juhe.cn/toutiao/index",
        tencentMapKey: "4HYBZ-EB23D-SLC42-HQ5R3-LP3LQ-OZFU5",
        heWeatherKey: "4a817b4338e04cc59bdb92da7771411e",
        juhetoutiaoKey: "a9f703a0200d68926f707f3f13629078",
        
    }
});