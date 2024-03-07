import React, { useState, useEffect } from 'react';

const CommentList = ({ comments }) => {
    return (
        <ul>
            {comments.map((comment) => (
                <li key={comment.id}>{comment.content}</li>
            ))}
        </ul>
    );
};

export default CommentList;
