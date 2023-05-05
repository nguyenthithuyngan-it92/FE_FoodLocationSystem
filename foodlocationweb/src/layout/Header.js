import { useContext, useEffect, useState } from "react";
import API, { authAPI, endpoints } from "../configs/API";
import { Button, Container, Form, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { UserContext } from "../configs/MyContext";

import * as React from "react";

import Avatar from "@mui/material/Avatar";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ButtonM from "@mui/material/Button";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import { Divider, ListItem, ListItemText, Typography } from "@mui/material";
import Moment from "react-moment";
import { numberWithCommas } from "../utils/converters";

const Header = () => {
  const [tags, setTags] = useState([]);

  const [user, dispatch] = useContext(UserContext);
  const [order, setOrder] = useState([]);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        let res = await authAPI().get(endpoints["orders"]);
        if (res.status === 200) {
          console.log(res.data);
          setOrder(res.data);
        }
      } catch {}
    };
    loadOrder();
  }, [user]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [anchorE2, setAnchorE2] = React.useState(null);
  const openNofi = Boolean(anchorE2);
  const handleClickNofi = (event) => {
    setAnchorE2(event.currentTarget);
  };
  const handleCloseNofi = () => {
    setAnchorE2(null);
  };

  useEffect(() => {
    const loadTags = async () => {
      let res = await API.get(endpoints["tags"]);
      console.log(res.data.results);
      setTags(res.data.results);
    };

    loadTags();
  }, []);

  const logout = () => {
    dispatch({
      type: "logout",
    });
  };

  let userInfo = (
    <>
      <div>
        <ButtonM
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <AccountCircleIcon fontSize="small" className="m-1" /> Tài khoản
        </ButtonM>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{ "aria-labelledby": "basic-button" }}
        >
          <MenuItem onClick={handleClose}>
            <Link to="/login" className="nav-link text-success">
              <LoginIcon fontSize="small" /> Đăng nhập
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link to="/register" className="nav-link text-danger">
              <PersonAddIcon fontSize="small" /> Đăng ký
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link
              to="/register-store"
              className="nav-link text-primary"
              sx={{ pl: 4 }}
            >
              <AddBusinessIcon fontSize="small" /> Đăng ký cửa hàng
            </Link>
          </MenuItem>
        </Menu>
      </div>
    </>
  );
  if (user !== null)
    userInfo = (
      <>
        {/* NOTIFICATION ORDER */}
        {user.user_role === 0 && user.is_superuser != 1 ? (
          <div>
            <ButtonM
              id="basic-button"
              color="warning"
              aria-controls={openNofi ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openNofi ? "true" : undefined}
              onClick={handleClickNofi}
            >
              <NotificationsActiveIcon color="warning" fontSize="small" />
            </ButtonM>
            <Menu
              style={{
                height: "300px",
                maxWidth: "450px",
                whiteSpace: "wrap",
              }}
              id="basic-menu"
              anchorEl={anchorE2}
              open={openNofi}
              onClose={handleCloseNofi}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {order.map((o) => (
                <MenuItem onClick={handleCloseNofi}>
                  {o.order_status == 0 ? (
                    <div>
                      <ListItem style={{ padding: 0 }}>
                        <ListItemText
                          style={{
                            display: "flex",
                            height: "auto",
                            whiteSpace: "wrap",
                          }}
                          secondary={
                            <PendingActionsIcon
                              style={{
                                color: "red",
                                fontSize: 16,
                                marginLeft: 5,
                              }}
                            />
                          }
                          primary="Đơn hàng chưa được xác nhận"
                        />
                        <caption
                          style={{
                            fontSize: 12,
                            fontStyle: "italic",
                            marginLeft: 5,
                          }}
                        >
                          <Moment fromNow>{o.created_date}</Moment>
                        </caption>
                      </ListItem>
                      <Typography
                        color="text.secondary"
                        variant="body2"
                        style={{
                          width: "350px",
                          marginBottom: 10,
                          height: "auto",
                          whiteSpace: "break-spaces",
                        }}
                      >
                        Bạn đã đặt thành công đơn hàng với tổng tiền{" "}
                        {numberWithCommas(o.amount)} VNĐ vào lúc{" "}
                        <Moment fromNow>{o.created_date}</Moment>{" "}
                      </Typography>
                      <Divider component="li" />
                    </div>
                  ) : null}
                  {o.order_status == 1 ? (
                    <div>
                      <ListItem style={{ padding: 0 }}>
                        <ListItemText
                          style={{
                            display: "flex",
                            height: "auto",
                            whiteSpace: "wrap",
                          }}
                          secondary={
                            <DeliveryDiningIcon
                              style={{
                                color: "orange",
                                fontSize: 16,
                                marginLeft: 5,
                              }}
                            />
                          }
                          primary="Đơn hàng đang giao đến bạn"
                        />
                        <caption
                          style={{
                            fontSize: 12,
                            fontStyle: "italic",
                            marginLeft: 5,
                          }}
                        >
                          <Moment fromNow>{o.payment_date}</Moment>
                        </caption>
                      </ListItem>
                      <Typography
                        color="text.secondary"
                        variant="body2"
                        style={{
                          width: "350px",
                          marginBottom: 10,
                          height: "auto",
                          whiteSpace: "break-spaces",
                        }}
                      >
                        Đơn hàng có tổng tiền {numberWithCommas(o.amount)} VNĐ
                        đang được giao đến bạn!
                      </Typography>
                      <Divider component="li" />
                    </div>
                  ) : null}
                  {o.order_status == 2 ? (
                    <div>
                      <ListItem style={{ padding: 0 }}>
                        <ListItemText
                          style={{
                            display: "flex",
                            height: "auto",
                            whiteSpace: "wrap",
                          }}
                          secondary={
                            <CreditScoreIcon
                              style={{
                                color: "green",
                                fontSize: 16,
                                marginLeft: 5,
                              }}
                            />
                          }
                          primary="Đơn hàng giao thành công"
                        />
                        <caption
                          style={{
                            fontSize: 12,
                            fontStyle: "italic",
                            marginLeft: 5,
                          }}
                        >
                          <Moment fromNow>{o.created_date}</Moment>
                        </caption>
                      </ListItem>
                      <Typography
                        color="text.secondary"
                        variant="body2"
                        style={{
                          width: "350px",
                          marginBottom: 10,
                          height: "auto",
                          whiteSpace: "break-spaces",
                        }}
                      >
                        Đơn hàng có tổng tiền {numberWithCommas(o.amount)} VNĐ
                        của bạn đã được giao vào{" "}
                        <Moment fromNow>{o.payment_date}</Moment>{" "}
                      </Typography>
                      <Divider component="li" />
                    </div>
                  ) : null}
                </MenuItem>
              ))}
            </Menu>
          </div>
        ) : null}
        {/* ACCOUNT */}
        <div>
          <ButtonM
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <Avatar alt={user.username} src={user.image} />
            {user.user_role === 0 ? (
              <Link to="#" className="nav-link text-info">
                Xin chào, {user.first_name}
              </Link>
            ) : (
              <Link to="#" className="nav-link text-info">
                Xin chào, {user.name_store}
              </Link>
            )}
          </ButtonM>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{ "aria-labelledby": "basic-button" }}
          >
            <MenuItem onClick={handleClose}>
              {user.user_role === 1 ? (
                <Link to="/store-management" className="nav-link text-success">
                  <ManageAccountsIcon fontSize="small" /> Quản lý cửa hàng
                </Link>
              ) : (
                ""
              )}
            </MenuItem>

            <MenuItem onClick={handleClose}>
              {user.is_superuser == 1 ? (
                <a
                  href="http://127.0.0.1:8000/admin/"
                  className="nav-link text-primary"
                >
                  <AdminPanelSettingsIcon fontSize="small" /> Trang quản trị
                </a>
              ) : (
                <Link to="/profile-user" className="nav-link text-primary">
                  <ManageAccountsIcon fontSize="small" /> Quản lý tài khoản
                </Link>
              )}
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link className="nav-link text-danger" onClick={logout}>
                <LogoutIcon fontSize="small" /> Đăng xuất
              </Link>
            </MenuItem>
          </Menu>
        </div>
      </>
    );

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto" style={{ alignItems: "center" }}>
              <Link to="/" style={{ textDecoration: "none", fontSize: "16px" }}>
                <HomeIcon fontSize="small"></HomeIcon> Trang chủ
              </Link>
              {/* {tags.map(t => <Nav.Link href="#link">{t.name}</Nav.Link>)} */}

              {userInfo}
            </Nav>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Tìm kiếm..."
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Tìm</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
