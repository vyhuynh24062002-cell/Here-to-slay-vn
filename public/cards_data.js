// Tọa độ chuẩn trên trang 4 cột (Anh hùng, Phép thuật, Chuyển đổi, Thách đấu)
const COL_4 = ['3.5%', '34.5%', '65.5%', '96.5%'];
const ROW_2 = ['6.5%', '54.5%'];

// Tọa độ chuẩn trên trang 3 cột (Quái vật, Thủ lĩnh)
const COL_3 = ['8%', '50%', '92%'];

const LEADERS_DATA = [
  { id: 'L1', name: 'The Divine Arrow', class: 'Ranger', sheet: '9.png', pos: '8% 6%', textVi: 'Mỗi khi bạn tung xúc xắc để TẤN CÔNG lá bài Quái Vật, +1 vào xúc xắc của bạn' },
  { id: 'L2', name: 'The Shadow Claw', class: 'Thief', sheet: '9.png', pos: '50% 6%', textVi: 'Một lần mỗi lượt vào lượt của bạn, có thể dùng 1 AP để lấy 1 lá bài từ tay người chơi khác' },
  { id: 'L3', name: 'The Fist of Reason', class: 'Fighter', sheet: '9.png', pos: '92% 6%', textVi: 'Mỗi khi bạn đổ xúc xắc để THÁCH ĐẤU, +2 vào xúc xắc của bạn' },
  { id: 'L4', name: 'The Charismatic Song', class: 'Bard', sheet: '9.png', pos: '8% 54%', textVi: 'Mỗi khi bạn tung xúc xắc để sử dụng hiệu ứng của lá Anh Hùng, +1 vào xúc xắc' },
  { id: 'L5', name: 'The Cloaked Sage', class: 'Wizard', sheet: '9.png', pos: '50% 54%', textVi: 'Mỗi khi bạn đánh lá bài Phép Thuật, RÚT 1 lá' },
  { id: 'L6', name: 'The Protecting Horn', class: 'Guardian', sheet: '9.png', pos: '92% 54%', textVi: 'Mỗi khi bạn dùng lá bài Chuyển Đổi cho lần đổ xúc xắc đó, +1 hoặc -1 vào xúc xắc' },
  { id: 'L7', name: 'The Brutal Bow', class: 'Fighter/Ranger', sheet: '15.png', pos: '8% 6%', textVi: 'Đầu lượt đổi tộc giữa Đấu Sĩ/Xạ Thủ. Mỗi khi PHÁ HỦY 1 Anh hùng, RÚT 1 lá' },
  { id: 'L8', name: 'The Mystical Maestro', class: 'Wizard/Bard', sheet: '15.png', pos: '50% 6%', textVi: 'Đầu lượt đổi tộc Pháp Sư/Thi Sĩ. Mỗi khi tung xúc xắc từ 4 trở xuống, RÚT 1 lá' },
  { id: 'L9', name: 'The Veiled Raider', class: 'Guardian/Thief', sheet: '15.png', pos: '92% 6%', textVi: 'Đầu lượt đổi tộc Bảo Hộ/Siêu Trộm. Mỗi khi tung được 12+, CƯỚP 1 Anh hùng' },
  { id: 'L10', name: 'The Piercing Howl', class: 'Warrior', sheet: '16.png', pos: '8% 6%', textVi: 'Mỗi khi tung xúc xắc, +1 vào tổng xúc xắc với mỗi Vật phẩm đang trang bị' },
  { id: 'L11', name: 'The Noble Shaman', class: 'Druid', sheet: '16.png', pos: '50% 6%', textVi: 'Một lần mỗi lượt của mỗi người chơi, chọn 1 xúc xắc bất kỳ và -1 vào xúc xắc đó' },
  { id: 'L12', name: 'The Fearless Flame', class: 'Sorcerer', sheet: '16.png', pos: '92% 6%', textVi: 'Mỗi khi tung xúc xắc, bạn có thể BỎ 1 lá bài để +1 vào xúc xắc của bạn' },
  { id: 'L13', name: 'The Gnawing Dread', class: 'Necromancer', sheet: '16.png', pos: '8% 54%', textVi: 'Một lần trong lượt, dùng 2 AP để lấy 1 lá bài trong đống bài bỏ lên tay' },
  { id: 'L14', name: 'The Raging Manticore', class: 'Berserker', sheet: '16.png', pos: '50% 54%', textVi: 'Mỗi khi bạn GIẾT được 1 lá Quái Vật, RÚT 2 lá bài' },
  { id: 'L15', name: 'The Unstable Unicorn', class: 'Any', sheet: '16.png', pos: '92% 54%', textVi: 'Đầu lượt bạn, chọn kỹ năng của 1 Thủ Lĩnh khác để sử dụng cho đến lượt sau' }
];

