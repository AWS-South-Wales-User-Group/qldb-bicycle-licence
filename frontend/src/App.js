import Register from "./components/Register.js";
import History from "./components/History.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

function App() {
  return (
    <Router>
      <Navbar bg='dark' variant='dark'>
        <Navbar.Brand>QLDB Bicycle</Navbar.Brand>
        <Nav className='mr-auto'>
          <LinkContainer to='/register'>
            <Nav.Link>Register</Nav.Link>
          </LinkContainer>
          <LinkContainer to='/history'>
            <Nav.Link>History</Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar>
      <Container>
        <Switch>
          <Route path='/register' component={Register} />
          <Route path='/history/' component={History} />
          <Route path='/'>
            <Redirect from="/" to="/register" exact /> 
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
