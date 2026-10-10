const socket = io();

const roleStatus = document.getElementById('role-status');
const notification = document.getElementById('notification');
const clickBtn = document.getElementById('click-btn');
const myScoreSpan = document.getElementById('my-score');
const opponentScoreSpan = document.getElementById('opponent-score');

let myRole = '';
let myScore = 0;
let opponentScore = 0;

socket.on('assign-role', (role) => {
    myRole = role;
    roleStatus.innerText = `Bạn là: ${role}`;
});

socket.on('start-game', (message) => {
    notification.innerText = message;
    clickBtn.disabled = false;
});

clickBtn.addEventListener('click', () => {
    myScore++;
    myScoreSpan.innerText = myScore;
    socket.emit('player-action', { role: myRole, score: myScore });
});

socket.on('update-game', (data) => {
    if (data.role !== myRole) {
        opponentScore = data.score;
        opponentScoreSpan.innerText = opponentScore;
        
        if (opponentScore >= 20) {
            notification.innerText = 'Đối thủ đã chiến thắng!';
            clickBtn.disabled = true;
        }
    } else {
        if (myScore >= 20) {
            notification.innerText = 'Bạn đã giành chiến thắng!';
            clickBtn.disabled = true;
        }
    }
});

socket.on('opponent-disconnected', (msg) => {
    notification.innerText = msg;
    clickBtn.disabled = true;
});

socket.on('room-full', (msg) => {
    roleStatus.innerText = msg;
    notification.innerText = 'Không thể tham gia trận đấu.';
});