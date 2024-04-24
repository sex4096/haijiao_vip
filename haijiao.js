
// ==UserScript==
// @name           haijiao-vip
// @namespace      https://github.com/sex4096/haijiao_vip
// @version        0.0.1
// @author         sex4096
// @description    解锁海角VIP帖子,并去除网站广告, TG讨论群:@svip_hj
// @include        *
// @homepage       https://github.com/sex4096/haijiao_vip#readme
// @supportURL     https://github.com/sex4096/haijiao_vip/issue
// @updateURL      https://raw.githubusercontent.com/sex4096/haijiao_vip/master/haijiao.js
// @downloadURL    https://raw.githubusercontent.com/sex4096/haijiao_vip/master/haijiao.js
// @run-at         document-idle
// @match          https://www.haijiao.com/*
// ==/UserScript==
(function () {
  'use strict';

  var __webpack_require__ = undefined;
  var VUE = undefined;
  var STORE = undefined;
  var AXIOS = undefined;
  var API = undefined;
  var callback = undefined;
  function initHookWebpack(initialed) {
    callback = initialed;
    let originCall = Function.prototype.call;
    Function.prototype.call = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      const result = originCall.apply(this, args);
      if (args.length === 4 && args[1] && args[1].exports && args[0] === args[2] && __webpack_require__ === undefined) {
        __webpack_require__ = args[3];
        Function.prototype.call = originCall;
        importModules();
      }
      return result;
    };
  }
  function importModules() {
    VUE = __webpack_require__("2b0e").default;
    STORE = __webpack_require__("4360").a;
    API = __webpack_require__("ec7a").a;
    AXIOS = __webpack_require__("bc3a");
    AXIOS = getObject(AXIOS);
    AXIOS = AXIOS.a;
    callback(VUE, STORE, AXIOS);
  }
  function getObject(module) {
    const t = module && module.__esModule ? function () {
      return module.default;
    } : function () {
      return module;
    };
    defineObject(t, "a", t);
    return t;
  }
  function defineObject(module, key, value) {
    Object.prototype.hasOwnProperty.call(module, key) || Object.defineProperty(module, key, {
      enumerable: true,
      get: value
    });
  }

  /**
   * 自定义拦截器
   */
  class Interceptor {
    // axios模块

    constructor(axios) {
      this.axios = axios;
    }

    /**
     * 初始化请求拦截器
     */
    initRequestInterceptor() {
      this.axios.interceptors.request.use(this.requestInterceptor);
    }

    /**
     * 初始化返回请求拦截器
     */
    initResponseInterceptor() {
      if (this.axios.interceptors.response.handlers.length != 1) {
        return;
      }
      // 因为返回处理会处理掉config,而我们需要config中的url,所以需要在返回处理之前处理
      if (this.axios.interceptors.response.handlers?.[0].fulfilled) {
        const origin = this.axios.interceptors.response.handlers?.[0].fulfilled;
        this.axios.interceptors.response.handlers[0].fulfilled = async response => {
          const data = await origin(response);
          response = {
            data: data,
            config: response.config
          };
          return response;
        };
      }
      this.axios.interceptors.response.use(this.responseInterceptor);
    }
    async requestInterceptor(request) {
      return request;
    }
    async responseInterceptor(response) {
      var data = response.data;
      const url = response.config.url.toLowerCase();
      if (/topic\/\d+/g.test(url)) {
        await Interceptor.fixTopic(data.data);
      } else if (/banner\/banner_list/g.test(url)) {
        data = await Interceptor.fixAds(data.data);
      }
      return data;
    }
    static async fixTopic(data) {
      console.log("修正帖子内容", data);
      if (data.node?.vipLimit > 0) {
        data.node.vipLimit = 0;
      }
      var content = data.content;
      if (content && !content.startsWith("<html><head></head><body>")) {
        // 删除掉[]标签
        content = content.replace(/\[视频\]/g, "");
        content = content.replace(/\[图片\]/g, "");
        content = content.replace(/此处内容售价\d+金币.*请购买后查看./g, "");
        content = content.replace(/\[sell.*\/sell]/g, "");
        // 首先针对没有获取到链接的视频进行一次处理
        for (var i = 0; i < data.attachments.length; i++) {
          if (data.attachments[i].category === "video" && !data.attachments[i].remoteUrl) {
            console.log("获取视频链接", data.attachments[i]);
            try {
              const response = await Interceptor.getAttment(data.topicId, data.attachments[i].id);
              data.attachments[i] = response.data;
            } catch (e) {
              data.attachments[i].remoteUrl = "";
              data.attachments[i].error = e;
            }
          }
        }
        data.attachments?.forEach(attachment => {
          var hasImage,
            hasVideo = false;
          // 处理图片
          if (attachment.category === "images" && attachment.remoteUrl) {
            content = content += `<p><img src="${attachment.remoteUrl}" data-id="${attachment.id}"/>`;
            hasImage = true;
          }
          if (hasImage === true) {
            content = `<p>${content}</p>`;
          }
          if (attachment.category === "video") {
            if (attachment.remoteUrl) {
              hasVideo = true;
              content += `<div class="video-div" data-id="${attachment.id}" id="video_${attachment.id}_${new Date().getTime()}" key-path="${attachment.keyPath}" data-url="${attachment.remoteUrl}"></div><div data-id="${attachment.id}" id="video_${attachment.id}_${new Date().getTime()}" class="video-div-btn" key-path="${attachment.keyPath}" data-url="${attachment.remoteUrl}"></div>`;
            } else {
              console.log("视频链接为空", attachment);
              content += `<p><div style="color:red;text-decoration:line-through;">${attachment.error}</div></p>`;
            }
          }
          if (hasVideo === true) {
            content = `<p>${content}</p>`;
          }
        });
        content = `<html><head></head><body>${content}</body></html>`;
      }
      console.log(content);
      data.content = content;
    }

    /**
     * 去广告
     * @param data
     */
    static async fixAds(data) {
      if (data) data = [];
      return data;
    }
    /**
     * 获取帖子附件
     * @param pid
     * @param aid
     */
    static async getAttment(pid, aid) {
      const DOMAIN = STORE.state.configUrl.domain;
      const url = `${DOMAIN}/api/attachment`;
      const data = {
        id: aid,
        resource_id: pid,
        reource_type: "topic",
        line: ""
      };
      return API.post(url, data);
    }
  }

  function initialed() {
    const interceptor = new Interceptor(AXIOS);
    interceptor.initRequestInterceptor();
    interceptor.initResponseInterceptor();
  }
  initHookWebpack(initialed);

})();
