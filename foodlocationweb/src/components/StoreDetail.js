import React, { useContext, useState, useEffect, Fragment } from "react";
import Loading from "../layout/Loading";
import API, { endpoints } from "../configs/API";
import { Link, useParams } from "react-router-dom";

import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import MenuItem from "./MenuItem";
import { dataFoodToFE } from "../utils/serializeData";
import { numberWithCommas } from "../utils/converters";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import PaymentsIcon from "@mui/icons-material/Payments";
import DescriptionIcon from "@mui/icons-material/Description";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { isValidTime } from "../utils";
import CustomizedBadges from "./Cart";
import { Alert, Tooltip } from "@mui/material";
import { UserContext } from "../configs/MyContext";
import StorefrontIcon from "@mui/icons-material/Storefront";

import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StoreDetail = () => {
  const [user] = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [cacheFood, setCacheFood] = useState(null);
  const [menuItem, setMenuItem] = useState([]);
  const [countCart, setCountCart] = useState(0);
  const [listCart, setListCart] = useState([]);
  const [food, setFood] = useState({});
  const { storeId, foodId } = useParams();

  useEffect(() => {
    // console.log(listCart);
    if (user) {
      const count = [...(listCart || [])].reduce(
        (accu, currentValue) => accu + currentValue.quantity,
        0
      );
      setCountCart(count);
    }
  }, [listCart]);

  useEffect(() => {
    if (user) {
      setListCart(JSON.parse(localStorage.getItem(`cart-${user.id}`)));
    } else {
      setCountCart(0);
      setListCart([]);
    }

    return () => {
      setCountCart(0);
      setListCart([]);
    };
  }, [user]);

  useEffect(() => {
    let loadMenuItem = async () => {
      let res = await API.get(endpoints["food-list"](storeId));
      if (res.status === 200) {
        const newData = dataFoodToFE(res.data);
        setMenuItem(newData);
      }
    };

    loadMenuItem();
  }, [storeId]);

  useEffect(() => {
    let loadFoodDetail = async () => {
      let res = await API.get(endpoints["food-by-id"](foodId));
      if (res.status === 200) {
        setFood(res.data);
      }
    };

    loadFoodDetail();
  }, [foodId]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddToCart = (item, isForceSave = false) => {
    const key = `cart-${user.id}`;
    if (isForceSave) {
      localStorage.removeItem(key);
    }

    const itemStorage = localStorage.getItem(key);
    // console.log("itemStorage :>", itemStorage);
    const temp = [
      {
        ...item,
        user_id: user.id,
        store_id: parseInt(storeId),
        quantity: 1,
      },
    ];

    if (!itemStorage) {
      localStorage.setItem(key, JSON.stringify(temp));
      setListCart(temp);

      // For case choose food different store
      if (isForceSave) {
        setOpen(false);
      }
    } else {
      const itemParse = JSON.parse(itemStorage);
      const storeIdExisted = itemParse[0] && itemParse[0].store_id;

      // console.log("itemParse :>", itemParse);
      if (storeIdExisted !== parseInt(storeId)) {
        setCacheFood(item);
        handleClickOpen();
      } else {
        const itemExisted = itemParse.findIndex(
          (cartItem) => cartItem.id === item.id
        );

        if (itemExisted === -1) {
          itemParse.push({
            ...item,
            user_id: user.id,
            store_id: parseInt(storeId),
            quantity: 1,
          });
          localStorage.setItem(key, JSON.stringify(itemParse));
          setListCart(itemParse);
        } else {
          const temp = itemParse.map((cart) => {
            if (cart.id === item.id) {
              return {
                ...cart,
                quantity: cart.quantity + 1,
              };
            }

            return cart;
          });

          localStorage.setItem(key, JSON.stringify(temp));
          setListCart(temp);
        }
      }
    }
  };

  if (food === null) return <Loading />;
  if (menuItem.length === 0) return <Loading />;

  const renderFoodItem = (listFoods = []) => {
    if (!Array.isArray(listFoods) || listFoods.length === 0) return null;

    return listFoods.map((item) => {
      return (
        <>
          <ListItemButton
            alignItems="flex-start"
            disabled={!item.active || !isValidTime(item)}
          >
            <Tooltip title="Xem chi tiết món ăn">
              <Link to={`/foods/${item.id}`} style={{ textDecoration: "none" }}>
                <ListItemAvatar>
                  <Avatar
                    style={{ width: 50, height: 50, marginRight: 15 }}
                    alt={item.name}
                    src={item.image}
                  />
                </ListItemAvatar>
              </Link>
            </Tooltip>

            <ListItemText
              primary={item.name}
              secondary={
                <Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                    style={{ fontWeight: "bold" }}
                  >
                    {numberWithCommas(item.price)} VND
                  </Typography>
                  <Typography
                    style={{
                      fontSize: "13px",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      color: "gray",
                    }}
                  >
                    {item.description}
                  </Typography>
                </Fragment>
              }
            />

            {!user || Number(user.user_role) === 1 ? (
              <Tooltip title="Vui lòng đăng nhập tài khoản khách hàng">
                <IconButton
                  color="success"
                  aria-label="add to shopping cart"
                  style={{
                    opacity: "0.5",
                    cursor: "not-allowed",
                  }}
                >
                  <AddShoppingCartIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <IconButton
                color="success"
                aria-label="add to shopping cart"
                onClick={() => handleAddToCart(item)}
              >
                <AddShoppingCartIcon />
              </IconButton>
            )}
          </ListItemButton>
          <Divider variant="inset" component="li" />
        </>
      );
    });
  };

  return (
    <>
      {/* INFO FOOD DETAIL */}
      {Object.keys(food).length > 0 && (
        <Card sx={{ display: "flex", margin: "10px" }}>
          <CardMedia
            component="img"
            src={food.image}
            alt={food.name}
            sx={{ width: 250, height: 250, objectFit: "cover", margin: "25px" }}
          />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: "1 0 auto" }}>
              <Typography
                component="div"
                variant="h4"
                sx={{ flex: "1 0 auto", marginTop: "5px" }}
              >
                {food.name}{" "}
                <Tooltip title="Xem chi tiết cửa hàng">
                  <Link
                    to={`/stores/${food.menu_item.store.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <span style={{ fontSize: 24, color: "gray" }}>
                      - {food.menu_item.store.name_store}{" "}
                      <StorefrontIcon
                        style={{ fontSize: 20, marginBottom: 5 }}
                      />
                    </span>
                  </Link>
                </Tooltip>
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
                sx={{
                  flex: "1 0 auto",
                  marginTop: "10px",
                  fontSize: "20px",
                  color: "Highlight",
                  fontWeight: "bold",
                }}
              >
                <PaymentsIcon /> {numberWithCommas(food.price)} VND
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
                sx={{
                  flex: "1 0 auto",
                  marginTop: "10px",
                  fontSize: "13px",
                  marginBottom: 2,
                }}
              >
                <DescriptionIcon /> {food.description}
              </Typography>
              <Link to={`/foods/${food.id}`} style={{ textDecoration: "none" }}>
                Xem thêm đánh giá món ăn
              </Link>

              <Stack
                direction="row"
                spacing={1}
                style={{ margin: "20px 10px" }}
              >
                {[...(food.tags || [])].map((tag) => {
                  return (
                    <Chip
                      icon={<LocalOfferIcon style={{ fontSize: "12px" }} />}
                      label={tag.name}
                      variant="outlined"
                    />
                  );
                })}
              </Stack>
            </CardContent>
          </Box>
        </Card>
      )}

      {/* DANH SÁCH MENU CỦA STORE */}
      <div style={{ display: "flex" }}>
        {/* list menu by store */}
        <MenuItem />
        {/* list food by store */}
        <List sx={{ flex: 1, overflow: "hidden", bgcolor: "background.paper" }}>
          {menuItem.map((item) => {
            return (
              <>
                <ListSubheader
                  component="div"
                  id="nested-list-subheader"
                  className="text-uppercase"
                  style={{ lineHeight: "20px", marginTop: 10 }}
                >
                  {item.name}
                </ListSubheader>
                {renderFoodItem(item.foods)}
              </>
            );
          })}
        </List>
      </div>
      {/* cart */}
      <CustomizedBadges count={countCart} />

      {/* DIALOG THÔNG BÁO ADD CART */}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle style={{ color: "red", fontWeight: "bold" }}>
          Cảnh báo
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-dFescription">
            Trong giỏ hàng đã có món ăn của cửa hàng khác. Bạn có muốn xóa những
            món trong giỏ hàng không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            style={{ color: "red", border: "1px solid red" }}
            onClick={handleClose}
          >
            Tắt thông báo
          </Button>
          <Button
            style={{ color: "green", border: "1px solid green" }}
            onClick={() => handleAddToCart(cacheFood, true)}
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StoreDetail;
