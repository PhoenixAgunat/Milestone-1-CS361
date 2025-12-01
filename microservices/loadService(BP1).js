const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3002;
const DATA_FILE = path.join(__dirname, 'personalData.json');

function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Contorl-Allow-Origin': '*',
        'Access-Contorl-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Contorl-Allow-Headers': 'Content-Type',
    });
    res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
    if (req.method === 'OPTIONS') {
        sendJson(res, 204, {
            'Access-Contorl-Allow-Origin': '*',
            'Access-Contorl-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Contorl-Allow-Headers': 'Content-Type',
        });
      return res.end();
    }

    if (req.method === 'GET' && req.url === '/load') {
        fs.readFile(DATA_FILE, 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.log('[loadService] No data file found, returning empty data.');
                    return sendJson(res, 200, {
                        text: '',
                        updatedAt: null
                    });
                } else {
                    console.error('[loadedService] Error reading file:', err);
                    return sendJson(res,500, { error: "Failed to load data." });
                }
            }

            try {
                const parsed = JSON.parse(fileData);
                console.log('[loadService] Data loaded successfully.');
                sendJson(res, 200, parsed);
            } catch (e) {
                console.error('[loadedService] Error parsing JSON:', e);
                sendJson(res, 500, { error: 'Corrupted data file.'});
            }
        });
    } else {
        sendJson(res, 404, { error: 'Not found' });
    }
});

server.listen(PORT, () => {
    console.log('[loadService] Listening on port ${PORT}' );

});