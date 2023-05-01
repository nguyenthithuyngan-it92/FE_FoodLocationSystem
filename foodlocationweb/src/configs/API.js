import axios from "axios";
import cookie from "react-cookies";

export const endpoints = {
  tags: "/tags/",
  foods: "/foods/",
  "food-by-id": (foodId) => `/foods/${foodId}/`,
  stores: "/stores/",
  user: "/users/",
  "menu-items": "/menu-items/",
  orders: "/orders/",
  login: "/o/token/",
  "current-user": "/users/current-user/",
  register: "/users/",
  "register-store": "/users/",

  "store-management": "/stores/store-management/",
  "menu-store": (storeId) => `/stores/${storeId}/menu-item/`,
  "food-list": (storeId) => `/food-list/${storeId}/get_food_by_store_id/`,
};

export const authAPI = () =>
  axios.create({
    baseURL: "http://127.0.0.1:8000/",
    headers: {
      Authorization: `Bearer ${cookie.load("access-token")}`,
    },
  });

export default axios.create({
  baseURL: "http://127.0.0.1:8000/",
});
