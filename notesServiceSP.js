// Phoenix Agunat
// Date: November 28, 2025
// Class: CS362
// small pool microservice: notesService
// Description: This service provides simple note-taking functionality in memory.

const http = require('http');
const PORT = 3004;


const notes = [
    "Don't forget: every progress starts with the decision to try.",
    "Note to self: consistency is key to success.",
    "Remember: small steps lead to big changes.",
    "Everything matters - stay consistent"
    ];

function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {

    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        });
        return res.end();
    }

    if (req.method === 'GET' && req.url === '/note') {
        const randomIndex = Math.floor(Math.random() * notes.length);
        const selectedNote = notes[randomIndex];

        console.log('[notesService] Sending Note:', selectedNote);

        return sendJson(res, 200, {
            note: selectedNote,
            timestamp: new Date().toISOString()
        });
    }

    sendJson(res,404, { error: 'Not found' });
});

server.listen(PORT, () => {
    console.log(`[notesService] Listening on port ${PORT}`);
});

