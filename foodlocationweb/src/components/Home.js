import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import API, { endpoints } from "../configs/API";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import Foods from "./Foods";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

const Home = () => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const loadTags = async () => {
      let res = await API.get(endpoints["tags"]);
      console.log(res.data.results);
      setTags(res.data.results);
    };

    loadTags();
  }, []);
  return (
    <div className="home">
      <Container fluid className="banner">
        <Row>
          <Col>
            <div>
              <div
                style={{
                  border: "1px solid",
                  borderColor: "gray",
                  borderRadius: "5px",
                  marginTop: "20px",
                  marginBottom: "20px",
                  display: "flex",
                  padding: 5,
                }}
              >
                {tags.map((t) => {
                  // let url = `/food/?tagId=${t.id}`;
                  return (
                    <Stack direction="row" spacing={2}>
                      <Chip
                        label={t.name}
                        icon={<LocalOfferIcon />}
                        variant="outlined"
                        style={{ padding: 5, margin: 10 }}
                      />
                    </Stack>
                  );
                })}
              </div>
            </div>
          </Col>
        </Row>
        <Foods />
      </Container>
    </div>
  );
};

export default Home;
