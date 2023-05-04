import { useContext, useState, useEffect } from "react";
import API, { endpoints } from "../configs/API";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
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
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { UserContext } from "../configs/MyContext";
import TimerOffIcon from "@mui/icons-material/TimerOff";
import TimerIcon from "@mui/icons-material/Timer";
import Loading from "../layout/Loading";
import StorefrontIcon from "@mui/icons-material/Storefront";

const FoodDetail = () => {
  const [user] = useContext(UserContext);
  const [foodDetail, setFoodDetail] = useState(null);
  const { foodId } = useParams();

  useEffect(() => {
    let loadFoodDetailById = async () => {
      let res = await API.get(endpoints["food-by-id"](foodId));
      console.log(res.data);
      if (res.status === 200) {
        setFoodDetail(res.data);
      }
    };

    loadFoodDetailById();
  }, [foodId]);

  if (foodDetail === null) return <Loading />;

  return (
    <>
      {/* INFO FOOD DETAIL */}
      <Card sx={{ display: "flex", margin: "10px" }}>
        <CardMedia
          component="img"
          src={foodDetail.image}
          alt={foodDetail.name}
          sx={{ width: 300, height: 300, objectFit: "cover", margin: "25px" }}
        />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography
              component="div"
              variant="h4"
              sx={{ flex: "1 0 auto", marginTop: "5px" }}
            >
              {foodDetail.name}
            </Typography>
            <Typography
              variant="subtitle1"
              color="Highlight"
              component="div"
              sx={{
                flex: "1 0 auto",
                marginTop: "10px",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              <PaymentsIcon /> {numberWithCommas(foodDetail.price)} VND
            </Typography>
            <div style={{ display: "flex" }}>
              <div style={{ width: "50%", marginRight: 10 }}>
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
                  <StorefrontIcon /> {foodDetail.menu_item.store.name_store}
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
                  <MenuBookIcon /> {foodDetail.menu_item.name}
                </Typography>
              </div>
              <div style={{ width: "80%", marginLeft: 10 }}>
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
                  <TimerIcon /> {foodDetail.start_time}
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
                  <TimerOffIcon /> {foodDetail.end_time}
                </Typography>
              </div>
            </div>
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
              <DescriptionIcon /> {foodDetail.description}
            </Typography>

            <Stack direction="row" spacing={1} style={{ margin: "20px 10px" }}>
              {[...(foodDetail.tags || [])].map((tag) => {
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
      <div
        style={{
          border: "1px solid",
          borderRadius: 5,
          margin: 10,
          height: 400,
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

export default FoodDetail;
