import React from "react";
import Form from 'react-bootstrap/Form';
import { Button, Col, Row } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";

export default function CommentCreate({ postId }) {
    const [content, setContent] = useState("");
    const submitComment = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:4001/posts/${postId}/comments`, {
                content
            });
            setContent("");
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Form onSubmit={submitComment}>
            <Form.Group className="mb-3" controlId="comment.Content">
                <Row>
                    <Col>
                        <Form.Control type="text" placeholder="Enter comment!" value={content} onChange={(e) => setContent(e.target.value)} />
                    </Col>
                    <Col className="col-lg-3">
                        <Button variant="dark" type="submit">
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form.Group>
        </Form>
    );
}