export function addStyle() {
  let script = document.createElement("link");
  script.setAttribute("rel", "stylesheet");
  script.setAttribute("type", "text/css");
  script.href = "https://cdn.jsdelivr.net/npm/antd@5.16.4/dist/reset.min.css";
  document.documentElement.appendChild(script);
}

export function setCookie(name: string, value: string) {
  document.cookie =
    name +
    "=" +
    value +
    ";path=/;expires=" +
    new Date(Date.now() + 864e5).toUTCString() +
    ";";
}
