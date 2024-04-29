declare module "*.svg" {
  const content: any;
  export default content;
}

export declare global {
  interface Window {
    VConsole: any;
  }
}
