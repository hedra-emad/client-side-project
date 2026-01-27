import { getData } from "../utils.js";

const data = window.location.pathname.split("/");
getData(data);
