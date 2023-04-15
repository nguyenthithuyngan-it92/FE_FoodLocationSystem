import { useEffect, useState } from 'react'
import API, { endpoints } from '../configs/API'
import { Button, Container, Form, Nav, Navbar } from 'react-bootstrap'

const Header = () => {
    const [tags, setTags] = useState([])

    useEffect(() => {
        const loadTags = async () => {
            let res = await API.get(endpoints['tags'])
            setTags(res.data.results)
        }

        loadTags()
    }, [])

    return (
        <>
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="#home">&#127968; Trang chủ</Nav.Link>
                    {tags.map(t => <Nav.Link href="#link">{t.name}</Nav.Link>)}
                    
                </Nav>
                <Form className="d-flex">
                  <Form.Control
                    type="search"
                    placeholder="Tìm kiếm..."
                    className="me-2"
                    aria-label="Search"
                  />
                  <Button variant="outline-success">Tìm</Button>
                </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        </>
    )
}

export default Header