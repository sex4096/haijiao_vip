import { Interceptor } from "./modules/interceptor";
import { AXIOS, initHookWebpack } from "./modules/webpack";

function initialed() {
  const interceptor = new Interceptor(AXIOS);
  interceptor.initRequestInterceptor();
  interceptor.initResponseInterceptor();
}

initHookWebpack(initialed);
