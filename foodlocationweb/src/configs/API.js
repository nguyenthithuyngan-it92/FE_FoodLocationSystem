import axios from "axios";
import cookie from "react-cookies";

export const endpoints = {
    "tags": "/tags/",
    "foods": "/foods/",
    "stores": "/stores/",
    "user": "/users/",
    "menu-items": "/menu-items/",
    "orders" : "/orders/",
    "login": "/o/token/",
    "current-user": "/users/current-user/",
    "register": "/users/",
    "register-store": "/users/",

    "store-management": "/stores/store-management/",
}

export const authAPI = () => axios.create({
    baseURL: "http://127.0.0.1:8000/",
    headers: {
        "Authorization": `Bearer ${cookie.load('access-token')}`
    }
})


export default axios.create({
    baseURL: "http://127.0.0.1:8000/"
})