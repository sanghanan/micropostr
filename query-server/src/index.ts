import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = 4002;

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

// GET /posts endpoint
app.get('/posts', (req: Request, res: Response) => {
    res.send(posts);
});

// POST /events endpoint
app.post('/events', (req: Request, res: Response) => {
    const { type, data } = req.body;

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
    console.log(posts);
    res.send({});
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});