import React from "react";
import ReactDOM from "react-dom";
import { AXIOS, initHookWebpack } from "./modules/webpack";
import App from "./ui/app";
import { Interceptor } from "./modules/interceptor";
import { addAnalytics, addStyle } from "./modules/util";

function initialed() {
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

addAnalytics();
addStyle();
initSetting();
initHookWebpack(initialed);