const MONSTERS_DATA = [
  { id: 'M1', name: 'Dragon Wasp', type: 'monster', sheet: '12.png', pos: '8% 6%', textVi: 'Mỗi khi Anh Hùng của bạn bị hy sinh hoặc phá hủy, thay vào đó BỎ 2 lá bài' },
  { id: 'M2', name: 'Goretelodont', type: 'monster', sheet: '12.png', pos: '50% 6%', textVi: 'Mỗi khi kết thúc lượt mà trên tay không còn bài, bạn được bốc 3 lá bài' },
  { id: 'M3', name: 'Lumbering Demon', type: 'monster', sheet: '12.png', pos: '92% 6%', textVi: 'Mỗi khi bạn RÚT 1 lá bài, bạn có thể RÚT 2 lá và BỎ đi 1 lá' },
  { id: 'M4', name: 'Possessed Plush', type: 'monster', sheet: '12.png', pos: '8% 54%', textVi: 'Mỗi khi bạn chơi lá bài Thử Thách, RÚT 1 lá bài' },
  { id: 'M5', name: 'Reef Ripper', type: 'monster', sheet: '12.png', pos: '50% 54%', textVi: 'Mỗi khi tung xúc xắc dùng hiệu ứng Anh hùng thất bại, RÚT 1 lá bài' },
  { id: 'M6', name: 'Saffyre Phoenix', type: 'monster', sheet: '12.png', pos: '92% 54%', textVi: 'Mỗi khi Anh hùng bị hy sinh hoặc phá hủy, được chơi 1 Anh hùng trên tay ngay' },
  { id: 'M7', name: 'Calamity Mongrel', type: 'monster', sheet: '15.png', pos: '8% 54%', textVi: 'Mỗi khi RÚT 1 lá Thử Thách, bạn có thể BỎ lá đó và RÚT 2 lá bài' },
  { id: 'M8', name: 'Wandering Behemoth', type: 'monster', sheet: '15.png', pos: '50% 54%', textVi: 'Mỗi khi lá Anh Hùng của bạn hy sinh hoặc bị phá hủy, bạn được RÚT 1 lá bài' },
  { id: 'M9', name: 'Wicked Sea Serpent', type: 'monster', sheet: '15.png', pos: '92% 54%', textVi: 'Mỗi khi bạn chơi 1 lá Vật Phẩm, RÚT 1 lá bài' },
  { id: 'M10', name: 'Arctic Aries', type: 'monster', sheet: '17.png', pos: '8% 6%', textVi: 'Mỗi khi tung xúc xắc thành công hiệu ứng Anh Hùng, RÚT 1 lá bài' },
  { id: 'M11', name: 'Abyss Queen', type: 'monster', sheet: '17.png', pos: '50% 6%', textVi: 'Mỗi khi người chơi khác dùng lá Chuyển đổi vào xúc xắc của bạn, +1 xúc xắc' },
  { id: 'M12', name: 'Terratuga', type: 'monster', sheet: '17.png', pos: '92% 6%', textVi: 'Những lá bài Anh hùng của bạn không thể bị tiêu diệt' },
  { id: 'M13', name: 'Orthus', type: 'monster', sheet: '17.png', pos: '8% 54%', textVi: 'Mỗi khi bạn RÚT lá bài Phép Thuật, bạn có thể sử dụng ngay lập tức' },
  { id: 'M14', name: 'Rex Major', type: 'monster', sheet: '17.png', pos: '50% 54%', textVi: 'Mỗi khi bạn RÚT lá Chuyển Đổi, có thể cho mọi người thấy và RÚT thêm lá thứ 2' },
  { id: 'M15', name: 'Dark Dragon King', type: 'monster', sheet: '17.png', pos: '92% 54%', textVi: 'Mỗi khi tung xúc xắc dùng hiệu ứng lá Anh hùng, +1 vào tổng xúc xắc của bạn' }
];

