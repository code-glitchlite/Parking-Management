import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const NavbarMain = () => {

  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/")
  }

  const navigateToSlot = () => {
    navigate("/slots")
  }

  return (
    <>
      <Navbar fixed="top" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Park Your Car</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={navigateToHome}>Book Slot</Nav.Link>
            <Nav.Link onClick={navigateToSlot}>Booked Slots</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  )
}

export default NavbarMain