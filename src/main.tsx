import React from "react";
import ReactDOM from "react-dom";
import { AXIOS, initHookWebpack } from "./modules/webpack";
import App from "./ui/app";
import { Interceptor } from "./modules/interceptor";

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

function addStyle() {
  let script = document.createElement("link");
  script.setAttribute("rel", "stylesheet");
  script.setAttribute("type", "text/css");
  script.href = "https://cdn.jsdelivr.net/npm/antd@5.16.4/dist/reset.min.css";
  document.documentElement.appendChild(script);
}
addStyle();
initSetting();
initHookWebpack(initialed);
