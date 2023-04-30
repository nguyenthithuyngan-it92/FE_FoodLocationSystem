import InfoStore from "../layout/InfoStore";
import * as React from "react";
import Loading from "../layout/Loading";
import { authAPI, endpoints } from "../configs/API";
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

const StoreDetail = () => {
  //   const [menuStore, setMenuStore] = React.useState([]);
  //   const { storeId } = useParams();

  //   React.useEffect(() => {
  //     let loadMenu = async () => {
  //       let res = await authAPI().get(endpoints["menu-store"](storeId));
  //       console.info(res.data);
  //       setMenuStore(res.data);
  //     };

  //     loadMenu();
  //   }, [storeId]);

  //   if (menuStore === null) return <Loading />;

  return (
    <>
      {/* <InfoStore /> */}
      <div style={{ display: "flex" }}>
        <List
          sx={{ width: "50%", maxWidth: 260, bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Danh mục món ăn
            </ListSubheader>
          }
        >
          <ListItemButton>
            <ListItemText primary="MenuItem1" />
          </ListItemButton>
          <Divider />
          <ListItemButton>
            <ListItemText primary="MenuItem2" />
          </ListItemButton>
          <Divider />
          <ListItemButton>
            <ListItemText primary="MenuItem3" />
          </ListItemButton>
          <Divider />
          <ListItemButton>
            <ListItemText primary="MenuItem4" />
          </ListItemButton>
        </List>
        <div style={{ width: "100%" }}>
          <List
            sx={{ width: "100%", maxWidth: 800, bgcolor: "background.paper" }}
          >
            <ListSubheader
              component="div"
              id="nested-list-subheader"
              className="text-uppercase"
              style={{ lineHeight: "20px" }}
            >
              MenuItem1
            </ListSubheader>
            <ListItemButton alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Image" src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary="Tên món ăn"
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                      style={{ fontWeight: "bold" }}
                    >
                      Giá 0 VND
                    </Typography>
                    {" - Description"}
                  </React.Fragment>
                }
              />
              <IconButton color="success" aria-label="add to shopping cart">
                <AddShoppingCartIcon />
              </IconButton>
            </ListItemButton>

            <Divider variant="inset" component="li" />
            <ListItemButton alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Image" src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary="Tên món ăn"
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                      style={{ fontWeight: "bold" }}
                    >
                      Giá 0 VND
                    </Typography>
                    {" - Description"}
                  </React.Fragment>
                }
              />
              <IconButton color="success" aria-label="add to shopping cart">
                <AddShoppingCartIcon />
              </IconButton>
            </ListItemButton>

            <Divider variant="inset" component="li" />
            <ListItemButton alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Image" src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary="Tên món ăn"
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                      style={{ fontWeight: "bold" }}
                    >
                      Giá 0 VND
                    </Typography>
                    {" - Description"}
                  </React.Fragment>
                }
              />
              <IconButton color="success" aria-label="add to shopping cart">
                <AddShoppingCartIcon />
              </IconButton>
            </ListItemButton>
          </List>
          <List
            sx={{ width: "100%", maxWidth: 800, bgcolor: "background.paper" }}
          >
            <ListSubheader
              component="div"
              id="nested-list-subheader"
              className="text-uppercase"
              style={{ lineHeight: "20px" }}
            >
              MenuItem2
            </ListSubheader>
            <ListItemButton alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Image" src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary="Tên món ăn"
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                      style={{ fontWeight: "bold" }}
                    >
                      Giá 0 VND
                    </Typography>
                    {" - Description"}
                  </React.Fragment>
                }
              />
              <IconButton color="success" aria-label="add to shopping cart">
                <AddShoppingCartIcon />
              </IconButton>
            </ListItemButton>

            <Divider variant="inset" component="li" />
            <ListItemButton alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Image" src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary="Tên món ăn"
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                      style={{ fontWeight: "bold" }}
                    >
                      Giá 0 VND
                    </Typography>
                    {" - Description"}
                  </React.Fragment>
                }
              />
              <IconButton color="success" aria-label="add to shopping cart">
                <AddShoppingCartIcon />
              </IconButton>
            </ListItemButton>

            <Divider variant="inset" component="li" />
            <ListItemButton alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Image" src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary="Tên món ăn"
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                      style={{ fontWeight: "bold" }}
                    >
                      Giá 0 VND
                    </Typography>
                    {" - Description"}
                  </React.Fragment>
                }
              />
              <IconButton color="success" aria-label="add to shopping cart">
                <AddShoppingCartIcon />
              </IconButton>
            </ListItemButton>
          </List>
        </div>
      </div>
    </>
  );
};

export default StoreDetail;
