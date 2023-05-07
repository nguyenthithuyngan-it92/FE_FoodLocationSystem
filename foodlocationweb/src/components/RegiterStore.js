import { useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API, { endpoints } from "../configs/API";
import InputFormUser from "../layout/InputFormUser";
import Loading from "../layout/Loading";


import Alert from "@mui/material/Alert";

const RegisterStore = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
    name_store: "",
    address: "",
    user_role: 1,
  });
  const avatar = useRef();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState();
  const nav = useNavigate();

  const registerStore = (evt) => {
    evt.preventDefault();

    const process = async () => {
      try {
        let form = new FormData();
        form.append("first_name", user.firstName);
        form.append("last_name", user.lastName);
        form.append("username", user.username);
        form.append("password", user.password);
        form.append("email", user.email);
        form.append("phone", user.phone);
        form.append("name_store", user.name_store);
        form.append("address", user.address);
        form.append("user_role", user.user_role);

        if (avatar.current.files.length > 0)
          form.append("avatar", avatar.current.files[0]);

        let res = await API.post(endpoints["register"], form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (res.status === 201) nav("/login");
        else setErr("Hệ thống bị lỗi! Vui lòng quay lại sau");
      } catch (ex) {
        let e = "";
        for (let d of Object.values(ex.response.data)) e += `${d} <br />`;

        setErr(e);
      } finally {
        setLoading(false);
      }
    };

    if (user.username === "" || user.password === "")
      setErr("Username hoặc password phải nhập!");
    else if (user.password !== user.confirmPassword)
    setErr("Mật khẩu xác nhận không khớp!");
    else if (user.name_store === "") setErr("Phải nhập tên cửa hàng!");
    else if (user.address === "") setErr("Phải nhập địa chỉ cửa hàng!");
    else if (avatar.current.files.length === 0)
      setErr("Phải chọn ảnh đại diện cho cửa hàng!");
    else if (user.firstName === "" || user.lastName === "")
      setErr("Phải nhập họ và tên!");
    else {
      setLoading(true);
      process();
    }
  };

  return (
    <>
      <h1 className="text-center text-success" style={{ marginTop: 10 }}>
        ĐĂNG KÝ CỬA HÀNG
      </h1>

      {err ? <Alert severity="error">{err}</Alert> : ""}
      
      <Form onSubmit={registerStore}>
        <div style={{ margin: 10, display: "flex" }}>
          <div style={{ width: "50%", margin: 10 }}>
            <InputFormUser
              label="Tên đăng nhập"
              type="text"
              value={user.username}
              controlId="un"
              setValue={(e) => setUser({ ...user, username: e.target.value })}
            />
            <InputFormUser
              label="Mật khẩu"
              type="password"
              value={user.password}
              controlId="pa"
              setValue={(e) => setUser({ ...user, password: e.target.value })}
            />
            <InputFormUser
              label="Xác nhận mật khẩu"
              type="password"
              value={user.confirmPassword}
              controlId="cf"
              setValue={(e) =>
                setUser({ ...user, confirmPassword: e.target.value })
              }
            />
            <InputFormUser
              label="Địa chỉ email"
              type="email"
              value={user.email}
              controlId="email"
              setValue={(e) => setUser({ ...user, email: e.target.value })}
            />
            <InputFormUser type="file" ref={avatar} label="Ảnh đại diện" />
          </div>
          <div style={{ width: "50%", margin: 10 }}>
            <InputFormUser
              label="Tên chủ cửa hàng"
              type="text"
              value={user.firstName}
              controlId="fn"
              setValue={(e) => setUser({ ...user, firstName: e.target.value })}
            />
            <InputFormUser
              label="Họ và tên lót"
              type="text"
              value={user.lastName}
              controlId="ln"
              setValue={(e) => setUser({ ...user, lastName: e.target.value })}
            />

            <InputFormUser
              label="Tên cửa hàng"
              type="text"
              value={user.name_store}
              controlId="name_store"
              setValue={(e) => setUser({ ...user, name_store: e.target.value })}
            />
            <InputFormUser
              label="Số điện thoại"
              type="number"
              value={user.phone}
              controlId="phone"
              setValue={(e) => setUser({ ...user, phone: e.target.value })}
            />
            <InputFormUser
              label="Địa chỉ cửa hàng"
              type="text"
              value={user.address}
              controlId="address"
              setValue={(e) => setUser({ ...user, address: e.target.value })}
            />
          </div>
        </div>

        <div style={{ marginLeft: "800px" }}>
          {loading ? (
            <Loading />
          ) : (
            <Button
              variant="success"
              type="submit"
              style={{ width: 100, fontWeight: "bold" }}
            >
              Đăng ký
            </Button>
          )}
        </div>
      </Form>
    </>
  );
};

export default RegisterStore;
