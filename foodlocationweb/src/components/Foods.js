import { useEffect, useState } from "react"
import API, { endpoints } from "../configs/API"
import { Button, ButtonGroup, Card, Col, Container, Row } from "react-bootstrap"
import Loading from "../layout/Loading"
import { useSearchParams } from "react-router-dom"

const Foods = () => {
    const [foods, setFoods] = useState([])
    const [page, setPage] = useState(1)
    const [q] = useSearchParams("")

    useEffect(() => {
        const loadFoods = async () => {
            try {
                let e = `${endpoints['foods']}?page=${page}`

                let kw = q.get('q')
                if (kw !== null)
                    e += `&q=${kw}`
                
                let tagId = q.get('q')
                if (tagId !== null)
                    e += `&tag_id=${tagId}`

                let res = await API.get(e)
                setFoods(res.data.results)
            } catch (ex) {
                setPage(1)
            }
        }

        setFoods(null)
        loadFoods()
    }, [page, q])

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
            {/* <Row>
                {foods.map(f => <Items key={f.id} obj={f} />)}
            </Row> */}
        </Container>
        </>
    )
}


export default Foods