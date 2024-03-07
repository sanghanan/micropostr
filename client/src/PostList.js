import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import { Col, Container, Row } from 'react-bootstrap';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

const PostList = () => {
    const [posts, setPosts] = useState({});
    const QUERY_SERVICE_URL = 'http://localhost:4002/posts';

    useEffect(() => {
        axios.get(QUERY_SERVICE_URL)
            .then(response => {
                console.log(response.data);
                setPosts(response.data);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    }, []);

    return (
            <Container>
                <Row>
            {Object.keys(posts).map((postId) => {
                const post = posts[postId];
                return (
                    <Col key={post.id} className='col-lg-4'>
                    <Card >
                        <Card.Body>
                            <Card.Title>{post.content}</Card.Title>
                            <CommentList comments={post.comments} />
                            <CommentCreate postId={post.id} />
                        </Card.Body>
                    </Card>
                    </Col>
                );
            })}
            </Row>
       </Container>
    );
};

export default PostList;
