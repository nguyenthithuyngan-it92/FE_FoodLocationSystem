import { useContext } from "react";
import { UserContext } from "../configs/MyContext";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import Typography from "@mui/material/Typography";

const InfoStore = () => {
  const [user] = useContext(UserContext);

  return (
    <>
      <Card sx={{ display: "flex", margin: "10px" }}>
        <CardMedia
          component="img"
          sx={{ width: 160, height: 160, objectFit: "cover", margin: "25px" }}
          src={user.image}
          alt={user.username}
        />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography
              component="div"
              variant="h4"
              sx={{ flex: "1 0 auto", marginTop: "5px" }}
            >
              {user.name_store}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
              sx={{ flex: "1 0 auto", marginTop: "10px" }}
            >
              <LocationOnIcon /> {user.address}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
              sx={{ flex: "1 0 auto", marginTop: "10px" }}
            >
              <LocalPhoneIcon /> {user.phone}
            </Typography>
          </CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flex: "1 0 auto",
              marginTop: "5px",
            }}
          >
            <IconButton aria-label="subcribes">
              <AddAlertIcon sx={{ height: 20, width: 20 }} />
            </IconButton>
            <Typography component="div" variant="h8" color="text.secondary">
              0 người theo dõi
            </Typography>
          </Box>
        </Box>
      </Card>
    </>
  );
};

export default InfoStore;
