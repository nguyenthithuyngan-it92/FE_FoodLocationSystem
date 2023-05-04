import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import API, { endpoints } from "../configs/API";

const MenuItem = () => {
  const { storeId } = useParams();
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    try {
      const fetchListMenu = async () => {
        const res = await API.get(endpoints["menu-store"](storeId));
        if (res.status === 200) {
          setMenu(res.data);
        }
      };

      fetchListMenu();
    } catch (err) {
      console.error(err);
    }
  }, [storeId]);

  return (
    <List
      sx={{ width: 220, flexShrink: 0, bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Danh mục món ăn
        </ListSubheader>
      }
    >
      {menu.map((item) => {
        return (
          <div key={item.id}>
            <ListItemButton>
              <ListItemText primary={`${item.name} (${item.food_count})`} />
            </ListItemButton>
            <Divider />
          </div>
        );
      })}
    </List>
  );
};

export default MenuItem;
