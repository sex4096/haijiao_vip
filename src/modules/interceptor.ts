import { PluginStore } from "./plugin_store";
import { getModule } from "./webpack";

/**
 * 自定义拦截器
 */
export class Interceptor {
  // axios模块
  axios: any;
  constructor(axios: any) {
    this.axios = axios;
  }

  /**
   * 初始化请求拦截器
   */
  initRequestInterceptor() {
    this.axios.interceptors.request.use(this.requestInterceptor.bind(this));
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
      this.axios.interceptors.response.handlers[0].fulfilled = async (
        response: any
      ) => {
        const data = await origin(response);
        response = {
          data: data,
          config: response.config,
        };
        return response;
      };
    }
    this.axios.interceptors.response.use(
      this.responseDecodeInterceptor.bind(this)
    );
    this.axios.interceptors.response.use(this.responseInterceptor.bind(this));
    this.axios.interceptors.response.use(
      this.responseEncodeInterceptor.bind(this)
    );
  }

  /**
   * 请求拦截器
   * @param request
   * @returns
   */
  private async requestInterceptor(request: any) {
    request = await this.requestUnlockBuyInterceptor(request);
    request = await this.requestUnlockBanUserInterceptor(request);
    request = await this.requestSearchInterceptor(request);
    return request;
  }

  /**
   * 解锁购买
   * @param request
   * @returns
   */
  private async requestUnlockBuyInterceptor(request: any) {
    if (
      PluginStore.get("unlockBuy", false) === true &&
      PluginStore.get("host", "").length > 0
    ) {
      if (
        /\/api\/attachment/g.test(request.url) ||
        /topic\/\d+/g.test(request.url)
      ) {
        console.log("转发请求", request.url, request);
        var host = PluginStore.get("host", "");
        request.baseURL = host;
        request.crossDomain = true;
      }
    }

    return request;
  }

  /**
   * 查看被ban的用户信息
   * @param request
   */
  private async requestUnlockBanUserInterceptor(request: any) {
    if (
      PluginStore.get("unlockBanUser", true) === true &&
      PluginStore.get("host", "").length > 0
    ) {
      if (
        /\/api\/user\/info\/\d+/g.test(request.url) ||
        /\/api\/user\/news\/other_news_list/g.test(request.url) ||
        (/\/api\/topic\/node\/topics/g.test(request.url) &&
          request.url.includes("userId"))
      ) {
        console.log("查看被ban的用户信息", request.url);
        var host = PluginStore.get("host", "");
        request.baseURL = host;
        request.crossDomain = true;
      }
    }
    return request;
  }

  /**
   * 解锁搜索功能
   * @param request
   */
  private async requestSearchInterceptor(request: any) {
    if (
      PluginStore.get("unlockSearch", true) === true &&
      PluginStore.get("host", "").length > 0
    ) {
      if (/\/api\/user\/search/g.test(request.url)) {
        console.log("搜索", request.url);
        var host = PluginStore.get("host", "");
        request.baseURL = host;
        request.crossDomain = true;
      }
    }
    return request;
  }

  /**
   * 对返回数据进行解码
   * @param response
   */
  private async responseDecodeInterceptor(response: any) {
    if (response.data.status === 200) {
      const origin_response = JSON.parse(JSON.stringify(response.data.data));
      var enc_data = response.data.data.data;
      if (enc_data && typeof enc_data === "string" && enc_data.length > 0) {
        const Base64 = getModule("e762").a;
        enc_data = JSON.parse(
          Base64.decode(Base64.decode(Base64.decode(enc_data)))
        );
      }
      response = {
        item: enc_data,
        url: response.config.url,
        mobile: true,
        origin_response: origin_response,
      };
    } else {
      // 克隆一个原始请求
      const origin_response = JSON.parse(JSON.stringify(response.data));
      const item = JSON.parse(JSON.stringify(response.data.data));
      response = {
        item: item,
        url: response.config.url,
        mobile: false,
        origin_response: origin_response,
      };
    }
    return response;
  }

  /**
   * 对reponse重新编码
   * @param response
   * @returns
   */
  private async responseEncodeInterceptor(response: any) {
    if (response.mobile === true) {
      var dec = response.item;
      if (response.origin_response.isEncrypted === true) {
        const Base64 = getModule("e762").a;
        dec = Base64.encode(
          Base64.encode(Base64.encode(JSON.stringify(response.item)))
        );
      }

      return {
        data: {
          ...response.origin_response,
          data: dec,
        },
      };
    } else {
      return {
        ...response.origin_response,
        data: response.item,
      };
    }
  }

  private async responseInterceptor(response: any) {
    const url = response.url.toLowerCase();
    var item = response.item;
    console.log("拦截器返回数据", url, item);

    if (
      /^\/api\/topic\/\d+/g.test(url) &&
      PluginStore.get("unlockVip", true) === true
    ) {
      item = await this.fixTopic(item);
    }
    // 去广告
    else if (
      /banner\/banner_list/g.test(url) &&
      PluginStore.get("removeAds", true) === true
    ) {
      item = await this.fixAds(item);
    }
    // 屏蔽置顶帖
    else if (
      /^\/api\/topic\/global\/topics/g.test(url) &&
      PluginStore.get("removeTops", true) === true
    ) {
      item = await this.fixTops(item);
    }

    response.item = item;
    return response;
  }
  /**
   * 修复帖子内容
   * @param {*} data
   * @returns
   */
  private async fixTopic(data: any) {
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

      data.attachments?.forEach((attachment: any) => {
        var hasImage,
          hasVideo = false;
        // 处理图片
        if (attachment.category === "images" && attachment.remoteUrl) {
          content =
            content += `<p><img src="${attachment.remoteUrl}" data-id="${attachment.id}"/>`;
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
  private async fixAds(data: any) {
    return null;
  }

  private async fixTops(data: any) {
    return [];
  }
}
