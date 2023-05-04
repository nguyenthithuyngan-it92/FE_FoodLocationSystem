import { useContext, useEffect, useState } from "react";
import API, { endpoints } from "../configs/API";
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

const Header = () => {
  const [tags, setTags] = useState([]);

  const [user, dispatch] = useContext(UserContext);

  // const [open, setOpen] = useState(false);

  // const handleClick = () => {
  //     setOpen(!open);
  // };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const loadTags = async () => {
      let res = await API.get(endpoints["tags"]);
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
          <AccountCircleIcon fontSize="small" className="m-2" /> Tài khoản
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
                <Link to="#" className="nav-link text-primary">
                  <AdminPanelSettingsIcon fontSize="small" /> Trang quản trị
                </Link>
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
