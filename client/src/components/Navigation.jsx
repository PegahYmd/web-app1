import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Navbar, Nav, Form, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LogoutButton, LoginButton } from './Auth';

const Navigation = (props) => {

  const handleSubmit = (event) => {
    event.preventDefault();
  }

  return (
    <Navbar expand="sm" variant="dark" fixed="top" className="navbar-padding justify-content-between">
      <Link to="/">
        <Navbar.Brand>
          CMS
        </Navbar.Brand>
      </Link>

        <Nav.Item>
          <Container className='links-wid'>
            <Row>
              <Col lg={6}>
                <Nav.Link href="#">
                  <Link to={"/admin"} state={{nextpage: location.pathname}}>
                    <p>admin pages</p>
                  </Link>
                </Nav.Link>
             </Col>
            <Col lg={6}>
              <Link to={"/page/" + 1} state={{nextpage: location.pathname}}>
                <p>regular user pages</p>
              </Link>
            </Col>
            </Row>
          </Container>
        </Nav.Item>
        
        <Nav className="ml-md-auto">
        <Navbar.Text className="mx-2">
          {props.user && props.user.name && `Welcome, ${props.user.name}!`}
        </Navbar.Text>
        <Form className="mx-2">
          {props.loggedIn ? <LogoutButton logout={props.logout} /> : <LoginButton />}
        </Form>
      </Nav>
    </Navbar>
    
  );
}

export { Navigation }; 