const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const db = require('monk')(process.env.MONGO_URI || 'localhost/skyblock');
const fs = require('fs');

const events = db.get('jacobEvents');

app.use(express.json());
app.use(require('cors')());
if (fs.existsSync('../client/dist')) {
    app.use(express.static('../client/dist'));
}

app.get('/api/upcomingEvents', async (req, res) => {
    const upcomingEvents = await events.find({ timestamp: { $gt: Date.now() - 21 * 60 * 1000 } }, {sort: {timestamp: 1}, fields: {_id: 0}});
    res.send(upcomingEvents)
});

// app.get('/events', async (req, res) => {
//     const allEvents = await events.find({}, {sort: {timestamp: 1}});
//     res.send(allEvents)
// });

app.post('/api/events', async (req, res) => {
    if (req.body.secret !== process.env.SECRET) {
        res.status(401);
        res.send('no');
    } else {
        await events.insert(req.body.events);
        res.send('done');
    }
});

app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`)
});