const MAIN_DECK_DATA = [
  // ĐẤU SĨ (FIGHTER - Ảnh 11)
  { id: 'H1', name: 'Bad Axe', type: 'hero', class: 'Fighter', sheet: '11.png', pos: `${COL_4[0]} ${ROW_2[0]}`, textVi: '[8+] PHÁ HỦY 1 lá Anh hùng' },
  { id: 'H2', name: 'Fury Knuckle', type: 'hero', class: 'Fighter', sheet: '11.png', pos: `${COL_4[1]} ${ROW_2[0]}`, textVi: '[5+] Lấy 1 lá từ người khác. Nếu là Thử Thách, lấy thêm lá thứ 2' },
  { id: 'H3', name: 'Beary Wise', type: 'hero', class: 'Fighter', sheet: '11.png', pos: `${COL_4[2]} ${ROW_2[0]}`, textVi: '[7+] Mỗi người chơi khác BỎ 1 lá. Chọn 1 trong các lá đó thêm vào tay' },
  { id: 'H4', name: 'Heavy Bear', type: 'hero', class: 'Fighter', sheet: '11.png', pos: `${COL_4[3]} ${ROW_2[0]}`, textVi: '[5+] Chọn một người chơi, người chơi đó phải BỎ 2 lá bài' },
  { id: 'H5', name: 'Bear Claw', type: 'hero', class: 'Fighter', sheet: '11.png', pos: `${COL_4[0]} ${ROW_2[1]}`, textVi: '[7+] Lấy 1 lá từ người khác. Nếu là Anh hùng, lấy thêm lá thứ 2' },
  { id: 'H6', name: 'Tough Teddy', type: 'hero', class: 'Fighter', sheet: '11.png', pos: `${COL_4[1]} ${ROW_2[1]}`, textVi: '[4+] Mỗi người chơi khác có tộc Đấu Sĩ trên bàn phải BỎ 1 lá bài' },
  { id: 'H7', name: 'Qi Bear', type: 'hero', class: 'Fighter', sheet: '11.png', pos: `${COL_4[2]} ${ROW_2[1]}`, textVi: '[10+] BỎ tối đa 3 lá. Với mỗi lá bỏ, PHÁ HỦY 1 lá Anh hùng' },
  { id: 'H8', name: 'Pan Chucks', type: 'hero', class: 'Fighter', sheet: '11.png', pos: `${COL_4[3]} ${ROW_2[1]}`, textVi: '[8+] RÚT 2 lá. Nếu có lá Thử Thách, tiết lộ để PHÁ HỦY 1 Anh hùng' },

  // XẠ THỦ (RANGER - Ảnh 13)
  { id: 'H9', name: 'Serious Grey', type: 'hero', class: 'Ranger', sheet: '13.png', pos: `${COL_4[0]} ${ROW_2[0]}`, textVi: '[9+] PHÁ HỦY 1 lá Anh hùng, và RÚT 1 lá bài' },
  { id: 'H10', name: 'Quick Draw', type: 'hero', class: 'Ranger', sheet: '13.png', pos: `${COL_4[1]} ${ROW_2[0]}`, textVi: '[8+] RÚT 2 lá. Nếu có lá Vật phẩm, được sử dụng ngay lập tức' },
  { id: 'H11', name: 'Lookie Rookie', type: 'hero', class: 'Ranger', sheet: '13.png', pos: `${COL_4[2]} ${ROW_2[0]}`, textVi: '[5+] Tìm lá Vật phẩm trong đống bài bỏ và thêm lên tay' },
  { id: 'H12', name: 'Wildshot', type: 'hero', class: 'Ranger', sheet: '13.png', pos: `${COL_4[3]} ${ROW_2[0]}`, textVi: '[8+] RÚT 3 lá bài và BỎ 1 lá bài' },
  { id: 'H13', name: 'Hook', type: 'hero', class: 'Ranger', sheet: '13.png', pos: `${COL_4[0]} ${ROW_2[1]}`, textVi: '[6+] Dùng lá Vật phẩm ngay lập tức và RÚT 1 lá bài' },
  { id: 'H14', name: 'Bullseye', type: 'hero', class: 'Ranger', sheet: '13.png', pos: `${COL_4[1]} ${ROW_2[1]}`, textVi: '[7+] Nhìn 3 lá trên cùng bộ bài, lấy 1 lá lên tay, xếp lại 2 lá kia' },
  { id: 'H15', name: 'Wily Red', type: 'hero', class: 'Ranger', sheet: '13.png', pos: `${COL_4[2]} ${ROW_2[1]}`, textVi: '[10+] RÚT lá bài cho đến khi trên tay đủ 7 lá' },
  { id: 'H16', name: 'Sharp Fox', type: 'hero', class: 'Ranger', sheet: '13.png', pos: `${COL_4[3]} ${ROW_2[1]}`, textVi: '[5+] Nhìn vào tay của người chơi khác' },

  // SIÊU TRỘM (THIEF - Ảnh 14)
  { id: 'H17', name: 'Kit Napper', type: 'hero', class: 'Thief', sheet: '14.png', pos: `${COL_4[0]} ${ROW_2[0]}`, textVi: '[9+] CƯỚP 1 lá Anh hùng' },
  { id: 'H18', name: 'Sly Pickings', type: 'hero', class: 'Thief', sheet: '14.png', pos: `${COL_4[1]} ${ROW_2[0]}`, textVi: '[6+] Lấy 1 lá từ tay người khác. Nếu là Vật phẩm, được chơi ngay' },
  { id: 'H19', name: 'Meowzio', type: 'hero', class: 'Thief', sheet: '14.png', pos: `${COL_4[2]} ${ROW_2[0]}`, textVi: '[10+] Chọn 1 người chơi, CƯỚP 1 Anh hùng và lấy 1 lá trên tay họ' },
  { id: 'H20', name: 'Plundering Puma', type: 'hero', class: 'Thief', sheet: '14.png', pos: `${COL_4[3]} ${ROW_2[0]}`, textVi: '[6+] Lấy 2 lá từ tay người khác, người đó được RÚT 1 lá bài' },
  { id: 'H21', name: 'Silent Shadow', type: 'hero', class: 'Thief', sheet: '14.png', pos: `${COL_4[0]} ${ROW_2[1]}`, textVi: '[8+] Nhìn vào tay người chơi khác. Chọn 1 lá thêm vào tay bạn' },
  { id: 'H22', name: 'Slippery Paws', type: 'hero', class: 'Thief', sheet: '14.png', pos: `${COL_4[1]} ${ROW_2[1]}`, textVi: '[6+] Lấy 2 lá từ tay người khác, rồi BỎ 1 trong những lá đó' },
  { id: 'H23', name: 'Shurikitty', type: 'hero', class: 'Thief', sheet: '14.png', pos: `${COL_4[2]} ${ROW_2[1]}`, textVi: '[9+] PHÁ HỦY 1 Anh hùng. Nếu có trang bị Vật phẩm, lấy Vật phẩm lên tay' },
