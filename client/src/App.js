import React from "react";
import PostCreate from "./PostCreate";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Navbar from 'react-bootstrap/Navbar';
import PostList from "./PostList";

export default function App() {
    return (
        <Container fluid className="px-0">

            <Navbar expand="lg" className="navbar-dark bg-dark">
                <Container>
                    <Navbar.Brand>PostR</Navbar.Brand>
                </Container>
            </Navbar>
            <Container>
                <Row className="mt-3">
                    <Col className="col-lg-4">
                        <PostCreate />
                    </Col>
                </Row>
            </Container>

            <Container>
                <hr />
                <Row className="mt-3">

                    <Col>
                        <PostList />
                    </Col>
                </Row>
            </Container>
        </Container>

    );
}