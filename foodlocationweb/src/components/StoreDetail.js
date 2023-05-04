import InfoStore from "../layout/InfoStore";
import { useContext, useState, useEffect, Fragment } from "react";
import Loading from "../layout/Loading";
import API, { authAPI, endpoints } from "../configs/API";
import { useParams } from "react-router-dom";

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
import FaceIcon from "@mui/icons-material/Face";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { isValidTime } from "../utils";
import CustomizedBadges from "./Cart";
import { Tooltip } from "@mui/material";
import { UserContext } from "../configs/MyContext";

const StoreDetail = () => {
  const [user] = useContext(UserContext);

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

  const handleAddToCart = (item) => {
    const key = `cart-${user.id}`;
    const itemStorage = localStorage.getItem(key);
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
    } else {
      const itemParse = JSON.parse(itemStorage);
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
  };

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
            <ListItemAvatar>
              <Avatar alt={item.name} src={item.image} />
            </ListItemAvatar>
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
            {!user || user.user_role === 1 ? (
              <Tooltip title="Vui lòng đăng nhập tài khoản khách hàng">
                <IconButton
                  color="success"
                  aria-label="add to shopping cart"
                  style={{ opacity: "0.5", cursor: "not-allowed" }}
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
      {/* <InfoStore /> */}
      <Card sx={{ display: "flex", margin: "10px" }}>
        <CardMedia
          component="img"
          src={food.image}
          alt={food.name}
          sx={{ width: 160, height: 160, objectFit: "cover", margin: "25px" }}
        />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography
              component="div"
              variant="h4"
              sx={{ flex: "1 0 auto", marginTop: "5px" }}
            >
              {food.name}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
              sx={{
                flex: "1 0 auto",
                marginTop: "10px",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              <PaymentsIcon /> {numberWithCommas(food.price)} VND
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
              sx={{ flex: "1 0 auto", marginTop: "10px", fontSize: "13px" }}
            >
              <DescriptionIcon /> {food.description}
            </Typography>
            <Stack direction="row" spacing={1} style={{ margin: "20px 10px" }}>
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
      <div style={{ display: "flex" }}>
        <MenuItem />
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
      <CustomizedBadges count={countCart} />
    </>
  );
};

export default StoreDetail;
