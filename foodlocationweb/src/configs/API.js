import axios from "axios";
import cookie from "react-cookies";

export const endpoints = {
  tags: "/tags/",
  foods: "/foods/",
  "food-by-id": (foodId) => `/foods/${foodId}/`, //lấy thông tin food detail
  stores: "/stores/", //chưa dùng
  "store-detail": (storeId) => `/stores/${storeId}/`, //lấy thông tin store cho trang Store Feedback
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
  "menu-store": (storeId) => `/stores/${storeId}/menu-item/`, //get list menu by store id
  "food-list": (storeId) => `/food-list/${storeId}/get_food_by_store_id/`, //get list food by store id
  "order-store": "/orders/", //đặt món
  "order-pending": "/orders/pending-order/", //get list order Pen
  "order-accepted": "/orders/accepted-order/", //get list order Acc
  "confirm-order": (orderId) => `/orders/${orderId}/confirm-order/`, //set status order

  "food-store": "/food-store/", //thêm món ăn
  "status-menu": (menuId) => `/menu-items/${menuId}/set-status-menu/`, //set status menu
  "action-menu": (menuId) => `/menu-items/${menuId}/`, //sửa xóa menu
  "status-food": (foodId) => `/food-store/${foodId}/set-status-food/`, //set status food
  "action-food": (foodId) => `/food-store/${foodId}/`, //sửa xóa food

  "count-follower": (storeId) =>
    `subcribes/${storeId}/count_follower_by_store/`, //đếm follower
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
