import { useState, useContext, useEffect } from "react";
import API, { authAPI, endpoints } from "../configs/API";
import { UserContext } from "../configs/MyContext";
import Loading from "../layout/Loading";
import { Link } from "react-router-dom";

import InfoStore from "../layout/InfoStore";
import Alert from "@mui/material/Alert";
import FuncStore from "./FuncStore";
import TableOrder from "./TableOrder";

const StoreManagement = () => {
  const [user] = useContext(UserContext);
  const [stores, setStores] = useState(null);
  //   const [navActive, setNavActive] = useState();

  // load store
  useEffect(() => {
    let loadStore = async () => {
      try {
        let res = await authAPI().get(endpoints["store-management"]);
        setStores(res.data);
      } catch (ex) {}
    };

    loadStore();
  }, []);

  if (user === null)
    return (
      <Alert severity="warning" sx={{ margin: "10px" }}>
        Vui lòng <Link to="/login"> đăng nhập </Link>vào tài khoản cửa hàng của
        bạn!
      </Alert>
    );
  if (user.user_role !== 1)
    return (
      <Alert severity="warning">
        Tài khoản của bạn không có quyền truy cập!
      </Alert>
    );

  // if (stores === null) return <Loading />

  return (
    <>
      {/* <h1 className="text-center text-success m-3">QUẢN LÝ CỬA HÀNG</h1> */}
      {user.is_verify === 0 ? (
        <Alert severity="warning">
          Tài khoản của bạn chưa được chứng thực để thực hiện chức năng này!
        </Alert>
      ) : (
        <div>
          {/* INFO STORE */} <InfoStore />
          <div style={{ display: "flex", gap: "15px" }}>
            {/* DANH SÁCH CHỨC NĂNG */}
            <FuncStore />

            <TableOrder />
          </div>
        </div>
      )}
    </>
  );
};

export default StoreManagement;
