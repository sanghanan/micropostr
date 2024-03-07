import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { randomBytes } from 'crypto';
import cors from 'cors';
import axios from 'axios';

type Comment = {
    id: string;
    content: string;
}

const app = express();
app.use(bodyParser.json());
app.use(cors());
const PORT = 4001;
const EVENT_BUS_URL = 'http://localhost:4005/events';

// In-memory storage for comments
const commentsByPostId: { [postId: string]: Comment[] } = {};

// GET /posts/:id/comments - Get comments for a post
app.get('/posts/:id/comments', (req: Request, res: Response) => {
    const postId = req.params.id;
    const postComments = commentsByPostId[postId] || [];
    res.send(postComments);
});

// POST /posts/:id/comments - Create a comment for a post
app.post('/posts/:id/comments', async(req: Request, res: Response) => {
    const commentId = randomBytes(4).toString('hex');
    const postId = req.params.id;
    const { content } = req.body;
    const comments = commentsByPostId[postId] || [];
    comments.push({ id: commentId, content });
    commentsByPostId[postId] = comments;
    // Emit an event to the event bus
    await axios.post(EVENT_BUS_URL, {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId
        }
    });
    res.status(201).send(comments);
});

app.post('/events', (req: Request, res: Response) => {
    console.log('Received Event', req.body.type);
    res.send({});
});

// Start the server
app.listen(PORT, () => {
    console.log('Server is running on port ', PORT);
});