import React from "react";
import ReactDOM from "react-dom";
import { Interceptor } from "./modules/interceptor";
import { AXIOS, initHookWebpack } from "./modules/webpack";
import MyButton from "./test";

function initialed() {
  initSetting();
  const interceptor = new Interceptor(AXIOS);
  interceptor.initRequestInterceptor();
  interceptor.initResponseInterceptor();
}

function initSetting() {
  const toolbarContainer = document.querySelector("div[id=toolbar-container]");
  if (toolbarContainer) {
    const newContainer = document.createElement("div");
    newContainer.id = "haijiao-vip-settings-container";
    toolbarContainer?.appendChild(newContainer);

    const myButton = React.createElement(MyButton, null);
    ReactDOM.render(myButton, newContainer);
  }
}
GM_addStyle(GM_getResourceText("antd"));

initHookWebpack(initialed);
