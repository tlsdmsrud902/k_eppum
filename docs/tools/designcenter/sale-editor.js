// 디자인센터 상세 「먼저 딱 한 번 해 볼까요?」 2단계 그림 : 세일 큰 화면 편집 창 → _deploy/dc/shots/sale-editor.jpg
//   node docs/tools/designcenter/sale-editor.js
// 재료 : _deploy/dc/editors.json 의 '세일 큰 화면' (로그인한 브라우저에서 가져온 편집 창 HTML), editor.css
// 바꿀 칸(제목)에 빨간 테두리 · 1번 배지, 사진 아래 칸 몇 개만 남기고 나머지는 숨긴다
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const DIR = require('path').resolve(__dirname, '../../../_deploy/dc') + '/';
const ED = JSON.parse(fs.readFileSync(DIR + 'editors.json', 'utf8'))['세일 큰 화면'];
const CSS = fs.readFileSync(DIR + 'editor.css', 'utf8');
const BADGE = 'position:absolute;z-index:99999;width:30px;height:30px;border-radius:50%;background:#e5383b;color:#fff;font:800 16px/30px Arial,sans-serif;text-align:center;border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.45)';
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
  const ep = await b.newPage();
  await ep.setViewport({ width: 780, height: 900, deviceScaleFactor: 1.4 });
  await ep.setContent('<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"><style>body{margin:0;padding:18px;background:#fbf8f1}' + CSS + '.pcms__bar{position:static}</style></head><body><div id="wrap">' + ED + '</div></body></html>', { waitUntil: 'load', timeout: 60000 });
  await ep.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 8000); }))));
  await ep.evaluate(() => document.fonts.ready);
  await ep.evaluate(BADGE => {
    const fields = [...document.querySelectorAll('.pcms__field')];
    const t = fields.find(x => (x.querySelector('.pcms__label span') || {}).textContent === '제목');
    t.style.boxShadow = 'inset 0 0 0 3px #e5383b'; t.style.borderRadius = '10px'; t.style.position = 'relative';
    const d = document.createElement('b'); d.textContent = '1'; d.style.cssText = BADGE; d.style.right = '10px'; d.style.top = '10px'; t.appendChild(d);
    // 제목 다음의 설명까지만 보이고 그 아래는 안내 한 줄
    const keep = fields.indexOf(t) + 1;
    fields.forEach((f, i) => { if (i > keep) f.style.display = 'none'; });
    const note = document.createElement('div'); note.textContent = '▼ 할인 문구 · 기간 문구 · 링크도 같은 방법으로 바꿔요';
    note.style.cssText = 'margin:0;padding:14px;background:#f6f1ec;color:#8a6d5d;text-align:center;font:700 15px Pretendard,sans-serif';
    fields[keep].after(note);
  }, BADGE);
  await new Promise(r => setTimeout(r, 600));
  await (await ep.$('#wrap')).screenshot({ path: DIR + 'shots/sale-editor.jpg', type: 'jpeg', quality: 86 });
  console.log('ok sale-editor');
  await b.close();
})();
