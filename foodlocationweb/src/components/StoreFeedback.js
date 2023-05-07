import { useContext, useState, useEffect } from "react";
import API, { endpoints } from "../configs/API";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { UserContext } from "../configs/MyContext";
import Loading from "../layout/Loading";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import IconButton from "@mui/material/IconButton";
import TableChartIcon from "@mui/icons-material/TableChart";
import Map, { apiKey } from "./Map";

const StoreFeedback = () => {
  const [user] = useContext(UserContext);
  const [store, setStore] = useState(null);
  const { storeId } = useParams();
  const [locationCenter, setLocationCenter] = useState({});
  const [countFollower, setCountFollower] = useState(0);

  useEffect(() => {
    let loadStoreDetail = async () => {
      let res = await API.get(endpoints["store-detail"](storeId));
      console.log(res);
      if (res.status === 200) {
        setStore(res.data);
      }
    };

    loadStoreDetail();
  }, [storeId]);

  useEffect(() => {
    const loadCountFollower = async () => {
      let res = await API.get(endpoints["count-follower"](storeId));
      console.log(res.data[0]);
      setCountFollower(res.data[0].total_followers);
    };

    loadCountFollower();
  }, [storeId]);

  // Get location
  useEffect(() => {
    if (store && store.address) {
      handleGetLocation(store.address);
    }
  }, [store]);

  const handleGetLocation = async (address) => {
    try {
      const res = await API.get(endpoints["get-location"](address));

      if (
        res.status === 200 &&
        Array.isArray(res.data) &&
        res.data.length > 0
      ) {
        const { lat, lon } = res.data[0];
        setLocationCenter({
          center: {
            lat: Number(lat),
            lng: Number(lon),
          },
          position: {
            lat: Number(lat),
            lng: Number(lon),
          },
        });
      }
    } catch (err) {
      console.log("err :>", err);
    }
  };

  if (store === null) return <Loading />;

  return (
    <>
      {/* INFO STORE DETAIL */}
      <Card sx={{ display: "flex", margin: "10px" }}>
        <CardMedia
          component="img"
          src={store.image}
          alt={store.name_store}
          sx={{ width: 160, height: 160, objectFit: "cover", margin: "25px" }}
        />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography
              component="div"
              variant="h4"
              sx={{ flex: "1 0 auto", marginTop: "5px" }}
            >
              {store.name_store}{" "}
              <span>
                {store.is_verify == 1 ? (
                  <VerifiedUserIcon
                    style={{ color: "green", marginBottom: 5 }}
                  />
                ) : null}
              </span>
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
              sx={{ flex: "1 0 auto", marginTop: "10px", maxWidth: 365 }}
            >
              <LocationOnIcon /> {store.address}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
              sx={{ flex: "1 0 auto", marginTop: "10px" }}
            >
              <LocalPhoneIcon /> {store.phone}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
              sx={{ flex: "1 0 auto", marginTop: "10px" }}
            >
              <TableChartIcon style={{ marginRight: 5 }} />
              Có {store.menu_count} danh mục
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
              <NotificationsActiveIcon sx={{ height: 20, width: 20 }} />
            </IconButton>
            {countFollower ? (
              <Typography component="div" variant="h8" color="text.secondary">
                {countFollower} người theo dõi
              </Typography>
            ) : (
              <Typography component="div" variant="h8" color="text.secondary">
                0 người theo dõi
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ width: 380, height: 200, margin: "10px" }}>
          <Map location={locationCenter} />
        </Box>
      </Card>
      <div
        style={{
          border: "1px solid",
          borderRadius: 5,
          margin: 10,
          height: 200,
        }}
      >
        <div
          style={{
            margin: "10px 20px",
            fontSize: 18,
            fontWeight: "bold",
            fontStyle: "italic",
            color: "gray",
          }}
        >
          Bình luận
        </div>
      </div>
    </>
  );
};

export default StoreFeedback;
