import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 4002;
const EVENT_BUS_URL = 'http://localhost:4005/events';

// Middleware
app.use(bodyParser.json());
app.use(cors());

type Comment = {
    id: string;
    content: string;
    status: string;
};

type Post = {
    id: string;
    content: string;
    comments: Comment[];
};

const posts = {} as { [id: string]: Post };

const handleEvent = (type: string, data: any) => {
    if (type === 'PostCreated') {
        const { id, content } = data;
        posts[id] = { id, content, comments: [] };
    } else if (type === 'CommentCreated') {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        if (post) {
            post.comments.push({ id, content, status });
        }
    }
    else if (type === 'CommentUpdated') {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        if (post) {
            const comment = post.comments.find(comment => comment.id === id);
            if (comment) {
                comment.content = content;
                comment.status = status;
            }
        }
    }
}

// GET /posts endpoint
app.get('/posts', (req: Request, res: Response) => {
    res.send(posts);
});

// POST /events endpoint
app.post('/events', (req: Request, res: Response) => {
    const { type, data } = req.body;
    handleEvent(type, data);
    res.send({});
});

// Start the server
app.listen(PORT, async() => {
    console.log(`Server is running on port ${PORT}`);
    const allEvents = await axios.get(EVENT_BUS_URL);
    allEvents.data.forEach((event: any) => {
        console.log('Processing event:', event);
        handleEvent(event.type, event.data);
    });
});