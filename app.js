/* ============================================================
 *  app.js —— 奥术档案室 · 渲染 / 路由 / 编辑逻辑
 * ============================================================ */

window.ARCHIVE_DATA = {
  meta: {
    title: "奥术统合局 · 档案室",
    subtitle: "ARCANE CHRONICLE ARCHIVE",
    stamp: "机密",
    footer: "奥术统合局档案科 · 整理",
    intro: "以下为奥术统合局近年重大事件的归档记录。点击时间轴上的档案袋可查阅事件全文；正文中标蓝的人名可跳转至对应人物档案。"
  },

  factions: {
    "星象科": { color: "#6ab0ff", bg: "rgba(106,176,255,0.1)" },
    "学生会": { color: "#c9a227", bg: "rgba(201,162,39,0.1)" },
    "图书委员会": { color: "#b084ff", bg: "rgba(176,132,255,0.1)" },
    "风纪委员会": { color: "#2ecc71", bg: "rgba(46,204,113,0.1)" },
    "无": { color: "#8b92a8", bg: "rgba(139,146,168,0.08)" }
  },

  characters: [
    {
      id: "lian",
      name: "莉安 · 维尔特",
      alias: "「黑猫的端水人」",
      level: "机密",
      relations: [
        { id: "cedric", name: "塞德里克 · 奥伯龙", rel: "温室事件里替她揽下全部处分的人" },
        { id: "edgar", name: "埃德加 · 灰羽", rel: "唯一在「看穿她」和「放过她」之间摇摆的大人" },
        { id: "vivian", name: "薇薇安 · 罗严塔尔", rel: "禁书区里隔着一排书架对视过的人" }
      ],
      timeline: [
        { period: "学院历114年·萌芽月", location: "苍曜学院·礼堂", faction: "星象科" },
        { period: "学院历114年·花月", location: "苍曜学院·第三温室", faction: "星象科" },
        { period: "学院历114年·炎月", location: "苍曜学院·竞技场", faction: "星象科" },
        { period: "学院历115年·霜月", location: "苍曜学院·图书馆", faction: "星象科" },
        { period: "学院历115年·星辉月", location: "苍曜学院·钟楼", faction: "星象科" }
      ],
      fields: [
        { k: "身份", v: "苍曜学院一年级 · 星象科" },
        { k: "外貌", v: "黑色短发，湖蓝色眼睛，身形娇小" },
        { k: "能力", v: "非魔法性的过度共情；极其敏锐的察言观色与心理分析" },
        { k: "家族", v: "长野出身，中产家庭；母系血缘复杂（详见附录[[x:第柒号附件]]）" },
        { k: "备注", v: "五岁起便懂得在家中「端水」。深知自身外貌优势，会示弱以换取庇护。" }
      ],
      bio: "莉安给人的第一印象永远是柔软的：娇小的个子，微微下垂的眼角，笑起来像是没有半点防备。\n\n但负责面试的 [[c:edgar|埃德加教授]] 在评语栏里写下了一句话——「她看我的时候，像在翻一本她已经读完的书。」\n\n她帮助他人的动机并非善良。更准确地说，她在每一个陷入困境的人身上，看见的是[[x:过去的自己]]。共情对她而言不是天赋，是旧伤。\n\n「我没事的。」——这是她说过最多次的谎。"
    },
    {
      id: "cedric",
      name: "塞德里克 · 奥伯龙",
      alias: "「白银的学生会长」",
      level: "内部",
      relations: [
        { id: "lian", name: "莉安 · 维尔特", rel: "他第一次违背「正确」的理由" }
      ],
      timeline: [
        { period: "学院历114年·花月", location: "苍曜学院·第三温室", faction: "学生会" },
        { period: "学院历114年·炎月", location: "苍曜学院·竞技场", faction: "学生会" },
        { period: "学院历115年·星辉月", location: "苍曜学院·钟楼", faction: "学生会" }
      ],
      fields: [
        { k: "身份", v: "苍曜学院三年级 · 学生会会长" },
        { k: "家世", v: "奥伯龙侯爵家嫡子" },
        { k: "擅长", v: "光系魔术、谈判、把责任全部揽到自己身上" }
      ],
      bio: "永远挺直的脊背，永远扣到最上面一颗的制服纽扣。塞德里克是「正确」的代名词。\n\n只有极少数人知道，他的右手手套下面藏着什么。关于此事的记录已被[[x:风纪委员会封存]]。\n\n在 [[e:tournament|魔导竞技大会骚动]] 中，他第一次在学生面前失态。"
    },
    {
      id: "vivian",
      name: "薇薇安 · 罗严塔尔",
      alias: "「禁书区的守夜人」",
      level: "内部",
      relations: [
        { id: "lian", name: "莉安 · 维尔特", rel: "留下红茶与字条的人" }
      ],
      timeline: [
        { period: "学院历114年·萌芽月", location: "苍曜学院·图书馆", faction: "图书委员会" },
        { period: "学院历115年·霜月", location: "苍曜学院·图书馆", faction: "图书委员会" },
        { period: "学院历115年·星辉月", location: "苍曜学院·钟楼", faction: "图书委员会" }
      ],
      fields: [
        { k: "身份", v: "苍曜学院二年级 · 图书委员长" },
        { k: "擅长", v: "古代语解读、结界魔术" },
        { k: "习性", v: "入夜后必定出现在图书馆禁书区" }
      ],
      bio: "薇薇安掌管着图书馆地下三层的钥匙。她说那是因为「老师信得过我」。\n\n事实上，禁书区的结界每个满月都会减弱一次，而她从没向任何人报告过这件事。原因参见 [[e:library-theft|禁书区失窃事件]]。"
    },
    {
      id: "edgar",
      name: "埃德加 · 灰羽",
      alias: "「不提问的教授」",
      level: "公开",
      relations: [
        { id: "lian", name: "莉安 · 维尔特", rel: "抽屉里那份未提交报告的对象" }
      ],
      timeline: [
        { period: "学院历114年·萌芽月", location: "苍曜学院·礼堂", faction: "星象科" },
        { period: "学院历114年·炎月", location: "苍曜学院·竞技场", faction: "星象科" },
        { period: "学院历115年·星辉月", location: "苍曜学院·钟楼", faction: "星象科" }
      ],
      fields: [
        { k: "身份", v: "星象科教授 · 莉安的指导教员" },
        { k: "特征", v: "灰色长外套，口袋里永远有糖" },
        { k: "备注", v: "全校唯一注意到莉安「没有过去记录」的人" }
      ],
      bio: "埃德加教授从不在课堂上点名，因为他开学第一周就记住了所有人的名字——以及他们说谎时的小动作。\n\n他办公室的抽屉里锁着一份从未提交的报告，报告对象是 [[c:lian|莉安·维尔特]]。"
    }
  ],

  events: [
    {
      id: "entrance", order: 1, date: "学院历 114年 · 萌芽月",
      title: "入学式 · 没有掌声的新生",
      summary: "莉安·维尔特以首席成绩入学。入学式上，她一个人坐在礼堂最后一排。",
      level: "公开", tags: ["入学", "莉安"], chars: ["lian", "edgar"],
      versions: [{
        title: "入学式 · 没有掌声的新生",
        article: "苍曜学院的入学式有个传统：新生按成绩顺序入场，首席将获得全场起立鼓掌的荣誉。\n\n那一年，念到「[[c:lian|莉安·维尔特]]」时，走上台的少女微微鞠了一躬，台下掌声雷动——而她本人，在掌声响起之前就已经走到了最后一排的空位上，把自己塞进了礼堂的阴影里。\n\n担任司会的 [[c:edgar|埃德加教授]] 事后在记录册边缘写下一行小字：「她不是害羞。她是在确认所有出口的位置。」\n\n这是档案室关于她的第一条记录。",
        isDefault: true
      }]
    },
    {
      id: "greenhouse", order: 2, date: "学院历 114年 · 花月",
      title: "温室的深夜谈话",
      summary: "温室玻璃碎裂事件的善后记录。没有处罚，只有一盆被修好的白玫瑰。",
      level: "内部", tags: ["温室", "莉安", "塞德里克"], chars: ["lian", "cedric"],
      versions: [
        {
          title: "温室的深夜谈话（正式记录）",
          article: "花月十七日夜，第三温室的一面玻璃被发现碎裂。值夜记录显示，当晚温室中有两个人：学生会长 [[c:cedric|塞德里克·奥伯龙]]，与一年级生 [[c:lian|莉安·维尔特]]。\n\n按校规，夜间滞留温室者处以停学三日。但次日的风纪报告上，塞德里克以「执行会长巡查」为由，将责任全部归于自己名下。\n\n没有人知道那晚他们谈了什么。温室管理员只作证了一件事：天亮之前，那个一年级的女孩蹲在碎玻璃中间，把一株被压坏的白玫瑰重新扶回了土里。\n\n「花修好了。」管理员在记录末尾写道，「碎掉的玻璃也是她一片一片捡干净的。手破了。」",
          isDefault: true
        },
        {
          title: "温室的深夜谈话（草稿版 · 塞德里克视角）",
          article: "「你为什么要来这里？」我问那个蹲在碎玻璃里的女孩。\n\n她没有抬头。「因为花要死了。」\n\n那不是答案。但我没有追问。\n\n（此版本尚未归档，仅供创作参考）",
          isDefault: false
        }
      ]
    },
    {
      id: "tournament", order: 3, date: "学院历 114年 · 炎月",
      title: "魔导竞技大会骚动",
      summary: "竞技大会决赛中发生魔力暴走。学生会长首次当众失态，原因被隐瞒。",
      level: "机密", tags: ["竞技大会", "塞德里克", "魔力暴走"], chars: ["cedric", "lian", "edgar"],
      versions: [{
        title: "魔导竞技大会骚动",
        article: "炎月的魔导竞技大会是学院年度盛事。决赛进行到第三轮时，场中突然发生大规模魔力暴走，防护结界出现七处裂缝。\n\n官方记录称暴走原因为「场地魔导炉过载」。但 [[c:edgar|埃德加教授]] 的私人观测笔记提供了另一个版本：暴走源位于观众席，而非场内。\n\n更令人在意的是 [[c:cedric|塞德里克]] 的反应。监控水晶记录显示，暴发生成的瞬间，他没有看向场中——他看向的是观众席第三排，脸色惨白。\n\n第三排坐着的，是[[x:莉安·维尔特]]。\n\n事后处理：场地修复，无人员伤亡。关于观众席的全部问询记录被移交[[x:学院理事会]]封存。",
        isDefault: true
      }]
    },
    {
      id: "library-theft", order: 4, date: "学院历 115年 · 霜月",
      title: "禁书区失窃事件",
      summary: "地下三层禁书区失窃，失物为《无名氏忏悔录》抄本。结界无破坏痕迹。",
      level: "绝密", tags: ["禁书区", "失窃", "薇薇安"], chars: ["vivian", "lian"],
      versions: [{
        title: "禁书区失窃事件",
        article: "霜月初三，图书委员长 [[c:vivian|薇薇安·罗严塔尔]] 报告：禁书区地下三层失窃，失物为《无名氏忏悔录》抄本一册。\n\n匪夷所思的是，七重结界无一被破坏。失窃当晚的钥匙记录完整，薇薇安本人整夜待在图书馆——她声称「什么都没听见」。\n\n风纪委员会调查了一个月，一无所获，案件被标记为「悬置」。\n\n未被记入卷宗的细节有两个：其一，失窃前一周，有人看见 [[c:lian|莉安]] 频繁出入图书馆的普通阅览区，借阅记录却全是无关紧要的星象图册；其二，失窃次日清晨，薇薇安办公桌上多了一杯还温着的红茶，和一张字条。\n\n字条上只有一句话：[[x:「书我借走了。你不必再守着它惩罚自己了。」]]",
        isDefault: true
      }]
    },
    {
      id: "starlight", order: 5, date: "学院历 115年 · 星辉月",
      title: "星辉祭 · 钟楼顶上的两个人",
      summary: "星辉祭当夜，钟楼结界被从内部解除十分钟。监控水晶恰好「故障」。",
      level: "机密", tags: ["星辉祭", "莉安"], chars: ["lian", "cedric", "edgar", "vivian"],
      versions: [{
        title: "星辉祭 · 钟楼顶上的两个人",
        article: "星辉祭是学院最古老的祭典。当夜零时，全院灯光熄灭，只余星象科点燃的星灯升空。\n\n本年度的记录中出现了一段空白：二十三时五十分至零时整，中央钟楼的结界被从内部解除，时长十分钟。负责监控的水晶「恰好」发生故障，没有留下任何影像。\n\n能解除钟楼结界的只有四个人：[[c:edgar|埃德加教授]]、[[c:cedric|学生会长]]、[[c:vivian|图书委员长]]，以及——理论上不存在权限的——[[x:莉安·维尔特]]。\n\n零时整，星灯照常升空。有学生在地面证言：「钟楼顶上有两个人影。其中一个好像……在哭。另一个只是把外套披了过去，什么都没说。」\n\n第二天，莉安照常出现在课堂上，笑着说她昨晚睡得很早。\n\n本卷宗至此暂无后续。档案科备注：[[x:「有些事件不需要结论。留档即可。」]]",
        isDefault: true
      }]
    }
  ]
};

