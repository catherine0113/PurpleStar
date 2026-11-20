// 紫微斗數命盤分析（規則式）：南派重星性、格局、三方四正；北派重宮干四化、化入化出、忌沖
(function (root) {
  const ZW = root.ZW || (typeof require !== 'undefined' ? require('./zw-core.js') : null);
  const { GAN, ZHI, PALACES, m12, stemHua, xiaoXianOf } = ZW;

  const MAJOR = ['紫微','天機','太陽','武曲','天同','廉貞','天府','太陰','貪狼','巨門','天相','天梁','七殺','破軍'];
  const JI_STARS = ['左輔','右弼','文昌','文曲','天魁','天鉞','祿存','天馬'];
  const SHA = ['擎羊','陀羅','火星','鈴星','地空','地劫'];
  const TAOHUA_A = ['貪狼','廉貞'];
  const TAOHUA_B = ['紅鸞','天喜','天姚','咸池'];
  const BRIGHT = {"紫微":"平廟旺旺得旺廟廟旺旺得旺","天機":"廟陷得旺利平廟陷得旺利平","太陽":"陷不旺廟旺旺旺得得平不陷","武曲":"旺廟得利廟平旺廟得利廟平","天同":"旺不利平平廟陷不旺平平廟","廉貞":"平利廟平利陷平利廟平利陷","天府":"廟廟廟得廟得旺廟得旺廟得","太陰":"廟廟旺陷陷陷不不利旺旺廟","貪狼":"旺廟平利廟陷旺廟平利廟陷","巨門":"旺不廟廟陷旺旺不廟廟陷旺","天相":"廟廟廟陷得得廟得廟陷得得","天梁":"廟旺廟廟廟陷廟旺陷得廟陷","七殺":"旺廟廟旺廟平旺廟廟旺廟平","破軍":"廟旺得陷旺平廟旺得陷旺平"};
  const DIR = ['正北','北偏東北','東北','正東','東偏東南','東南','正南','南偏西南','西南','正西','西偏西北','西北'];
  const SHENGXIAO = '鼠牛虎兔龍蛇馬羊猴雞狗豬'.split('');

  const S = {
    紫微: { good: '有領導力、自尊心強、穩重大方、有責任感', bad: '好面子、主觀、耳根子軟、不易聽人勸', spouse: '有主見、氣質端莊、帶點權威感，可能年紀稍長或社經地位較高', career: '管理領導、公職、大型企業主管、自營事業', money: '財源穩但重排場，花費也大', health: '脾胃消化、頭部', rel: '家人間有威嚴感，互動重禮數，命主常是做主的一方', friend: '朋友多為有地位者，但容易形成上下關係' },
    天機: { good: '聰明機敏、反應快、善於企劃分析、好學', bad: '多慮善變、神經緊繃、計畫多執行少', spouse: '聰明、能言善道、個性靈活，年紀相近或略小', career: '企劃、研究、資訊科技、顧問、教學、幕僚參謀', money: '靠頭腦與技術賺錢，宜穩健、不宜投機', health: '肝膽、神經系統、四肢筋骨', rel: '彼此多言語交流，關係容易隨環境變動', friend: '朋友多，但交情容易隨環境改變' },
    太陽: { good: '熱情大方、樂於助人、光明磊落、有正義感', bad: '好面子、付出過多、勞碌、容易虎頭蛇尾', spouse: '開朗熱情、事業心強、外向能幹', career: '公職、政治、傳播、教育、外務、能源、對外發展', money: '名先於利，先建立名聲再求財，花錢大方', health: '頭部、眼睛、血壓、心臟', rel: '與男性長輩緣深，常是照顧家人的一方', friend: '樂於幫朋友，貴人多，但也常為人付出' },
    武曲: { good: '剛毅果決、執行力強、重實際、理財能力好', bad: '固執、不善表達情感、說話直、較孤剋', spouse: '務實能幹、個性剛強，較不浪漫', career: '金融財務、會計、軍警、工程技術、五金機械、實業', money: '財星，善理財、能聚財，宜正財', health: '肺部呼吸道、牙齒骨骼', rel: '關係較淡，少說關心的話，但重實際照顧', friend: '交友重實際，朋友不多但講信用' },
    天同: { good: '溫和隨和、樂觀知足、人緣好、有福氣', bad: '懶散、缺乏衝勁、依賴心重、情緒化', spouse: '溫和體貼、懂生活情趣，可能年紀較小或帶孩子氣', career: '服務業、餐飲、社福、設計藝術、休閒娛樂、行政', money: '白手起家，財來自努力後的福報，不宜過度享樂', health: '泌尿、腎臟、膀胱、耳朵、體重', rel: '家庭氣氛和諧，彼此包容', friend: '人緣好、相處融洽，但容易交到吃喝玩樂的朋友' },
    廉貞: { good: '才華洋溢、有企圖心、公關能力強、是非分明', bad: '個性強烈、情緒起伏大、好勝、易有感情糾葛', spouse: '個性鮮明、有魅力，感情濃烈但容易起摩擦', career: '公關行銷、法律、軍警、電子科技、技術研發、政治', money: '財運起伏，宜走正途，不宜投機', health: '血液循環、心臟、免疫系統', rel: '彼此個性不相讓，容易有摩擦，需學會退一步', friend: '交際手腕好，但交友圈複雜，需慎選' },
    天府: { good: '穩重保守、包容力強、善於管理、重生活品質', bad: '保守、缺乏冒險精神、愛面子、略顯自滿', spouse: '穩重可靠，有家底或懂得持家', career: '財務管理、行政、銀行、不動產、大企業、倉儲', money: '財庫星，善於守成積蓄', health: '脾胃消化系統', rel: '家庭關係穩定，有能力照顧家人', friend: '朋友穩定，多能互相照應' },
    太陰: { good: '溫柔細膩、內斂含蓄、有藝術氣質、善於規劃', bad: '多愁善感、敏感多慮、優柔寡斷', spouse: '溫柔體貼、顧家，氣質斯文', career: '不動產、財務、設計美學、文書、夜間或女性相關產業', money: '善於儲蓄，以累積為主，與不動產有緣', health: '腎臟、內分泌、眼睛', rel: '與母親或女性家人緣深', friend: '交友細膩，以少數知心為主' },
    貪狼: { good: '多才多藝、交際手腕好、企圖心強、適應力好', bad: '慾望多、好高騖遠、桃花多、有投機心', spouse: '有魅力、懂生活情趣、交際廣，感情變化較多', career: '業務、公關、演藝娛樂、餐飲、美容、宗教玄學、投資', money: '有偏財運，但需防投機失利', health: '肝腎、生殖系統、菸酒耗損', rel: '家人互動熱鬧，但各有心思', friend: '朋友多、應酬多，但良莠不齊' },
    巨門: { good: '口才好、分析力強、心思縝密、有研究精神', bad: '多疑、易惹口舌是非、容易得罪人、愛鑽牛角尖', spouse: '能言善辯，雙方溝通要注意語氣，容易因言語起爭執', career: '律師、講師教學、傳播、業務、醫藥、研究', money: '靠口才或專業賺錢，財來多有競爭', health: '腸胃、口腔、食道', rel: '家人間容易有口角誤會，宜多溝通', friend: '容易因言語生是非，需防小人中傷' },
    天相: { good: '正直熱心、有服務精神、協調能力好、衣食無缺', bad: '耳根子軟、缺乏主見、好管閒事', spouse: '性情溫和、重外表打扮、講道理，相處和諧', career: '秘書幕僚、人事、公職、服務業、法務、時尚', money: '衣食祿足，理財宜保守', health: '皮膚、泌尿系統、糖分代謝', rel: '家人相處講道理，能互相協調', friend: '交友廣泛，常扮演調停者' },
    天梁: { good: '老成持重、有正義感、樂於照顧人、有長輩緣', bad: '好說教、孤高、愛管事、自以為是', spouse: '成熟穩重，可能年紀較長，或兩人年齡差距明顯', career: '醫療、宗教、教育、社福、保險、法律監察', money: '不宜投機，財多來自專業與口碑', health: '脾胃、心臟、慢性病', rel: '能得長輩庇蔭，也常照顧家人', friend: '多有年長貴人，也常為朋友出頭' },
    七殺: { good: '果斷勇敢、獨立有魄力、敢衝敢拼', bad: '衝動急躁、獨斷、人生起伏大', spouse: '個性剛強有主見，宜晚婚，兩人宜各有空間', career: '軍警、外科、運動、業務開拓、創業、機械工程', money: '財來財去，起伏大，宜搭配穩健理財', health: '呼吸系統、肺、外傷意外', rel: '較早獨立，與家人各自打拼，聚少離多', friend: '朋友少而精，重義氣' },
    破軍: { good: '開創力強、不墨守成規、勇於改革', bad: '衝動、不穩定、消耗多', spouse: '有個性、敢愛敢恨，感情多變動，宜晚婚', career: '創業、改革開發、修繕、運輸、軍警、進出口', money: '先破後成，消耗大，需防大起大落', health: '生殖泌尿、腎、外傷開刀', rel: '與家人緣分有起伏，可能分隔兩地', friend: '交友變動大，容易與朋友分分合合' },
  };
  const AUX = {
    左輔: '有助力、平輩相助', 右弼: '有助力、人緣好', 文昌: '聰慧、重文書條理', 文曲: '口才才藝佳、感性',
    天魁: '有陽性貴人（男性、長輩）', 天鉞: '有陰性貴人（女性、暗中相助）', 祿存: '有財祿但較保守', 天馬: '多變動、奔波、利外地',
    擎羊: '衝動、競爭、易有刑傷', 陀羅: '拖延、糾纏、做事反覆', 火星: '急躁、突發狀況', 鈴星: '陰沉、暗中不順',
    地空: '想法空靈、易落空', 地劫: '易有損失、劫財',
  };
  const ORGAN = {
    紫微: '脾胃、頭部', 天機: '肝膽、神經、四肢', 太陽: '眼睛、頭部、血壓、心臟', 武曲: '呼吸道、肺、牙齒骨骼', 天同: '泌尿、腎、耳朵',
    廉貞: '血液循環、心臟、免疫', 天府: '脾胃', 太陰: '腎、內分泌、眼睛、睡眠', 貪狼: '肝腎、生殖系統', 巨門: '腸胃、口腔、食道',
    天相: '皮膚、泌尿', 天梁: '脾胃、心臟、慢性病', 七殺: '呼吸道、外傷', 破軍: '生殖泌尿、外傷開刀',
    文昌: '神經系統、精神壓力、呼吸道', 文曲: '神經系統、精神壓力、內分泌', 左輔: '脾胃', 右弼: '脾胃'
  };
  const FEMALE_ORGAN = ['太陰', '廉貞', '破軍', '天同', '貪狼'];
  const SHA_HEALTH = { 擎羊: '外傷或開刀', 陀羅: '慢性病、筋骨牙齒', 火星: '發炎、發燒', 鈴星: '暗疾、神經緊繃', 地空: '精神壓力、虛症', 地劫: '精神壓力、虛症', 天刑: '開刀手術' };
  const PM = { 命宮: '自我', 兄弟: '兄弟姊妹與同事', 夫妻: '感情與配偶', 子女: '子女、晚輩與合夥', 財帛: '賺錢與用錢', 疾厄: '身體與心性', 遷移: '外出與社會互動', 交友: '朋友與部屬', 官祿: '事業工作', 田宅: '家庭與不動產', 福德: '精神享受與福報', 父母: '父母長輩、上司與文書' };
  const SHEN_M = { 命宮: '自我意識強，一生以自己的想法為主軸', 夫妻: '很重視感情與配偶，婚姻對人生影響大', 財帛: '重視財富，人生重心常放在賺錢', 遷移: '一生多外出奔波，在外發展的機會多', 官祿: '事業心強，以工作成就為重', 福德: '重精神享受與生活品味' };
  const LAI_M = { 命宮: '一生課題在自己，自立自為、凡事靠自己打拼', 兄弟: '一生課題與兄弟姊妹、母親或同事有關', 夫妻: '一生課題落在感情與婚姻', 子女: '一生課題與子女、晚輩、合夥或桃花有關', 財帛: '一生課題是錢財，為錢奔忙也因錢得失', 疾厄: '一生課題是身心健康，勞碌於自身', 遷移: '一生課題在外，與社會、出外發展有關', 交友: '一生課題與朋友眾生有關，人際影響大', 官祿: '一生課題在事業工作', 田宅: '一生課題與家庭、家業、置產有關', 福德: '一生課題在精神、興趣與福報', 父母: '一生課題與父母長輩、學業文書有關' };

  function analyze(c, ctx) {
    const by = ctx.birthYear, now = ctx.nowYear, gender = c.input.gender;
    const P = (n) => m12(c.ming - PALACES.indexOf(n));
    const nameOf = (b) => c.palaces[b].name;
    const nm = (b) => nameOf(b) === '命宮' ? '命宮' : nameOf(b) + '宮';
    const starsIn = (b) => c.palaces[b].stars;
    const yiIn = (b) => c.palaces[b].yiStars || [];
    const majorsIn = (b) => starsIn(b).filter((s) => MAJOR.includes(s));
    const mainOf = (b) => { const m = majorsIn(b); return m.length ? { stars: m, borrowed: false } : { stars: majorsIn(m12(b + 6)), borrowed: true }; };
    const sanfang = (b) => [b, m12(b + 6), m12(b + 4), m12(b + 8)];
    const inSF = (b, list) => sanfang(b).flatMap((x) => starsIn(x).filter((s) => list.includes(s)));
    const birthHuaIn = (b) => c.birthHua.filter((h) => h.to === b);
    const fly = (b, hua) => c.flights.find((f) => f.from === b && f.hua === hua);
    const bright = (s, b) => BRIGHT[s] ? BRIGHT[s][b] : '';
    const brightTxt = (b, stars) => stars.map((s) => `${s}（${bright(s, b)}）`).join('、');
    const weak = (s, b) => ['陷', '不'].includes(bright(s, b));
    const huaTxt = (h) => `${h.star}化${h.hua}`;
    const dirOf = (b) => `${DIR[b]}（${ZHI[b]}方）`;
    const uniq = (a) => [...new Set(a)];
    const yearGZ = (y) => GAN[(y - 4) % 10] + ZHI[m12(y - 4)];
    const ageOf = (y) => y - by + 1;
    const dxOf = (age) => c.daXian.find((d) => age >= d.start && age <= d.end);
    const luCunOf = (g) => [2, 3, 5, 6, 5, 6, 8, 9, 11, 0][g];
    function yearInfo(y) {
      const gan = (y - 4) % 10, zhi = m12(y - 4), age = ageOf(y);
      const lc = luCunOf(gan);
      return { y, gan, zhi, age, hua: stemHua(c, gan), hong: m12(3 - zhi), xi: m12(9 - zhi), yang: m12(lc + 1), tuo: m12(lc - 1), xx: age >= 1 ? xiaoXianOf(c, age) : null, dx: dxOf(age), ln: (n) => m12(zhi - PALACES.indexOf(n)) };
    }
    const hit = (hua, list, t) => hua.filter((h) => h.hua === t && list.includes(h.to));
    const ming = c.ming, mainMing = mainOf(ming);

    // ---------- 1. 個性 ----------
    const per = [];
    const mm = mainMing.stars;
    if (mainMing.borrowed) per.push(`命宮沒有主星（空宮），借對宮遷移宮的${mm.join('、')}來看，個性較易受環境與身邊的人影響，可塑性高，有時也會缺乏定見。`);
    else per.push(`命宮主星為${brightTxt(ming, mm)}。`);
    const goods = mm.map((s) => S[s].good), bads = mm.map((s) => S[s].bad);
    per.push(`<b>優點：</b>${goods.join('；')}。`);
    per.push(`<b>缺點：</b>${bads.join('；')}。`);
    const weakOnes = mainMing.borrowed ? [] : mm.filter((s) => weak(s, ming));
    if (weakOnes.length) per.push(`${weakOnes.join('、')}在命宮落陷，優點較難完全發揮，缺點容易放大，需要後天修養來補足。`);
    const mingAux = starsIn(ming).filter((s) => AUX[s]);
    if (mingAux.length) per.push(`命宮同宮的${mingAux.join('、')}：${mingAux.map((s) => AUX[s]).join('；')}。`);
    const sfJi = inSF(ming, JI_STARS), sfSha = inSF(ming, SHA);
    per.push(`命宮三方四正（命、遷、財、官）會到吉星 ${sfJi.length} 顆${sfJi.length ? '（' + sfJi.join('、') + '）' : ''}、煞星 ${sfSha.length} 顆${sfSha.length ? '（' + sfSha.join('、') + '）' : ''}。${sfJi.length > sfSha.length ? '吉多於煞，整體格局較順，做事容易得到助力。' : sfSha.length > sfJi.length ? '煞多於吉，人生歷練較多，個性較有稜角，但磨練後能成大器。' : '吉煞相當，成敗多看個人努力與選擇。'}`);
    const bhMing = birthHuaIn(ming);
    bhMing.forEach((h) => per.push({ 祿: `生年${huaTxt(h)}坐命，人緣好、有福氣，凡事較能順勢而為。`, 權: `生年${huaTxt(h)}坐命，主觀強、有掌控欲與執行力，適合當主導者。`, 科: `生年${huaTxt(h)}坐命，斯文有禮、重名聲，遇事常有貴人化解。`, 忌: `生年${huaTxt(h)}坐命，個性執著、自我要求高，一生較勞心，容易鑽牛角尖。` }[h.hua]));
    // 格局
    const gj = [];
    const sfStars = sanfang(ming).flatMap(starsIn);
    const hasLu = sfStars.includes('祿存') || c.birthHua.some((h) => h.hua === '祿' && sanfang(ming).includes(h.to));
    if (starsIn(ming).includes('紫微') && starsIn(ming).includes('天府')) gj.push('紫府同宮');
    if (mm.some((s) => ['七殺', '破軍', '貪狼'].includes(s)) && !mainMing.borrowed) gj.push('殺破狼（一生變動多、敢衝敢拼）');
    if (['天機', '太陰', '天同', '天梁'].every((s) => sfStars.includes(s))) gj.push('機月同梁（適合穩定的公職或幕僚）');
    if (!starsIn(ming).includes('天府') && sfStars.includes('天府') && sfStars.includes('天相')) gj.push('府相朝垣');
    if (['太陽', '天梁', '文昌'].every((s) => sfStars.includes(s)) && hasLu) gj.push('陽梁昌祿（利考試、學術、公職）');
    if (starsIn(ming).includes('貪狼') && (starsIn(ming).includes('火星') || starsIn(ming).includes('鈴星'))) gj.push(starsIn(ming).includes('火星') ? '火貪格（有突發的機運）' : '鈴貪格（有突發的機運）');
    if (starsIn(ming).includes('巨門') && (ming === 0 || ming === 6)) gj.push('石中隱玉');
    if (ming === 7 && !majorsIn(ming).length && c.stars['太陽'] === 3 && c.stars['太陰'] === 11) gj.push('明珠出海');
    const nb = [m12(ming - 1), m12(ming + 1)];
    const jia = (a, b2, n) => { if ((c.stars[a] === nb[0] && c.stars[b2] === nb[1]) || (c.stars[a] === nb[1] && c.stars[b2] === nb[0])) gj.push(n); };
    jia('左輔', '右弼', '左右夾命（吉）'); jia('文昌', '文曲', '昌曲夾命（吉）'); jia('天魁', '天鉞', '魁鉞夾命（吉）');
    jia('擎羊', '陀羅', bhMing.some((h) => h.hua === '忌') ? '羊陀夾忌（凶，宜謹慎）' : '羊陀夾命（凶）'); jia('地空', '地劫', '空劫夾命（凶）'); jia('火星', '鈴星', '火鈴夾命（凶）');
    sanfang(ming).forEach((b) => { if (starsIn(b).includes('天馬') && (starsIn(b).includes('祿存') || birthHuaIn(b).some((h) => h.hua === '祿'))) gj.push(`祿馬交馳（在${nm(b)}，利外出求財）`); });
    if (gj.length) per.push(`<b>格局：</b>${uniq(gj).join('、')}。`);
    // 北派
    const mj = fly(ming, '忌'), ml = fly(ming, '祿');
    per.push(`<b>北派看法：</b>命宮宮干${GAN[c.stems[ming]]}，化祿入${ml.self ? '本宮（自化祿）' : nm(ml.to)}，表示命主的緣分與付出放在${PM[nameOf(ml.to)]}；化忌入${mj.self ? '本宮（自化忌）' : nm(mj.to)}，${mj.self ? '自化忌的人做事常有心無力、容易自我消耗，要學會放下' : `表示一生最在意、最放不下的是${PM[nameOf(mj.to)]}，並沖${nm(m12(mj.to + 6))}，${PM[nameOf(m12(mj.to + 6))]}方面較易起伏`}。`);
    c.palaces[ming].selfHua.filter((f) => f.hua !== '忌').forEach((f) => per.push({ 祿: '命宮自化祿：大方隨和，好處來得快去得也快。', 權: '命宮自化權：自主性強，容易固執己見。', 科: '命宮自化科：重形象，喜歡表現斯文的一面。' }[f.hua]));
    const shenName = nameOf(c.shen);
    per.push(`身宮在${nm(c.shen)}：${SHEN_M[shenName] || '後天重心偏向' + PM[shenName]}。來因宮在${nm(c.laiYin)}：${LAI_M[nameOf(c.laiYin)]}。`);

    // ---------- 2. 姻緣 ----------
    const fq = P('夫妻'), zn = P('子女'), fd = P('福德');
    const mainFq = mainOf(fq);
    const love = [];
    love.push(`夫妻宮${mainFq.borrowed ? '無主星，借對宮官祿宮的' + mainFq.stars.join('、') : '主星為' + brightTxt(fq, mainFq.stars)}。未來的對象傾向：${mainFq.stars.map((s) => S[s].spouse).join('；')}。${mainFq.borrowed ? '夫妻宮空宮，感情較易受外在環境影響，對象的條件與自己的事業圈有關。' : ''}`);
    const fqAux = starsIn(fq).filter((s) => AUX[s]);
    if (fqAux.length) love.push(`夫妻宮有${fqAux.join('、')}：${fqAux.map((s) => AUX[s]).join('；')}。${fqAux.some((s) => SHA.includes(s)) ? '有煞星同宮，感情較多波折，宜晚婚或多磨合。' : ''}${fqAux.some((s) => ['左輔', '右弼'].includes(s)) ? '左輔或右弼在夫妻宮，需防第三者介入。' : ''}`);
    const bhFq = birthHuaIn(fq);
    bhFq.forEach((h) => love.push({ 祿: `生年${huaTxt(h)}入夫妻宮，配偶緣佳，對象對自己有幫助。`, 權: `生年${huaTxt(h)}入夫妻宮，配偶個性強、有主導權。`, 科: `生年${huaTxt(h)}入夫妻宮，配偶斯文有禮，感情相敬如賓。`, 忌: `生年${huaTxt(h)}入夫妻宮，對感情特別執著，常覺得虧欠對方或被感情牽絆，宜晚婚、多包容。` }[h.hua]));
    const tA = uniq([...sanfang(ming), fq].flatMap((b) => starsIn(b).filter((s) => TAOHUA_A.includes(s)).map((s) => `${s}在${nm(b)}`)));
    const tB = uniq([ming, fq, m12(fq + 6), zn, fd].flatMap((b) => yiIn(b).filter((s) => TAOHUA_B.includes(s)).map((s) => `${s}在${nm(b)}`)));
    const muyu = c.palaces.find((p) => p.changSheng === '沐浴');
    if (tA.length || tB.length) love.push(`桃花星：${[...tA, ...tB].join('、')}${muyu && [ming, fq].includes(muyu.zhi) ? `，另有沐浴在${nm(muyu.zhi)}` : ''}。命宮三方或夫妻宮一帶有桃花星，異性緣明顯，感情機會多，但也要留意選擇與專一。`);
    else love.push('命宮、夫妻宮附近桃花星不多，感情態度較保守，姻緣多靠介紹或長時間相處而來。');
    const fqJi = fly(fq, '忌'), fqLu = fly(fq, '祿'), mingToFq = c.flights.filter((f) => f.from === ming && f.to === fq);
    let bp = `<b>北派看法：</b>夫妻宮宮干${GAN[c.stems[fq]]}，化祿入${fqLu.self ? '本宮' : nm(fqLu.to)}，化忌入${fqJi.self ? '本宮（自化忌）' : nm(fqJi.to)}。`;
    if (fqJi.self) bp += '夫妻宮自化忌，感情來得快也容易淡，對方不太會表達，關係需要用心經營。';
    else if (fqJi.to === ming) bp += '夫妻宮化忌入命，配偶對命主依賴、牽絆深，緣分重，但也容易管得多。';
    else if (fqJi.to === m12(ming + 6)) bp += '夫妻宮化忌沖命宮，雙方價值觀容易衝突，宜多溝通。';
    else if (fqJi.to === P('官祿')) bp += '夫妻宮化忌入官祿、沖夫妻本身，感情容易受工作影響，或聚少離多。';
    else bp += `配偶在意的是${PM[nameOf(fqJi.to)]}。`;
    if (mingToFq.length) bp += `命宮化${mingToFq.map((f) => f.hua).join('、')}入夫妻宮，命主對感情投入${mingToFq.some((f) => f.hua === '忌') ? '很深，容易執著於對方' : '，願意為對方付出'}。`;
    love.push(bp);
    love.push(`子女宮（桃花位、親密關係）主星${mainOf(zn).stars.join('、')}，福德宮（感情觀與內心滿足）主星${mainOf(fd).stars.join('、')}${starsIn(fd).some((s) => SHA.includes(s)) ? '，福德宮見煞，內心容易不安，感情中需要更多安全感' : ''}。`);
    // 大限
    const dxLove = c.daXian.filter((d) => d.start <= 60).map((d) => {
      const h = stemHua(c, c.stems[d.zhi]); let sc = 0; const why = [];
      if (hit(h, [fq], '祿').length) { sc += 2; why.push('大限化祿入夫妻'); }
      if (d.zhi === fq) { sc += 2; why.push('大限行經夫妻宮'); }
      const dfq = m12(d.zhi - 2);
      if (yiIn(dfq).some((s) => ['紅鸞', '天喜'].includes(s))) { sc += 1; why.push('大限夫妻宮見紅鸞天喜'); }
      if (hit(h, [fq], '忌').length) { sc -= 1; why.push('大限化忌入夫妻，感情多考驗'); }
      return { d, sc, why };
    });
    const goodDx = dxLove.filter((x) => x.sc >= 2);
    if (goodDx.length) love.push(`大限：${goodDx.map((x) => `${x.d.start}–${x.d.end}歲（${x.why.join('、')}）`).join('；')}，這些十年感情運較旺。`);
    // 流年
    const loveYears = [];
    for (let age = 20; age <= 45; age++) {
      const y = by + age - 1, Y = yearInfo(y); let sc = 0; const why = [];
      if ([ming, fq].includes(Y.hong) || [ming, fq].includes(Y.xi)) { sc += 3; why.push('流年紅鸞天喜照命或夫妻'); }
      if ([Y.ln('夫妻')].includes(Y.hong) || [Y.ln('夫妻')].includes(Y.xi)) { sc += 1; why.push('流年夫妻宮見鸞喜'); }
      if (hit(Y.hua, [fq], '祿').length) { sc += 2; why.push('流年化祿入夫妻'); }
      if (hit(Y.hua, [fq], '科').length) { sc += 1; why.push('流年化科入夫妻'); }
      if (Y.zhi === fq || Y.xx === fq) { sc += 2; why.push(Y.zhi === fq ? '流年命宮到本命夫妻' : '小限到夫妻宮'); }
      const dh = stemHua(c, c.stems[Y.dx.zhi]);
      if (hit(dh, [fq], '祿').length) { sc += 1; }
      if (hit(Y.hua, [fq], '忌').length) { sc -= 1; why.push('但流年化忌入夫妻，過程有波折'); }
      if (sc >= 4) loveYears.push({ Y, sc, why });
    }
    loveYears.sort((a, b) => b.sc - a.sc);
    const top = loveYears.slice(0, 6).sort((a, b) => a.Y.y - b.Y.y);
    if (top.length) love.push('<b>較容易遇到可論及婚嫁對象的年份：</b><ul>' + top.map((x) => `<li>${x.Y.y}年（${yearGZ(x.Y.y)}，${x.Y.age}歲）${x.Y.y < now ? '［已過］' : ''}：${x.why.join('、')}</li>`).join('') + '</ul>');
    const lateMarry = mainFq.stars.some((s) => ['七殺', '破軍', '天梁', '武曲'].includes(s)) || bhFq.some((h) => h.hua === '忌') || fqJi.self;
    love.push(`<b>姻緣課題：</b>${lateMarry ? '夫妻宮組合顯示宜晚婚，太早結婚較易磨合辛苦，三十歲後成熟穩定再定下來較佳。' : '感情發展較順，遇到合適對象不必刻意拖延。'}${tA.length + tB.length >= 3 ? '桃花旺，最大的課題是專一與選擇。' : ''}${starsIn(fq).some((s) => SHA.includes(s)) ? '雙方個性需要磨合，遇到爭執宜冷靜處理。' : ''}`);

    // ---------- 3. 事業財運 ----------
    const gl = P('官祿'), cb = P('財帛'), qy = P('遷移'), tz = P('田宅');
    const car = [];
    const mainGl = mainOf(gl), mainCb = mainOf(cb);
    car.push(`官祿宮${mainGl.borrowed ? '無主星，借夫妻宮的' + mainGl.stars.join('、') : '主星為' + brightTxt(gl, mainGl.stars)}。<b>適合的方向：</b>${uniq([...mainGl.stars, ...mm].map((s) => S[s].career)).join('；')}。`);
    const glAux = starsIn(gl).filter((s) => AUX[s]);
    if (glAux.length) car.push(`官祿宮有${glAux.join('、')}：${glAux.map((s) => AUX[s]).join('；')}。`);
    const pos = [];
    if (mm.some((s) => ['紫微', '天府', '太陽', '七殺', '破軍'].includes(s)) || starsIn(gl).some((s) => ['天魁', '天鉞'].includes(s))) pos.push('適合擔任主管、領導或自行創業');
    if (mm.some((s) => ['天機', '天相', '天梁', '太陰', '天同'].includes(s))) pos.push('適合幕僚、企劃、專業技術或穩定的組織內發展');
    if (starsIn(qy).includes('天馬') || starsIn(ming).includes('天馬') || mainOf(qy).stars.some((s) => ['太陽', '天機', '七殺', '破軍'].includes(s))) pos.push('外出、跑外務或往外地發展較有利');
    if (pos.length) car.push(`<b>適合的位置：</b>${pos.join('；')}。`);
    car.push(`財帛宮${mainCb.borrowed ? '無主星，借福德宮的' + mainCb.stars.join('、') : '主星為' + brightTxt(cb, mainCb.stars)}：${mainCb.stars.map((s) => S[s].money).join('；')}。`);
    const cbSha = starsIn(cb).filter((s) => SHA.includes(s));
    if (cbSha.length) car.push(`財帛宮有${cbSha.join('、')}，${cbSha.some((s) => ['地空', '地劫'].includes(s)) ? '易有意外破財，不宜投機或替人作保' : '賺錢辛苦、競爭多'}。`);
    const careerBh = c.birthHua.filter((h) => [gl, cb, tz, ming].includes(h.to));
    careerBh.forEach((h) => car.push(`生年${huaTxt(h)}入${nm(h.to)}：${{ 祿: '此處有天生的福份與機會', 權: '此處有掌控力與企圖心', 科: '此處有名聲與貴人', 忌: '此處是一生的執著與課題，容易辛苦' }[h.hua]}。`));
    const cbJi = fly(cb, '忌'), glJi = fly(gl, '忌'), cbLu = fly(cb, '祿');
    let cbp = '<b>北派看法：</b>';
    if (cbJi.to === tz) cbp += '財帛宮化忌入田宅，財入庫，善於存錢、置產。';
    else if (cbJi.self) cbp += '財帛宮自化忌，錢財來去快，宜強迫儲蓄。';
    else if (cbJi.to === m12(tz + 6)) cbp += '財帛宮化忌沖田宅，存錢不易，宜購置不動產鎖住財富。';
    else cbp += `財帛宮化忌入${nm(cbJi.to)}，錢財多花在${PM[nameOf(cbJi.to)]}。`;
    cbp += `財帛宮化祿入${cbLu.self ? '本宮' : nm(cbLu.to)}；官祿宮化忌入${glJi.self ? '本宮（自化忌，工作容易換來換去或勞而少功）' : nm(glJi.to) + '，工作上最在意' + PM[nameOf(glJi.to)]}。`;
    if (glJi.to === m12(gl + 6) || glJi.to === P('夫妻')) cbp += '官祿忌沖本宮，事業容易有變動。';
    car.push(cbp);
    const tzMain = mainOf(tz).stars;
    car.push(`田宅宮（財庫、家業）主星${tzMain.join('、')}${starsIn(tz).includes('祿存') || birthHuaIn(tz).some((h) => h.hua === '祿') ? '，有祿，財庫豐厚，適合置產' : ''}${starsIn(tz).some((s) => ['地空', '地劫'].includes(s)) ? '，見空劫，財庫有漏，不宜過度借貸' : ''}；遷移宮主星${mainOf(qy).stars.join('、')}${starsIn(qy).some((s) => SHA.includes(s)) ? '，見煞，在外打拼較辛苦，出門注意安全' : '，在外發展機會不錯'}。`);
    const dxCar = c.daXian.filter((d) => d.end >= 18 && d.start <= 75).map((d) => {
      const h = stemHua(c, c.stems[d.zhi]); let sc = 0; const why = [];
      if (hit(h, [gl, cb, ming, d.zhi], '祿').length) { sc += 2; why.push('化祿入命財官'); }
      if (hit(h, [gl, ming], '權').length) { sc += 1; why.push('化權入命官'); }
      if (hit(h, [gl, cb], '忌').length) { sc -= 2; why.push('化忌入財官'); }
      if (hit(h, [m12(gl + 6), m12(cb + 6)], '忌').length) { sc -= 1; why.push('化忌沖財官'); }
      const jj = starsIn(d.zhi).filter((s) => JI_STARS.includes(s)).length - starsIn(d.zhi).filter((s) => SHA.includes(s)).length;
      sc += Math.sign(jj);
      return { d, sc, why, label: sc >= 2 ? '開創擴張期' : sc <= -2 ? '保守沉潛期' : '穩定累積期' };
    });
    car.push('<b>各大限事業節奏：</b><ul>' + dxCar.map((x) => `<li>${x.d.start}–${x.d.end}歲（${GAN[c.stems[x.d.zhi]]}${ZHI[x.d.zhi]}）：${x.label}${x.why.length ? '，' + x.why.join('、') : ''}</li>`).join('') + '</ul>');
    const carYears = [];
    for (let y = now; y <= now + 15; y++) {
      const Y = yearInfo(y); if (Y.age < 18) continue; let sc = 0; const why = [];
      if (hit(Y.hua, [gl], '祿').length) { sc += 2; why.push('流年化祿入官祿'); }
      if (hit(Y.hua, [cb], '祿').length) { sc += 2; why.push('流年化祿入財帛'); }
      if (hit(Y.hua, [gl, ming], '權').length) { sc += 1; why.push('流年化權入命官'); }
      if (hit(Y.hua, [gl], '科').length) { sc += 1; why.push('流年化科入官祿'); }
      if (hit(Y.hua, [gl, cb], '忌').length) { sc -= 2; why.push('流年化忌入財官'); }
      if (hit(Y.hua, [m12(gl + 6), m12(cb + 6)], '忌').length) { sc -= 2; why.push('流年化忌沖財官'); }
      if ([gl, cb].includes(Y.yang) || [gl, cb].includes(Y.tuo)) { sc -= 1; why.push('流年羊陀到財官'); }
      if (Y.xx === gl || Y.zhi === gl) { sc += 1; why.push('流年或小限到官祿'); }
      const tag = sc >= 3 ? (hit(Y.hua, [cb, ming], '祿').length && hit(Y.hua, [gl, ming, cb], '權').length ? '適合創業或擴張' : '適合轉職、升遷或爭取新機會') : sc <= -2 ? '宜沉著守成，不宜冒進或大額投資' : '';
      if (tag) carYears.push(`<li>${y}年（${yearGZ(y)}，${Y.age}歲）：<b>${tag}</b>，${why.join('、')}</li>`);
    }
    if (carYears.length) car.push(`<b>未來十五年重點年份：</b><ul>${carYears.join('')}</ul>`);
    car.push(`<b>需注意：</b>${[starsIn(gl).some((s) => SHA.includes(s)) ? '官祿宮見煞，職場競爭或人事摩擦多，宜培養專業護身' : '', starsIn(cb).some((s) => ['地空', '地劫'].includes(s)) || starsIn(cb).includes('擎羊') ? '理財避免投機、不替人作保' : '', mm.some((s) => ['破軍', '七殺', '貪狼'].includes(s)) ? '開創力強但容易衝太快，擴張前先評估現金流' : '', glJi.self ? '官祿自化忌，避免頻繁換工作' : ''].filter(Boolean).join('；') || '整體事業結構穩定，按部就班累積即可'}。`);

    // ---------- 4. 健康 ----------
    const jy = P('疾厄'), fm = P('父母');
    const hea = [];
    const mainJy = mainOf(jy);
    const organs = (list) => uniq(list.flatMap((s) => (ORGAN[s] || '').split('、')).filter(Boolean));
    const fem = (list) => gender === '女' && list.some((s) => FEMALE_ORGAN.includes(s)) ? ['婦科'] : [];
    hea.push(`疾厄宮${mainJy.borrowed ? '無主星，借父母宮的' + mainJy.stars.join('、') : '主星為' + brightTxt(jy, mainJy.stars)}，先天較需要注意：${[...organs(mainJy.stars), ...fem(mainJy.stars)].join('、')}。`);
    const jySha = [...starsIn(jy), ...yiIn(jy)].filter((s) => SHA_HEALTH[s]);
    if (jySha.length) hea.push(`疾厄宮有${jySha.join('、')}：${uniq(jySha.map((s) => SHA_HEALTH[s])).join('、')}需留意。`);
    const bhJy = birthHuaIn(jy);
    bhJy.forEach((h) => hea.push(`生年${huaTxt(h)}入疾厄：${h.hua === '忌' ? `${organs([h.star]).join('、')}是先天較弱的環節，宜定期檢查` : h.hua === '祿' ? '體質不錯，但容易因享受而發胖' : '身體狀況大致穩定'}。`));
    c.birthHua.filter((h) => h.hua === '忌').forEach((h) => { if (h.to !== jy) hea.push(`生年化忌星為${h.star}，對應${[...organs([h.star]), ...fem([h.star])].join('、')}，也是一生需要保養的部位。`); });
    const mentalSigns = [...starsIn(ming), ...starsIn(jy), ...starsIn(fd)].filter((s) => ['地空', '地劫', '鈴星'].includes(s));
    if (mentalSigns.length || birthHuaIn(fd).some((h) => h.hua === '忌')) hea.push('命宮、疾厄或福德宮帶空劫、鈴星或化忌，精神壓力與睡眠品質要多照顧，適度放鬆。');
    const jyJi = fly(jy, '忌');
    hea.push(`<b>北派看法：</b>疾厄宮化忌入${jyJi.self ? '本宮（自化忌，身體小毛病來得快也去得快，但要防累積）' : nm(jyJi.to) + '，身體狀況容易受' + PM[nameOf(jyJi.to)] + '影響'}。`);
    const heaYears = [];
    for (let y = now; y <= now + 15; y++) {
      const Y = yearInfo(y); let sc = 0; const why = [], st = [];
      const j = Y.hua.find((h) => h.hua === '忌');
      if (j.to === jy) { sc += 3; why.push(`流年${j.star}化忌入疾厄`); st.push(j.star); }
      if (j.to === fm) { sc += 2; why.push(`流年${j.star}化忌沖疾厄`); st.push(j.star); }
      if (j.to === Y.ln('疾厄')) { sc += 1; why.push('流年化忌入流年疾厄'); st.push(j.star); }
      if (Y.zhi === jy || Y.xx === jy) { sc += 1; why.push(Y.zhi === jy ? '流年命宮到疾厄' : '小限到疾厄'); st.push(...mainJy.stars); }
      if ([jy, Y.zhi].includes(Y.yang)) { sc += 1; why.push('流年擎羊到疾厄或命宮'); }
      if ([jy, Y.zhi].includes(Y.tuo)) { sc += 1; why.push('流年陀羅到疾厄或命宮'); }
      const dj = stemHua(c, c.stems[Y.dx.zhi]).find((h) => h.hua === '忌');
      if (dj.to === jy) { sc += 1; st.push(dj.star); }
      if (sc >= 3) {
        const parts = [...organs(st.length ? st : mainJy.stars), ...fem(st)];
        if ([jy, Y.zhi].includes(Y.yang)) parts.push('外傷開刀');
        heaYears.push(`<li>${y}年（${yearGZ(y)}，${Y.age}歲）：留意${uniq(parts).join('、')}（${why.join('、')}）</li>`);
      }
    }
    hea.push(heaYears.length ? `<b>未來十五年需特別注意的年份：</b><ul>${heaYears.join('')}</ul>` : '未來十五年沒有明顯的健康警訊年份，維持規律作息即可。');

    // ---------- 5. 家庭六親 ----------
    const xd = P('兄弟');
    const fam = [];
    const rel = (b, label) => {
      const m = mainOf(b), aux = starsIn(b).filter((s) => AUX[s]), bh = birthHuaIn(b);
      let t = `<b>${label}</b>（${nm(b)}，${m.borrowed ? '借' : ''}${m.stars.join('、')}）：${m.stars.map((s) => S[s].rel).join('；')}。`;
      if (aux.some((s) => JI_STARS.includes(s))) t += `有${aux.filter((s) => JI_STARS.includes(s)).join('、')}，彼此能互相幫助。`;
      if (aux.some((s) => SHA.includes(s))) t += `有${aux.filter((s) => SHA.includes(s)).join('、')}，相處較有摩擦或緣分較薄。`;
      bh.forEach((h) => { t += { 祿: `生年${huaTxt(h)}，緣分深厚、能得助益。`, 權: `生年${huaTxt(h)}，對方較強勢。`, 科: `生年${huaTxt(h)}，關係和睦、互相尊重。`, 忌: `生年${huaTxt(h)}，牽掛多、易有虧欠感，是一生的課題。` }[h.hua]; });
      const toMe = c.flights.find((f) => f.from === b && f.hua === '忌' && f.to === ming);
      const meTo = c.flights.find((f) => f.from === ming && f.hua === '忌' && f.to === b);
      if (toMe) t += '此宮化忌入命，對方對命主牽絆或要求較多。';
      if (meTo) t += '命宮化忌入此宮，命主很在意對方，常為其操心付出。';
      return t;
    };
    fam.push(rel(fm, '父母'));
    if (c.stars['太陽'] !== undefined && c.stars['太陰'] !== undefined) fam.push(`太陽（代表父親）${weak('太陽', c.stars['太陽']) ? '落陷，與父親緣分較薄或父親較辛勞' : '入廟旺，父親有能力、能照顧家庭'}；太陰（代表母親）${weak('太陰', c.stars['太陰']) ? '落陷，與母親相處需多體諒，母親較操勞' : '入廟旺，母親溫和、母緣佳'}。`);
    fam.push(rel(xd, '兄弟姊妹'));
    fam.push(rel(zn, '子女'));
    fam.push(rel(tz, '家庭氣氛'));
    fam.push(rel(fd, '祖德與遠房親戚'));
    const famYears = [];
    const ppl = [[fm, '父母長輩', P('疾厄')], [xd, '兄弟姊妹', P('交友')], [zn, '子女晚輩', tz]];
    for (let y = now; y <= now + 12; y++) {
      const Y = yearInfo(y); const j = Y.hua.find((h) => h.hua === '忌');
      ppl.forEach(([b, who, opp]) => {
        if (j.to === b || (b === fm && j.to === opp)) {
          let g = '';
          if (b === fm) g = j.star === '太陽' ? '，尤其是父親或男性長輩' : j.star === '太陰' ? '，尤其是母親或女性長輩' : '';
          famYears.push(`<li>${y}年（${yearGZ(y)}）：流年${j.star}化忌${j.to === b ? '入' : '沖'}${nm(b)}，${who}的健康或生活容易有較大變動${g}，可多關心生肖屬${SHENGXIAO[b]}或${SHENGXIAO[m12(b + 6)]}的家人。</li>`);
        }
      });
    }
    fam.push(famYears.length ? `<b>未來十二年家人需多關心的年份</b>（宮支論生肖為參考，非定論）：<ul>${famYears.join('')}</ul>` : '未來十二年家人方面沒有明顯的變動年份。');

    // ---------- 6. 人際 ----------
    const jyou = P('交友');
    const soc = [];
    const mainJ = mainOf(jyou);
    soc.push(`交友宮${mainJ.borrowed ? '無主星，借兄弟宮的' + mainJ.stars.join('、') : '主星為' + brightTxt(jyou, mainJ.stars)}：${mainJ.stars.map((s) => S[s].friend).join('；')}。`);
    const jAux = starsIn(jyou).filter((s) => AUX[s]);
    const goodF = jAux.filter((s) => JI_STARS.includes(s)), badF = jAux.filter((s) => SHA.includes(s));
    if (goodF.length) soc.push(`交友宮有${goodF.join('、')}，${goodF.some((s) => ['天魁', '天鉞'].includes(s)) ? '朋友中有貴人' : '朋友能提供助力'}，屬於益友多的格局。`);
    if (badF.length) soc.push(`交友宮有${badF.join('、')}，${badF.some((s) => ['地空', '地劫'].includes(s)) ? '與朋友有金錢往來易受損' : '朋友間易有競爭或口角'}，需防損友。`);
    birthHuaIn(jyou).forEach((h) => soc.push({ 祿: `生年${huaTxt(h)}入交友，人緣好，朋友能帶來好處。`, 權: `生年${huaTxt(h)}入交友，朋友較強勢，容易被朋友左右。`, 科: `生年${huaTxt(h)}入交友，朋友多為斯文有禮之人，有貴人相助。`, 忌: `生年${huaTxt(h)}入交友，對朋友付出多回報少，容易被拖累，借貸合夥要謹慎。` }[h.hua]));
    const jJi = fly(jyou, '忌'), jLu = fly(jyou, '祿');
    let sp = `<b>北派看法：</b>交友宮化祿入${jLu.self ? '本宮' : nm(jLu.to)}${jLu.to === ming ? '，朋友對命主有實質幫助（貴人）' : jLu.to === cb ? '，朋友能帶來財路' : ''}；化忌入${jJi.self ? '本宮（自化忌，朋友來來去去，交情不長久）' : nm(jJi.to)}`;
    if (jJi.to === ming) sp += '，朋友容易找命主麻煩或要求幫忙，要懂得拒絕';
    else if (jJi.to === cb) sp += '，容易因朋友破財，不宜借錢給人或合夥投資';
    else if (jJi.to === m12(ming + 6)) sp += '，忌沖命宮，需防小人暗中扯後腿';
    else if (jJi.to === gl) sp += '，工作上容易被同事或部屬拖累';
    sp += '。';
    soc.push(sp);
    const gr = uniq([c.stars['天魁'], c.stars['天鉞']]).map(dirOf);
    const kePos = c.birthHua.find((h) => h.hua === '科');
    soc.push(`<b>貴人方位：</b>${gr.join('、')}（天魁、天鉞所在）${kePos ? `，以及${dirOf(kePos.to)}（生年化科所在）` : ''}。`);
    const xr = uniq([jJi.self ? null : jJi.to, c.stars['擎羊'], c.stars['陀羅']].filter((x) => x !== null)).map(dirOf);
    soc.push(`<b>需防小人的方位：</b>${xr.join('、')}（交友化忌與羊陀所在）。`);
    const socYears = [];
    for (let y = now; y <= now + 12; y++) {
      const Y = yearInfo(y); const j = Y.hua.find((h) => h.hua === '忌'), l = Y.hua.find((h) => h.hua === '祿'), k = Y.hua.find((h) => h.hua === '科');
      if (j.to === jyou || j.to === xd) socYears.push(`<li>${y}年（${yearGZ(y)}）：流年化忌${j.to === jyou ? '入' : '沖'}交友宮，<b>需防損友、借貸或合夥糾紛</b>。</li>`);
      else if (l.to === jyou || k.to === jyou || [Y.zhi].includes(c.stars['天魁']) || [Y.zhi].includes(c.stars['天鉞'])) socYears.push(`<li>${y}年（${yearGZ(y)}）：${l.to === jyou ? '流年化祿入交友' : k.to === jyou ? '流年化科入交友' : '流年命宮遇魁鉞'}，<b>貴人運佳</b>，適合拓展人脈。</li>`);
    }
    if (socYears.length) soc.push(`<b>未來十二年人際重點年份：</b><ul>${socYears.join('')}</ul>`);

    return [
      { title: '個性分析', items: per },
      { title: '姻緣感情', items: love },
      { title: '事業財運', items: car },
      { title: '健康', items: hea },
      { title: '家庭六親', items: fam },
      { title: '人際關係', items: soc },
    ];
  }

  const api = { analyze };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.ZWA = api;
})(this);
