import { useReducer } from "react";
import { Container } from "react-bootstrap";
import cookie from "react-cookies";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import { UserContext } from "./configs/MyContext";
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import userReducer from "./reducers/UserReducer";
import Foods from "./components/Foods";
import RegisterUser from "./components/RegisterUser";
import RegisterStore from "./components/RegiterStore";
import StoreManagement from "./components/StoreManagement";
import StoreDetail from "./components/StoreDetail";
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
/>;

function App() {
  const [user, dispatch] = useReducer(
    userReducer,
    cookie.load("current-user") || null
  );

  return (
    <UserContext.Provider value={[user, dispatch]}>
      <BrowserRouter>
        <Header />

        <Container>
          <Routes>
            <Route path="/" element={<Foods />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterUser />} />
            <Route path="/register-store" element={<RegisterStore />} />
            <Route path="/store-management" element={<StoreManagement />} />
            <Route path="/stores/" element={<StoreDetail />} />
            <Route path="*" element={<h1>Comming soon...</h1>}></Route>
          </Routes>
        </Container>

        <Footer />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
