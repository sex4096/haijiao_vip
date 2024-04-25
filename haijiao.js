
// ==UserScript==
// @name           haijiao-vip: 解锁海角社区VIP帖子,去广告
// @namespace      https://github.com/sex4096/haijiao_vip
// @version        0.0.8
// @author         forgetme8
// @description    解锁 海角社区(haijiao.com) VIP帖子,并去除网站广告, TG讨论群:@svip_hj
// @homepage       https://github.com/sex4096/haijiao_vip#readme
// @supportURL     https://github.com/sex4096/haijiao_vip/issue
// @updateURL      https://raw.githubusercontent.com/sex4096/haijiao_vip/ui/haijiao.js
// @downloadURL    https://raw.githubusercontent.com/sex4096/haijiao_vip/ui/haijiao.js
// @run-at         document-idle
// @match          https://www.haijiao.com/*
// @match          https://haijiao.com/*
// @license        MIT
// @connect        cdn.jsdelivr.net
// @require        https://cdn.jsdelivr.net/npm/react@18.3.0/umd/react.production.min.js
// @require        https://cdn.jsdelivr.net/npm/react-dom@18.3.0/umd/react-dom.production.min.js
// ==/UserScript==
(function (React, ReactDOM) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
  var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);

  var __webpack_require__ = undefined;
  var VUE = undefined;
  var AXIOS = undefined;
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
    __webpack_require__("4360").a;
    AXIOS = __webpack_require__("bc3a");
    AXIOS = getObject(AXIOS);
    AXIOS = AXIOS.a;
    callback();
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
   * 加载模块
   * @param module
   */
  function getModule(module) {
    if (!__webpack_require__) return null;
    return __webpack_require__(module);
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
      this.axios.interceptors.response.use(this.responseDecodeInterceptor);
      this.axios.interceptors.response.use(this.responseInterceptor);
      this.axios.interceptors.response.use(this.responseEncodeInterceptor);
    }

    /**
     * 请求拦截器
     * @param request
     * @returns
     */
    async requestInterceptor(request) {
      // if (
      //   /topic\/\d+/g.test(request.url) ||
      //   /\/api\/attachment/g.test(request.url)
      // ) {
      //   console.log("转发请求", request.url);
      //   request.url = `http://127.0.0.1:8000` + request.url;
      // }

      return request;
    }

    /**
     * 对返回数据进行解码
     * @param response
     */
    async responseDecodeInterceptor(response) {
      if (response.data.status === 200) {
        const origin_response = JSON.parse(JSON.stringify(response.data.data));
        var enc_data = response.data.data.data;
        if (enc_data && typeof enc_data === "string" && enc_data.length > 0) {
          const Base64 = getModule("e762").a;
          enc_data = JSON.parse(Base64.decode(Base64.decode(Base64.decode(enc_data))));
        }
        response = {
          item: enc_data,
          url: response.config.url,
          mobile: true,
          origin_response: origin_response
        };
      } else {
        // 克隆一个原始请求
        const origin_response = JSON.parse(JSON.stringify(response.data));
        const item = JSON.parse(JSON.stringify(response.data.data));
        response = {
          item: item,
          url: response.config.url,
          mobile: false,
          origin_response: origin_response
        };
      }
      return response;
    }

    /**
     * 对reponse重新编码
     * @param response
     * @returns
     */
    async responseEncodeInterceptor(response) {
      if (response.mobile === true) {
        var dec = response.item;
        if (response.origin_response.isEncrypted === true) {
          const Base64 = getModule("e762").a;
          dec = Base64.encode(Base64.encode(Base64.encode(JSON.stringify(response.item))));
        }
        return {
          data: {
            ...response.origin_response,
            data: dec
          }
        };
      } else {
        return {
          ...response.origin_response,
          data: response.item
        };
      }
    }
    async responseInterceptor(response) {
      const url = response.url.toLowerCase();
      var item = response.item;
      if (/topic\/\d+/g.test(url)) {
        item = await Interceptor.fixTopic(item, response.mobile);
      } else if (/banner\/banner_list/g.test(url)) {
        item = await Interceptor.fixAds(item);
      }
      response.item = item;
      return response;
    }
    /**
     * 修复帖子内容
     * @param {*} data
     * @returns
     */
    static async fixTopic(data) {
      console.log("修复帖子内容", data);
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
        // for (var i = 0; i < data.attachments.length; i++) {
        //   if (
        //     data.attachments[i].category === "video" &&
        //     !data.attachments[i].remoteUrl
        //   ) {
        //     console.log("获取视频链接", data.attachments[i]);
        //     try {
        //       const item = await Interceptor.getAttment(
        //         data.topicId,
        //         data.attachments[i].id
        //       );
        //       console.log("返回的数据:", item);

        //       data.attachments[i] = item;
        //       console.log("获取视频链接成功", data.attachments[i]);
        //     } catch (e) {
        //       data.attachments[i].remoteUrl = "";
        //       data.attachments[i].error = e;
        //     }
        //   }
        // }

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
            // if (attachment.remoteUrl) {
            hasVideo = true;
            content += `<p><video src="${attachment.remoteUrl}" data-id="${attachment.id}"></video></p>`;
            // } else {
            //   console.log("视频链接为空", attachment);
            //   content += `<p><div style="color:red;text-decoration:line-through;">${attachment.error}</div></p>`;
            // }
          }
          if (hasVideo === true) {
            content = `<p>${content}</p>`;
          }
        });
        content = `<html><head></head><body>${content}</body></html>`;
      }
      data.content = content;
      return data;
    }

    /**
     * 去广告
     * @param data
     */
    static async fixAds(data) {
      return null;
    }
    /**
     * 获取帖子附件
     * @param pid
     * @param aid
     */
    static async getAttment(pid, aid) {
      const url = `/api/attachment`;
      var headers = {};
      if (VUE.$cookies) {
        const uid = VUE.$cookies.get("uid");
        const token = VUE.$cookies.get("token");
        headers = {
          "X-User-Id": uid,
          "X-User-Token": token
        };
      }
      const data = {
        id: aid,
        resource_id: pid,
        reource_type: "topic",
        line: ""
      };
      const response = await AXIOS.post(url, data, {
        headers: headers
      });
      const responseData = response.data.hasOwnProperty("data") ? response.data : response;
      var videoData = responseData.data;
      if (responseData.success === false) {
        throw new Error(responseData.message);
      }
      if (videoData && typeof videoData === "string" && videoData.length > 0 && responseData.isEncrypted === true) {
        videoData = JSON.parse(window.atob(window.atob(window.atob(videoData))));
      }
      return videoData;
    }
  }

  function MyButton() {
    return /*#__PURE__*/React__default["default"].createElement("button", null, "I'm a button");
  }

  function initialed() {
    initSetting();
    const interceptor = new Interceptor(AXIOS);
    interceptor.initRequestInterceptor();
    interceptor.initResponseInterceptor();
  }
  function initSetting() {
    const toolbarContainer = document.querySelector("div.toolbar-container > div.hj-slot");
    console.log(toolbarContainer);
    const newContainer = document.createElement("div");
    newContainer.id = "haijiao-vip-settings-container";
    toolbarContainer?.appendChild(newContainer);
    const myButton = /*#__PURE__*/React__default["default"].createElement(MyButton, null);
    ReactDOM__default["default"].render(myButton, newContainer);
  }
  initHookWebpack(initialed);
  //插入React Component

})(React, ReactDOM);
