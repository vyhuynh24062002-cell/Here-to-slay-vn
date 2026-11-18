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
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function calculateAutoBonus(player, actionType) {
  let bonus = 0;
  if (player.leader) {
    if (player.leader.id === 'L1' && actionType === 'attack') bonus += 1;
    if (player.leader.id === 'L3' && actionType === 'challenge') bonus += 2;
    if (player.leader.id === 'L4' && actionType === 'hero') bonus += 1;
    if (player.leader.id === 'L10') {
      bonus += player.party.filter(c => c.equippedItem).length;
    }
  }
  player.slayedMonsters.forEach(m => {
    if (m.id === 'M15' && actionType === 'hero') bonus += 1;
    if (m.id === 'M21' && actionType === 'challenge') bonus += 1;
    if (m.id === 'M24' && actionType === 'attack') bonus += 2;
    if (m.id === 'M26' && actionType === 'attack') bonus += 1;
    if (m.id === 'M30') bonus += 1;
  });
  player.party.forEach(hero => {
    if (hero.equippedItem) {
      if (hero.equippedItem.id === 'IT13' && actionType === 'hero') bonus += 2;
      if (hero.equippedItem.id === 'IT24' && actionType === 'hero') bonus += 4;
      if (hero.equippedItem.id === 'CI2' && actionType === 'hero') bonus -= 2;
    }
  });
  return bonus;
}

