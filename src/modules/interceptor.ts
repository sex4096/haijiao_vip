import { AXIOS, VUE, getModule } from "./webpack";

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
    this.axios.interceptors.response.use(this.responseDecodeInterceptor);
    this.axios.interceptors.response.use(this.responseInterceptor);
    this.axios.interceptors.response.use(this.responseEncodeInterceptor);
  }

  /**
   * 请求拦截器
   * @param request
   * @returns
   */
  private async requestInterceptor(request: any) {
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

    if (/topic\/\d+/g.test(url) && GM_getValue("unlockVip", true) === true) {
      item = await Interceptor.fixTopic(item, response.mobile);
    }
    // 去广告
    else if (
      /banner\/banner_list/g.test(url) &&
      GM_getValue("removeAds", true) === true
    ) {
      item = await Interceptor.fixAds(item);
    }
    // 屏蔽置顶帖
    else if (
      /^\/api\/topic\/global\/topics/g.test(url) &&
      GM_getValue("removeTops", true) === true
    ) {
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
  private static async fixTopic(data: any, mobile: boolean = false) {
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
  private static async fixAds(data: any) {
    return null;
  }

  private static async fixTops(data: any) {
    return [];
  }

  /**
   * 获取帖子附件
   * @param pid
   * @param aid
   */
  private static async getAttment(pid: number, aid: number) {
    const url = `/api/attachment`;

    var headers = {};
    if (VUE.$cookies) {
      const uid = VUE.$cookies.get("uid");
      const token = VUE.$cookies.get("token");
      headers = {
        "X-User-Id": uid,
        "X-User-Token": token,
      };
    }
    const data = {
      id: aid,
      resource_id: pid,
      reource_type: "topic",
      line: "",
    };

    const response = await AXIOS.post(url, data, {
      headers: headers,
    });
    const responseData = response.data.hasOwnProperty("data")
      ? response.data
      : response;
    var videoData = responseData.data;

    if (responseData.success === false) {
      throw new Error(responseData.message);
    }
    if (
      videoData &&
      typeof videoData === "string" &&
      videoData.length > 0 &&
      responseData.isEncrypted === true
    ) {
      videoData = JSON.parse(window.atob(window.atob(window.atob(videoData))));
    }

    return videoData;
  }
}
