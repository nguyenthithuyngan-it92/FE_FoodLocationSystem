import InfoStore from "../layout/InfoStore";
import * as React from "react";
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

const StoreDetail = () => {
  const [menuItem, setMenuItem] = React.useState([]);
  const [food, setFood] = React.useState({});
  const { storeId, foodId } = useParams();

  React.useEffect(() => {
    let loadMenuItem = async () => {
      let res = await API.get(endpoints["food-list"](storeId));
      if (res.status === 200) {
        const newData = dataFoodToFE(res.data);
        setMenuItem(newData);
      }
    };

    loadMenuItem();
  }, [storeId]);

  console.log("menuItem :>", menuItem);
  React.useEffect(() => {
    let loadFoodDetail = async () => {
      let res = await API.get(endpoints["food-by-id"](foodId));
      if (res.status === 200) {
        setFood(res.data);
      }
    };

    loadFoodDetail();
  }, [foodId]);

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
                <React.Fragment>
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
                </React.Fragment>
              }
            />
            <IconButton color="success" aria-label="add to shopping cart">
              <AddShoppingCartIcon />
            </IconButton>
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
    </>
  );
};

export default StoreDetail;
