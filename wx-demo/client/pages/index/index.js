//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

const app = getApp()
Page({
    data: {
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: '',
        sliderList: [
          { selected: true, imageSource: '../../images/cidian.png' },
          { selected: false, imageSource: '../../images/2.jpg' },
          { selected: false, imageSource: '../../images/food.png' },
        ],
        today: "",
        location: '',
        county: '',
        containerShow: true,
        weatherData: '',
        inTheaters: {},
        air: '',
        dress: ''
    },
    onLoad: function(options){
      //更新当前日期
      app.globalData.day = util.formatTime(new Date()).split(' ')[0];
      this.setData({
        today: app.globalData.day
      });
      //定位当前城市
      this.getLocation();
      //获取豆瓣电影正在热映信息
      var inTheatersUrl = app.globalData.doubanBase +
        "/v2/movie/in_theaters" + "?start=0&count=6";
      this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
    },
    switchTab: function(e){
      var sliderList = this.data.sliderList;
      var i, item;
      for (i = 0; item = sliderList[i]; ++i) {
        item.selected = e.detail.current == i;
      }
      this.setData({
        sliderList: sliderList
      });
    },

    //定位当前城市
    getLocation: function () {
      var that = this;
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          //当前的经度和纬度
          let latitude = res.latitude
          let longitude = res.longitude
          wx.request({
            url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${app.globalData.tencentMapKey}`,
            success: res => {
              app.globalData.defaultCity = app.globalData.defaultCity ? app.globalData.defaultCity : res.data.result.ad_info.city;
              app.globalData.defaultCounty = app.globalData.defaultCounty ? app.globalData.defaultCounty : res.data.result.ad_info.district;
              that.setData({
                location: app.globalData.defaultCity,
                county: app.globalData.defaultCounty
              });
              that.getWeather();
              that.getAir();
            }
          })
        }
      })
    },
    //获取天气
    getWeather: function (e) {
      var length = this.data.location.length;
      var city = this.data.location.slice(0, length - 1); //分割字符串
      console.log(city);
      var that = this;
      var param = {
        key: app.globalData.heWeatherKey,
        location: city
      };
      //发出请求
      wx.request({
        url: app.globalData.heWeatherBase + "/s6/weather",
        data: param,
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          app.globalData.weatherData = res.data.HeWeather6[0].status == "unknown city" ? "" : res.data.HeWeather6[0];
          var weatherData = app.globalData.weatherData ? app.globalData.weatherData.now : "暂无该城市天气信息";
          var dress = app.globalData.weatherData ? res.data.HeWeather6[0].lifestyle[1] : { txt: "暂无该城市天气信息" };
          that.setData({
            weatherData: weatherData, //今天天气情况数组 
            dress: dress //生活指数
          });
        }
      })
    },
    //获取当前空气质量情况
    getAir: function (e) {
      var length = this.data.location.length;
      var city = this.data.location.slice(0, length - 1);
      var that = this;
      var param = {
        key: app.globalData.heWeatherKey,
        location: city
      };
      wx.request({
        url: app.globalData.heWeatherBase + "/s6/air/now",
        data: param,
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          app.globalData.air = res.data.HeWeather6[0].status == "unknown city" ? "" : res.data.HeWeather6[0].air_now_city;
          that.setData({
            air: app.globalData.air
          });
        }
      })
    },
    jump: function(){
      wx.reLaunch({
        url: '../switchcity/switchcity',
      })
    },
    //点击天气跳转到天气页面
    gotoWeather: function () {
      wx.navigateTo({
        url: '../weather/weather'
      });
    },
    //调用豆瓣api
    getMovieListData: function (url, settedKey, categoryTitle) {
      wx.showNavigationBarLoading()
      var that = this;
      wx.request({
        url: url,
        method: 'GET',
        header: {
          "Content-Type": "json"
        },
        success: function (res) {
          that.processDoubanData(res.data, settedKey, categoryTitle)
        },
        fail: function (error) {
          console.log(error)
        }
      })
    },
    //获得电影数据后的处理方法
    processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
      var movies = [];
      for (var idx in moviesDouban.subjects) {
        var subject = moviesDouban.subjects[idx];
        var title = subject.title;
        if (title.length >= 6) {
          title = title.substring(0, 6) + "...";
        }
        var temp = {
          stars: util.convertToStarsArray(subject.rating.stars),
          title: title,
          average: subject.rating.average,
          coverageUrl: subject.images.large,
          movieId: subject.id
        }
        movies.push(temp)
      }
      var readyData = {};
      readyData[settedKey] = {
        categoryTitle: categoryTitle,
        movies: movies
      }
      this.setData(readyData);
      wx.hideNavigationBarLoading();
    },
    // 用户登录示例
    login: function() {
        if (this.data.logged) return

        util.showBusy('正在登录')
        var that = this

        // 调用登录接口
        qcloud.login({
            success(result) {
                if (result) {
                    util.showSuccess('登录成功')
                    that.setData({
                        userInfo: result,
                        logged: true
                    })
                } else {
                    // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
                    qcloud.request({
                        url: config.service.requestUrl,
                        login: true,
                        success(result) {
                            util.showSuccess('登录成功')
                            that.setData({
                                userInfo: result.data.data,
                                logged: true
                            })
                        },

                        fail(error) {
                            util.showModel('请求失败', error)
                            console.log('request fail', error)
                        }
                    })
                }
            },

            fail(error) {
                util.showModel('登录失败', error)
                console.log('登录失败', error)
            }
        })
    },

    // 切换是否带有登录态
    switchRequestMode: function (e) {
        this.setData({
            takeSession: e.detail.value
        })
        this.doRequest()
    },

    doRequest: function () {
        util.showBusy('请求中...')
        var that = this
        var options = {
            url: config.service.requestUrl,
            login: true,
            success (result) {
                util.showSuccess('请求成功完成')
                console.log('request success', result)
                that.setData({
                    requestResult: JSON.stringify(result.data)
                })
            },
            fail (error) {
                util.showModel('请求失败', error);
                console.log('request fail', error);
            }
        }
        if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
            qcloud.request(options)
        } else {    // 使用 wx.request 则不带登录态
            wx.request(options)
        }
    },

    // 上传图片接口
    doUpload: function () {
        var that = this

        // 选择图片
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function(res){
                util.showBusy('正在上传')
                var filePath = res.tempFilePaths[0]

                // 上传图片
                wx.uploadFile({
                    url: config.service.uploadUrl,
                    filePath: filePath,
                    name: 'file',

                    success: function(res){
                        util.showSuccess('上传图片成功')
                        console.log(res)
                        res = JSON.parse(res.data)
                        console.log(res)
                        that.setData({
                            imgUrl: res.data.imgUrl
                        })
                    },

                    fail: function(e) {
                        util.showModel('上传图片失败')
                    }
                })

            },
            fail: function(e) {
                console.error(e)
            }
        })
    },

    // 预览图片
    previewImg: function () {
        wx.previewImage({
            current: this.data.imgUrl,
            urls: [this.data.imgUrl]
        })
    },

   
    openTunnel: function () {
        util.showBusy('信道连接中...')
        // 创建信道，需要给定后台服务地址
        var tunnel = this.tunnel = new qcloud.Tunnel(config.service.tunnelUrl)

        // 监听信道内置消息，包括 connect/close/reconnecting/reconnect/error
        tunnel.on('connect', () => {
            util.showSuccess('信道已连接')
            console.log('WebSocket 信道已连接')
            this.setData({ tunnelStatus: 'connected' })
        })

        tunnel.on('close', () => {
            util.showSuccess('信道已断开')
            console.log('WebSocket 信道已断开')
            this.setData({ tunnelStatus: 'closed' })
        })

        tunnel.on('reconnecting', () => {
            console.log('WebSocket 信道正在重连...')
            util.showBusy('正在重连')
        })

        tunnel.on('reconnect', () => {
            console.log('WebSocket 信道重连成功')
            util.showSuccess('重连成功')
        })

        tunnel.on('error', error => {
            util.showModel('信道发生错误', error)
            console.error('信道发生错误：', error)
        })

        // 监听自定义消息（服务器进行推送）
        tunnel.on('speak', speak => {
            util.showModel('信道消息', speak)
            console.log('收到说话消息：', speak)
        })

        // 打开信道
        tunnel.open()

        this.setData({ tunnelStatus: 'connecting' })
    },

    /**
     * 点击「发送消息」按钮，测试使用信道发送消息
     */
    sendMessage() {
        if (!this.data.tunnelStatus || !this.data.tunnelStatus === 'connected') return
        // 使用 tunnel.isActive() 来检测当前信道是否处于可用状态
        if (this.tunnel && this.tunnel.isActive()) {
            // 使用信道给服务器推送「speak」消息
            this.tunnel.emit('speak', {
                'word': 'I say something at ' + new Date(),
            });
        }
    },

    /**
     * 点击「关闭信道」按钮，关闭已经打开的信道
     */
    closeTunnel() {
        if (this.tunnel) {
            this.tunnel.close();
        }
        util.showBusy('信道连接中...')
        this.setData({ tunnelStatus: 'closed' })
    }
})
