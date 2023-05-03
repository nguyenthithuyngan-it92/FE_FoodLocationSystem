import { useContext, useEffect, useState } from 'react'
import API, { endpoints } from '../configs/API'
import { Button, Container, Form, Nav, Navbar } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../configs/MyContext'

import * as React from 'react';

import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';


const Header = () => {
    const [tags, setTags] = useState([])
    const [user, dispatch] = useContext(UserContext)
    const [q, setQ] = useState()
    const nav = useNavigate()

    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    useEffect(() => {
        const loadTags = async () => {
            let res = await API.get(endpoints['tags'])
            setTags(res.data.results)
        }

        loadTags()
    }, [])

    const search = (evt) => {
        evt.preventDefault()
        nav(`/?q=${q}`)
    }

    const logout = () => {
        dispatch({
            "type": "logout"
        })
    }

    let userInfo = (
        <>
            <List>
                <ListItemButton onClick={handleClick}>
                    <AccountCircleIcon fontSize='small' className='m-2' /> Tài khoản
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                    <Link to="/login" className="nav-link text-success">
                        <LoginIcon fontSize='small' /> Đăng nhập
                    </Link>
                    <Link to="/register" className="nav-link text-danger" >
                        <PersonAddIcon fontSize='small' /> Đăng ký              
                    </Link>
                    <Link to="/register-store" className="nav-link text-primary" sx={{ pl: 4 }}>
                        <AddBusinessIcon fontSize='small' /> Đăng ký cửa hàng
                    </Link>
                    </List>
                </Collapse>
            </List>
        </>
    )
    if (user !== null)
        userInfo = (
            <>
                <List sx={{ flexGrow: 0 }} >
                    <ListItemButton onClick={handleClick} sx={{ p: 0 }}>
                        <Avatar alt={user.username} src={user.image} />
                        {user.user_role===0?
                            <Link to="#" className="nav-link text-info">Xin chào, {user.first_name}</Link>:
                            <Link to="#" className="nav-link text-info">Xin chào, {user.name_store}</Link>}
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                        {user.user_role===1?
                            <Link to="/store-management" className="nav-link text-success">
                                <ManageAccountsIcon fontSize='small' /> Quản lý cửa hàng              
                            </Link> :""}
                        <Link to="#" className="nav-link text-primary">
                            <ManageAccountsIcon fontSize='small' /> Quản lý tài khoản              
                        </Link>
                        <Link className="nav-link text-danger" onClick={logout}>
                            <LogoutIcon fontSize='small' /> Đăng xuất
                        </Link>
                        </List>
                    </Collapse>
                </List>
            </>
        )


    return (
        <>
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="#home">Địa Điểm Ăn Uống</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto align-items-center">
                    <Link to="/" className="nav-link active">&#127968; Trang chủ</Link>
                    {tags.map(t => {
                        let url = `/?tagId=${t.id}`
                        return <Link key={t.id} className="nav-link" to={url}>{t.name}</Link>
                    })}

                    {/* {tags.map(t => <Nav.Link href="#link">{t.name}</Nav.Link>)} */}

                    {userInfo}
                    
                </Nav>
                <Form onSubmit={search} className="d-flex">
                  <Form.Control
                    type="search"
                    placeholder="Tìm kiếm..."
                    className="me-2"
                    aria-label="Search"
                    value={q}
                    onChange={evt => setQ(evt.target.value)}
                  />
                  <Button type="submit" variant="outline-success">Tìm</Button>
                </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        </>
    )
}

export default Header