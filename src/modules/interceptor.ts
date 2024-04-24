import { AXIOS, STORE } from "./webpack";

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
    return request;
  }

  /**
   * 对返回数据进行解码
   * @param response
   */
  private async responseDecodeInterceptor(response: any) {
    if (response.data.status === 200) {
      const responseData = response.data;

      response = {
        ...responseData,
        mobile: true,
        original: responseData,
      };
    } else {
      response = {
        data: response.data.data,
        url: response.config.url,
        mobile: false,
        original: response.data,
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
    if (response.mobile === false) {
      console.log("返回数据", {
        ...response.original,
        data: response.data,
      });

      return {
        ...response.original,
        data: response.data,
      };
    }
  }

  private async responseInterceptor(data: any) {
    const url = data.url.toLowerCase();
    var apiData = data.data;
    console.log("拦截器", url, data);

    if (/topic\/\d+/g.test(url)) {
      apiData = await Interceptor.fixTopic(apiData);
    } else if (/banner\/banner_list/g.test(url)) {
      apiData = await Interceptor.fixAds(apiData);
    }
    data.data = apiData;
    return data;
  }
  private static async fixTopic(data: any) {
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
        if (
          data.attachments[i].category === "video" &&
          !data.attachments[i].remoteUrl
        ) {
          console.log("获取视频链接", data.attachments[i]);
          try {
            const response = await Interceptor.getAttment(
              data.topicId,
              data.attachments[i].id
            );
            data.attachments[i] = response.data;
          } catch (e) {
            data.attachments[i].remoteUrl = "";
            data.attachments[i].error = e;
          }
        }
      }

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
    return data;
  }

  /**
   * 去广告
   * @param data
   */
  private static async fixAds(data: any) {
    if (data) data = [];
    return data;
  }
  /**
   * 获取帖子附件
   * @param pid
   * @param aid
   */
  private static async getAttment(pid: number, aid: number) {
    const url = `/api/attachment`;
    const data = {
      id: aid,
      resource_id: pid,
      reource_type: "topic",
      line: "",
    };

    return AXIOS.post(url, data);
  }
}
