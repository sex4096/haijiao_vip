export var __webpack_require__: any = undefined;
export var VUE: any = undefined;
export var STORE: any = undefined;
export var AXIOS: any = undefined;
export var BASE64: any = undefined;
var callback: any = undefined;
export function initHookWebpack(initialed: CallableFunction) {
  callback = initialed;
  let originCall = Function.prototype.call;
  Function.prototype.call = function (...args) {
    const result = originCall.apply(this, args);

    if (
      args.length === 4 &&
      args[1] &&
      args[1].exports &&
      args[0] === args[2] &&
      __webpack_require__ === undefined
    ) {
      __webpack_require__ = args[3];
      Function.prototype.call = originCall;
      importModules();
    }
    return result;
  };
}

function importModules() {
  VUE = __webpack_require__("2b0e").default;
  STORE = __webpack_require__("4360").a;
  AXIOS = __webpack_require__("bc3a");
  AXIOS = getObject(AXIOS);
  AXIOS = AXIOS.a;

  callback();
}

function getObject(module: any) {
  const t =
    module && module.__esModule
      ? function () {
          return module.default;
        }
      : function () {
          return module;
        };
  defineObject(t, "a", t);
  return t;
}

function defineObject(module: any, key: string, value: any) {
  Object.prototype.hasOwnProperty.call(module, key) ||
    Object.defineProperty(module, key, {
      enumerable: true,
      get: value,
    });
}
