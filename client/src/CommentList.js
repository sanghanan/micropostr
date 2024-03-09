import React, { useState, useEffect } from 'react';

const moderateComment = (status, content) => {
   switch (status) {
         case 'pending':
              return 'This comment is awaiting moderation';
         case 'rejected':
              return 'This comment has been rejected';
         default:
              return content;
    }
};

const CommentList = ({ comments }) => {
    return (
        <ul>
            {comments.map((comment) => (
                <li key={comment.id}>{moderateComment(comment.status, comment.content)}</li>
            ))}
        </ul>
    );
};

export default CommentList;
