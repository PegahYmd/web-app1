import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Navbar, Nav, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LogoutButton, LoginButton } from './Auth';

const Navigation = (props) => {

  const handleSubmit = (event) => {
    event.preventDefault();
  }

  return (
    <Navbar bg="primary" expand="sm" variant="dark" fixed="top" className="navbar-padding justify-content-between">
      <Link to="/">
        <Navbar.Brand>
          {/* <i className="bi bi-collection-play icon-size"/> */}CMS
        </Navbar.Brand>
      </Link>
      {/* <Form className="my-2 my-lg-0 mx-auto d-sm-block" action="#" role="search" aria-label="Quick search" onSubmit={handleSubmit}>
        <Form.Control className="mr-sm-2" type="search" placeholder="Search" aria-label="Search query" />
      </Form> */}
      
        <Nav.Item>
          <Nav.Link href="#">
            <Link to={"/admin"} state={{nextpage: location.pathname}}>
              <p>admin pages</p>
              </Link>
            </Nav.Link>

            <Link to={"/page/" + 1} state={{nextpage: location.pathname}}>
            <p>regular user pages</p>
            </Link>
            
        </Nav.Item>
        <Nav className="ml-md-auto">
        <Navbar.Text className="mx-2">
          {props.user && props.user.name && `Welcome, ${props.user.name}!`}
          {/* <i className="bi bi-person-circle icon-size"/> */}
        </Navbar.Text>
        <Form className="mx-2">
          {props.loggedIn ? <LogoutButton logout={props.logout} /> : <LoginButton />}
        </Form>
      </Nav>
    </Navbar>
    
  );
}

export { Navigation }; 