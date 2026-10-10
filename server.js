const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let players = [];

io.on('connection', (socket) => {
    console.log(`Có người chơi kết nối: ${socket.id}`);

    if (players.length < 2) {
        players.push(socket.id);
        const playerRole = players.length === 1 ? 'Player 1' : 'Player 2';
        socket.emit('assign-role', playerRole);
        
        if (players.length === 2) {
            io.emit('start-game', 'Trận đấu bắt đầu!');
        }
    } else {
        socket.emit('room-full', 'Phòng đã đủ 2 người chơi!');
    }

    socket.on('player-action', (data) => {
        io.emit('update-game', data);
    });

    socket.on('disconnect', () => {
        console.log(`Người chơi ngắt kết nối: ${socket.id}`);
        players = players.filter(id => id !== socket.id);
        io.emit('opponent-disconnected', 'Đối thủ đã rời phòng!');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server đang chạy tại cổng ${PORT}`);
});
server.listen(PORT, () => {
    console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});