io.on('connection', (socket) => {
  socket.on('createRoom', ({ playerName, initialDeck, monsterDeck }) => {
    const roomCode = generateRoomCode();
    const mDeck = shuffleArray(monsterDeck);
    rooms[roomCode] = {
      code: roomCode,
      players: [{
        id: socket.id,
        name: playerName,
        ap: 3,
        hand: [],
        party: [],
        leader: null,
        slayedMonsters: []
      }],
      mainDeck: shuffleArray(initialDeck),
      discardPile: [],
      monsterDeck: mDeck,
      activeMonsters: mDeck.splice(0, 3),
      dice:,
      lastRollInfo: '',
      logs: ['Phòng ' + roomCode + ' đã tạo thành công!']
    };
    socket.join(roomCode);
    socket.emit('roomJoined', rooms[roomCode]);
  });

  socket.on('joinRoom', ({ roomCode, playerName }) => {
    const room = rooms[roomCode.toUpperCase()];
    if (!room) return socket.emit('errorMsg', 'Mã phòng không tồn tại!');
    if (room.players.length >= 6) return socket.emit('errorMsg', 'Phòng đã đầy (tối đa 6 người)!');

    room.players.push({
      id: socket.id,
      name: playerName,
      ap: 3,
      hand: [],
      party: [],
      leader: null,
      slayedMonsters: []
    });
    room.logs.push(playerName + ' đã vào bàn chơi.');
    socket.join(room.code);
    socket.emit('roomJoined', room);
    io.to(room.code).emit('updateState', room);
  });

  socket.on('shuffleDeck', (roomCode) => {
    const room = rooms[roomCode];
    if (!room) return;
    room.mainDeck = shuffleArray(room.mainDeck);
    room.logs.push('🔀 Đã xào lại bộ bài chính.');
    io.to(roomCode).emit('updateState', room);
  });

  socket.on('dealCards', (roomCode) => {
    const room = rooms[roomCode];
    if (!room) return;
    room.players.forEach(p => {
      for (let i = 0; i < 5; i++) {
        if (room.mainDeck.length > 0) p.hand.push(room.mainDeck.pop());
      }
    });
    room.logs.push('🃏 Đã chia 5 lá bài cho mỗi người chơi.');
    io.to(roomCode).emit('updateState', room);
  });

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
    room.mainDeck = shuffleArray(fullDeck);
    room.monsterDeck = shuffleArray(fullMonsters);
    room.activeMonsters = room.monsterDeck.splice(0, 3);
    room.logs.push('♻️ Đã thu toàn bộ bài về bộ bài gốc.');
    io.to(roomCode).emit('updateState', room);
  });

  socket.on('drawCard', (roomCode) => {
    const room = rooms[roomCode];
    if (!room || room.mainDeck.length === 0) return;
    const p = room.players.find(pl => pl.id === socket.id);
    if (p) {
      p.hand.push(room.mainDeck.pop());
      room.logs.push(p.name + ' rút 1 lá bài.');
      io.to(roomCode).emit('updateState', room);
    }
  });

  socket.on('selectLeader', ({ roomCode, leaderCard }) => {
    const room = rooms[roomCode];
    if (!room) return;
    const p = room.players.find(pl => pl.id === socket.id);
    if (p) {
      p.leader = leaderCard;
      room.logs.push('👑 ' + p.name + ' chọn Thủ Lĩnh: ' + leaderCard.name);
      io.to(roomCode).emit('updateState', room);
    }
  });

  socket.on('playCard', ({ roomCode, cardIndex, destination, targetHeroIndex }) => {
    const room = rooms[roomCode];
    if (!room) return;
    const p = room.players.find(pl => pl.id === socket.id);
    if (!p || !p.hand[cardIndex]) return;

    const [card] = p.hand.splice(cardIndex, 1);
    if (destination === 'party') {
      p.party.push({ ...card, equippedItem: null });
      room.logs.push(p.name + ' triệu hồi ' + card.name);
    } else if (destination === 'equip' && p.party[targetHeroIndex]) {
      p.party[targetHeroIndex].equippedItem = card;
      room.logs.push(p.name + ' trang bị ' + card.name + ' cho ' + p.party[targetHeroIndex].name);
    } else {
      room.discardPile.push(card);
      room.logs.push(p.name + ' đánh/bỏ lá ' + card.name);
    }
    io.to(roomCode).emit('updateState', room);
  });

  socket.on('slayMonster', ({ roomCode, monsterIndex }) => {
    const room = rooms[roomCode];
    if (!room) return;
    const p = room.players.find(pl => pl.id === socket.id);
    if (p && room.activeMonsters[monsterIndex]) {
      const [slayed] = room.activeMonsters.splice(monsterIndex, 1);
      p.slayedMonsters.push(slayed);
      if (room.monsterDeck.length > 0) {
        room.activeMonsters.push(room.monsterDeck.pop());
      }
      room.logs.push('⚔️ ' + p.name + ' đã GIẾT Quái Vật ' + slayed.name + '!');
      io.to(roomCode).emit('updateState', room);
    }
  });

  socket.on('removeHero', ({ roomCode, targetPlayerId, heroIndex }) => {
    const room = rooms[roomCode];
    if (!room) return;
    const target = room.players.find(pl => pl.id === targetPlayerId);
    if (target && target.party[heroIndex]) {
      const [removed] = target.party.splice(heroIndex, 1);
      if (removed.equippedItem) room.discardPile.push(removed.equippedItem);
      room.discardPile.push(removed);
      room.logs.push('💀 ' + removed.name + ' của ' + target.name + ' bị đưa vào đống bỏ.');
      io.to(roomCode).emit('updateState', room);
    }
  });

  socket.on('stealHero', ({ roomCode, fromPlayerId, heroIndex }) => {
    const room = rooms[roomCode];
    if (!room) return;
    const thief = room.players.find(pl => pl.id === socket.id);
    const victim = room.players.find(pl => pl.id === fromPlayerId);
    if (thief && victim && victim.party[heroIndex]) {
      const [stolen] = victim.party.splice(heroIndex, 1);
      thief.party.push(stolen);
      room.logs.push('🥷 ' + thief.name + ' CƯỚP ' + stolen.name + ' từ ' + victim.name + '!');
      io.to(roomCode).emit('updateState', room);
    }
  });

  socket.on('rollDice', ({ roomCode, actionType }) => {
    const room = rooms[roomCode];
    if (!room) return;
    const p = room.players.find(pl => pl.id === socket.id);
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const bonus = p ? calculateAutoBonus(p, actionType) : 0;
    const total = d1 + d2 + bonus;

    room.dice = [d1, d2];
    const bonusText = bonus !== 0 ? ' (' + (bonus > 0 ? '+' + bonus : bonus) + ')' : '';
    room.lastRollInfo = d1 + ' + ' + d2 + bonusText + ' = ' + total;
    room.logs.push('🎲 ' + (p ? p.name : '') + ' tung xúc xắc: ' + room.lastRollInfo);
    io.to(roomCode).emit('updateState', room);
  });

  socket.on('changeAP', ({ roomCode, delta }) => {
    const room = rooms[roomCode];
    if (!room) return;
    const p = room.players.find(pl => pl.id === socket.id);
    if (p) {
      p.ap = Math.max(0, p.ap + delta);
      io.to(roomCode).emit('updateState', room);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Server running on port ' + PORT));
