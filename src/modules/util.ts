export function addStyle() {
  let script = document.createElement("link");
  script.setAttribute("rel", "stylesheet");
  script.setAttribute("type", "text/css");
  script.href = "https://cdn.jsdelivr.net/npm/antd@5.16.4/dist/reset.min.css";
  document.documentElement.appendChild(script);
}

export function addAnalytics() {
  const script = document.createElement("script");
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-NQ08DH5N3T";
  script.async = true;
  document.head.appendChild(script);

  const script2 = document.createElement("script");
  script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-NQ08DH5N3T');
    `;
  document.head.appendChild(script2);
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
