// Phoenix Agunat
// Date: November 28, 2025
// Class: CS362
// our third big pool microservice: updateService
// Description: This service handles updating personal data in a JSON file.

const http = require('http');
const fs = require('fs');
const path = require('path');   
const PORT = 3003;
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

    // Handle OPTIONS for CORS
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        return res.end();
    }

    // Handle update request
    if (req.method === 'POST' && req.url === '/update') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const parsed = JSON.parse(body);
                const text = parsed.text || '';

                const updatedData = {
                    text: text,
                    updatedAt: new Date().toISOString()
                };

                fs.writeFile(DATA_FILE, JSON.stringify(updatedData, null, 2), err => {
                    if (err) {
                        console.error('[updateService] Error writing file:', err);
                        return sendJson(res, 500, { error: 'Failed to update data' });
                    }

                    console.log('[updateService] Updated data:', updatedData);
                    sendJson(res, 200, {
                        message: 'Data updated successfully',
                        data: updatedData
                    });
                });

            } catch (e) {
                console.error('[updateService] Invalid JSON', e);
                sendJson(res, 400, { error: 'Invalid JSON input' });
            }
        });

    } else {
        sendJson(res, 404, { error: 'Not found' });
    }
});
server.listen(PORT, () => {
    console.log(`[updateService] Listening on port ${PORT}`);
});
