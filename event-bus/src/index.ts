import express, { Request, Response } from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
const PORT = 4005;

const app = express();
app.use(bodyParser.json());
app.use(express.json());
type Event = {
    type: string;
    data: Object;
};

app.post('/events', async (req: Request, res: Response) => {
    const event: Event = req.body;
    console.log('Received event:', event);
    const listeners = [
        'http://localhost:4000/events',
        'http://localhost:4001/events',
        'http://localhost:4002/events',
        'http://localhost:4003/events'
    ];

    try {
        await Promise.all(listeners.map(url => 
            axios.post(url, event).catch(error => {
                console.error(`Error transmitting event to ${url}:`, error);
                return error; // Return error to prevent Promise.all from failing fast.
            })
        ));
        res.status(200).send('Event transmitted successfully');
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).send('Error transmitting event');
    }
});


app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});