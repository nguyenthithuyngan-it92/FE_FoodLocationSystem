import { useContext, useState, useEffect } from "react";
import API, { authAPI, endpoints } from "../configs/API";
import { Link, useParams } from "react-router-dom";
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
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { UserContext } from "../configs/MyContext";
import TimerOffIcon from "@mui/icons-material/TimerOff";
import TimerIcon from "@mui/icons-material/Timer";
import Loading from "../layout/Loading";
import StorefrontIcon from "@mui/icons-material/Storefront";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import Moment from "react-moment";
import { Avatar } from "@mui/material";
import Rating from "react-rating";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";

const FoodDetail = () => {
  const [user] = useContext(UserContext);
  const [foodDetail, setFoodDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { foodId } = useParams();
  const [refresher, setRefresher] = useState(1);

  useEffect(() => {
    let loadFoodDetailById = async () => {
      let res = await API.get(endpoints["food-by-id"](foodId));
      if (res.status === 200) {
        setFoodDetail(res.data);
      }
    };

    loadFoodDetailById();
  }, [foodId]);

  useEffect(() => {
    const loadComments = async () => {
      let res = await API.get(endpoints["food-comments"](foodId));
      console.info(res.data);
      if (res.status === 200) {
        setComments(res.data);
      }
    };

    loadComments();
  }, [foodId, refresher]);

  const addComment = (evt) => {
    evt.preventDefault();

    const process = async () => {
      try {
        let res = await authAPI().post(endpoints["add-comment"](foodId), {
          content: content,
        });
        // console.info(res);
        // setComments((curr) => [res.data, ...curr]);
        if (res.status === 201) {
          setRefresher((pre) => pre + 1);
          setContent("");
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    process();
  };

  const like = () => {
    const process = async () => {
      let res = await authAPI().post(endpoints["food-like"](foodId));
      setFoodDetail(res.data);
    };

    process();
  };

  const rating = (r) => {
    const process = async () => {
      let res = await authAPI().post(endpoints["food-rating"](foodId), {
        rate: r,
      });
      console.info(res);
      if (res.status === 200) {
        setRefresher((pre) => pre + 1);
        // setFoodDetail(res.data);
      }
      // setFoodDetail(res.data);
    };

    process();
  };

  console.log("comments :>", comments);

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
              <div style={{ width: "70%", marginRight: 10 }}>
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
                  <StorefrontIcon />{" "}
                  {Object.keys(foodDetail).length > 0 &&
                    foodDetail.menu_item.store.name_store}
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
                  <MenuBookIcon />{" "}
                  {Object.keys(foodDetail).length > 0 &&
                    foodDetail.menu_item.name}
                </Typography>
              </div>
              <div style={{ width: "30%", marginLeft: 10 }}>
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

            {!user ? (
              ""
            ) : (
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
                <Button
                  onClick={like}
                  type="submit"
                  variant={
                    foodDetail.like === true ? "danger" : "outline-danger"
                  }
                >
                  <FavoriteBorderIcon />
                </Button>
                <div>
                  <Rating
                    initialRating={Number(foodDetail.rate)}
                    onClick={rating}
                    emptySymbol={<StarBorderIcon />}
                    fullSymbol={<StarIcon style={{ color: "orange" }} />}
                  />
                </div>
              </Typography>
            )}
          </CardContent>
        </Box>
      </Card>
      <div
        style={{
          border: "1px solid",
          borderRadius: 5,
          margin: 10,
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
          <hr></hr>

          {!user ? (
            <small>
              Xin vui lòng <Link to={"/login"}>đăng nhập</Link> trước khi bình
              luận!!!
            </small>
          ) : (
            <Form onSubmit={addComment}>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={content}
                  required
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Nội dung bình luận...."
                />
                {loading ? (
                  <Loading />
                ) : (
                  <Button className="mt-2" variant="primary" type="submit">
                    Bình luận
                  </Button>
                )}
              </Form.Group>
            </Form>
          )}

          <hr></hr>

          {comments.length === 0 ? (
            <p>Không có bình luận nào</p>
          ) : (
            comments.map((c) => {
              return (
                <Row className="bg-light m-1">
                  <Col md={1} xs={3}>
                    <Avatar
                      src={c.user.image}
                      alt={c.user.username}
                      rounded
                      fluid
                    />
                  </Col>
                  <Col md={11} xs={9}>
                    <p style={{ marginBottom: "5px" }}>{c.content}</p>
                    <small style={{ fontSize: "12px" }}>
                      Bình luận bởi{" "}
                      <Link style={{ textDecoration: "none", color: "gray" }}>
                        {c.user.username}
                      </Link>{" "}
                      lúc <Moment fromNow>{c.created_date}</Moment>
                    </small>
                  </Col>
                </Row>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default FoodDetail;