(function () {
  "use strict";
  var LS_DATA = "arcane_archive_v3";
  var LS_EDIT = "arcane_edit_mode";
  var app = document.getElementById("app");

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function loadData() {
    try {
      var raw = localStorage.getItem(LS_DATA);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return clone(window.ARCHIVE_DATA);
  }

  function persist() { localStorage.setItem(LS_DATA, JSON.stringify(data)); }
  var data = loadData();

  function isEdit() { return localStorage.getItem(LS_EDIT) === "1"; }
  function setEdit(on) {
    if (on) localStorage.setItem(LS_EDIT, "1");
    else localStorage.removeItem(LS_EDIT);
    document.getElementById("edit-toolbar").hidden = !on;
    document.getElementById("edit-toggle").classList.toggle("active", on);
    document.body.classList.toggle("editing", on);
  }

  function findEvent(id) { return data.events.find(function (e) { return e.id === id; }); }
  function findChar(id) { return data.characters.find(function (c) { return c.id === id; }); }

  function normalizeColons(text) {
    if (!text) return text;
    return String(text)
      .replace(/\[\[x\uff1a/g, '[[x:')
      .replace(/\[\[c\uff1a/g, '[[c:')
      .replace(/\[\[e\uff1a/g, '[[e:');
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function renderInline(text) {
    var out = esc(text);
    out = out.replace(/\[\[c[:\uff1a]([^\]|]+)\|([^\]]+)\]\]/g, function (m, id, label) {
      var exists = findChar(id.trim());
      return '<a class="chip chip-char" href="#/char/' + encodeURIComponent(id.trim()) + '">' + esc(label) + (exists ? "" : " ⚠") + "</a>";
    });
    out = out.replace(/\[\[e[:\uff1a]([^\]|]+)\|([^\]]+)\]\]/g, function (m, id, label) {
      var exists = findEvent(id.trim());
      return '<a class="chip chip-event" href="#/event/' + encodeURIComponent(id.trim()) + '">' + esc(label) + (exists ? "" : " ⚠") + "</a>";
    });
    out = out.replace(/\[\[x[:\uff1a]([^\]]+)\]\]/g, function (m, secret) {
      return '<span class="redact" title="悬停查看">' + esc(secret) + "</span>";
    });
    return out;
  }

  function renderArticle(text) {
    if (!text) return "";
    return text.split(/\n\s*\n/).map(function (p) {
      return "<p>" + renderInline(p.trim()).replace(/\n/g, "<br>") + "</p>";
    }).join("");
  }

  function stampHTML(level) {
    var lv = level || "公开";
    return '<span class="stamp stamp-' + esc(lv) + '">' + esc(lv) + "</span>";
  }

  function avatarHTML(c) {
    var initial = (c.name || "?").replace(/[\s·・]/g, "").charAt(0);
    return '<div class="portrait"><span>' + esc(initial) + '</span><i>PHOTO<br>NOT AVAILABLE</i></div>';
  }

  /* ==================== 时间轴 ==================== */
  var filterTag = null, filterChar = null, searchQ = "";

  function allTags() {
    var s = [];
    data.events.forEach(function (e) { (e.tags || []).forEach(function (t) { if (s.indexOf(t) < 0) s.push(t); }); });
    return s;
  }

  function renderTimeline() {
    var meta = data.meta;
    var events = clone(data.events).sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    var filtered = events.filter(function (e) {
      if (filterTag && (e.tags || []).indexOf(filterTag) < 0) return false;
      if (filterChar && (e.chars || []).indexOf(filterChar) < 0) return false;
      if (searchQ) {
        var hay = (e.title + " " + e.summary + " " + e.date).toLowerCase();
        if (hay.indexOf(searchQ.toLowerCase()) < 0) return false;
      }
      return true;
    });

    var html = '<section class="intro paper">';
    html += '<div class="intro-head"><span class="file-no">' + esc(meta.fileNo || "卷宗编号 · A-114") + '</span>' + stampHTML(meta.stamp) + '</div>';
    html += '<h1 class="intro-title">' + esc(meta.title) + '</h1>';
    html += '<p class="intro-text">' + renderInline(meta.intro || "") + '</p>';
    html += '<div class="filter-bar">';
    html += '<input id="search" class="search" placeholder="检索事件标题 / 摘要…" value="' + esc(searchQ) + '">';
    html += '<div class="filter-row"><span class="filter-label">标签</span>';
    allTags().forEach(function (t) {
      html += '<button class="filter-chip' + (filterTag === t ? " on" : "") + '" data-tag="' + esc(t) + '">' + esc(t) + '</button>';
    });
    html += '</div><div class="filter-row"><span class="filter-label">人物</span>';
    data.characters.forEach(function (c) {
      html += '<button class="filter-chip' + (filterChar === c.id ? " on" : "") + '" data-char="' + esc(c.id) + '">' + esc(c.name) + '</button>';
    });
    html += '</div></div></section>';

    html += '<section class="timeline">';
    if (!filtered.length) html += '<div class="empty paper">没有符合条件的卷宗。</div>';
    filtered.forEach(function (e, i) {
      html += '<article class="tl-item ' + (i % 2 ? "right" : "left") + '">';
      html += '<div class="tl-pin"></div>';
      html += '<div class="folder">';
      html += '<a class="folder-body paper" href="#/event/' + encodeURIComponent(e.id) + '">';
      html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:8px;"><span class="folder-date">' + esc(e.date) + '</span>' + stampHTML(e.level) + '</div>';
      html += '<h2 class="folder-title">' + esc(e.title) + '</h2>';
      html += '<p class="folder-summary">' + renderInline(e.summary) + '</p>';
      if ((e.versions || []).length > 1) html += '<span style="font-size:11px;color:var(--cyan);margin-top:8px;display:inline-block;">📄 ' + e.versions.length + ' 个版本</span>';
      html += '</a>';
      if (isEdit()) {
        html += '<div style="position:absolute;top:8px;right:8px;display:flex;gap:6px;z-index:3;">' +
          '<button class="mini-btn" data-edit-event="' + esc(e.id) + '">编辑</button>' +
          '<button class="mini-btn danger" data-del-event="' + esc(e.id) + '">删除</button></div>';
      }
      html += '</div></article>';
    });
    html += '</section>';
    if (isEdit()) html += '<div class="add-row"><button class="mini-btn add" data-add-event>＋ 新增事件卷宗</button></div>';
    app.innerHTML = html;
    bindTimeline();
  }

  function bindTimeline() {
    var s = document.getElementById("search");
    if (s) s.addEventListener("input", function () { searchQ = s.value; renderTimeline(); });
    app.querySelectorAll("[data-tag]").forEach(function (b) {
      b.addEventListener("click", function () { filterTag = filterTag === b.dataset.tag ? null : b.dataset.tag; renderTimeline(); });
    });
    app.querySelectorAll("[data-char]").forEach(function (b) {
      b.addEventListener("click", function () { filterChar = filterChar === b.dataset.char ? null : b.dataset.char; renderTimeline(); });
    });
    app.querySelectorAll("[data-edit-event]").forEach(function (b) {
      b.addEventListener("click", function () { showEventForm(b.dataset.editEvent); });
    });
    app.querySelectorAll("[data-del-event]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (confirm("确认删除该事件卷宗？")) {
          data.events = data.events.filter(function (e) { return e.id !== b.dataset.delEvent; });
          persist(); renderTimeline();
        }
      });
    });
    var add = app.querySelector("[data-add-event]");
    if (add) add.addEventListener("click", function () { showEventForm(null); });
  }

  /* ==================== 人物总览 ==================== */
  function renderChars() {
    var html = '<section class="intro paper"><div class="intro-head"><span class="file-no">卷宗编号 · P-000</span>' + stampHTML("人员名册") + '</div><h1 class="intro-title">人物档案索引</h1><p class="intro-text">以下人员的详细档案已归档。点击档案卡查阅全文。</p></section>';
    html += '<section style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:28px;">';
    data.characters.forEach(function (c) {
      html += '<div style="position:relative;">';
      html += '<a class="paper" href="#/char/' + encodeURIComponent(c.id) + '" style="display:flex;gap:18px;padding:24px 22px 20px;text-decoration:none;color:inherit;">';
      html += '<div style="flex:none;width:88px;height:108px;transform:rotate(-1deg);background:linear-gradient(160deg,#1e2740,#141b2e);border:4px solid var(--panel-hi);outline:1px solid var(--gold-dim);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;"><span style="font-size:34px;font-weight:700;color:var(--ink-soft);">' + (c.name || "?").replace(/[\s·・]/g, "").charAt(0) + '</span><i style="font-family:var(--font-mono);font-style:normal;font-size:7px;letter-spacing:1px;color:var(--ink-faint);text-align:center;">PHOTO<br>NOT AVAILABLE</i></div>';
      html += '<div style="flex:1;min-width:0;display:flex;flex-direction:column;">';
      html += '<div style="font-size:19px;font-weight:700;letter-spacing:1.5px;">' + esc(c.name) + '</div>';
      if (c.alias) html += '<div style="font-family:var(--font-hei);font-size:12px;color:var(--red);margin:2px 0 8px;">' + esc(c.alias) + '</div>';
      var first = (c.fields || [])[0];
      if (first) html += '<div style="font-size:13px;color:var(--ink-soft);">' + esc(first.k) + '：' + esc(first.v) + '</div>';
      html += '<div style="margin-top:auto;padding-top:10px;display:flex;justify-content:space-between;align-items:flex-end;">' + stampHTML(c.level) + '<span style="color:var(--cyan);font-family:var(--font-hei);font-size:12px;letter-spacing:3px;">调阅 →</span></div>';
      html += '</div></a>';
      if (isEdit()) {
        html += '<div style="position:absolute;top:8px;right:8px;display:flex;gap:6px;z-index:3;">' +
          '<button class="mini-btn" data-edit-char="' + esc(c.id) + '">编辑</button>' +
          '<button class="mini-btn danger" data-del-char="' + esc(c.id) + '">删除</button></div>';
      }
      html += '</div>';
    });
    html += '</section>';
    if (isEdit()) html += '<div class="add-row"><button class="mini-btn add" data-add-char>＋ 新增人物档案</button></div>';
    app.innerHTML = html;

    app.querySelectorAll("[data-edit-char]").forEach(function (b) {
      b.addEventListener("click", function () { showCharForm(b.dataset.editChar); });
    });
    app.querySelectorAll("[data-del-char]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (confirm("确认删除该人物档案？")) {
          data.characters = data.characters.filter(function (c) { return c.id !== b.dataset.delChar; });
          data.events.forEach(function (e) { e.chars = (e.chars || []).filter(function (id) { return id !== b.dataset.delChar; }); });
          persist(); renderChars();
        }
      });
    });
    var add = app.querySelector("[data-add-char]");
    if (add) add.addEventListener("click", function () { showCharForm(null); });
  }

  /* ==================== 事件详情（多版本） ==================== */
  function renderEvent(id) {
    var e = findEvent(id);
    if (!e) { app.innerHTML = '<div class="empty paper">卷宗不存在。<a href="#/">返回时间轴</a></div>'; return; }

    var sorted = clone(data.events).sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    var idx = sorted.findIndex(function (x) { return x.id === id; });
    var prev = sorted[idx - 1], next = sorted[idx + 1];
    var versions = e.versions && e.versions.length ? e.versions : [{ title: e.title, article: e.article || "", isDefault: true }];
    var activeIndex = 0;
    versions.forEach(function (v, i) { if (v.isDefault) activeIndex = i; });

    var html = '<div class="back-row"><a class="back-link" href="#/">← 返回时间轴</a>'
      + (isEdit() ? '<button class="mini-btn" data-edit-event="' + esc(e.id) + '">编辑此卷宗</button>' : "") + '</div>';

    html += '<section class="paper dossier">';
    html += '<div class="punch-holes" aria-hidden="true"><i></i><i></i><i></i></div>';
    html += '<header class="dossier-head">';
    html += '<div class="dossier-meta-top"><span class="file-no">卷宗编号 · E-' + String(e.order || 0).padStart(3, "0") + '</span>' + stampHTML(e.level) + '</div>';
    html += '<h1 class="dossier-title">' + esc(e.title) + '</h1>';
    html += '<div class="dossier-date">记录日期：' + esc(e.date) + '</div>';
    html += '</header>';

    if (versions.length > 1 || isEdit()) {
      html += '<div class="version-tabs">';
      versions.forEach(function (v, i) {
        html += '<button class="version-tab' + (i === activeIndex ? ' active' : '') + '" data-vidx="' + i + '">' + esc(v.title)
          + (v.isDefault ? '<span class="v-default">●</span>' : '') + '</button>';
      });
      if (isEdit()) html += '<button class="mini-btn add" data-add-version style="margin-left:auto;border:none;background:transparent;color:var(--cyan);font-size:11px;">＋ 新增版本</button>';
      html += '</div>';
    }

    var v = versions[activeIndex];
    html += '<div id="version-body"><div class="article">' + renderArticle(v.article) + '</div></div>';

    if ((e.chars || []).length) {
      html += '<div style="margin-top:20px;padding-top:16px;border-top:1px dashed rgba(201,162,39,0.2);"><span style="font-family:var(--font-hei);font-size:13px;letter-spacing:4px;color:var(--ink-soft);">相关人员</span><div style="margin-top:10px;">';
      e.chars.forEach(function (cid) {
        var c = findChar(cid);
        html += '<a class="chip chip-char" href="#/char/' + encodeURIComponent(cid) + '">' + esc(c ? c.name : cid) + '</a> ';
      });
      html += '</div></div>';
    }

    html += '<div class="dossier-sign">—— 档案科 · 整理完毕 ——</div>';
    html += '</section>';

    html += '<nav class="prev-next">';
    html += prev ? '<a href="#/event/' + encodeURIComponent(prev.id) + '">← ' + esc(prev.title) + '</a>' : '<span></span>';
    html += next ? '<a href="#/event/' + encodeURIComponent(next.id) + '">' + esc(next.title) + ' →</a>' : '<span></span>';
    html += '</nav>';

    app.innerHTML = html;

    app.querySelectorAll('.version-tab[data-vidx]').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var idx = parseInt(tab.dataset.vidx);
        app.querySelectorAll('.version-tab').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        app.querySelector('#version-body').innerHTML = '<div class="article">' + renderArticle(versions[idx].article) + '</div>';
      });
    });

    var b = app.querySelector("[data-edit-event]");
    if (b) b.addEventListener("click", function () { showEventForm(e.id); });
    var av = app.querySelector("[data-add-version]");
    if (av) av.addEventListener("click", function () { showVersionForm(e.id); });
  }

  /* ==================== 人物详情 ==================== */
  function renderChar(id) {
    var c = findChar(id);
    if (!c) { app.innerHTML = '<div class="empty paper">档案不存在。<a href="#/chars">返回人物索引</a></div>'; return; }

    var related = data.events.filter(function (e) { return (e.chars || []).indexOf(id) >= 0; })
      .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });

    var html = '<div class="back-row"><a class="back-link" href="#/chars">← 返回人物索引</a>'
      + (isEdit() ? '<button class="mini-btn" data-edit-char="' + esc(c.id) + '">编辑此档案</button>' : "") + '</div>';

    html += '<section class="paper dossier">';
    html += '<div class="punch-holes" aria-hidden="true"><i></i><i></i><i></i></div>';
    html += '<header class="dossier-head" style="display:flex;gap:26px;align-items:flex-start;">';
    html += '<div style="flex:none;width:108px;height:132px;transform:rotate(-1.5deg);background:linear-gradient(160deg,#1e2740,#141b2e);border:6px solid var(--panel-hi);outline:1px solid var(--gold-dim);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;"><span style="font-size:44px;font-weight:700;color:var(--ink-soft);">' + (c.name || "?").replace(/[\s·・]/g, "").charAt(0) + '</span><i style="font-family:var(--font-mono);font-style:normal;font-size:8px;letter-spacing:2px;color:var(--ink-faint);text-align:center;line-height:1.6;">PHOTO<br>NOT AVAILABLE</i></div>';
    html += '<div style="flex:1;min-width:0;">';
    html += '<div class="dossier-meta-top"><span class="file-no">人员编号 · ' + esc(c.id.toUpperCase()) + '</span>' + stampHTML(c.level) + '</div>';
    html += '<h1 class="dossier-title">' + esc(c.name) + '</h1>';
    if (c.alias) html += '<div class="dossier-date">' + esc(c.alias) + '</div>';
    html += '</div></header>';

    if ((c.fields || []).length) {
      html += '<dl class="meta-table">';
      c.fields.forEach(function (f) { html += '<dt>' + esc(f.k) + '</dt><dd>' + renderInline(f.v) + '</dd>'; });
      html += '</dl>';
    }

    if ((c.timeline || []).length) {
      html += '<h3 style="margin-top:24px;padding-top:14px;border-top:1px dashed rgba(201,162,39,0.2);font-family:var(--font-hei);font-size:13px;letter-spacing:4px;color:var(--ink-soft);">时空足迹</h3>';
      html += '<div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:8px;">';
      c.timeline.forEach(function (t) {
        var fc = (data.factions && data.factions[t.faction]) ? data.factions[t.faction].color : "var(--gold)";
        html += '<span style="display:inline-block;padding:4px 10px;border:1px solid rgba(201,162,39,0.2);font-size:12px;font-family:var(--font-hei);">';
        html += '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + fc + ';margin-right:6px;box-shadow:0 0 6px ' + fc + ';"></span>';
        html += esc(t.period) + ' · ' + esc(t.location);
        html += '</span>';
      });
      html += '</div>';
    }

    html += '<div class="article">' + renderArticle(c.bio) + '</div>';

    if ((c.relations || []).length) {
      html += '<h3 style="margin-top:30px;padding-top:16px;border-top:1px dashed rgba(201,162,39,0.2);font-family:var(--font-hei);font-size:13px;letter-spacing:4px;color:var(--ink-soft);">关联人物</h3><ul style="list-style:none;margin-top:12px;">';
      c.relations.forEach(function (r) {
        var target = r.id ? findChar(r.id) : null;
        var nameHtml = target
          ? '<a class="chip chip-char" href="#/char/' + encodeURIComponent(target.id) + '">' + esc(r.name || target.name) + '</a>'
          : '<span style="font-weight:700;letter-spacing:1px;">' + esc(r.name || "（未署名）") + '</span>';
        html += '<li style="display:flex;align-items:baseline;gap:12px;padding:7px 0;border-bottom:1px dotted rgba(201,162,39,0.15);font-size:14px;"><span style="flex:none;min-width:132px;">' + nameHtml + '</span><span style="color:var(--ink-soft);font-size:14px;line-height:1.8;">' + renderInline(r.rel || "") + '</span></li>';
      });
      html += '</ul>';
    }

    if (related.length) {
      html += '<h3 style="margin-top:30px;padding-top:16px;border-top:1px dashed rgba(201,162,39,0.2);font-family:var(--font-hei);font-size:13px;letter-spacing:4px;color:var(--ink-soft);">相关卷宗</h3><ul style="list-style:none;margin-top:12px;">';
      related.forEach(function (e) {
        html += '<li style="display:flex;align-items:baseline;gap:12px;padding:7px 0;border-bottom:1px dotted rgba(201,162,39,0.15);font-size:14px;"><span style="font-family:var(--font-mono);font-size:12px;letter-spacing:2px;color:var(--ink-faint);">' + esc(e.date) + '</span><a class="chip chip-event" href="#/event/' + encodeURIComponent(e.id) + '">' + esc(e.title) + '</a></li>';
      });
      html += '</ul>';
    }
    html += '<div class="dossier-sign">—— 档案科 · 整理完毕 ——</div>';
    html += '</section>';

    app.innerHTML = html;
    var b = app.querySelector("[data-edit-char]");
    if (b) b.addEventListener("click", function () { showCharForm(c.id); });
  }

  /* ==================== 关系图谱 ==================== */
  function renderNetwork() {
    var html = '<section class="intro paper">';
    html += '<div class="intro-head"><span class="file-no">卷宗编号 · N-000</span>' + stampHTML("内部资料") + '</div>';
    html += '<h1 class="intro-title">人物关系图谱</h1>';
    html += '<p class="intro-text">同一底色框内为同一阵营。实线为直接关联，虚线为事件间接关联。点击节点调阅档案。</p>';
    html += '</section>';
    html += '<section class="paper" style="padding:20px;"><div id="net-canvas" class="net-canvas"></div></section>';
    app.innerHTML = html;
    drawNetwork(document.getElementById('net-canvas'));
  }

  function drawNetwork(container) {
    var width = container.clientWidth;
    var height = container.clientHeight || 600;
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "net-svg");
    svg.setAttribute("viewBox", "0 0 " + width + " " + height);

    var factions = {};
    data.characters.forEach(function (c) {
      var f = (c.timeline && c.timeline[0]) ? c.timeline[0].faction : "无";
      if (!factions[f]) factions[f] = [];
      factions[f].push(c);
    });

    var factionNames = Object.keys(factions);
    var cols = Math.min(factionNames.length, 3);
    var colW = width / cols;
    var nodePositions = {};

    factionNames.forEach(function (fname, fi) {
      var members = factions[fname];
      var cx = (fi % cols) * colW + colW / 2;
      var fcolor = (data.factions && data.factions[fname]) ? data.factions[fname].color : "#8b92a8";
      var fbg = (data.factions && data.factions[fname]) ? data.factions[fname].bg : "rgba(139,146,168,0.08)";

      var rect = document.createElementNS(svgNS, "rect");
      rect.setAttribute("x", cx - colW / 2 + 10);
      rect.setAttribute("y", 20);
      rect.setAttribute("width", colW - 20);
      rect.setAttribute("height", height - 40);
      rect.setAttribute("fill", fbg);
      rect.setAttribute("stroke", fcolor);
      rect.setAttribute("stroke-width", "1.5");
      rect.setAttribute("rx", "4");
      svg.appendChild(rect);

      var label = document.createElementNS(svgNS, "text");
      label.setAttribute("x", cx);
      label.setAttribute("y", 44);
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("fill", fcolor);
      label.setAttribute("font-family", "var(--font-hei)");
      label.setAttribute("font-size", "13");
      label.setAttribute("font-weight", "700");
      label.textContent = fname;
      svg.appendChild(label);

      members.forEach(function (c, mi) {
        var nx = cx + (mi % 2 === 0 ? -1 : 1) * (colW / 5);
        var ny = 80 + Math.floor(mi / 2) * 90;
        nodePositions[c.id] = { x: nx, y: ny, color: fcolor };

        var g = document.createElementNS(svgNS, "g");
        g.setAttribute("class", "net-node");
        g.addEventListener("click", function () { location.hash = "#/char/" + encodeURIComponent(c.id); });

        var circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", nx); circle.setAttribute("cy", ny);
        circle.setAttribute("r", 22); circle.setAttribute("fill", fcolor); circle.setAttribute("opacity", "0.15");
        g.appendChild(circle);

        var inner = document.createElementNS(svgNS, "circle");
        inner.setAttribute("cx", nx); inner.setAttribute("cy", ny);
        inner.setAttribute("r", 7); inner.setAttribute("fill", fcolor);
        g.appendChild(inner);

        var text = document.createElementNS(svgNS, "text");
        text.setAttribute("x", nx); text.setAttribute("y", ny + 28);
        text.setAttribute("class", "net-node-text");
        text.textContent = c.name.split(" · ")[0];
        g.appendChild(text);

        svg.appendChild(g);
      });
    });

    data.characters.forEach(function (c) {
      if (!c.relations) return;
      c.relations.forEach(function (r) {
        if (!r.id || !nodePositions[r.id] || !nodePositions[c.id]) return;
        var p1 = nodePositions[c.id], p2 = nodePositions[r.id];
        var line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", p1.x); line.setAttribute("y1", p1.y);
        line.setAttribute("x2", p2.x); line.setAttribute("y2", p2.y);
        line.setAttribute("class", "net-link direct");
        svg.insertBefore(line, svg.firstChild);
      });
    });

    var legend = document.createElement("div");
    legend.className = "net-legend";
    factionNames.forEach(function (fname) {
      var fcolor = (data.factions && data.factions[fname]) ? data.factions[fname].color : "#8b92a8";
      legend.innerHTML += '<div class="net-legend-item"><span class="net-legend-dot" style="background:' + fcolor + '"></span>' + esc(fname) + '</div>';
    });
    container.appendChild(svg);
    container.appendChild(legend);
  }

  /* ==================== 时空检索 ==================== */
  function renderSpacetime() {
    var html = '<section class="intro paper">';
    html += '<div class="intro-head"><span class="file-no">卷宗编号 · S-000</span>' + stampHTML("内部资料") + '</div>';
    html += '<h1 class="intro-title">时空检索台</h1>';
    html += '<p class="intro-text">选择时期与地点，快速筛选出同时空下的角色组合，辅助故事构思。</p>';
    html += '</section>';

    var periods = [], locations = [];
    data.characters.forEach(function (c) {
      (c.timeline || []).forEach(function (t) {
        if (periods.indexOf(t.period) < 0) periods.push(t.period);
        if (locations.indexOf(t.location) < 0) locations.push(t.location);
      });
    });
    periods.sort(); locations.sort();

    html += '<section class="paper" style="padding:24px;">';
    html += '<div class="st-filter">';
    html += '<div class="st-group"><label>时期</label><select id="st-period"><option value="">全部时期</option>';
    periods.forEach(function (p) { html += '<option value="' + esc(p) + '">' + esc(p) + '</option>'; });
    html += '</select></div>';
    html += '<div class="st-group"><label>地点</label><select id="st-location"><option value="">全部地点</option>';
    locations.forEach(function (l) { html += '<option value="' + esc(l) + '">' + esc(l) + '</option>'; });
    html += '</select></div>';
    html += '<div class="st-group"><label>阵营</label><select id="st-faction"><option value="">全部阵营</option>';
    Object.keys(data.factions || {}).forEach(function (f) { html += '<option value="' + esc(f) + '">' + esc(f) + '</option>'; });
    html += '</select></div>';
    html += '</div>';
    html += '<div id="st-results"></div>';
    html += '</section>';

    app.innerHTML = html;

    function updateST() {
      var period = document.getElementById("st-period").value;
      var location = document.getElementById("st-location").value;
      var faction = document.getElementById("st-faction").value;

      var locMap = {};
      data.characters.forEach(function (c) {
        (c.timeline || []).forEach(function (t) {
          if (period && t.period !== period) return;
          if (location && t.location !== location) return;
          if (faction && t.faction !== faction) return;
          if (!locMap[t.location]) locMap[t.location] = [];
          locMap[t.location].push({ char: c, period: t.period, faction: t.faction });
        });
      });

      var rhtml = '<div class="st-matrix">';
      Object.keys(locMap).forEach(function (loc) {
        var chars = locMap[loc];
        rhtml += '<div class="st-card">';
        rhtml += '<div class="st-card-title">' + esc(loc) + '</div>';
        chars.forEach(function (item) {
          var fc = (data.factions && data.factions[item.faction]) ? data.factions[item.faction].color : "var(--gold)";
          rhtml += '<div class="st-char">';
          rhtml += '<span class="st-char-dot" style="background:' + fc + ';box-shadow:0 0 6px ' + fc + ';"></span>';
          rhtml += '<a class="st-char-name" href="#/char/' + encodeURIComponent(item.char.id) + '">' + esc(item.char.name) + '</a>';
          rhtml += '<span class="st-char-faction">' + esc(item.period) + ' · ' + esc(item.faction) + '</span>';
          rhtml += '</div>';
        });
        rhtml += '</div>';
      });
      rhtml += '</div>';

      var combos = [];
      Object.keys(locMap).forEach(function (loc) {
        var list = locMap[loc];
        if (list.length >= 2) {
          for (var i = 0; i < list.length; i++) {
            for (var j = i + 1; j < list.length; j++) combos.push({ a: list[i], b: list[j], loc: loc });
          }
        }
      });

      if (combos.length) {
        rhtml += '<div class="st-highlight">';
        rhtml += '<div class="st-highlight-title">▼ 可能发生故事的角色组合（同一地点 & 同一时期）</div>';
        combos.forEach(function (combo) {
          rhtml += '<div class="st-combo">';
          rhtml += '<a href="#/char/' + encodeURIComponent(combo.a.char.id) + '" class="chip chip-char">' + esc(combo.a.char.name) + '</a>';
          rhtml += '<span class="st-combo-arrow">↔</span>';
          rhtml += '<a href="#/char/' + encodeURIComponent(combo.b.char.id) + '" class="chip chip-char">' + esc(combo.b.char.name) + '</a>';
          rhtml += '<span style="color:var(--ink-faint);font-size:12px;margin-left:auto;">@ ' + esc(combo.loc) + '</span>';
          rhtml += '</div>';
        });
        rhtml += '</div>';
      }

      document.getElementById("st-results").innerHTML = rhtml;
    }

    document.getElementById("st-period").addEventListener("change", updateST);
    document.getElementById("st-location").addEventListener("change", updateST);
    document.getElementById("st-faction").addEventListener("change", updateST);
    updateST();
  }

  /* ==================== 编辑表单 ==================== */
  function modal(title, bodyHTML, onSubmit) {
    var wrap = document.createElement("div");
    wrap.className = "modal-wrap";
    wrap.innerHTML = '<div class="modal paper"><div class="modal-head"><span>' + esc(title) + '</span>'
      + '<button class="mini-btn" data-close>✕ 关闭</button></div>'
      + '<form class="modal-form">' + bodyHTML
      + '<div class="modal-actions"><button type="submit" class="mini-btn add">保存修订</button></div></form></div>';
    document.body.appendChild(wrap);
    wrap.querySelector("[data-close]").addEventListener("click", function () { wrap.remove(); });
    wrap.addEventListener("click", function (ev) { if (ev.target === wrap) wrap.remove(); });
    wrap.querySelector("form").addEventListener("submit", function (ev) {
      ev.preventDefault();
      onSubmit(wrap.querySelector("form"));
      wrap.remove();
      persist();
      route();
    });
  }

  function field(label, name, value, type) {
    if (type === "textarea") return '<label class="f-label">' + label + '<textarea name="' + name + '" rows="7">' + esc(value || "") + '</textarea></label>';
    return '<label class="f-label">' + label + '<input name="' + name + '" value="' + esc(value || "") + '"></label>';
  }

  function showEventForm(id) {
    var e = id ? findEvent(id) : { id: "", order: (data.events.length + 1) * 10, date: "", title: "", summary: "", level: "内部", tags: [], chars: [], versions: [{ title: "", article: "", isDefault: true }] };
    var isNew = !id;
    var levels = ["公开", "内部", "机密", "绝密"].map(function (lv) { return '<option' + (e.level === lv ? " selected" : "") + '>' + lv + '</option>'; }).join("");
    var charBoxes = data.characters.map(function (c) { return '<label style="font-family:var(--font-hei);font-size:13px;color:var(--ink);"><input type="checkbox" name="chars" value="' + esc(c.id) + '"' + ((e.chars || []).indexOf(c.id) >= 0 ? " checked" : "") + '> ' + esc(c.name) + '</label>'; }).join("");

    var body = '<div class="f-grid">' + field("事件 ID", "id", e.id) + field("排序", "order", e.order) + field("日期", "date", e.date) + field("标题", "title", e.title) + '<label class="f-label">保密等级<select name="level">' + levels + '</select></label>' + field("标签（/分隔）", "tags", (e.tags || []).join(" / ")) + '</div>' + field("摘要", "summary", e.summary, "textarea") + '<div class="f-label">相关人员<div style="display:flex;flex-wrap:wrap;gap:6px 16px;padding:6px 0;">' + charBoxes + '</div></div>';

    modal(isNew ? "新增事件" : "修订事件", body, function (form) {
      var fd = new FormData(form);
      var nid = String(fd.get("id")).trim();
      if (!nid) { alert("ID 不能为空"); throw new Error("no id"); }
      if (isNew && findEvent(nid)) { alert("ID 已存在"); throw new Error("dup id"); }
      var target = isNew ? {} : e;
      target.id = isNew ? nid : e.id;
      target.order = Number(fd.get("order")) || 0;
      target.date = String(fd.get("date"));
      target.title = String(fd.get("title"));
      target.level = String(fd.get("level"));
      target.summary = normalizeColons(String(fd.get("summary")));
      target.tags = String(fd.get("tags")).split(/[\/，,]/).map(function (s) { return s.trim(); }).filter(Boolean);
      target.chars = fd.getAll("chars").map(String);
      if (!target.versions) target.versions = [{ title: target.title, article: "", isDefault: true }];
      if (isNew) data.events.push(target);
    });
  }

  function showVersionForm(eventId) {
    var e = findEvent(eventId);
    var body = field("版本标题", "vtitle", "") + field("正文", "varticle", "", "textarea");
    modal("新增版本 · " + e.title, body, function (form) {
      var fd = new FormData(form);
      if (!e.versions) e.versions = [];
      e.versions.push({ title: String(fd.get("vtitle")), article: normalizeColons(String(fd.get("varticle"))), isDefault: false });
    });
  }

  function showCharForm(id) {
    var c = id ? findChar(id) : { id: "", name: "", alias: "", level: "内部", fields: [], bio: "", timeline: [] };
    var isNew = !id;
    var levels = ["公开", "内部", "机密", "绝密"].map(function (lv) { return '<option' + (c.level === lv ? " selected" : "") + '>' + lv + '</option>'; }).join("");
    var fieldsText = (c.fields || []).map(function (f) { return f.k + "：" + f.v; }).join("\n");
    var relsText = (c.relations || []).map(function (r) { return (r.name || "") + "：" + (r.rel || ""); }).join("\n");
    var timelineText = (c.timeline || []).map(function (t) { return t.period + "|" + t.location + "|" + t.faction; }).join("\n");

    var body = '<div class="f-grid">' + field("人物 ID", "id", c.id) + field("姓名", "name", c.name) + field("称号", "alias", c.alias) + '<label class="f-label">保密等级<select name="level">' + levels + '</select></label>' + '</div>' + field("档案表格（项目：内容）", "fields", fieldsText, "textarea") + field("时空足迹（格式：时期|地点|阵营）", "timeline", timelineText, "textarea") + field("关联人物（名字：关系）", "relations", relsText, "textarea") + field("正文", "bio", c.bio, "textarea");

    modal(isNew ? "新增人物" : "修订人物", body, function (form) {
      var fd = new FormData(form);
      var nid = String(fd.get("id")).trim();
      if (!nid) { alert("ID 不能为空"); throw new Error("no id"); }
      if (isNew && findChar(nid)) { alert("ID 已存在"); throw new Error("dup id"); }
      var target = isNew ? {} : c;
      target.id = isNew ? nid : c.id;
      target.name = String(fd.get("name"));
      target.alias = String(fd.get("alias"));
      target.level = String(fd.get("level"));
      target.fields = normalizeColons(String(fd.get("fields"))).split("\n").map(function (line) {
        var m = line.split(/[:：]/);
        if (m.length < 2) return null;
        return { k: m[0].trim(), v: m.slice(1).join(":").trim() };
      }).filter(Boolean);
      target.timeline = String(fd.get("timeline")).split("\n").map(function (line) {
        var p = line.split("|");
        if (p.length < 3) return null;
        return { period: p[0].trim(), location: p[1].trim(), faction: p[2].trim() };
      }).filter(Boolean);
      target.bio = normalizeColons(String(fd.get("bio")));
      target.relations = String(fd.get("relations")).split("\n").map(function (line) {
        var m = line.split(/[:：]/);
        if (m.length < 2) return null;
        var name = m[0].trim(), rel = m.slice(1).join(":").trim();
        if (!name) return null;
        var norm = function (s) { return s.replace(/[\s·・]/g, ""); };
        var found = data.characters.find(function (x) { return norm(x.name) === norm(name); });
        return { id: found ? found.id : "", name: name, rel: rel };
      }).filter(Boolean);
      if (isNew) data.characters.push(target);
    });
  }

  /* ==================== 导入导出 ==================== */
  document.getElementById("btn-export").addEventListener("click", function () {
    var text = "window.ARCHIVE_DATA = " + JSON.stringify(data, null, 2) + ";\n";
    var blob = new Blob([text], { type: "text/javascript;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "data.js";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  document.getElementById("btn-import").addEventListener("click", function () {
    document.getElementById("import-file").click();
  });

  document.getElementById("import-file").addEventListener("change", function (ev) {
    var f = ev.target.files[0];
    if (!f) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var text = String(reader.result);
        var obj;
        try { obj = JSON.parse(text); }
        catch (e1) {
          var m = text.match(/ARCHIVE_DATA\s*=\s*(\{[\s\S]*\})\s*;?\s*$/);
          if (!m) throw new Error("无法解析");
          obj = JSON.parse(m[1]);
        }
        if (!obj.events || !obj.characters || !obj.meta) throw new Error("数据缺少必要字段");
        data = obj;
        persist();
        route();
        alert("导入成功。");
      } catch (err) { alert("导入失败：" + err.message); }
    };
    reader.readAsText(f);
    ev.target.value = "";
  });

  document.getElementById("btn-reset").addEventListener("click", function () {
    if (confirm("恢复为初始数据？浏览器内的全部修改将被清除。")) {
      localStorage.removeItem(LS_DATA);
      data = clone(window.ARCHIVE_DATA);
      route();
    }
  });

  /* ==================== 路由 ==================== */
  function applyMeta() {
    var m = data.meta;
    document.getElementById("brand-title").textContent = m.title || "奥术档案室";
    document.getElementById("brand-subtitle").textContent = m.subtitle || "ARCANE CHRONICLE ARCHIVE";
    document.getElementById("footer-note").textContent = m.footer || "";
    document.title = (m.title || "奥术档案室") + " · ARCANE ARCHIVE";
  }

  function route() {
    applyMeta();
    var hash = location.hash || "#/";
    document.querySelectorAll(".main-nav a").forEach(function (a) { a.classList.remove("active"); });

    var m;
    if ((m = hash.match(/^#\/event\/(.+)$/))) { renderEvent(decodeURIComponent(m[1])); }
    else if ((m = hash.match(/^#\/char\/(.+)$/))) { renderChar(decodeURIComponent(m[1])); }
    else if (hash === "#/chars") { renderChars(); setNav("chars"); }
    else if (hash === "#/network") { renderNetwork(); setNav("network"); }
    else if (hash === "#/spacetime") { renderSpacetime(); setNav("spacetime"); }
    else { renderTimeline(); setNav("timeline"); }
    window.scrollTo(0, 0);
  }

  function setNav(r) {
    var a = document.querySelector('.main-nav a[data-route="' + r + '"]');
    if (a) a.classList.add("active");
  }

  document.getElementById("edit-toggle").addEventListener("click", function () {
    setEdit(!isEdit());
    route();
  });

  setEdit(isEdit());
  window.addEventListener("hashchange", route);
  route();
})();
