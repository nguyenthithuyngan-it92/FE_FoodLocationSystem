import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API, { endpoints } from "../configs/API";
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import Loading from "../layout/Loading";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import StoreIcon from "@mui/icons-material/Store";
import { isValidTime } from "../utils";

const threeDotsStyle = {
  fontSize: "18px",
  lineHeight: "24px",
  height: "24px",
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
};

const Foods = () => {
  const [foods, setFoods] = useState([]);
  const [page, setPage] = useState(1);
  const [tags] = useSearchParams("");
  const [name] = useSearchParams("");
  const [price] = useSearchParams("");

  useEffect(() => {
    const loadFoods = async () => {
      try {
        let e = `${endpoints["foods"]}?page=${page}`;

        let kw = name.get("name");
        let p = price.get("price");
        if (kw !== null) e += `&name=${kw}`;

        if (p !== null) e += `&price=${p}`;

        // let tagId = tags.get('tags')
        // if (tagId !== null)
        //     e += `&tag_id=${tagId}`

        let res = await API.get(e);
        setFoods(res.data.results);
      } catch (ex) {
        setPage(1);
      }
    };

    setFoods(null);
    loadFoods();
  }, [page, name, price]);

  const nextPage = () => setPage((current) => current + 1);
  const prevPage = () => setPage((current) => current - 1);

  if (foods === null) return <Loading />;

  if (foods === 0)
    return (
      <div className="alert alert-info">Không có món ăn nào được tìm thấy</div>
    );

  return (
    <>
      <Container>
        <Row>
          {foods.map((f) => {
            return (
              <Col
                key={f.id}
                md={3}
                xs={12}
                className="p-1"
                style={{ position: "relative" }}
              >
                <div
                  className={`card-food ${
                    isValidTime(f) ? "active" : "card-food-disabled unactive"
                  } `}
                >
                  <Link
                    to={`/stores/${f.menu_item.store.id}/menu/${f.id}`}
                    style={{ textDecoration: "none", color: "unset" }}
                  >
                    <Card>
                      <Card.Img
                        variant="top"
                        src={f.image}
                        className="object-fit:cover"
                        style={{
                          width: "100%",
                          height: 225,
                          boxShadow: "0px 2px 20px rgb(0 0 0 / 12%)",
                        }}
                      />
                      <Card.Body>
                        <Card.Title style={threeDotsStyle}>{f.name}</Card.Title>
                        <Card.Subtitle
                          style={{
                            ...threeDotsStyle,
                            fontWeight: "normal",
                            color: "gray",
                            fontSize: "12px",
                          }}
                        >
                          {f.menu_item.store.address}
                        </Card.Subtitle>
                        <Card.Text
                          style={{ ...threeDotsStyle, fontSize: "14px" }}
                        >
                          <StoreIcon /> {f.menu_item.store.name_store}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                </div>
              </Col>
            );
          })}
        </Row>
        <ButtonGroup
          aria-label="paging"
          className="p-1"
          style={{ marginLeft: "40%" }}
        >
          <Button
            onClick={prevPage}
            variant="outlined"
            style={{ border: "1px solid", margin: 5 }}
          >
            <ArrowBackIosIcon />
          </Button>
          <Button
            onClick={nextPage}
            variant="outlined"
            style={{ border: "1px solid", margin: 5 }}
          >
            <ArrowForwardIosIcon />
          </Button>
        </ButtonGroup>
      </Container>
    </>
  );
};

export default Foods;
