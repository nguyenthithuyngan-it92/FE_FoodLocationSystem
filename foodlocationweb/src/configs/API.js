import axios from "axios";

export const endpoints = {
    "tags": "/tags/",
    "foods": "/foods/",
    "stores": "/stores/",
    "menu-items": "/menu-items/",
    "orders" : "/orders/"
}

export default axios.create({
    baseURL: "http://127.0.0.1:8000/"
})