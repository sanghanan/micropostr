import React, { useState, useEffect } from 'react';

const CommentList = ({ postId }) => {
    const [comments, setComments] = useState({});

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`http://localhost:4001/posts/${postId}/comments`);
                const data = await response.json();
                const commentsObject = {};
                data.forEach(comment => {
                    commentsObject[comment.id] = comment;
                });
                setComments(commentsObject);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [postId]);

    return (
        <ul>
            {Object.values(comments).map((comment) => (
                <li key={comment.id}>{comment.content}</li>
            ))}
        </ul>
    );
};

export default CommentList;
