import { useRef, useState } from "react"
import { Button, Form } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import API, { endpoints } from "../configs/API"
import InputFormUser from "../layout/InputFormUser"
import Loading from "../layout/Loading"

const RegisterUser = () => {
    const [user, setUser] = useState({
        "firstName": "",
        "lastName": "",
        "username": "",
        "password": "",
        "confirmPassword": "",
        "email": "",
        "phone": ""
    })
    const avatar = useRef()
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState()
    const nav = useNavigate()

    const register = (evt) => {
        evt.preventDefault()

        const process = async () => {
            try {
                let form = new FormData()
                form.append("first_name", user.firstName)
                form.append("last_name", user.lastName)
                form.append("username", user.username)
                form.append("password", user.password)
                form.append("email", user.email)
                form.append("phone", user.phone)
                if (avatar.current.files.length > 0)
                    form.append("avatar", avatar.current.files[0])
    
                let res = await API.post(endpoints['register'], form, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                if (res.status === 201)
                    nav("/login")
                else
                    setErr("Hệ thống bị lỗi! Vui lòng quay lại sau")
            } catch (ex) {
                let e = ''
                for (let d of Object.values(ex.response.data))
                    e += `${d} <br />`
               
                setErr(e)
            } finally {
                setLoading(false)
            }
            
        }

        if (user.username === "" || user.password === "")
            setErr("Username hoặc password phải nhập!")
        else if (user.password !== user.confirmPassword)
            setErr("Mật khẩu KHÔNG khớp!")
        else {
            setLoading(true)
            process()
        }
        
    }

    return (
        <>
            <h1 className="text-center text-success">ĐĂNG KÝ NGƯỜI DÙNG</h1>

            {err?<div className="alert alert-danger" dangerouslySetInnerHTML={{__html: err}}></div>:""}

            <Form onSubmit={register}>
                <InputFormUser label="Tên người dùng" type="text" value={user.firstName} controlId="fn"
                        setValue={e => setUser({...user, "firstName": e.target.value})} />
                <InputFormUser label="Họ và tên lót" type="text" value={user.lastName} controlId="ln"
                        setValue={e => setUser({...user, "lastName": e.target.value})} />
                <InputFormUser label="Tên đăng nhập" type="text" value={user.username} controlId="un"
                        setValue={e => setUser({...user, "username": e.target.value})} />
                <InputFormUser label="Mật khẩu" type="password" value={user.password}  controlId="pa"
                        setValue={e => setUser({...user, "password": e.target.value})} />
                <InputFormUser label="Xác nhận mật khẩu" type="password" value={user.confirmPassword} controlId="cf"
                        setValue={e => setUser({...user, "confirmPassword": e.target.value})} />
                <InputFormUser label="Địa chỉ email" type="email" value={user.email}  controlId="email"
                        setValue={e => setUser({...user, "email": e.target.value})} />
                <InputFormUser label="Số điện thoại" type="number" value={user.phone} controlId="phone"
                        setValue={e => setUser({...user, "phone": e.target.value})} />
              
            
                <InputFormUser type="file" ref={avatar} label="Ảnh đại diện" />
                
                {loading?<Loading />:<Button variant="primary" type="submit">Đăng ký</Button>}
            </Form>
        </>
    )
}

export default RegisterUser