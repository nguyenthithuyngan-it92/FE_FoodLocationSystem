import { useContext, useEffect, useState } from "react";
import InputFormUser from "../layout/InputFormUser";
import ReactVirtualizedTable, { ACTION_TYPES } from "./ReactVirtualizedTable";
import {
  Alert,
  AlertTitle,
  Divider,
  FormControl,
  MenuItem,
  Select,
  Snackbar,
} from "@mui/material";
import { FormLabel } from "react-bootstrap";
import API, { authAPI, endpoints } from "../configs/API";
import {
  Navigate,
  useNavigate,
  redirect,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { UserContext } from "../configs/MyContext";
import { numberWithCommas } from "../utils/converters";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { buildExtraDataToAPI, deserializerData } from "../utils/serializeData";

const FEE = 15000;
const MOMO = 2;

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
  const [searchParams] = useSearchParams();
  const [mess, setMess] = useState(null);
  const [openMess, setOpenMess] = useState(false);
  const [err, setErr] = useState();

  const handleCloseMess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenMess(false);
  };

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

  // SET QUANTITY FOOD
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
    const orderId = searchParams.get("orderId");
    const totalTemp = searchParams.get("amount");
    const responseCode = searchParams.get("resultCode");

    if (orderId) {
      const extraData = searchParams.get("extraData");
      const newExtraData = deserializerData(extraData);
      const {
        order_details,
        delivery_fee,
        payment_status,
        paymentmethod,
        receiver_address,
        receiver_name,
        receiver_phone,
        store,
        user,
      } = newExtraData;

      if (Number(responseCode) !== 1006) {
        try {
          (async function () {
            const params = {
              receiver_address,
              receiver_name,
              receiver_phone,
              amount: totalTemp,
              payment_status: true,
              paymentmethod: Number(paymentmethod),
              delivery_fee: parseFloat(delivery_fee),
              user: Number(user),
              order_details: JSON.parse(order_details),
              store: Number(store),
            };

            const res = await authAPI().post(endpoints["orders"], params);

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
          })();
        } catch (err) {
          console.log(err);
        }
      } else {
        setFormOrder({
          receiver_name,
          paymentmethod: Number(paymentmethod),
          receiver_address,
          receiver_phone,
          delivery_fee,
        });
        setListCart(JSON.parse(localStorage.getItem(`cart-${user.id}`)));
        setMess("Bạn chưa thanh toán hóa đơn! Đơn hàng chưa được đặt!");
        setOpenMess(true);
      }
    }
  }, []);

  // set total amount
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

  // check user load cart
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

  // ADD ORDER
  const addOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    let isValid = true;

    if (formOrder.receiver_name === "") {
      setErr("Phải nhập tên người nhận!");
      isValid = false;
    } else if (formOrder.receiver_phone === "") {
      setErr("Phải nhập số điện thoại người nhận!");
      isValid = false;
    } else if (formOrder.receiver_address === "") {
      setErr("Phải nhập địa chỉ nhận hàng!");
      isValid = false;
    } else if (formOrder.paymentmethod === "") {
      setErr("Phải nhập chọn phương thức thanh toán!");
      isValid = false;
    }
    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      let storeId = null;
      const paymentmethod = formOrder.paymentmethod;

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
        payment_status: paymentmethod === MOMO ? true : false,
        amount: total,
        user: user.id,
        order_details: orderDetails,
        store: storeId,
      };

      let res;

      if (Number(paymentmethod) === MOMO) {
        const extraData = buildExtraDataToAPI({
          ...params,
          order_details: JSON.stringify(orderDetails),
        });

        res = await authAPI().post(endpoints["payMomo"], {
          orderInfo: `Khách hàng: ${formOrder.receiver_name} - ${formOrder.receiver_phone}`,
          amount: `${total}`,
          redirectUrl: "http://localhost:3000/cart",
          ipnUrl: "http://localhost:3000/cart",
          extraData,
        });

        if (res.status === 200) {
          const payURL = res.data.data.payURL;
          window.location.href = payURL;
        }
        return;
      } else {
        res = await authAPI().post(endpoints["orders"], params);
      }

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
      setMess("Đặt không thành công! Vui lòng kiểm tra lại các món ăn đặt!!!");
      setOpenMess(true);
    } finally {
      setLoading(false);
    }
  };

  // if (!user) return <Navigate to="/login" replace={true} />;

  return (
    <>
      {!user || Number(user.user_role) === 0 ? (
        <div>
          {/* MESSAGE */}
          <Snackbar
            open={openMess}
            autoHideDuration={6000}
            onClose={handleCloseMess}
          >
            <Alert severity="error" onClose={handleCloseMess}>
              <AlertTitle>Lỗi đặt món</AlertTitle>
              {mess}
            </Alert>
          </Snackbar>
          <div style={{ border: "1px solid", margin: 10, borderRadius: 5 }}>
            <h6 style={{ margin: 10, color: "gray" }}>
              Thông tin món ăn được đặt
            </h6>
            <ReactVirtualizedTable columns={columnsCart} rows={listCart} />
            <div
              style={{
                padding: 12,
                fontWeight: "bold",
                color: "Highlight",
              }}
            >
              Tổng tiền:
              <span
                style={{ fontSize: "20px", fontStyle: "italic", margin: 5 }}
              >
                {listCart.length === 0 ? 0 : numberWithCommas(total)}
              </span>
              VNĐ
            </div>
          </div>
          <Divider color="gray" />
          <div style={{ border: "1px solid", margin: 10, borderRadius: 5 }}>
            <h6 style={{ margin: 10, color: "gray" }}>Thông tin giao hàng</h6>
            {err ? <Alert severity="error">{err}</Alert> : ""}
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
        </div>
      ) : (
        <Alert severity="warning" style={{ margin: 5 }}>
          Vui lòng đăng nhập bằng tài khoản khách hàng để thực hiện đặt món!
        </Alert>
      )}
    </>
  );
};

export default CartOrder;
