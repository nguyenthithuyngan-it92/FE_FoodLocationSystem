import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import API, { endpoints } from '../configs/API';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

const Home = () => {
  const [tags, setTags] = useState([])


  useEffect(() => {
    const loadTags = async () => {
      let res = await API.get(endpoints['tags']);
      console.log(res.data.results);
      setTags(res.data.results);
    };

    loadTags();
  }, []);
  return (
    <div className='home'>
      <Container fluid className="banner">
        <Row>
          <Col>
            <div>
              <h1>Đặt món online tại TN & KN </h1>
              <h4>Giao hàng tận nơi</h4>
              {tags.map(t => {
                let url = `/food/?tagId=${t.id}`
                return (
                  <Button style={{width: 100, fontWeight: "bold"}} key={t.id} className="btn btn-link">
                    <Link to={url} className="text-decoration-none">{t.name}</Link>
                  </Button>
                  )
                })}
            </div>
          </Col>
          <Col>2 of 2</Col>
        </Row>

      </Container>
    </div>
  );
}

export default Home;
