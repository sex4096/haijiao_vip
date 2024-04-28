
// ==UserScript==
// @name           haijiao-vip: 解锁海角社区VIP帖子,去广告
// @namespace      https://github.com/sex4096/haijiao_vip
// @version        0.0.11
// @author         forgetme8
// @description    解锁 海角社区(haijiao.com) VIP帖子,并去除网站广告, TG讨论群:@svip_hj.本插件完全免费,如果你是付费购买,请立刻退款并举报
// @homepage       https://github.com/sex4096/haijiao_vip#readme
// @supportURL     https://github.com/sex4096/haijiao_vip/issue
// @updateURL      https://raw.githubusercontent.com/sex4096/haijiao_vip/master/haijiao.js
// @downloadURL    https://raw.githubusercontent.com/sex4096/haijiao_vip/master/haijiao.js
// @run-at         document-idle
// @match          https://www.haijiao.com/*
// @match          https://haijiao.com/*
// @license        MIT
// @connect        cdn.jsdelivr.net
// @require        https://cdn.jsdelivr.net/npm/react@18.3.0/umd/react.production.min.js
// @require        https://cdn.jsdelivr.net/npm/react-dom@18.3.0/umd/react-dom.production.min.js
// @require        https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js
// @require        https://cdn.jsdelivr.net/npm/antd@5.16.4/dist/antd.min.js
// @require        https://cdn.jsdelivr.net/npm/@ant-design/icons@5.3.6/dist/index.umd.min.js
// ==/UserScript==
(function (React$1, ReactDOM, antd, icons) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React$1);
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

  const Settings = _ref => {
    let {
      initialSettings,
      onFormInstanceReady
    } = _ref;
    const [form] = antd.Form.useForm();
    React$1.useEffect(() => {
      onFormInstanceReady(form);
    }, []);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(antd.Form, {
      form: form,
      name: "settings",
      labelAlign: "right",
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 16
      },
      initialValues: initialSettings
    }, /*#__PURE__*/React.createElement(antd.Form.Item, {
      label: "\u53BB\u5E7F\u544A"
    }, /*#__PURE__*/React.createElement(antd.Form.Item, {
      name: "removeAds",
      noStyle: true
    }, /*#__PURE__*/React.createElement(antd.Switch, {
      defaultChecked: true
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 10
      }
    }, "\u53BB\u9664\u7F51\u7AD9\u5E7F\u544A")), /*#__PURE__*/React.createElement(antd.Form.Item, {
      label: "\u5C4F\u853D\u7F6E\u9876"
    }, /*#__PURE__*/React.createElement(antd.Form.Item, {
      name: "removeTops",
      noStyle: true
    }, /*#__PURE__*/React.createElement(antd.Switch, {
      defaultChecked: true
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 10
      }
    }, "\u5C4F\u853D\u5168\u5C40\u7F6E\u9876\u5E16")), /*#__PURE__*/React.createElement(antd.Form.Item, {
      label: "\u89E3\u9501VIP"
    }, /*#__PURE__*/React.createElement(antd.Form.Item, {
      name: "unlockVip",
      noStyle: true
    }, /*#__PURE__*/React.createElement(antd.Switch, {
      defaultChecked: true
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 10
      }
    }, "\u53EF\u89C2\u770Bvip\u533A\u7684\u5E16\u5B50\u53CA\u89C6\u9891")), /*#__PURE__*/React.createElement(antd.Form.Item, {
      label: "\u89E3\u9501\u6536\u8D39\u89C6\u9891"
    }, /*#__PURE__*/React.createElement(antd.Form.Item, {
      name: "unlockBuy",
      noStyle: true
    }, /*#__PURE__*/React.createElement(antd.Switch, {
      defaultChecked: false,
      disabled: true
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 10
      }
    }, "\u53EF\u89C2\u770B\u9700\u8981\u8D2D\u4E70\u7684\u89C6\u9891(\u5F00\u53D1\u4E2D)"))));
  };

  class PluginStore {
    static get(key, defaultValue) {
      const value = localStorage.getItem(key);
      console.log("获取", key, value);
      if (value === null) {
        return defaultValue;
      }
      if (typeof defaultValue === "number") {
        return parseInt(value);
      }
      if (typeof defaultValue === "boolean") {
        return value === "true";
      }
      return value;
    }
    static set(key, value) {
      localStorage.setItem(key, value.toString());
    }
  }

  const App = () => {
    const [isModalOpen, setIsModalOpen] = React$1.useState(false);
    const [formInstance, setFormInstance] = React$1.useState();
    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleOk = async () => {
      const values = await formInstance?.validateFields();
      onCreate(values);
      setIsModalOpen(false);
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };
    const onCreate = values => {
      PluginStore.set("removeAds", values.removeAds);
      PluginStore.set("removeTops", values.removeTops);
      PluginStore.set("unlockVip", values.unlockVip);
      PluginStore.set("unlockBuy", values.unlockBuy);
    };
    return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement(antd.FloatButton, {
      type: "primary",
      tooltip: "\u6D77\u89D2VIP\u8BBE\u7F6E",
      style: {
        right: 16
      },
      icon: /*#__PURE__*/React__default["default"].createElement(icons.SettingOutlined, null),
      onClick: showModal
    }), /*#__PURE__*/React__default["default"].createElement(antd.Modal, {
      title: "\u8BBE\u7F6E",
      open: isModalOpen,
      onOk: handleOk,
      onCancel: handleCancel,
      destroyOnClose: true,
      okButtonProps: {
        autoFocus: true
      }
    }, /*#__PURE__*/React__default["default"].createElement(Settings, {
      initialSettings: {
        removeAds: PluginStore.get("removeAds", true),
        removeTops: PluginStore.get("removeTops", true),
        unlockVip: PluginStore.get("unlockVip", true),
        unlockBuy: PluginStore.get("unlockBuy", false)
      },
      onFormInstanceReady: instance => {
        setFormInstance(instance);
      }
    })));
  };

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
      console.log("拦截器返回数据", url, item);
      if (/topic\/\d+/g.test(url) && PluginStore.get("removeAds", true) === true) {
        item = await Interceptor.fixTopic(item, response.mobile);
      }
      // 去广告
      else if (/banner\/banner_list/g.test(url) && PluginStore.get("removeAds", true) === true) {
        item = await Interceptor.fixAds(item);
      }
      // 屏蔽置顶帖
      else if (/^\/api\/topic\/global\/topics/g.test(url) && PluginStore.get("removeTops", true) === true) {
        item = await Interceptor.fixTops(item);
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
    static async fixTops(data) {
      return [];
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

  function addStyle() {
    let script = document.createElement("link");
    script.setAttribute("rel", "stylesheet");
    script.setAttribute("type", "text/css");
    script.href = "https://cdn.jsdelivr.net/npm/antd@5.16.4/dist/reset.min.css";
    document.documentElement.appendChild(script);
  }
  function addAnalytics() {
    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-NQ08DH5N3T";
    script.async = true;
    document.head.appendChild(script);
    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-NQ08DH5N3T');
    `;
    document.head.appendChild(script2);
  }

  function initialed() {
    const interceptor = new Interceptor(AXIOS);
    interceptor.initRequestInterceptor();
    interceptor.initResponseInterceptor();
  }
  function initSetting() {
    const myButton = /*#__PURE__*/React__default["default"].createElement(App, null);
    const pluginDiv = document.createElement("div");
    pluginDiv.id = "haijiao-vip-plugin";
    document.body.appendChild(pluginDiv);
    ReactDOM__default["default"].render(myButton, pluginDiv);
  }
  addAnalytics();
  addStyle();
  initSetting();
  initHookWebpack(initialed);

})(React, ReactDOM, antd, icons);
