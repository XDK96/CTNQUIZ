"use strict";
// use port 8000 unless there exists a preconfigured port

const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

let clients = [];
const app = express();
var port = process.env.PORT || 8000;

// Statikus fájlok kiszolgálása
app.use(express.static(path.join(__dirname)));

// Kezdőoldal kiszolgálása
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'server.html'));
});
app.get('/client', (req, res) => {
  res.sendFile(path.join(__dirname, 'client.html'));
});

app.get('/names', (req, res) => {
const namePath = path.join(__dirname, 'names.txt');

  fs.readFile(namePath, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(data);
  });
});

app.get('/quiz', (req, res) => {
const quizPath = path.join(__dirname, 'quiz.txt');

  fs.readFile(quizPath, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(data);
  });
});

// HTTP szerver létrehozása
const server = http.createServer(app);

// WebSocket szerver létrehozása
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New client connected');
    // Add new client to the list
    clients.push(ws);
	
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
		
		var ct=JSON.parse(message);
        // Broadcast the message to all clients except the sender
        clients.forEach(client => {
			//console.log(client);
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(ct));
            }
        });
    });
    ws.on('close', function close() {
        console.log('A client disconnected');

        // Remove the client from the list
        clients = clients.filter(client => client !== ws);
    });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});