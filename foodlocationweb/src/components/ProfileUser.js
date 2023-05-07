import { useContext, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { UserContext } from "../configs/MyContext";
import { Alert, Avatar, Snackbar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import InputFormUser from "../layout/InputFormUser";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { authAPI, endpoints } from "../configs/API";

const ProfileUser = () => {
  const [user, dispatch] = useContext(UserContext);
  const avatar = useRef();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [err, setErr] = useState(null);
  const [mess, setMess] = useState(null);
  const [openMess, setOpenMess] = useState(false);

  const handleCloseMess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenMess(false);
  };

  const [userEdit, setUser] = useState({
    first_name: user ? user.first_name : "",
    last_name: user ? user.last_name : "",
    username: user ? user.username : "",
    email: user ? user.email : "",
    phone: user ? user.phone : "",
    address: user ? user.address : "",
    name_store: user ? user.name_store : "",
  });

  const editUser = async (evt) => {
    evt.preventDefault();
    setLoading(true);
    try {
      let form = new FormData();
      form.append("first_name", userEdit.first_name);
      form.append("last_name", userEdit.last_name);
      form.append("username", userEdit.username);
      form.append("email", userEdit.email);
      form.append("phone", userEdit.phone);

      if (avatar.current.files.length > 0)
        form.append("avatar", avatar.current.files[0]);

      if (userEdit.address) form.append("address", userEdit.address);

      if (userEdit.name_store) form.append("name_store", userEdit.name_store);

      let res = await authAPI().put(endpoints["current-user"], form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 200) {
        // setUser((pre) => pre + 1);

        setOpenMess(true);
        setMess("Cập nhật thông tin thành công!");

        dispatch({
          type: "edit",
          payload: res.data,
        });
      } else setErr("Hệ thống bị lỗi! Vui lòng quay lại sau");
    } catch (ex) {
      let e = "";
      for (let d of Object.values(ex.response.data)) e += `${d} <br />`;

      setErr(e);
    } finally {
      setLoading(false);
    }
  };

  if (user === null) return navigate("/login");

  return (
    <>
      {/* MESSAGE */}
      {user ? (
        <div>
          <Snackbar
            open={openMess}
            autoHideDuration={6000}
            onClose={handleCloseMess}
          >
            <Alert onClose={handleCloseMess}>{mess}</Alert>
          </Snackbar>
          <div style={{ margin: 10, display: "flex" }}>
            <div style={{ width: "35%", marginLeft: 10 }}>
              <Avatar
                alt={user.username}
                src={user.image}
                style={{
                  width: 150,
                  height: 150,
                  fontSize: "50px",
                  marginLeft: "25%",
                }}
              />
              <Form.Group
                className="inputPanel-avatar-profile"
                style={{ marginTop: 10 }}
              >
                <Form.Label
                  className="usernameField-inputPanel--username"
                  style={{ color: "gray" }}
                >
                  Thay đổi ảnh đại diện
                </Form.Label>
                <Form.Control
                  type="file"
                  name="avatar-upload"
                  ref={avatar}
                ></Form.Control>
              </Form.Group>
            </div>
            <div style={{ width: "50%", marginRight: 30, marginLeft: 50 }}>
              {err ? <Alert severity="error">{err}</Alert> : ""}
              <InputFormUser
                label="Tên đăng nhập"
                type="text"
                value={userEdit.username}
                controlId="un"
                setValue={(e) =>
                  setUser({ ...userEdit, username: e.target.value })
                }
              />
              <InputFormUser
                label="Họ và tên lót"
                type="text"
                value={userEdit.last_name}
                controlId="ln"
                setValue={(e) =>
                  setUser({ ...userEdit, last_name: e.target.value })
                }
              />
              <InputFormUser
                label="Tên"
                type="text"
                value={userEdit.first_name}
                controlId="fn"
                setValue={(e) =>
                  setUser({ ...userEdit, first_name: e.target.value })
                }
              />
              <InputFormUser
                label="Địa chỉ email"
                type="email"
                value={userEdit.email}
                controlId="email"
                setValue={(e) =>
                  setUser({ ...userEdit, email: e.target.value })
                }
              />
              <InputFormUser
                label="Số điện thoại"
                type="number"
                value={userEdit.phone}
                controlId="phone"
                setValue={(e) =>
                  setUser({ ...userEdit, phone: e.target.value })
                }
              />
              {Number(user.user_role) === 1 ? (
                <>
                  <InputFormUser
                    label="Tên cửa hàng"
                    type="text"
                    value={userEdit.name_store}
                    controlId="name_store"
                    setValue={(e) =>
                      setUser({ ...userEdit, name_store: e.target.value })
                    }
                  />
                  <InputFormUser
                    label="Địa chỉ cửa hàng"
                    type="text"
                    value={userEdit.address}
                    controlId="phone"
                    setValue={(e) =>
                      setUser({ ...userEdit, address: e.target.value })
                    }
                  />
                </>
              ) : null}
              <div style={{ marginLeft: "320px" }}>
                <LoadingButton
                  loading={loading}
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  variant="outlined"
                  style={{
                    fontWeight: "bold",
                    color: "orange",
                    borderColor: "orange",
                  }}
                  onClick={editUser}
                >
                  Cập nhật
                </LoadingButton>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Alert severity="warning">
          Vui lòng <Link to="/login">đăng nhập </Link> để xem thông tin của bạn!
        </Alert>
      )}
    </>
  );
};

export default ProfileUser;
