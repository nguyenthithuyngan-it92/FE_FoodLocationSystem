import { useEffect, useState } from "react"
import API, { endpoints } from "../configs/API"
import { Button, ButtonGroup, Card, Col, Container, Row } from "react-bootstrap"
import Loading from "../layout/Loading"

const Foods = () => {
    const [foods, setFoods] = useState([])
    const [page, setPage] = useState(1)
    
    useEffect(() => {
        const loadFoods = async () => {
            try {
                let e = `${endpoints['foods']}?page=${page}`
                let res = await API.get(e)
                setFoods(res.data.results)
            } catch (ex) {
                setPage(1)
            }
        }

        loadFoods()
    }, [page])

    const nextPage = () => setPage(current => current + 1)
    const prevPage = () => setPage(current => current - 1)

    if (foods === null)
        return <Loading />

    return (
        <>
        <Container>
            <Row>
                {foods.map(f =>
                {
                    return (
                    <Col md={3} xs={12} className="p-1">
                        <Card>
                            <Card.Img variant="top" src={f.image} className="object-fit:cover"/>
                            <Card.Body>
                                <Card.Title>{f.name}</Card.Title>
                                <Button variant="primary">Xem chi tiết</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    )
                })}
            </Row>
            <ButtonGroup aria-label="paging" className="p-1">
                <Button onClick={prevPage} variant="secondary">&#9194;</Button>
                <Button onClick={nextPage} variant="secondary">&#9193;</Button>
            </ButtonGroup>
        </Container>
        </>
    )
}


export default Foods