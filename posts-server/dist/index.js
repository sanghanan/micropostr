"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 4000;
const posts = [];
app.get('/posts', (req, res) => {
    // Handle GET request for /posts
    res.send(posts);
});
app.post('/posts', (req, res) => {
    // Handle POST request for /posts
    res.send('POST /posts endpoint');
});
app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});
