import { useContext, useState } from "react"
import { Button, Form } from "react-bootstrap"
import cookie from "react-cookies"
import { Navigate } from "react-router-dom"
import API, { authAPI, endpoints } from "../configs/API"
import { UserContext } from "../configs/MyContext"
import Loading from "../layout/Loading"

const Login = () => {
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState([])
    const [user, dispatch] = useContext(UserContext)


    const login = (evt) => {
        evt.preventDefault()

        const process = async () => {
         
            try {
                // let res = await API.post(endpoints['login'], {
                //     'username': username,
                //     'password': password,
                //     'client_id': 'PX1L78DG7sjxUgndorfk2LTH8ye0jOWbcpRON1lI',
                //     'client_secret': 'e2X37hXDnWDK1i2sNjCocfUqiDD6siUZKbB52xVjZ9yc2jYKE3PTtNvUNvPPukBGbKda5Iq9mU9L5aWiLZ0mkYpEprjJNkL6bkqnO3Rz4LxCrYDdgyE4Hpef1CL6P6IV',
                //     'grant_type': 'password',
                // }, {
                //     headers: {
                //     'Content-Type': 'application/json'
                //     }
                //   })

                let form = new FormData()
                form.append("username", username)
                form.append("password", password)
                form.append("grant_type", 'password')
                form.append("client_id", 'PX1L78DG7sjxUgndorfk2LTH8ye0jOWbcpRON1lI')
                form.append("client_secret", 'e2X37hXDnWDK1i2sNjCocfUqiDD6siUZKbB52xVjZ9yc2jYKE3PTtNvUNvPPukBGbKda5Iq9mU9L5aWiLZ0mkYpEprjJNkL6bkqnO3Rz4LxCrYDdgyE4Hpef1CL6P6IV')
    
                let res = await API.post(endpoints['login'], form, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
    
                cookie.save("access-token", res.data.access_token)
    
                let user = await authAPI().get(endpoints['current-user'])
                cookie.save("current-user", user.data)
    
                dispatch({
                    "type": "login",
                    "payload": user.data
                })
            } catch (ex) {
                setError(...error, 'Username hoặc password không chính xác!')
            } finally {
                setLoading(false)
            }
        }
        
        if (username === "" || username === undefined || password === "" || password === undefined) {
            setError(...error, "username hoac password không được rỗng!")
        } else {
            setLoading(true)
            process()
        }
    }
    if (user !== null)
        return <Navigate to="/" />

    return (
        <>
            <h1 className="text-center text-success">ĐĂNG NHẬP NGƯỜI DÙNG</h1>

            {error?<div className="alert alert-danger" dangerouslySetInnerHTML={{__html: error}}></div>:""}

            <Form onSubmit={login}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Tên đăng nhập</Form.Label>
                    <Form.Control type="text" value={username}
                                  onChange={e => setUsername(e.target.value)}
                                  placeholder="Tên đăng nhâp..." />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control type="password" value={password}
                                  onChange={e => setPassword(e.target.value)}
                                  placeholder="Mật khẩu..." />
                </Form.Group>
                {loading?<Loading />:<Button variant="primary" type="submit">Đăng nhập</Button>}
            </Form>
        </>
    )
}

export default Login