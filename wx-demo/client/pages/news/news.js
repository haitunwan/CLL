// pages/news/news.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topNews: [],
    newsType: 'guoji',
    selsectState: [1, 0, 0, 0, 0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // 访问聚合数据的网络接口-头条新闻
    wx.request({
      url: app.globalData.juhetoutiaoBase,
      data: {
        type: 'guoji',
        key: app.globalData.juhetoutiaoKey
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.error_code == 0) {
          that.setData({
            topNews: res.data.result.data
          })
        } else {
          console.log('获取失败');
        }
      }
    })
  },
  //数据受限没有详情信息，给用户一个提示就好
  bindViewTap: function (event) {
    wx.showModal({
      title: '提示',
      content: '实时更新，但因为免费接口资源受限，新闻详情请访问官方网站哈😘',
      success: function (res) {
        if (res.confirm) {
          wx.showToast({
            title: "谢谢支持",
            duration: 1000,
            icon: "success"
          })
        } else if (res.cancel) {
          wx.showToast({
            title: "🙄🙄🙄",
            duration: 1000,
            icon: "success"
          })
        }
      }
    })
  },
  clickNation: function () {
    this.setData({
      newsType: 'guoji',
      selsectState: [1, 0, 0, 0, 0]
    })
    this.getNews();
  },
  clickSport: function () {
    this.setData({
      newsType: 'tiyu',
      selsectState: [0, 1, 0, 0, 0]
    })
    this.getNews();
  },
  clickScience: function () {
    this.setData({
      newsType: 'keji',
      selsectState: [0, 0, 1, 0, 0]
    })
    this.getNews();
  },
  clickHappy: function () {
    this.setData({
      newsType: 'yule',
      selsectState: [0, 0, 0, 1, 0]
    })
    this.getNews();
  },
  clickFinance: function () {
    this.setData({
      newsType: 'caijing',
      selsectState: [0, 0, 0, 0, 1]
    })
    this.getNews();
  },

  getNews: function () {
    var that = this
    // 访问聚合数据的网络接口-头条新闻
    wx.request({
      url: app.globalData.juhetoutiaoBase,
      data: {
        type: this.data.newsType,
        key: app.globalData.juhetoutiaoKey
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.error_code == 0) {
          that.setData({
            topNews: res.data.result.data
          })
        } else {
          console.log('获取失败');
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})