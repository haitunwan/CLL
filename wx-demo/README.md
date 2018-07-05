# 微信小程序开发 Demo

最近在学习微信小程序的开发，本项目是我的第一个微信小程序，参考博客https://www.cnblogs.com/xuanbiyijue/p/7980010.html。

下面说说开发这个微信小程序期间遇到了哪些问题吧：

1.首先得去微信小程序的官网注册，然后申请一个appId。

2.由于是初学者，因此我一开始选择的是快速启动版本（quick start），但是因为需要调用一些第三方的接口，例如本项目中采用了腾讯的位置服务接口，因此此时就需要有自己的域名和ssk证书认证。（申请域名感觉都是收费的，也找了很久，感觉很费时间）所以为了省去这一步，我又改为了node.js版本，因为腾讯云提供了这个支持，将项目通过腾讯云传递上去之后，就可以自动获得一个域名。（这个部分花了大概一周的时间才搞明白）

3.一定要将调用的第三方接口的网址写入微信小程序的域名信息中，否则是不合法的。

4.第三方接口一般需要在其对应的官网注册，然后申请接口才能使用，否则没有权限。（腾讯，今日头条，百度地图等）

5.这个项目中使用了豆瓣电影的第三方接口，但是在使用过程中，发现豆瓣对其做了禁止访问。为了解决这个问题，我配置了一个nginx作为中间的代理。

关于nginx的配置：

【1】.官网下载nginx，下载之后的目录如下：

【2】.在conf——>nginx.conf文件中http下的server中，添加：

location /v2/ { 

			proxy_store off; 
			
			proxy_redirect off; 
			
			proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; 
			
			proxy_set_header X-Real-IP $remote_addr; 
			
			proxy_set_header Referer 'no-referrer-when-downgrade'; 
			
			proxy_set_header User-Agent 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'; 
			
			proxy_connect_timeout 600; 
			
			proxy_read_timeout 600; 
			
			proxy_send_timeout 600; 
			
			proxy_pass https://api.douban.com/v2/; 
			
		}


【3】.在nginx.exe所在的目录打开命令窗口，执行相关命令：（我的环境是window，因此命令如下）

  启动命令：start nginx

  修改配置后重新加载生效： ./nginx -s reload 
  
【4】.然后将小程序中的访问地址https://api/douban.com/v2 改为：http：//localhost/v2，即可访问。



