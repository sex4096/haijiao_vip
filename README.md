# 海角社区(haijiao.com) - 解锁收费视频,VIP,去广告脚本

该脚本完全免费并开源,遵守MIT协议.

开源代码托管在: [haijiao_vip](https://github.com/sex4096/haijiao_vip/)

TG讨论群:[@svip_hj](https://t.me/svip_hj)

TG频道: [@svip_nav](https://t.me/svip_nav)

## 功能

- 去广告
- 屏蔽全局置顶贴
- 解锁VIP板块帖子
- 手机版适配
- 解锁钻石和金币帖子

![setting1](snapshot/settings3.jpg)

## 待开发功能

- 下载视频
- ~~免登录 (目前看来免登录问题还很多,滞后吧)~~

## 说明

### 目前需要登录网站才可以使用!!!

### 目前需要登录网站才可以使用!!!

### 目前需要登录网站才可以使用!!!

如果找不到设置,请检查访问的网站是否为`haijiao.com`

该脚本对`底层请求`添加了`拦截器`, 通过修改请求来达到解锁视频,VIP,去广告等功能,不对页面元素做任何修改

## 安装

#### PC端:

正常Tampermonkey安装`haijiao.js`即可,~~脚本无任何依赖~~.

#### iOS:

推荐使用Safari浏览器+Stay插件进行安装,在Stay通过链接新建脚本即可:
`https://raw.githubusercontent.com/sex4096/haijiao_vip/master/haijiao.js`

#### 安卓:

目前测试火狐浏览器一切正常

## 闲聊

由于拿到了`webpack_require`,基本上可以对网站所有功能进行原生调用或者修改,所以大家有什么好的想法可以和我交流~

建立了一个TG群:`@svip_hj`,大家可以来交流. PS:禁止讨论反动言论,禁止讨论幼女/人兽等.

## 贡献

欢迎大佬贡献代码,基本调用如下:

比如调用网站的确认信息框并且在点击确认后弹出登录窗口:

```typescript
VUE.prototype.$message.close();
VUE.prototype
  .$confirm("您暂时还未登录,海角VIP脚本无法生效,请登录", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
  .then(() => {
    VUE.prototype.$loginWindow();
  });
```

## 截图

设置界面在这里:

PC端:
![settings1](snapshot/settings1.jpg)

移动端:

![settings2](snapshot/settings2.jpg)
