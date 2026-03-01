import { getData } from "../utils.js";
const parts = window.location.pathname.split("/");
const file = (parts[parts.length - 1] || "").split("?")[0];
const data = [null, null, file];
getData(data);
