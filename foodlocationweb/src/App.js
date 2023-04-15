import logo from './logo.svg';
import './App.css';
import { useReducer } from 'react';
import cookie from "react-cookies";
import Header from './layout/Header';
import Footer from './layout/Footer';
import { Container } from 'react-bootstrap';
import Foods from './components/Foods';


function App() {

  return (
    <>
    <Header />

    <Container>
      <Foods />
    </Container>

    <Footer />
    </>
  );
}

export default App;
