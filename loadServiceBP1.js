// Phoenix Agunat
// Date: November 28, 2025
// Class: CS362
// Our first big pool microservice: loadService
// Description: This service handles loading personal data from a JSON file.


const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3002;
const DATA_FILE = path.join(__dirname, 'personalData.json');

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


    if (req.method === 'GET' && req.url === '/load') {
        fs.readFile(DATA_FILE, 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.log('[loadService] No data file found, returning empty data.');
                    return sendJson(res, 200, { text: '', updatedAt: null });
                } else {
                    console.error('[loadService] Error reading file:', err);
                    return sendJson(res, 500, { error: 'Failed to load data.' });
                }
            }

            try {
                const parsed = JSON.parse(data);
                console.log('[loadService] Data loaded successfully.');
                sendJson(res, 200, parsed);
            } catch (e) {
                console.error('[loadService] Error parsing JSON:', e);
                sendJson(res, 500, { error: 'Corrupted data file.' });
            }
        });
    } else {
        sendJson(res, 404, { error: 'Not found' });
    }
});

server.listen(PORT, () => {
    console.log(`[loadService] Listening on port ${PORT}`);
});
