// pages/more/more.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selsectState: [0, 0, 0, 0, 0],
    selectIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  //点击词典图标
  clickDict: function () {
    this.setData({
      selsectState: [1, 0, 0, 0, 0],
      selectIndex: 1
    });
    wx.showToast({
      title: "还没空做啊🤣",
      duration: 3000,
      icon: "success"
    })
  },
  //点击快递图标
  clickExpre: function () {
    this.setData({
      selsectState: [0, 1, 0, 0, 0],
      selectIndex: 2
    });
    wx.showToast({
      title: "还没空做啊🤣",
      duration: 3000,
      icon: "success"
    })
  },
  //点击更多图标
  clickMore: function () {
    this.setData({
      selsectState: [0, 0, 1, 0, 0],
      selectIndex: 3
    });
    wx.showActionSheet({
      itemList: [
        "给你个小彩蛋~"
      ],
      itemColor: "#405f80",
      success: function (res) {
        wx.navigateTo({
          url: '../logs/logs'
        });
      }
    })
  },

  //点击github
  clickGithub: function () {
    this.setData({
      selsectState: [0, 0, 0, 1, 0],
      selectIndex: 4
    });
  },
  //点击博客园
  clickBlog: function () {
    this.setData({
      selsectState: [0, 0, 0, 0, 1],
      selectIndex: 5
    });
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