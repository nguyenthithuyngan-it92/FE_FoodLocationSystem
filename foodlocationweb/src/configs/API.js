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
  "payment-method": "/paymentmethod/",

  "menu-management": "/stores/menu-management/",
  "food-management": "/stores/food-management/",
  "menu-store": (storeId) => `/stores/${storeId}/menu-item/`,
  "food-list": (storeId) => `/food-list/${storeId}/get_food_by_store_id/`,
  "order-store": "/orders/",
  "order-pending": "/orders/pending-order/",
  "order-accepted": "/orders/accepted-order/",
  "confirm-order": (orderId) => `/orders/${orderId}/confirm-order/`,

  "food-store": "/food-store/",
  "status-menu": (menuId) => `/menu-items/${menuId}/set-status-menu/`,
  "action-menu": (menuId) => `/menu-items/${menuId}/`,
  "status-food": (foodId) => `/food-store/${foodId}/set-status-food/`,
  "action-food": (foodId) => `/food-store/${foodId}/`,

  "count-follower": (storeId) =>
    `subcribes/${storeId}/count_follower_by_store/`,
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
