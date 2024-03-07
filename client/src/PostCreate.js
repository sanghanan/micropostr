import React from "react";
import Form from 'react-bootstrap/Form';
import { Button } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";

export default function PostCreate() {
    const [content, setContent] = useState("");
    const submitPost = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/posts", {
                content
            });
            setContent("");
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Form onSubmit={submitPost}>
            <h4>Create a Post</h4>
      <Form.Group className="mb-3" controlId="post.Content">
        <Form.Label>Type your post below</Form.Label>
        <Form.Control value={content} onChange={e=> setContent(e.target.value)} as="textarea" rows={3} />
      </Form.Group>
      <Button variant="dark" type="submit">
        Submit
      </Button>
    </Form>
    );
}