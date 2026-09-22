/* ============================================================
 *  app.js —— 炼金术深蓝版（含区块化编辑器）
 * ============================================================ */
(function () {
  "use strict";

  var LS_DATA = "archive_alchemy_v3";
  var LS_EDIT = "archive_edit_mode";
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
      return '<a class="chip chip-char" href="#/char/' + encodeURIComponent(id.trim()) + '">' +
        esc(label) + (exists ? "" : " ⚠") + "</a>";
    });
    out = out.replace(/\[\[e[:\uff1a]([^\]|]+)\|([^\]]+)\]\]/g, function (m, id, label) {
      var exists = findEvent(id.trim());
      return '<a class="chip chip-event" href="#/event/' + encodeURIComponent(id.trim()) + '">' +
        esc(label) + (exists ? "" : " ⚠") + "</a>";
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
    html += '<div class="filter-bar" style="margin-top:22px;border-top:1px dashed var(--line);padding-top:16px;">';
    html += '<input id="search" class="search" placeholder="检索事件标题 / 摘要…" value="' + esc(searchQ) + '">';
    html += '<div class="filter-row" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:8px;"><span style="font-family:var(--font-mono);font-size:11px;letter-spacing:3px;color:var(--ink-faint);margin-right:4px;">标签</span>';
    allTags().forEach(function (t) {
      html += '<button class="filter-chip' + (filterTag === t ? " on" : "") + '" data-tag="' + esc(t) + '">' + esc(t) + '</button>';
    });
    html += '</div><div class="filter-row" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;"><span style="font-family:var(--font-mono);font-size:11px;letter-spacing:3px;color:var(--ink-faint);margin-right:4px;">人物</span>';
    data.characters.forEach(function (c) {
      html += '<button class="filter-chip' + (filterChar === c.id ? " on" : "") + '" data-char="' + esc(c.id) + '">' + esc(c.name) + '</button>';
    });
    html += '</div></div>';
    if (isEdit()) {
      html += '<div style="margin-top:18px;padding-top:14px;border-top:1px dashed var(--line);text-align:right;"><button class="mini-btn" data-edit-meta>✎ 修订档案抬头</button></div>';
    }
    html += '</section>';

    html += '<section class="timeline">';
    if (!filtered.length) html += '<div class="empty paper">没有符合条件的卷宗。</div>';
    filtered.forEach(function (e, i) {
      html += '<article class="tl-item ' + (i % 2 ? "right" : "left") + '">';
      html += '<div class="tl-pin"></div>';
      html += '<div class="folder" style="position:relative;">';
      html += '<a class="folder-body paper" href="#/event/' + encodeURIComponent(e.id) + '">';
      html += '<div class="folder-top" style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:8px;"><span class="folder-date">' + esc(e.date) + '</span>' + stampHTML(e.level) + '</div>';
      html += '<h2 class="folder-title">' + esc(e.title) + '</h2>';
      html += '<p class="folder-summary">' + renderInline(e.summary) + '</p>';
      html += '</a>';
      if (isEdit()) {
        html += '<div style="position:absolute;top:8px;right:8px;display:flex;gap:6px;z-index:3;">'
          + '<button class="mini-btn" data-edit-event="' + esc(e.id) + '">编辑</button>'
          + '<button class="mini-btn danger" data-del-event="' + esc(e.id) + '">删除</button></div>';
      }
      html += '</div></article>';
    });
    html += '</section>';

    if (isEdit()) html += '<div style="text-align:center;margin-top:20px;"><button class="mini-btn add" data-add-event style="padding:10px 26px;font-size:13px;letter-spacing:3px;border-style:dashed;">＋ 新增事件卷宗</button></div>';
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
    var em = app.querySelector("[data-edit-meta]");
    if (em) em.addEventListener("click", function () { showMetaForm(); });
  }

  /* ==================== 人物总览 ==================== */
  function renderChars() {
    var html = '<section class="intro paper"><div class="intro-head"><span class="file-no">卷宗编号 · P-000</span>'
      + stampHTML("人员名册") + '</div><h1 class="intro-title">人物档案索引</h1>'
      + '<p class="intro-text">以下人员的详细档案已归档。点击档案卡查阅全文。</p></section>';

    html += '<section style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:28px;">';
    data.characters.forEach(function (c) {
      html += '<div style="position:relative;">';
      html += '<a class="paper" href="#/char/' + encodeURIComponent(c.id) + '" style="display:flex;gap:18px;padding:24px 22px 20px;text-decoration:none;color:inherit;">';
      html += avatarHTML(c);
      html += '<div style="flex:1;min-width:0;display:flex;flex-direction:column;">';
      html += '<div style="font-size:19px;font-weight:700;letter-spacing:1.5px;">' + esc(c.name) + '</div>';
      if (c.alias) html += '<div style="font-family:var(--font-hei);font-size:12px;color:var(--crimson-deep);margin:2px 0 8px;">' + esc(c.alias) + '</div>';
      var first = (c.fields || [])[0];
      if (first) html += '<div style="font-size:13px;color:var(--ink-soft);">' + esc(first.k) + '：' + esc(first.v) + '</div>';
      html += '<div style="margin-top:auto;padding-top:10px;display:flex;justify-content:space-between;align-items:flex-end;">' + stampHTML(c.level) + '<span style="color:var(--crimson);font-family:var(--font-hei);font-size:12px;letter-spacing:3px;">调阅 →</span></div>';
      html += '</div></a>';
      if (isEdit()) {
        html += '<div style="position:absolute;top:8px;right:8px;display:flex;gap:6px;z-index:3;">'
          + '<button class="mini-btn" data-edit-char="' + esc(c.id) + '">编辑</button>'
          + '<button class="mini-btn danger" data-del-char="' + esc(c.id) + '">删除</button></div>';
      }
      html += '</div>';
    });
    html += '</section>';

    if (isEdit()) html += '<div style="text-align:center;margin-top:20px;"><button class="mini-btn add" data-add-char style="padding:10px 26px;font-size:13px;letter-spacing:3px;border-style:dashed;">＋ 新增人物档案</button></div>';
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
    html += '<div class="dossier-meta-top" style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:12px;"><span class="file-no">卷宗编号 · E-' + String(e.order || 0).padStart(3, "0") + '</span>' + stampHTML(e.level) + '</div>';
    html += '<h1 class="dossier-title">' + esc(e.title) + '</h1>';
    html += '<div class="dossier-date">记录日期：' + esc(e.date) + '</div>';
    html += '</header>';

    if (versions.length > 1 || isEdit()) {
      html += '<div class="version-tabs">';
      versions.forEach(function (v, i) {
        html += '<button class="version-tab' + (i === activeIndex ? ' active' : '') + '" data-vidx="' + i + '">' + esc(v.title)
          + (v.isDefault ? '<span class="v-default">●</span>' : '') + '</button>';
      });
      if (isEdit()) html += '<button class="mini-btn add" data-add-version style="margin-left:auto;border:none;background:transparent;color:var(--verdigris);font-size:11px;">＋ 新增版本</button>';
      html += '</div>';
    }

    var v = versions[activeIndex];
    html += '<div id="version-body">';
    html += '<div class="article">' + renderArticle(v.article) + '</div>';
    html += '</div>';

    if ((e.chars || []).length) {
      html += '<div style="margin-top:20px;padding-top:16px;border-top:1px dashed var(--line);"><span style="font-family:var(--font-hei);font-size:13px;letter-spacing:4px;color:var(--ink-soft);">相关人员</span><div style="margin-top:10px;">';
      e.chars.forEach(function (cid) {
        var c = findChar(cid);
        html += '<a class="chip chip-char" href="#/char/' + encodeURIComponent(cid) + '">' + esc(c ? c.name : cid) + '</a> ';
      });
      html += '</div></div>';
    }

    html += '<div class="dossier-sign">—— 档案科 · 整理完毕 ——</div>';
    html += '</section>';

    html += '<nav style="display:flex;justify-content:space-between;gap:16px;margin-top:30px;flex-wrap:wrap;">';
    html += prev ? '<a href="#/event/' + encodeURIComponent(prev.id) + '" style="font-family:var(--font-hei);font-size:13px;letter-spacing:1px;color:#8a9bb8;text-decoration:none;border:1px solid rgba(201,168,76,0.4);padding:8px 16px;max-width:46%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">← ' + esc(prev.title) + '</a>' : '<span></span>';
    html += next ? '<a href="#/event/' + encodeURIComponent(next.id) + '" style="font-family:var(--font-hei);font-size:13px;letter-spacing:1px;color:#8a9bb8;text-decoration:none;border:1px solid rgba(201,168,76,0.4);padding:8px 16px;max-width:46%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + esc(next.title) + ' →</a>' : '<span></span>';
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

  /* ==================== 人物详情（区块化面板） ==================== */

  // 将旧版数据转换为区块格式
  function charToBlocks(c) {
    if (c.blocks && c.blocks.length) return c.blocks;
    var blocks = [];
    if (c.fields && c.fields.length) {
      blocks.push({
        type: "table", title: "档案资料",
        content: c.fields.map(function (f) { return f.k + "：" + f.v; }).join("\n")
      });
    }
    if (c.bio) {
      blocks.push({ type: "article", title: "人物设定", content: c.bio });
    }
    if (!blocks.length) blocks.push({ type: "article", title: "人物设定", content: "" });
    return blocks;
  }

  function renderChar(id) {
    var c = findChar(id);
    if (!c) { app.innerHTML = '<div class="empty paper">档案不存在。<a href="#/chars">返回人物索引</a></div>'; return; }

    var related = data.events.filter(function (e) { return (e.chars || []).indexOf(id) >= 0; })
      .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });

    var html = '<div class="back-row"><a class="back-link" href="#/chars">← 返回人物索引</a>'
      + (isEdit() ? '<button class="mini-btn" data-edit-char="' + esc(c.id) + '">编辑此档案</button>' : "") + '</div>';

    html += '<section class="paper dossier">';
    html += '<div class="punch-holes" aria-hidden="true"><i></i><i></i><i></i></div>';

    // 头部：portrait + 名字/称号/保密等级
    html += '<header class="dossier-head char-head">';
    html += avatarHTML(c);
    html += '<div class="char-head-main">';
    html += '<div class="dossier-meta-top" style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:8px;">';
    html += '<span class="file-no">人员编号 · ' + esc(c.id.toUpperCase()) + '</span>';
    html += stampHTML(c.level);
    html += '</div>';
    html += '<h1 class="dossier-title">' + esc(c.name) + '</h1>';
    if (c.alias) html += '<div class="dossier-alias">' + esc(c.alias) + '</div>';
    html += '</div></header>';

    // 时空足迹
    if ((c.timeline || []).length) {
      html += '<div style="margin-bottom:22px;padding:12px 0;border-bottom:1px dashed var(--line);">';
      html += '<span style="font-family:var(--font-hei);font-size:12px;letter-spacing:3px;color:var(--ink-faint);margin-right:10px;">时空足迹</span>';
      html += '<div style="display:inline-flex;flex-wrap:wrap;gap:8px;margin-top:8px;">';
      c.timeline.forEach(function (t) {
        var fc = (data.factions && data.factions[t.faction]) ? data.factions[t.faction].color : "var(--gold)";
        html += '<span style="display:inline-block;padding:3px 10px;border:1px solid var(--line);font-size:12px;font-family:var(--font-hei);">';
        html += '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + fc + ';margin-right:6px;"></span>';
        html += esc(t.period) + ' · ' + esc(t.location);
        html += '</span>';
      });
      html += '</div></div>';
    }

    // 区块面板
    var blocks = charToBlocks(c);
    blocks.forEach(function (blk, idx) {
      html += renderBlockHTML(blk, idx, false);
    });

    // 关联人物
    if ((c.relations || []).length) {
      html += '<h3 style="margin-top:30px;padding-top:16px;border-top:1px dashed var(--line);font-family:var(--font-hei);font-size:13px;letter-spacing:4px;color:var(--ink-soft);">关联人物</h3><ul style="list-style:none;margin-top:12px;">';
      c.relations.forEach(function (r) {
        var target = r.id ? findChar(r.id) : null;
        var nameHtml = target
          ? '<a class="chip chip-char" href="#/char/' + encodeURIComponent(target.id) + '">' + esc(r.name || target.name) + '</a>'
          : '<span style="font-weight:700;letter-spacing:1px;">' + esc(r.name || "（未署名）") + '</span>';
        html += '<li style="display:flex;align-items:baseline;gap:12px;padding:7px 0;border-bottom:1px dotted var(--line);font-size:14px;"><span style="flex:none;min-width:132px;">' + nameHtml + '</span><span style="color:var(--ink-soft);font-size:14px;line-height:1.8;">' + renderInline(r.rel || "") + '</span></li>';
      });
      html += '</ul>';
    }

    if (related.length) {
      html += '<h3 style="margin-top:30px;padding-top:16px;border-top:1px dashed var(--line);font-family:var(--font-hei);font-size:13px;letter-spacing:4px;color:var(--ink-soft);">相关卷宗</h3><ul style="list-style:none;margin-top:12px;">';
      related.forEach(function (e) {
        html += '<li style="display:flex;align-items:baseline;gap:12px;padding:7px 0;border-bottom:1px dotted var(--line);font-size:14px;"><span style="font-family:var(--font-mono);font-size:12px;letter-spacing:2px;color:var(--ink-faint);">' + esc(e.date) + '</span><a class="chip chip-event" href="#/event/' + encodeURIComponent(e.id) + '">' + esc(e.title) + '</a></li>';
      });
      html += '</ul>';
    }
    html += '<div class="dossier-sign">—— 档案科 · 整理完毕 ——</div>';
    html += '</section>';

    app.innerHTML = html;
    var b = app.querySelector("[data-edit-char]");
    if (b) b.addEventListener("click", function () { showCharForm(c.id); });
  }

  function renderBlockHTML(blk, idx, editing) {
    var typeLabel = { table: "表", article: "文", heading: "字" }[blk.type] || "文";
    var html = '';
    if (editing) {
      html += '<div class="block-panel editing" data-bidx="' + idx + '" data-btype="' + blk.type + '">';
      html += '<div class="block-header">';
      html += '<span class="block-type-tag">' + typeLabel + '</span>';
      html += '<input type="text" class="block-title-input" value="' + esc(blk.title) + '" placeholder="面板名称" data-btitle>';
      html += '<div class="block-tools">';
      html += '<button type="button" data-bmove="-1" title="上移">↑</button>';
      html += '<button type="button" data-bmove="1" title="下移">↓</button>';
      html += '<button type="button" data-bdel title="删除">✕</button>';
      html += '</div></div>';
      html += '<div class="block-body">';
      if (blk.type === "table") {
        html += '<textarea class="block-table-editor" data-bcontent placeholder="每行一条，格式：项目：内容" rows="6">' + esc(blk.content) + '</textarea>';
      } else if (blk.type === "heading") {
        html += '<textarea class="block-content-textarea" data-bcontent placeholder="大字内容" rows="3">' + esc(blk.content) + '</textarea>';
      } else {
        html += '<textarea class="block-content-textarea" data-bcontent placeholder="正文内容（空行分段；支持 [[c:id|人名]] [[e:id|事件]] [[x:遮盖]] ）" rows="8">' + esc(blk.content) + '</textarea>';
      }
      html += '</div></div>';
    } else {
      html += '<div class="block-panel">';
      html += '<div class="block-header">';
      html += '<span class="block-type-tag">' + typeLabel + '</span>';
      html += '<span class="block-title-text">' + esc(blk.title) + '</span>';
      html += '</div>';
      html += '<div class="block-body">';
      if (blk.type === "table") {
        html += '<dl class="meta-table">';
        blk.content.split("\n").forEach(function (line) {
          var m = line.split(/[:：]/);
          if (m.length < 2) return;
          html += '<dt>' + esc(m[0].trim()) + '</dt><dd>' + renderInline(m.slice(1).join("：").trim()) + '</dd>';
        });
        html += '</dl>';
      } else if (blk.type === "heading") {
        html += '<div style="font-size:26px;letter-spacing:6px;font-weight:700;text-align:center;padding:20px 10px;line-height:1.6;">' + renderInline(blk.content) + '</div>';
      } else {
        html += '<div class="article">' + renderArticle(blk.content) + '</div>';
      }
      html += '</div></div>';
    }
    return html;
  }

  /* ==================== 关系图谱 ==================== */
  function renderNetwork() {
    var html = '<section class="intro paper">';
    html += '<div class="intro-head"><span class="file-no">卷宗编号 · N-000</span>' + stampHTML("内部资料") + '</div>';
    html += '<h1 class="intro-title">人物关系图谱</h1>';
    html += '<p class="intro-text">同一底色框内为同一阵营。实线为直接关联，虚线为事件间接关联。点击节点调阅档案。</p>';
    html += '</section>';

    html += '<section class="paper" style="padding:20px;">';
    html += '<div id="net-canvas" class="net-canvas"></div>';
    html += '</section>';

    app.innerHTML = html;
    setTimeout(function () { drawNetwork(document.getElementById('net-canvas')); }, 50);
  }

  function drawNetwork(container) {
    if (!container) return;
    var width = container.clientWidth || 800;
    var height = 600;
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
      var fcolor = (data.factions && data.factions[fname]) ? data.factions[fname].color : "#8a7c60";
      var fbg = (data.factions && data.factions[fname]) ? data.factions[fname].bg : "rgba(138,124,96,0.1)";

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
        circle.setAttribute("cx", nx);
        circle.setAttribute("cy", ny);
        circle.setAttribute("r", 22);
        circle.setAttribute("fill", fcolor);
        circle.setAttribute("opacity", "0.2");
        g.appendChild(circle);

        var inner = document.createElementNS(svgNS, "circle");
        inner.setAttribute("cx", nx);
        inner.setAttribute("cy", ny);
        inner.setAttribute("r", 8);
        inner.setAttribute("fill", fcolor);
        g.appendChild(inner);

        var text = document.createElementNS(svgNS, "text");
        text.setAttribute("x", nx);
        text.setAttribute("y", ny + 28);
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
        var p1 = nodePositions[c.id];
        var p2 = nodePositions[r.id];
        var line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", p1.x);
        line.setAttribute("y1", p1.y);
        line.setAttribute("x2", p2.x);
        line.setAttribute("y2", p2.y);
        line.setAttribute("class", "net-link direct");
        svg.insertBefore(line, svg.firstChild);
      });
    });

    var legend = document.createElement("div");
    legend.className = "net-legend";
    factionNames.forEach(function (fname) {
      var fcolor = (data.factions && data.factions[fname]) ? data.factions[fname].color : "#8a7c60";
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
    periods.sort();
    locations.sort();

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
          rhtml += '<span class="st-char-dot" style="background:' + fc + '"></span>';
          rhtml += '<a class="st-char-name" href="#/char/' + encodeURIComponent(item.char.id) + '" style="text-decoration:none;color:var(--ink);font-weight:700;">' + esc(item.char.name) + '</a>';
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
            for (var j = i + 1; j < list.length; j++) {
              combos.push({ a: list[i], b: list[j], loc: loc });
            }
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
    if (type === "textarea") {
      return '<label class="f-label">' + label + '<textarea name="' + name + '" rows="7">' + esc(value || "") + '</textarea></label>';
    }
    return '<label class="f-label">' + label + '<input name="' + name + '" value="' + esc(value || "") + '"></label>';
  }

  function showEventForm(id) {
    var e = id ? findEvent(id) : { id: "", order: (data.events.length + 1) * 10, date: "", title: "", summary: "", level: "内部", tags: [], chars: [], versions: [{ title: "", article: "", isDefault: true }] };
    var isNew = !id;
    var levels = ["公开", "内部", "机密", "绝密"].map(function (lv) {
      return '<option' + (e.level === lv ? " selected" : "") + '>' + lv + '</option>';
    }).join("");
    var charBoxes = data.characters.map(function (c) {
      return '<label style="font-family:var(--font-hei);font-size:13px;color:var(--ink);"><input type="checkbox" name="chars" value="' + esc(c.id) + '"' + ((e.chars || []).indexOf(c.id) >= 0 ? " checked" : "") + '> ' + esc(c.name) + '</label>';
    }).join("");

    var body = '<div class="f-grid">'
      + field("事件 ID", "id", e.id)
      + field("排序", "order", e.order)
      + field("日期", "date", e.date)
      + field("标题", "title", e.title)
      + '<label class="f-label">保密等级<select name="level">' + levels + '</select></label>'
      + field("标签（/分隔）", "tags", (e.tags || []).join(" / "))
      + '</div>'
      + field("摘要", "summary", e.summary, "textarea")
      + '<div class="f-label">相关人员<div style="display:flex;flex-wrap:wrap;gap:6px 16px;padding:6px 0;">' + charBoxes + '</div></div>';

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
    var body = field("版本标题", "vtitle", "")
      + field("正文", "varticle", "", "textarea");
    modal("新增版本 · " + e.title, body, function (form) {
      var fd = new FormData(form);
      if (!e.versions) e.versions = [];
      e.versions.push({
        title: String(fd.get("vtitle")),
        article: normalizeColons(String(fd.get("varticle"))),
        isDefault: false
      });
    });
  }

  /* ---------- 人物区块化编辑器 ---------- */
  function showCharForm(id) {
    var c = id ? findChar(id) : { id: "", name: "", alias: "", level: "内部", timeline: [], relations: [], blocks: [] };
    var isNew = !id;
    var levels = ["公开", "内部", "机密", "绝密"].map(function (lv) {
      return '<option' + (c.level === lv ? " selected" : "") + '>' + lv + '</option>';
    }).join("");
    var relsText = (c.relations || []).map(function (r) { return (r.name || "") + "：" + (r.rel || ""); }).join("\n");
    var timelineText = (c.timeline || []).map(function (t) { return t.period + "|" + t.location + "|" + t.faction; }).join("\n");

    // 确保有 blocks
    var blocks = charToBlocks(c);

    var body = '<div class="f-grid">'
      + field("人物 ID", "id", c.id)
      + field("姓名", "name", c.name)
      + field("称号", "alias", c.alias)
      + '<label class="f-label">保密等级<select name="level">' + levels + '</select></label>'
      + '</div>'
      + field("时空足迹（格式：时期|地点|阵营）", "timeline", timelineText, "textarea")
      + field("关联人物（名字：关系）", "relations", relsText, "textarea");

    // 区块编辑器
    body += '<div style="margin-top:10px;padding-top:14px;border-top:2px solid var(--ink);"><div style="font-family:var(--font-hei);font-size:13px;letter-spacing:3px;margin-bottom:10px;">档案面板（可上下移动、自定义名称）</div>';
    body += '<div id="block-editor">';
    blocks.forEach(function (blk, idx) {
      body += renderBlockHTML(blk, idx, true);
    });
    body += '</div>';
    body += '<div class="add-block-bar">';
    body += '<button type="button" data-add-block="table">＋ 添加表格面板</button> · ';
    body += '<button type="button" data-add-block="article">＋ 添加文本面板</button> · ';
    body += '<button type="button" data-add-block="heading">＋ 添加大字面板</button>';
    body += '</div></div>';

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
      target.timeline = String(fd.get("timeline")).split("\n").map(function (line) {
        var p = line.split("|");
        if (p.length < 3) return null;
        return { period: p[0].trim(), location: p[1].trim(), faction: p[2].trim() };
      }).filter(Boolean);
      target.relations = String(fd.get("relations")).split("\n").map(function (line) {
        var m = line.split(/[:：]/);
        if (m.length < 2) return null;
        var name = m[0].trim();
        var rel = m.slice(1).join(":").trim();
        if (!name) return null;
        var norm = function (s) { return s.replace(/[\s·・]/g, ""); };
        var found = data.characters.find(function (x) { return norm(x.name) === norm(name); });
        return { id: found ? found.id : "", name: name, rel: rel };
      }).filter(Boolean);

      // 读取区块
      var editor = document.getElementById("block-editor");
      var blockEls = editor.querySelectorAll(".block-panel");
      target.blocks = [];
      blockEls.forEach(function (el) {
        var type = el.dataset.btype || "article";
        var titleIn = el.querySelector("[data-btitle]");
        var contentIn = el.querySelector("[data-bcontent]");
        target.blocks.push({
          type: type,
          title: titleIn ? titleIn.value : "",
          content: contentIn ? normalizeColons(contentIn.value) : ""
        });
      });

      // 兼容旧字段
      target.fields = [];
      target.bio = "";
      target.blocks.forEach(function (blk) {
        if (blk.type === "table") {
          blk.content.split("\n").forEach(function (line) {
            var m = line.split(/[:：]/);
            if (m.length >= 2) target.fields.push({ k: m[0].trim(), v: m.slice(1).join("：").trim() });
          });
        } else if (blk.type === "article" && !target.bio) {
          target.bio = blk.content;
        }
      });

      if (isNew) data.characters.push(target);
    });

    // 绑定区块操作（延迟，等DOM插入后）
    setTimeout(function () {
      bindBlockEditor();
    }, 50);
  }

  function bindBlockEditor() {
    var editor = document.getElementById("block-editor");
    if (!editor) return;

    // 移动
    editor.querySelectorAll("[data-bmove]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var el = btn.closest(".block-panel");
        var dir = parseInt(btn.dataset.bmove);
        if (dir < 0 && el.previousElementSibling) {
          editor.insertBefore(el, el.previousElementSibling);
        } else if (dir > 0 && el.nextElementSibling) {
          editor.insertBefore(el.nextElementSibling, el);
        }
      });
    });

    // 删除
    editor.querySelectorAll("[data-bdel]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (confirm("删除此面板？")) {
          btn.closest(".block-panel").remove();
        }
      });
    });

    // 添加
    document.querySelectorAll("[data-add-block]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var type = btn.dataset.addBlock;
        var titles = { table: "档案表格", article: "人物设定", heading: "大字标题" };
        var newBlock = { type: type, title: titles[type] || "新面板", content: "" };
        var idx = editor.querySelectorAll(".block-panel").length;
        var div = document.createElement("div");
        div.innerHTML = renderBlockHTML(newBlock, idx, true);
        editor.appendChild(div.firstElementChild);
        bindBlockEditor(); // 重新绑定
      });
    });
  }

  function showMetaForm() {
    var m = data.meta;
    var body = '<div class="f-grid">'
      + field("档案室标题", "title", m.title)
      + field("英文副标题", "subtitle", m.subtitle)
      + field("卷宗编号", "fileNo", m.fileNo || "卷宗编号 · A-114")
      + field("印章文字", "stamp", m.stamp)
      + '</div>'
      + field("首页引言", "intro", m.intro, "textarea")
      + field("页脚文字", "footer", m.footer);
    modal("修订档案抬头", body, function (form) {
      var fd = new FormData(form);
      data.meta.title = String(fd.get("title"));
      data.meta.subtitle = String(fd.get("subtitle"));
      data.meta.fileNo = String(fd.get("fileNo"));
      data.meta.stamp = String(fd.get("stamp"));
      data.meta.intro = normalizeColons(String(fd.get("intro")));
      data.meta.footer = String(fd.get("footer"));
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
    document.getElementById("brand-title").textContent = m.title || "事件档案室";
    document.getElementById("brand-subtitle").textContent = m.subtitle || "CHRONICLE ARCHIVE";
    document.getElementById("footer-note").textContent = m.footer || "";
    document.title = (m.title || "事件档案室") + " · CHRONICLE ARCHIVE";
  }

  function route() {
    applyMeta();
    var hash = location.hash || "#/";
    document.querySelectorAll(".main-nav a").forEach(function (a) { a.classList.remove("active"); });

    var m;
    if ((m = hash.match(/^#\/event\/(.+)$/))) {
      renderEvent(decodeURIComponent(m[1]));
    } else if ((m = hash.match(/^#\/char\/(.+)$/))) {
      renderChar(decodeURIComponent(m[1]));
    } else if (hash === "#/chars") {
      renderChars();
      setNav("chars");
    } else if (hash === "#/network") {
      renderNetwork();
      setNav("network");
    } else if (hash === "#/spacetime") {
      renderSpacetime();
      setNav("spacetime");
    } else {
      renderTimeline();
      setNav("timeline");
    }
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
