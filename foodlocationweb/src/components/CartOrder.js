import { useContext, useEffect, useState } from "react";
import InputFormUser from "../layout/InputFormUser";
import ReactVirtualizedTable, { ACTION_TYPES } from "./ReactVirtualizedTable";
import { Divider, FormControl, MenuItem, Select } from "@mui/material";
import { FormLabel } from "react-bootstrap";
import API, { authAPI, endpoints } from "../configs/API";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../configs/MyContext";
import { numberWithCommas } from "../utils/converters";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

const FEE = 15000;

const CartOrder = () => {
  const [user] = useContext(UserContext);
  const [payment, setPaymethod] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [listCart, setListCart] = useState([]);
  const [formOrder, setFormOrder] = useState({
    receiver_name: "",
    receiver_phone: "",
    receiver_address: "",
    delivery_fee: FEE,
    paymentmethod: "",
  });
  const navigate = useNavigate();

  const columnsCart = [
    { width: 100, label: "Mã món ăn", dataKey: "id", numeric: false },
    { width: 200, label: "Tên món ăn", dataKey: "name", numeric: false },
    { width: 150, label: "Giá", dataKey: "price", numeric: true },
    {
      width: 120,
      label: "Số lượng",
      dataKey: "quantity",
      numeric: false,
      hasAction: true,
      service: (type, data) => handleActionCart(type, data),
    },
  ];

  const handleActionCart = (type, data) => {
    // console.log({ type, data });
    const key = `cart-${user.id}`;
    const dataStorage = JSON.parse(localStorage.getItem(key));
    const cartItem = dataStorage.find((item) => item.id === data.id);
    let results;

    if (cartItem && cartItem.quantity === 1 && type === ACTION_TYPES.MINUS) {
      results = dataStorage.filter((item) => item.id !== data.id);
    } else {
      results = dataStorage.map((item) => {
        const { id, quantity } = item;
        if (id === data.id) {
          return {
            ...item,
            quantity: type === ACTION_TYPES.MINUS ? quantity - 1 : quantity + 1,
          };
        }

        return item;
      });
    }

    setListCart(results);
    localStorage.setItem(key, JSON.stringify(results));
  };

  useEffect(() => {
    // console.log(listCart);
    if (user) {
      const total = [...(listCart || [])].reduce(
        (accu, currentValue) =>
          accu + currentValue.quantity * currentValue.price,
        FEE
      );
      setTotal(total);
    }
  }, [listCart]);

  useEffect(() => {
    if (user) {
      setListCart(JSON.parse(localStorage.getItem(`cart-${user.id}`)) || []);
    } else {
      setListCart([]);
    }

    return () => {
      setListCart([]);
    };
  }, [user]);

  useEffect(() => {
    const loadPayments = async () => {
      let res = await API.get(endpoints["payment-method"]);
      setPaymethod(res.data.results);
    };

    loadPayments();
  }, []);

  const addOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let storeId = null;
      const orderDetails = listCart.map((item) => {
        storeId = item.store_id;

        return {
          quantity: item.quantity,
          unit_price: item.price,
          food: item.id,
        };
      });

      const params = {
        ...formOrder,
        payment_status: false,
        amount: total,
        user: user.id,
        order_details: orderDetails,
        store: storeId,
      };

      let res = await authAPI().post(endpoints["orders"], params);

      if (res.status === 201) {
        setFormOrder({
          receiver_name: "",
          receiver_phone: "",
          receiver_address: "",
          delivery_fee: FEE,
          paymentmethod: "",
        });
        setListCart([]);
        localStorage.removeItem(`cart-${user.id}`);
        navigate("/");
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Navigate to="/login" replace={true} />;

  return (
    <>
      <div style={{ border: "1px solid", margin: 10, borderRadius: 5 }}>
        <h6 style={{ margin: 10, color: "gray" }}>Thông tin món ăn được đặt</h6>
        <ReactVirtualizedTable columns={columnsCart} rows={listCart} />
        <div
          style={{
            padding: 12,
            fontWeight: "bold",
            color: "Highlight",
          }}
        >
          Tổng tiền:
          <span style={{ fontSize: "20px", fontStyle: "italic", margin: 5 }}>
            {listCart.length === 0 ? 0 : numberWithCommas(total)}
          </span>
          VNĐ
        </div>
      </div>
      <Divider color="gray" />
      <div style={{ border: "1px solid", margin: 10, borderRadius: 5 }}>
        <h6 style={{ margin: 10, color: "gray" }}>Thông tin giao hàng</h6>
        <div style={{ margin: 10, display: "flex" }}>
          <div style={{ width: "50%", margin: 10 }}>
            <InputFormUser
              label="Tên người nhận"
              type="text"
              value={formOrder.receiver_name}
              controlId="rn"
              setValue={(e) => {
                setFormOrder({
                  ...formOrder,
                  receiver_name: e.target.value,
                });
              }}
            />
            <InputFormUser
              label="Số điện thoại người nhận"
              type="number"
              value={formOrder.receiver_phone}
              controlId="phone"
              setValue={(e) => {
                setFormOrder({
                  ...formOrder,
                  receiver_phone: e.target.value,
                });
              }}
            />
            <InputFormUser
              label="Địa chỉ nhận hàng"
              type="text"
              value={formOrder.receiver_address}
              controlId="address"
              setValue={(e) => {
                setFormOrder({
                  ...formOrder,
                  receiver_address: e.target.value,
                });
              }}
            />
          </div>
          <div style={{ width: "50%", margin: 10 }}>
            <InputFormUser
              disabled
              label="Phí giao hàng"
              type="number"
              value={FEE}
              controlId="fee"
            />
            <FormControl fullWidth>
              <FormLabel>Phương thức thanh toán</FormLabel>
              <Select
                onChange={(e) => {
                  setFormOrder({
                    ...formOrder,
                    paymentmethod: e.target.value,
                  });
                }}
                value={formOrder.paymentmethod}
                displayEmpty
                style={{ height: 37 }}
              >
                {payment.map((p) => (
                  <MenuItem value={p.id}>{p.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <div
              style={{
                padding: 12,
                marginLeft: "280px",
              }}
            >
              <LoadingButton
                loading={loading}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="outlined"
                onClick={addOrder}
              >
                Đặt món
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartOrder;
