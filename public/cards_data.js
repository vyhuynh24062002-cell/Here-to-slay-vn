me.slayedMonsters.forEach(sm => { const smEl = createCardElement(sm); smEl.onclick = () => zoomCard(sm); lBox.appendChild(smEl); });
const pBox = document.getElementById('my-party');
pBox.innerHTML = '';
me.party.forEach((hero, hIdx) => {
const el = createCardElement(hero);
el.onclick = () => {
const act = prompt(hero.name + ':\n1. Hy sinh / Bỏ\n2. Phóng to');
if (act === '1') socket.emit('removeHero', { roomCode: room.code, targetPlayerId: me.id, heroIndex: hIdx });
else if (act === '2') zoomCard(hero);
};
pBox.appendChild(el);
});
const hBox = document.getElementById('my-hand');
hBox.innerHTML = '';
me.hand.forEach((card, cIdx) => {
const el = createCardElement(card);
el.onclick = () => {
const act = prompt(card.name + ':\n1. Triệu hồi vào Tổ đội\n2. Trang bị Vật phẩm\n3. Đánh Phép / Bỏ bài\n4. Phóng to');
if (act === '1') socket.emit('playCard', { roomCode: room.code, cardIndex: cIdx, destination: 'party' });
else if (act === '2') {
if (!me.party.length) return alert('Chưa có Anh hùng trên bàn!');
const names = me.party.map((h, i) => (i + 1) + '. ' + h.name).join('\n');
const ch = parseInt(prompt('Chọn số Anh hùng:\n' + names)) - 1;
if (me.party[ch]) socket.emit('playCard', { roomCode: room.code, cardIndex: cIdx, destination: 'equip', targetHeroIndex: ch });
} else if (act === '3') socket.emit('playCard', { roomCode: room.code, cardIndex: cIdx, destination: 'discard' });
else if (act === '4') zoomCard(card);
};
hBox.appendChild(el);
});
}
const logBox = document.getElementById('game-logs');
logBox.innerHTML = room.logs.slice(-6).map(l => '• ' + l + '').join('');
logBox.scrollTop = logBox.scrollHeight;
}
