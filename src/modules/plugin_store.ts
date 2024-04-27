export class PluginStore {
  static get(key: string, defaultValue: string | number | boolean): any {
    const value = localStorage.getItem(key);
    console.log("获取", key, value);

    if (value === null) {
      return defaultValue;
    }
    if (typeof defaultValue === "number") {
      return parseInt(value);
    }
    if (typeof defaultValue === "boolean") {
      return value === "true";
    }
    return value;
  }

  static set(key: string, value: string | number | boolean) {
    localStorage.setItem(key, value.toString());
  }
}
