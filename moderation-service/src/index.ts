import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
const PORT = 4003;
const EVENT_BUS_URL = 'http://localhost:4005/events';

app.use(bodyParser.json());

app.post('/events', async (req: Request, res: Response) => {
    const bannedWords = ['orange', 'apple', 'banana'];
    const { type, data } = req.body;
    if (type === 'CommentCreated') {
        const { id, content, postId, status } = data;
        const statusToSet = bannedWords.some(word => content.includes(word)) ? 'rejected' : 'approved';
        console.log('Moderation status:', statusToSet);
        await axios.post(EVENT_BUS_URL, {
            type: 'CommentModerated',
            data: {
                id,
                content,
                postId,
                status: statusToSet
            }
        });
    }
    res.send({});
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});