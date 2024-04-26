import React from "react";
import ReactDOM from "react-dom";
import { Interceptor } from "./modules/interceptor";
import { AXIOS, initHookWebpack } from "./modules/webpack";
import App from "./ui/app";

function initialed() {
  initSetting();
  const interceptor = new Interceptor(AXIOS);
  interceptor.initRequestInterceptor();
  interceptor.initResponseInterceptor();
}

function initSetting() {
  const myButton = React.createElement(App, null);
  const pluginDiv = document.createElement("div");
  pluginDiv.id = "haijiao-vip-plugin";
  document.body.appendChild(pluginDiv);
  ReactDOM.render(myButton, pluginDiv);
}
GM_addStyle(GM_getResourceText("antd"));

initHookWebpack(initialed);
