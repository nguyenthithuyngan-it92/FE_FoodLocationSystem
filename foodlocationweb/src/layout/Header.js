import { useContext, useEffect, useState } from 'react'
import API, { endpoints } from '../configs/API'
import { Button, Container, Form, Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { UserContext } from '../configs/MyContext'

const Header = () => {
    const [tags, setTags] = useState([])
    
    const [user, dispatch] = useContext(UserContext)

    useEffect(() => {
        const loadTags = async () => {
            let res = await API.get(endpoints['tags'])
            setTags(res.data.results)
        }

        loadTags()
    }, [])

    const logout = () => {
        dispatch({
            "type": "logout"
        })
    }

    let userInfo = (
        <>
            <Link to="/login" className="nav-link text-success">&#129489; Đăng nhập</Link>
            <Link to="/register" className="nav-link text-danger">&#129489; Đăng ký</Link>
            <Link to="/register-store" className="nav-link text-primary">&#129489; Đăng ký cửa hàng</Link>
        </>
    )
    if (user !== null)
        userInfo = (
            <>
                <Link to="#" className="nav-link text-info">&#129489; Xin chào, {user.first_name}</Link>
                <Link className="nav-link text-danger" onClick={logout}>Đăng xuất</Link>
            </>
        )

    return (
        <>
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/">&#127968; Trang chủ</Nav.Link>
                    {tags.map(t => <Nav.Link href="#link">{t.name}</Nav.Link>)}

                    {userInfo}
                    
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