import React from "react";
import ReactDOM from "react-dom";
import { initHookWebpack } from "./modules/webpack";
import App from "./ui/app";
import { Interceptor } from "./modules/interceptor";
import { addAnalytics, addStyle, setCookie } from "./modules/util";

function initialed(vue: any, store: any, axios: any) {
  const interceptor = new Interceptor(axios);
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

sessionStorage.setItem("pageOpen", "1");
addAnalytics();
addStyle();
initSetting();
initHookWebpack(initialed);
setCookie("is_vip", "1");

console.log("haijiao-vip-plugin init success");
