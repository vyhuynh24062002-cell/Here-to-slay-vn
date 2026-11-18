const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

const rooms = {};

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

io.on('connection', (socket) => {
  socket.on('createRoom', ({ playerName, initialDeck, monsterDeck, leaderDeck }) => {
    const roomCode = generateRoomCode();
    rooms[roomCode] = {
      code: roomCode,
      host: socket.id,
      players: [{
        id: socket.id,
        name: playerName,
        ap: 3,
        hand: [],
        party: [],
        leader: null,
        slayedMonsters: []
      }],
      mainDeck: shuffleArray([...initialDeck]),
      discardPile: [],
      monsterDeck: shuffleArray([...monsterDeck]),
      activeMonsters: [],
      leaderPool: [...leaderDeck],
      dice:,
      logs: [`Phòng ${roomCode} đã được tạo bởi ${playerName}.`]
    };

    // Lật sẵn 3 quái vật lên bàn theo đúng luật
    rooms[roomCode].activeMonsters = rooms[roomCode].monsterDeck.splice(0, 3);
    socket.join(roomCode);
    socket.emit('roomJoined', rooms[roomCode]);
  });

  socket.on('joinRoom', ({ roomCode, playerName }) => {
    const room = rooms[roomCode.toUpperCase()];
    if (!room) return socket.emit('errorMsg', 'Không tìm thấy mã phòng!');
    if (room.players.length >= 6) return socket.emit('errorMsg', 'Phòng đã đủ 6 người!');

    room.players.push({
      id: socket.id,
      name: playerName,
      ap: 3,
      hand: [],
      party: [],
      leader: null,
      slayedMonsters: []
    });
    room.logs.push(`${playerName} đã tham gia bàn chơi.`);
    socket.join(room.code);
    io.to(room.code).emit('updateState', room);
  });

  // Nút XÀO BÀI
  socket.on('shuffleDeck', (roomCode) => {
    const room = rooms[roomCode];
    if (!room) return;
    room.mainDeck = shuffleArray(room.mainDeck);
    room.logs.push('Bộ bài chính đã được XÀO lại.');
    io.to(roomCode).emit('updateState', room);
  });

  // Nút CHIA BÀI (Chia mỗi người 5 lá theo luật)
  socket.on('dealCards', (roomCode) => {
    const room = rooms[roomCode];
    if (!room) return;
    room.players.forEach(p => {
      for (let i = 0; i < 5; i++) {
        if (room.mainDeck.length > 0) {
          p.hand.push(room.mainDeck.pop());
        }
      }
    });
    room.logs.push('Đã CHIA 5 lá bài cho mỗi người chơi.');
    io.to(roomCode).emit('updateState', room);
  });

  // Nút THU BÀI (Thu toàn bộ bài trên tay, tổ đội, chồng bỏ về bộ bài chính và xào)
  socket.on('recallCards', ({ roomCode, fullDeck, fullMonsters }) => {
    const room = rooms[roomCode];
    if (!room) return;
    room.players.forEach(p => {
      p.hand = [];
      p.party = [];
      p.slayedMonsters = [];
      p.ap = 3;
    });
    room.discardPile = [];
    room.mainDeck = shuffleArray([...fullDeck]);
    room.monsterDeck = shuffleArray([...fullMonsters]);
    room.activeMonsters = room.monsterDeck.splice(0, 3);
    room.logs.push('Đã THU TOÀN BỘ BÀI về bộ bài gốc và đặt lại bàn chơi.');
    io.to(roomCode).emit('updateState', room);
  });

  // Rút 1 lá bài
  socket.on('drawCard', (roomCode) => {
    const room = rooms[roomCode];
    if (!room || room.mainDeck.length === 0) return;
    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.hand.push(room.mainDeck.pop());
      room.logs.push(`${player.name} đã rút 1 lá bài.`);
      io.to(roomCode).emit('updateState', room);
    }
  });

  // Chọn Thủ Lĩnh
  socket.on('selectLeader', ({ roomCode, leaderCard }) => {
    const room = rooms[roomCode];
    if (!room) return;
    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.leader = leaderCard;
      room.logs.push(`${player.name} đã chọn Thủ Lĩnh: ${leaderCard.name}.`);
      io.to(roomCode).emit('updateState', room);
    }
  });

  // Đánh lá bài từ tay xuống bàn hoặc chồng bài bỏ
  socket.on('playCard', ({ roomCode, cardIndex, destination }) => {
    const room = rooms[roomCode];
    if (!room) return;
    const player = room.players.find(p => p.id === socket.id);
    if (!player || !player.hand[cardIndex]) return;

    const [card] = player.hand.splice(cardIndex, 1);
    if (destination === 'party') {
      player.party.push({ ...card, equippedItem: null });
      room.logs.push(`${player.name} đã triệu hồi ${card.name} vào tổ đội.`);
    } else {
      room.discardPile.push(card);
      room.logs.push(`${player.name} đã sử dụng/bỏ lá ${card.name}.`);
    }
    io.to(roomCode).emit('updateState', room);
  });

  // Tung 2 xúc xắc
  socket.on('rollDice', (roomCode) => {
    const room = rooms[roomCode];
    if (!room) return;
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const player = room.players.find(p => p.id === socket.id);
    room.dice = [d1, d2];
    room.logs.push(`🎲 ${player ? player.name : 'Người chơi'} tung xúc xắc được: ${d1} + ${d2} = ${d1 + d2}`);
    io.to(roomCode).emit('updateState', room);
  });

  // Cập nhật điểm hành động (AP)
  socket.on('changeAP', ({ roomCode, delta }) => {
    const room = rooms[roomCode];
    if (!room) return;
    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.ap = Math.max(0, player.ap + delta);
      io.to(roomCode).emit('updateState', room);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server Here to Slay đang chạy tại http://localhost:${PORT}`);
});
