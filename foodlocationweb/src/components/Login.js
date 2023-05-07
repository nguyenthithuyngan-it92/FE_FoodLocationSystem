import { useContext, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import cookie from "react-cookies";
import { Navigate } from "react-router-dom";
import API, { authAPI, endpoints } from "../configs/API";
import { UserContext } from "../configs/MyContext";
import Loading from "../layout/Loading";
import Alert from "@mui/material/Alert";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [user, dispatch] = useContext(UserContext);

  const login = (evt) => {
    evt.preventDefault();
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

        let form = new FormData();
        form.append("username", username);
        form.append("password", password);
        form.append("grant_type", "password");
        form.append("client_id", "PX1L78DG7sjxUgndorfk2LTH8ye0jOWbcpRON1lI");
        form.append(
          "client_secret",
          "e2X37hXDnWDK1i2sNjCocfUqiDD6siUZKbB52xVjZ9yc2jYKE3PTtNvUNvPPukBGbKda5Iq9mU9L5aWiLZ0mkYpEprjJNkL6bkqnO3Rz4LxCrYDdgyE4Hpef1CL6P6IV"
        );

        let res = await API.post(endpoints["login"], form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        cookie.save("access-token", res.data.access_token);

        let user = await authAPI().get(endpoints["current-user"]);
        cookie.save("current-user", user.data);

        dispatch({
          type: "login",
          payload: user.data,
        });
      } catch (ex) {
        setLoading(false);
        setError("Username hoặc password không chính xác!");
      }
    };
    // if (username === undefined || password === undefined) {
    //     setError( "username hoặc password không được chứa kí tự đặc biệt!");
    //     console.log("validate error");
    //   } else

    if (!username?.trim() || !password?.trim()) {
      setError("Username hoặc password không được rỗng!");
    } else {
      console.log("validate success");
      setLoading(true);
      process();
    }
  };
  if (user !== null) return <Navigate to="/" />;

  return (
    <>
      <Row className="vh-100 d-flex justify-content-center align-items-center">
        <Col xl={4} md={8} lg={6} xs={12}>
          <Card>
            <Card.Body className="shadow">
              <h3 className="fw-bold mb-2 text-uppercase text-center  ">
                đăng nhập người dùng
              </h3>
              {error && <Alert severity="error">{error}</Alert>}
              <Form onSubmit={login} className="mx-auto">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Tên đăng nhập</Form.Label>
                  <Form.Control
                    type="text"
                    value={username || ""}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Tên đăng nhập..."
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    value={password || ""}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mật khẩu..."
                  />
                </Form.Group>
                {loading ? (
                  <Loading />
                ) : (
                  <div className="d-grid">
                    <Button variant="primary" type="submit">
                      Đăng nhập
                    </Button>
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Login;
