import "./components/Licence.js";
import Licence from "./components/Licence.js";
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
          <LinkContainer to='/licence'>
            <Nav.Link>Licence</Nav.Link>
          </LinkContainer>
          <LinkContainer to='/history'>
            <Nav.Link>History</Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar>
      <Container>
        <Switch>
          <Route path='/licence'>
            <Licence />
          </Route>
          <Route path='/history'>
            <History />
          </Route>
          <Route path='/'>
            <Redirect from="/" to="/licence" exact /> 
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
