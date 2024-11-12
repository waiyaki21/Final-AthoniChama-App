var page = window.location.pathname.split("/").pop().split(".")[0];
var aux = window.location.pathname.split("/");
var to_build = (aux.includes('pages')?'../':'./');
var root = window.location.pathname.split("/")
if (!aux.includes("pages")) {
  page = "dashboard";
}

loadStylesheet(to_build + "assets/css/perfect-scrollbar.css");
loadJS(to_build + "./perfect-scrollbar.js", true);

if (document.querySelector("nav [navbar-trigger]")) {
  loadJS(to_build + "./navbar-collapse.js", true);
}

if (document.querySelector("[data-target='tooltip']")) {
  loadJS(to_build + "./tooltips.js", true);
  loadStylesheet(to_build + "../css/tooltips.css");
}

if (document.querySelector("[nav-pills]")) {
  loadJS(to_build + "./nav-pills.js", true);
}

if (document.querySelector("[dropdown-trigger]")) {
  loadJS(to_build + "./dropdown.js", true);

}

if (document.querySelector("[fixed-plugin]")) {
  loadJS(to_build + "./fixed-plugin.js", true);
}

if (document.querySelector("[navbar-main]")) {
  loadJS(to_build + "./sidenav-burger.js", true);
  loadJS(to_build + "./navbar-sticky.js", true);
}

if (document.querySelector("canvas")) {
  loadJS(to_build + "./chart-1.js", true);
  loadJS(to_build + "./chart-2.js", true);
}

function loadJS(FILE_URL, async) {
  let dynamicScript = document.createElement("script");

  dynamicScript.setAttribute("src", FILE_URL);
  dynamicScript.setAttribute("type", "text/javascript");
  dynamicScript.setAttribute("async", async);

  document.head.appendChild(dynamicScript);
}

function loadStylesheet(FILE_URL) {
  let dynamicStylesheet = document.createElement("link");

  dynamicStylesheet.setAttribute("href", FILE_URL);
  dynamicStylesheet.setAttribute("type", "text/css");
  dynamicStylesheet.setAttribute("rel", "stylesheet");

  document.head.appendChild(dynamicStylesheet);
}
