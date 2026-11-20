// 紫微斗數排盤核心（河洛飛星派取向）
// 地支索引：子0 丑1 寅2 卯3 辰4 巳5 午6 未7 申8 酉9 戌10 亥11
// 天干索引：甲0 乙1 丙2 丁3 戊4 己5 庚6 辛7 壬8 癸9
(function (root) {
  const GAN = '甲乙丙丁戊己庚辛壬癸'.split('');
  const ZHI = '子丑寅卯辰巳午未申酉戌亥'.split('');
  const PALACES = ['命宮', '兄弟', '夫妻', '子女', '財帛', '疾厄', '遷移', '交友', '官祿', '田宅', '福德', '父母'];
  const HUA = ['祿', '權', '科', '忌'];
  const m12 = (n) => ((n % 12) + 12) % 12;

  // 四化表，可依門派切換異說
  function siHuaTable(opt = {}) {
    const t = {
      0: ['廉貞', '破軍', '武曲', '太陽'],
      1: ['天機', '天梁', '紫微', '太陰'],
      2: ['天同', '天機', '文昌', '廉貞'],
      3: ['太陰', '天同', '天機', '巨門'],
      4: ['貪狼', '太陰', '右弼', '天機'],
      5: ['武曲', '貪狼', '天梁', '文曲'],
      6: ['太陽', '武曲', '太陰', '天同'],
      7: ['巨門', '太陽', '文曲', '文昌'],
      8: ['天梁', '紫微', '左輔', '武曲'],
      9: ['破軍', '巨門', '太陰', '貪狼'],
    };
    if (opt.wuKe === '太陽') t[4] = ['貪狼', '太陰', '太陽', '天機'];
    if (opt.geng === '陽武同陰') t[6] = ['太陽', '武曲', '天同', '太陰'];
    if (opt.geng === '陽武府同') t[6] = ['太陽', '武曲', '天府', '天同'];
    if (opt.renKe === '天府') t[8] = ['天梁', '紫微', '天府', '武曲'];
    return t;
  }

  // 五虎遁：各宮天干
  function palaceStems(yearGan) {
    const yinStem = (2 * (yearGan % 5) + 2) % 10; // 寅宮天干
    const stems = new Array(12);
    for (let b = 0; b < 12; b++) stems[b] = (yinStem + m12(b - 2)) % 10;
    return stems;
  }

  // 納音五行局
  function wuXingJu(gan, zhi) {
    const g = Math.floor(gan / 2) + 1; // 甲乙1 丙丁2 戊己3 庚辛4 壬癸5
    const z = [0, 0, 1, 1, 2, 2, 0, 0, 1, 1, 2, 2][zhi];
    let v = g + z; if (v > 5) v -= 5;
    return { 1: { name: '金四局', n: 4 }, 2: { name: '水二局', n: 2 }, 3: { name: '火六局', n: 6 }, 4: { name: '土五局', n: 5 }, 5: { name: '木三局', n: 3 } }[v];
  }

  function ziweiPos(ju, day) {
    let x = 0;
    while ((day + x) % ju !== 0) x++;
    const q = (day + x) / ju;
    let pos = 2 + q - 1;
    pos += (x % 2 === 1) ? -x : x;
    return m12(pos);
  }

  // 主函式：輸入農曆資料
  // { yearGan, yearZhi, month(1-12, 已處理閏月), day, hour(時辰索引0-11), gender:'男'|'女', opt }
  function buildChart(inp) {
    const { yearGan, yearZhi, month, day, hour, gender } = inp;
    const opt = inp.opt || {};
    const ming = m12(2 + (month - 1) - hour);
    const shen = m12(2 + (month - 1) + hour);
    const stems = palaceStems(yearGan);
    const ju = wuXingJu(stems[ming], ming);

    const stars = {}; // 星名 -> 地支
    const Z = ziweiPos(ju.n, day);
    Object.assign(stars, { 紫微: Z, 天機: m12(Z - 1), 太陽: m12(Z - 3), 武曲: m12(Z - 4), 天同: m12(Z - 5), 廉貞: m12(Z - 8) });
    const F = m12(4 - Z);
    Object.assign(stars, { 天府: F, 太陰: m12(F + 1), 貪狼: m12(F + 2), 巨門: m12(F + 3), 天相: m12(F + 4), 天梁: m12(F + 5), 七殺: m12(F + 6), 破軍: m12(F + 10) });

    // 輔星與煞星
    stars['左輔'] = m12(4 + month - 1);
    stars['右弼'] = m12(10 - (month - 1));
    stars['文昌'] = m12(10 - hour);
    stars['文曲'] = m12(4 + hour);
    const luCun = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0][yearGan];
    stars['祿存'] = luCun; stars['擎羊'] = m12(luCun + 1); stars['陀羅'] = m12(luCun - 1);
    const kuiYue = { 0: [1, 7], 4: [1, 7], 6: [1, 7], 1: [0, 8], 5: [0, 8], 2: [11, 9], 3: [11, 9], 7: [6, 2], 8: [3, 5], 9: [3, 5] }[yearGan];
    stars['天魁'] = kuiYue[0]; stars['天鉞'] = kuiYue[1];
    stars['地劫'] = m12(11 + hour); stars['地空'] = m12(11 - hour);
    const grp = yearZhi % 4; // 申子辰0 巳酉丑1 寅午戌2 亥卯未3
    const huoStart = [2, 3, 1, 9][grp], lingStart = [10, 10, 3, 10][grp];
    stars['火星'] = m12(huoStart + hour); stars['鈴星'] = m12(lingStart + hour);
    stars['天馬'] = [2, 11, 8, 5][grp];

    // 乙級星
    const yi = {};
    const yz = yearZhi, yg = yearGan, mo = month - 1, h = hour;
    yi['天哭'] = m12(6 - yz); yi['天虛'] = m12(6 + yz);
    yi['龍池'] = m12(4 + yz); yi['鳳閣'] = m12(10 - yz);
    yi['紅鸞'] = m12(3 - yz); yi['天喜'] = m12(9 - yz);
    const season = Math.floor(m12(yz - 2) / 3); // 寅卯辰0 巳午未1 申酉戌2 亥子丑3
    yi['孤辰'] = [5, 8, 11, 2][season]; yi['寡宿'] = [1, 4, 7, 10][season];
    yi['蜚廉'] = [8, 9, 10, 5, 6, 7, 2, 3, 4, 11, 0, 1][yz];
    yi['破碎'] = [5, 1, 9][yz % 3];
    yi['華蓋'] = [4, 1, 10, 7][grp]; yi['咸池'] = [9, 6, 3, 0][grp];
    yi['天德'] = m12(9 + yz); yi['月德'] = m12(5 + yz);
    yi['年解'] = m12(10 - yz);
    yi['天空'] = m12(yz + 1);
    yi['天官'] = [7, 4, 5, 2, 3, 9, 11, 9, 10, 6][yg];
    yi['天福'] = [9, 8, 0, 11, 3, 2, 6, 5, 6, 5][yg];
    yi['天廚'] = [5, 6, 0, 5, 6, 8, 2, 6, 9, 11][yg];
    const jie = [[8, 9], [6, 7], [4, 5], [2, 3], [0, 1]][yg % 5];
    yi['截路'] = jie[0]; yi['空亡'] = jie[1];
    const xun0 = m12(yz - yg + 10);
    yi['旬空'] = (xun0 % 2 === yg % 2) ? xun0 : m12(xun0 + 1);
    yi['天刑'] = m12(9 + mo); yi['天姚'] = m12(1 + mo);
    yi['解神'] = m12(8 + 2 * Math.floor(mo / 2));
    yi['天巫'] = [5, 8, 2, 11][mo % 4];
    yi['天月'] = [10, 5, 4, 2, 7, 3, 11, 7, 2, 6, 10, 2][mo];
    yi['陰煞'] = m12(2 - 2 * mo);
    yi['三台'] = m12(stars['左輔'] + day - 1); yi['八座'] = m12(stars['右弼'] - (day - 1));
    yi['恩光'] = m12(stars['文昌'] + day - 2); yi['天貴'] = m12(stars['文曲'] + day - 2);
    yi['台輔'] = m12(6 + h); yi['封誥'] = m12(2 + h);
    yi['天才'] = m12(ming + yz); yi['天壽'] = m12(shen + yz);
    yi['天傷'] = m12(ming - 7); yi['天使'] = m12(ming - 5);

    const table = siHuaTable(opt);
    const palaceOf = (star) => stars[star];

    // 各宮資料（以地支為鍵）
    const palaces = [];
    for (let b = 0; b < 12; b++) {
      palaces.push({ zhi: b, stem: stems[b], name: PALACES[m12(ming - b)], stars: [], birthHua: {}, isShen: b === shen });
    }
    for (const [s, b] of Object.entries(stars)) palaces[b].stars.push(s);
    for (const p of palaces) p.yiStars = [];
    for (const [s, b] of Object.entries(yi)) palaces[b].yiStars.push(s);

    // 生年四化
    const birthHua = table[yearGan].map((s, i) => ({ star: s, hua: HUA[i], to: palaceOf(s) }));
    birthHua.forEach((h) => { palaces[h.to].birthHua[h.star] = h.hua; });

    // 宮干飛化與自化
    const flights = []; // {from, to, star, hua, self}
    for (let b = 0; b < 12; b++) {
      table[stems[b]].forEach((s, i) => {
        const to = palaceOf(s);
        flights.push({ from: b, to, star: s, hua: HUA[i], self: to === b });
      });
    }
    for (const p of palaces) {
      p.out = flights.filter((f) => f.from === p.zhi);
      p.selfHua = p.out.filter((f) => f.self);
      // 對宮宮干化入本宮（部分門派稱「向心自化」）
      p.oppIn = flights.filter((f) => f.from === m12(p.zhi + 6) && f.to === p.zhi);
    }

    // 大限
    const yang = yearGan % 2 === 0;
    const forward = (yang && gender === '男') || (!yang && gender === '女');
    const daXian = [];
    for (let i = 0; i < 12; i++) {
      const b = m12(ming + (forward ? i : -i));
      daXian.push({ zhi: b, start: ju.n + i * 10, end: ju.n + i * 10 + 9 });
      palaces[b].daXian = [ju.n + i * 10, ju.n + i * 10 + 9];
    }

    // 長生十二神：依五行局起長生，陽男陰女順行、陰男陽女逆行
    const CS = ['長生', '沐浴', '冠帶', '臨官', '帝旺', '衰', '病', '死', '墓', '絕', '胎', '養'];
    const csStart = { 2: 8, 5: 8, 3: 11, 4: 5, 6: 2 }[ju.n];
    CS.forEach((n, i) => { palaces[m12(csStart + (forward ? i : -i))].changSheng = n; });
    // 博士十二神：由祿存起博士，順逆同上
    const BS = ['博士', '力士', '青龍', '小耗', '將軍', '奏書', '飛廉', '喜神', '病符', '大耗', '伏兵', '官府'];
    BS.forEach((n, i) => { palaces[m12(luCun + (forward ? i : -i))].boShi = n; });
    // 小限：寅午戌起辰、申子辰起戌、巳酉丑起未、亥卯未起丑；男順女逆
    const xxStart = [10, 7, 4, 1][grp];
    const xxDir = gender === '男' ? 1 : -1;
    for (const p of palaces) p.xiaoXian = [];
    for (let age = 1; age <= 120; age++) palaces[m12(xxStart + xxDir * (age - 1))].xiaoXian.push(age);

    // 來因宮：天干同生年干之宮，不取子丑
    const k = m12(((-yearGan - 2) % 10 + 10) % 10);
    const laiYin = m12(2 + k);

    return { input: inp, ming, shen, stems, ju, stars, palaces, birthHua, flights, daXian, forward, laiYin, table, xxStart, xxDir, yiStars: yi };
  }

  // 小限宮位（虛歲）
  function xiaoXianOf(chart, age) { return m12(chart.xxStart + chart.xxDir * (age - 1)); }
  // 斗君（流年正月）：自流年太歲宮起正月逆數至生月，再由該宮起子時順數至生時
  function douJun(chart, flowYearZhi) { return m12(flowYearZhi - (chart.input.month - 1) + chart.input.hour); }
  // 流月命宮：斗君起正月順行
  function flowMonthPalace(chart, flowYearZhi, month) { return m12(douJun(chart, flowYearZhi) + month - 1); }
  // 流日命宮：流月命宮起初一順行
  function flowDayPalace(chart, flowYearZhi, month, day) { return m12(flowMonthPalace(chart, flowYearZhi, month) + day - 1); }
  // 流月天干：以流年干五虎遁起正月（寅月）
  function flowMonthStem(flowYearGan, month) { return ((2 * (flowYearGan % 5) + 2) + month - 1) % 10; }

  // 追忌（忌轉忌）：從某宮開始，沿宮干化忌一路追
  function chaseJi(chart, startZhi, maxSteps = 12) {
    const path = [];
    let cur = startZhi;
    const seen = new Set();
    for (let i = 0; i < maxSteps; i++) {
      const ji = chart.flights.find((f) => f.from === cur && f.hua === '忌');
      path.push(ji);
      if (ji.self) { path.end = '自化忌，止'; break; }
      const key = ji.to;
      if (seen.has(key)) { path.end = '回到已經過的宮位，循環止'; break; }
      seen.add(cur);
      cur = ji.to;
    }
    return path;
  }

  // 祿隨忌走：某宮化祿入 X，再看 X 宮干化忌入何宮
  function luFollowJi(chart, startZhi) {
    const lu = chart.flights.find((f) => f.from === startZhi && f.hua === '祿');
    const ji = chart.flights.find((f) => f.from === lu.to && f.hua === '忌');
    return { lu, ji };
  }

  // 立太極：以 taiji 為命宮，重新命名十二宮
  function taijiNames(taiji) {
    const names = {};
    for (let b = 0; b < 12; b++) names[b] = PALACES[m12(taiji - b)];
    return names;
  }

  // 運限四化：以某宮天干（大限）或流年天干飛出
  function stemHua(chart, stem) {
    return chart.table[stem].map((s, i) => ({ star: s, hua: HUA[i], to: chart.stars[s] }));
  }

  const api = { GAN, ZHI, PALACES, HUA, buildChart, xiaoXianOf, douJun, flowMonthPalace, flowDayPalace, flowMonthStem, chaseJi, luFollowJi, taijiNames, stemHua, palaceStems, wuXingJu, ziweiPos, siHuaTable, m12 };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.ZW = api;
})(this);
