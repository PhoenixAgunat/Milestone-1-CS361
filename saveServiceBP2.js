// Phoenix Agunat
// Date: November 28, 2025
// Class: CS362
// Our second big pool microservice: saveService
// Description: This service handles saving personal data to a JSON file.

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
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

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        });
        return res.end();
    }

    // Handle POST /save
    if (req.method === 'POST' && req.url === '/save') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const parsed = JSON.parse(body);
                const text = parsed.text || '';

                const dataToStore = {
                    text: text,
                    updatedAt: new Date().toISOString()
                };

                fs.writeFile(DATA_FILE, JSON.stringify(dataToStore, null, 2), err => {
                    if (err) {
                        console.error('[saveService] Error writing file:', err);
                        return sendJson(res, 500, { error: 'Failed to save data.' });
                    }

                    console.log('[saveService] Data saved successfully.');
                    sendJson(res, 200, {
                        message: 'Data saved successfully.',
                        data: dataToStore
                    });
                });

            } catch (e) {
                console.error('[saveService] Error parsing JSON:', e);
                return sendJson(res, 400, { error: 'Invalid JSON format.' });
            }
        });

    } else {
        // Fallback for routes not found
        sendJson(res, 404, { error: 'Not Found' });
    }
});

server.listen(PORT, () => {
    console.log(`[saveService] Listening on port ${PORT}`);
});
