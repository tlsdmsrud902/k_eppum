// 디자인센터 상세페이지 만들기 (PETPIA 상세페이지와 같은 구성) — eppum (K-뷰티)
//   node docs/tools/designcenter-detail.js        → _deploy/dc/detail.html (미리보기 · 이미지로 굽기용)
// 재료 : _deploy/dc/detail.css (상세 CSS — eppum-designcenter-detail.html 의 <style>), _deploy/dc/img/*.webp (스킨 사진),
//        _deploy/dc/shots/walk-NN-page|edit.jpg (섹션 캡처, walk.js), sale-edit · sale-editor · sale-after.jpg (SALE 예시),
//        _deploy/dc/walk-meta.json (섹션마다 번호 붙인 칸 이름)
const fs = require('fs');
const path = require('path');
const DC = path.join(__dirname, '../../_deploy/dc');
const CSS = fs.readFileSync(path.join(DC, 'detail.css'), 'utf8');
const META = JSON.parse(fs.readFileSync(path.join(DC, 'walk-meta.json'), 'utf8'));
const ORDER_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSf26MVAAFBO6btjz97kuKnjw6jvWKNdJ21ET3jIUsov0NTR_g/viewform?usp=header';
const SAMPLE = 'https://ecudemo409119.cafe24.com/';
const I = n => 'img/' + n + '.webp';
const S = n => 'shots/' + n + '.jpg';

// 섹션 머리글 · 버튼 이름 · 덧붙임 안내
const SEC = {
  '첫 화면': ['Glow softly, every day', '메인 첫 화면 (사진 · 영상 3장면)', '첫 화면 고치기', ['<b>영상 넣기</b> : 1번의 <em>영상 주소</em> 칸에 mp4 주소를 넣으면 그 영상이, 비우면 사진이 나와요.', '스크롤하면 나오는 2번 · 3번 장면도 아래쪽 칸에서 똑같이 바꿔요.']],
  '이용 안내': ['Shop info', '이용 안내 (배송 · 교환 · 후기 · 문의)', '이용 안내 고치기', ['안내 칸을 늘리려면 [복사해서 추가], 줄이려면 [삭제]를 눌러요.']],
  '루틴 고르기': ["What's your routine?", '오늘은 어떤 루틴이 필요하세요?', '루틴 고르기 고치기', ['스킨케어 · 메이크업 카드마다 사진, 제목, 바로가기를 바꿔요. 바로가기는 한 줄에 「이름 주소」로 써요.']],
  '카테고리': ['Shop by need', '오늘은 무엇이 필요하세요?', '카테고리 고치기', ['동그라미 하나가 칸 하나예요. 분류를 늘리려면 [복사해서 추가]를 눌러요.']],
  '추천 상품 제목': ['Curated · New · Best · Reviews', '상품 섹션 4곳 (추천 · 신상 · 인기 · 포토리뷰)', '추천 상품 제목 고치기', ['상품은 카페24 관리자 › 메인 진열에서 고르면 자동으로 나와요. 섹션 제목과 버튼 글자만 [고치기]로 바꿔요.', '포토리뷰는 상품 사용후기 게시판의 사진 후기가 자동으로 모여요.']],
  '루틴 찾기': ['Find your routine', '나에게 맞는 루틴은 무엇일까요?', '루틴 찾기 고치기', ['선택지 사진과 안내 글을 바꿔요.']],
  '루틴 가이드': ['Routine, made easy', '루틴, 어렵지 않아요', '루틴 가이드 고치기', ['1 · 2 · 3단계 글도 아래 칸에서 바꿔요.']],
  '장면 속 상품': ['Shop the look', '장면 속 그 상품', '장면 속 상품 고치기', ['사진 위 + 점은 편집 창에서 사진을 눌러 찍고, 상품번호만 적으면 상품 이름 · 가격이 자동으로 나와요.']],
  '기획전': ['A day to celebrate', '소중한 사람에게, 빛나는 하루를', '기획전 고치기', ['왼쪽 · 오른쪽 배너의 사진, 글, 링크를 바꿔요.']],
  '체크리스트': ['Your routine list', '나만의 루틴, 하나씩 채워요', '체크리스트 고치기', ['준비물은 한 줄에 하나씩 쓰면 그대로 체크 항목이 돼요.']],
  '뷰티 노트': ['Beauty notes', '더 예뻐지는 작은 습관', '뷰티 노트 고치기', ['카드를 늘리거나 줄일 수 있어요.']],
  '회원 안내': ['Your beauty, in one place', '다음 쇼핑도, 조금 더 편하게', '회원 안내 고치기', []],
  '자주 묻는 질문': ['A little help', '자주 묻는 질문', '자주 묻는 질문 고치기', ['질문을 늘리려면 [복사해서 추가]를 눌러요.']],
  '맨 아래 브랜드': ['eppum', '맨 아래 브랜드', '맨 아래 브랜드 고치기', ['큰 로고 사진과 문장을 우리 가게 것으로 바꿔요.']],
  '이벤트 팝업': ['Event popup', '메인 이벤트 팝업', '이 팝업 고치기', ['팝업 <em>사진</em> → [사진 바꾸기]를 누르고 내 컴퓨터 사진 고르기', '<em>제목 · 설명 · 버튼 · 링크</em> 칸 → 지우고 새로 쓰기', '<em>마감 시각</em>에 2026-10-31 23:59 처럼 쓰면 남은 시간 타이머가 붙어요.', '팝업은 최대 5장까지 저절로 넘어가요. [복사해서 추가]로 늘려요.']],
};
const isPhoto = l => /사진/.test(l) && !/스티커|글/.test(l);
const mapItem = (l, i) => isPhoto(l)
  ? `<li><b>${i + 1}</b><span><em>${l}</em> → [사진 바꾸기]를 누르고 내 컴퓨터 사진 고르기</span></li>`
  : `<li><b>${i + 1}</b><span><em>${l}</em> 칸 → 지우고 새로 쓰기</span></li>`;

const ezSecs = META.map(m => {
  const [kick, title, btn, notes] = SEC[m.name];
  return `
    <div class="ez-sec">
      <header><span class="ez-no">${m.id}</span><div><small>${kick}</small><h3>${title}</h3></div></header>
      <p class="ez-lead">이 섹션의 <b>[${btn}]</b>를 누르면 아래 창이 열려요. <b>화면의 번호 = 창의 번호</b>예요.</p>
      <figure class="ez-page"><img src="${S('walk-' + m.id + '-page')}" alt="${title} 화면"></figure>
      <p class="ez-arrow">▼ [고치기]를 누르면 열리는 창</p>
      <figure class="ez-edit"><img src="${S('walk-' + m.id + '-edit')}" alt="${title} 편집 창"></figure>
      <ul class="ez-map">${m.found.map(mapItem).join('')}${notes.map(n => `<li class="ez-note"><b>+</b><span>${n}</span></li>`).join('')}</ul>
    </div>`;
}).join('');

const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>eppum | 디자인센터 상세페이지</title>
<meta name="description" content="스킨케어 · 메이크업 · 바디/헤어를 한곳에서. 이벤트와 타임세일, 쿠폰 뽑기까지 갖춘 eppum 카페24 K-뷰티 쇼핑몰 디자인 상세페이지입니다.">
<style>${CSS}
.hero{background-image:url('${I('scene-glow')}')}
.sale-photo{background-image:url('${I('scene-nail')}')}
.closing{background-image:url('${I('scene-vanity')}')}
.hero-brand img{width:150px}
</style>
</head>
<body>
<main class="sheet">
  <section class="hero" id="top">
    <div class="hero-brand"><img src="${I('logo-eppum')}" alt="eppum"></div>
    <div class="hero-stamp">DESIGNED<br>FOR EVERY<br><b>ROUTINE</b></div>
    <div class="hero-copy">
      <span class="eyebrow">A Cafe24 shop skin for everyday beauty</span>
      <h1 class="serif">Glow softly.<br><i>Every day.</i></h1>
      <p>좋은 제품을 발견하는 즐거움부터, 나를 가꾸는 세심한 경험까지.<br>eppum은 매일의 스킨케어와 메이크업을 한곳에서 연결합니다.</p>
      <div class="label-row"><span>첫 화면 3장면 비주얼 (영상 가능)</span><span>SALE 전용 이벤트 페이지</span><span>랜덤 쿠폰 뽑기 · 마감 카운트다운</span><span>상품별 타임세일</span><span>스킨케어 · 메이크업 맞춤 탐색</span><span>무료배송 진행바 · 재고 임박 안내</span><span>후기 작성 유도 · 포토리뷰 이벤트</span><span>루틴 체크리스트 · 3단계 루틴 가이드</span></div>
    </div>
  </section>
  <section class="easy" id="easy">
    <div class="easy-head"><span class="eyebrow">After purchase · no code</span><h2>구매 후, 이렇게 쉽게 바꿔요</h2><p>코드를 몰라도 돼요.<br><b>바꾸고 싶은 곳의 주황 버튼 → 글 고쳐 쓰기 → 저장</b>, 이게 전부예요.</p></div>
    <div class="ez-try">
      <h3>먼저 딱 한 번 해 볼까요? <span>세일 배너 문구를 우리 가게 문구로</span></h3>
      <div class="ez-step"><p class="t"><b>1</b><span>구매 후 알려 드리는 <em>관리자 전용 주소</em>로 쇼핑몰을 열면, 모든 섹션에 주황색 <em>[고치기]</em> 버튼이 생겨요.</span></p><img src="${S('sale-edit')}" alt="고치기 버튼이 생긴 SALE 페이지"></div>
      <div class="ez-step"><p class="t"><b>2</b><span>[고치기]를 누르면 이 창이 열려요. <em>화면에 있던 글이 칸에 그대로</em> 들어 있으니 지우고 새로 쓰면 돼요.</span></p><img src="${S('sale-editor')}" alt="세일 큰 화면 편집 창" class="narrow"></div>
      <div class="ez-step"><p class="t"><b>3</b><span><em>[저장하기]</em>를 누르면 끝! 쇼핑몰을 새로고침하면 바로 바뀌어 있어요.</span></p><img src="${S('sale-after')}" alt="새 문구로 바뀐 SALE 큰 화면"></div>
      <div class="ez-step"><p class="t"><b>+</b><span>사진도 똑같아요. <em>[사진 바꾸기]</em>를 누르고 내 컴퓨터 사진을 고르면 바로 바뀌어요.</span></p><p class="s">권장 크기와 다르면 바로 알려 줘서, 잘린 사진이 올라가지 않아요.</p></div>
    </div>
    <div class="ez-list-head"><span class="eyebrow">From top to bottom</span><h3>메인 화면, 위에서부터 하나씩</h3><p>모든 섹션이 같은 방법이에요. 화면에 붙은 번호와 창의 번호를 맞춰 보세요.</p></div>
    ${ezSecs}
    <div class="ez-end"><b>세일 페이지 · 상품 목록 위 배너 · 게시판 · 가이드 페이지</b>도 똑같이 [고치기]가 나와요.<br>섹션 숨기기 · 순서 바꾸기도 버튼 하나로, 실수해도 [실행 취소]와 [이전 저장본]으로 되돌려요.<br>카카오톡 상담 버튼도 편집 모드에서 채널 주소만 붙여 넣으면 연결돼요.</div>
  </section>
  <section class="process" id="process">
    <div class="process-head"><span class="eyebrow">After purchase · what happens next?</span><h2>작업 진행 절차 안내</h2><p>주문부터 디자인 적용과 완료 안내까지, 진행 순서를 먼저 확인해 주세요.</p></div>
    <div class="process-grid">
      <article class="process-card"><b><span>01</span> 디자인 선택 및 결제</b><p>디자인과 필요한 구매 옵션을 확인한 뒤 주문·결제를 진행합니다.</p></article>
      <article class="process-card"><b><span>02</span> 주문 접수</b><p>결제 확인 후 안내되는 접수 방법에 따라 쇼핑몰 정보와 요청사항을 전달합니다.</p><a class="process-cta" href="${ORDER_FORM}" target="_blank" rel="noopener">주문서 접수하기</a></article>
      <article class="process-card"><b><span>03</span> 디자인 복사 및 세팅</b><p>접수 내용 확인 후 선택한 상품에 포함된 디자인 복사와 세팅 작업을 진행합니다.</p></article>
      <article class="process-card"><b><span>04</span> 완료 확인 및 매뉴얼 전달</b><p>작업 결과를 확인하고, 디자인 사용에 필요한 매뉴얼과 안내를 전달받습니다.</p></article>
    </div>
    <p class="process-foot">세팅 범위와 준비 정보는 구매 옵션 및 주문 후 안내 내용을 확인해 주세요.</p>
  </section>
  <nav class="quick" aria-label="상세페이지 바로가기">
    <a href="#sale"><span>01 / EVENT</span>행사와 카운트다운</a><a href="#coupon"><span>02 / COUPON</span>쿠폰 뽑기</a><a href="#timesale"><span>03 / TIME SALE</span>상품별 마감 표시</a><a href="#shop"><span>04 / SHOPPING</span>쉬운 상품 찾기</a>
  </nav>
  <section class="intro">
    <div class="brandmark">e</div><span class="eyebrow">Thoughtful beauty, every day</span>
    <h2>쇼핑몰의 첫인상부터<br>구매를 돕는 작은 기능까지</h2>
    <p class="lead">브랜드 분위기를 전하는 뷰티 비주얼, 원하는 제품을 빠르게 찾는 탐색 구조, 다시 방문하게 만드는 프로모션. 보기 좋은 화면 안에 운영과 구매에 꼭 필요한 흐름을 담았습니다.</p>
  </section>
  <section class="event-hero" id="sale">
    <div class="event-top"><span class="eyebrow">Season sale · a little something for you</span><h2 class="serif">좋은 발견은<br>기다릴 때 더 설레니까</h2><p>SALE 전용 페이지에서 이벤트와 상품 혜택을 한눈에 안내합니다.</p>
      <div class="timer" aria-label="이벤트 종료까지 남은 시간을 보여주는 카운트다운 예시"><div class="timebox"><strong>30</strong><small>DAYS</small></div><div class="timebox"><strong>21</strong><small>HOURS</small></div><div class="timebox"><strong>49</strong><small>MIN</small></div><div class="timebox"><strong>00</strong><small>SEC</small></div></div>
      <p class="micro" style="margin-top:12px;color:#c9bdb1">이벤트 종료 시각에 맞춰 남은 시간이 자동으로 줄어드는 구성</p>
    </div>
    <div class="sale-photo"><div class="sale-caption"><span class="eyebrow">BEAUTY ESSENTIALS EDIT</span><h3>Good finds.<br>Pretty days.</h3><p>매일의 루틴을 위한 반가운 발견</p><span class="offer">UP TO 50% · LIMITED TIME ONLY</span></div></div>
    <div class="event-strip">GLOW SOFTLY &nbsp; · &nbsp; SEASONAL PICKS &nbsp; · &nbsp; LITTLE THINGS, BETTER DAYS</div>
  </section>
  <section class="section center">
    <span class="eyebrow">One page, more reasons to shop</span><h2>이벤트 안내와 혜택을<br>한 화면에 모아</h2><p class="lead">메인 팝업과 SALE 페이지가 방문자의 시선을 혜택으로 안내하고, 바로 상품을 살펴볼 수 있도록 이어집니다.</p>
    <div class="feature-pair">
      <article class="feature-card"><img src="${I('scene-lip')}" alt="SALE 이벤트 배너 이미지"><div class="copy"><small>SALE EVENT</small><strong>마감 시간을 보여주는 기획전</strong><p>큰 비주얼과 종료 카운트다운으로 이벤트 기간과 시즌 혜택을 명확하게 전달합니다.</p></div></article>
      <article class="feature-card"><img src="${I('scene-palette')}" alt="포토리뷰 이벤트 이미지"><div class="copy"><small>REVIEW EVENT</small><strong>포토리뷰 참여 안내</strong><p>메인 팝업에서 리뷰 혜택을 소개하고 리뷰 작성 페이지로 연결합니다. 현재 샘플 안내는 포토리뷰 3,000P입니다.</p></div></article>
    </div>
  </section>
  <section class="section coupon-section" id="coupon">
    <div class="coupon-grid">
      <div class="coupon-art"><img src="${I('sq-powder')}" alt="eppum 파우더 · 퍼프 이미지"><span class="coupon-sticker">RANDOM COUPON · MAX 50%</span></div>
      <div class="coupon-copy"><span class="eyebrow">A little gift for you</span><h2>쿠폰 뽑기의 설렘</h2><p class="lead">SALE 페이지에서 회원이 쿠폰을 직접 뽑고, 받은 혜택을 마이쿠폰에서 확인한 뒤 주문서에 적용합니다.</p>
        <div class="coupon-cards"><div class="coupon-card"><span>LUCKY COUPON</span><strong>5%</strong></div><div class="coupon-card"><span>LUCKY COUPON</span><strong>10%</strong></div><div class="coupon-card"><span>LUCKY COUPON</span><strong>20%</strong></div><div class="coupon-card"><span>LUCKY COUPON</span><strong>50%</strong></div></div>
        <h3>참여는 간단하게, 적용은 편리하게</h3><div class="steps"><div class="step"><b>STEP 01</b><span>로그인</span></div><div class="step"><b>STEP 02</b><span>쿠폰 뽑기</span></div><div class="step"><b>STEP 03</b><span>마이쿠폰 확인</span></div><div class="step"><b>STEP 04</b><span>주문서에 적용</span></div></div>
        <div class="note-box"><strong>운영 안내</strong><br>회원 전용 · 1인 1회 참여 · 발급 쿠폰은 마이쿠폰에서 확인 · 사용기간과 적용 조건은 쿠폰별 설정에 따릅니다.</div>
      </div>
    </div>
  </section>
  <section class="section timesale" id="timesale">
    <span class="eyebrow">A moment worth catching</span><h2>타임세일 혜택,<br>상품에서도 바로 확인</h2><p class="lead">타임세일 상품은 상품 카드와 상세 화면에서 할인 배지와 남은 시간을 보여줘 혜택과 기간을 놓치지 않게 돕습니다.</p>
    <div class="timesale-layout">
      <div class="product-shot"><img src="${I('sq-serum')}" alt="세럼 상품 이미지"><span class="sale-badge">TIME SALE</span><div class="floating-timer"><span>혜택 종료까지</span><strong>08 : 24 : 16</strong></div></div>
      <div><div class="mini-window"><div class="mini-head"><b>PRODUCT DETAIL</b><span>혜택 확인이 쉬운 상품 화면</span></div><div class="mini-product"><img src="${I('sq-serum')}" alt="비타C 울트라 글로우 세럼 미리보기"><div><h3>비타C 울트라 글로우 세럼</h3><div class="price"><del>45,000원</del> 38,000원</div><span class="discount">TIME SALE · 15% OFF</span></div></div><div class="bar"><i></i></div><div class="floating-timer" style="position:static;margin-top:14px;background:#f4eee7;color:#3d342d"><span>남은 시간</span><strong style="color:#8d4e3d">08 : 24 : 16</strong></div></div>
        <div class="timesale-copy"><h3>목록에서 보고, 상세에서 다시 확인</h3><ul class="check-list"><li>상품 목록에 SALE 배지와 할인 정보 표시</li><li>상품 상세에 종료 카운트다운 배너 안내</li><li>상품별 종료 시각과 배너 색상을 설정해 운영</li></ul><p class="micro" style="margin-top:14px">표시 예시는 이해를 돕기 위한 샘플이며, 실제 할인율·종료 시각은 상품과 운영 설정에 따라 달라집니다.</p></div>
      </div>
    </div>
  </section>
  <section class="section merchant-tools">
    <div class="merchant-head"><div><span class="eyebrow">More comfort for the shop owner</span><h2>운영에 필요한 편의 기능도<br>꼼꼼하게</h2><p class="lead">고객의 구매 결정을 돕는 안내를 장바구니와 상품 상세의 필요한 위치에 보여줍니다.</p></div></div>
    <div class="merchant-grid">
      <article class="merchant-card"><span class="tiny-label">01 / SHIPPING</span><h3>무료배송 진행바</h3><p>장바구니 상단에서 무료배송 기준까지 남은 금액과 진행 상태를 안내합니다.</p><div class="mock-ui"><small>CART · FREE SHIPPING GOAL</small><strong>15,000원 더 담으면 무료배송</strong><div class="mock-bar"><i></i></div><small style="margin:8px 0 0">무료배송까지 남은 금액을 한눈에 확인</small></div></article>
      <article class="merchant-card"><span class="tiny-label">02 / LOW STOCK</span><h3>재고 임박 표시</h3><p>재고가 얼마 남지 않은 상품은 상세 가격 아래에 남은 수량을 보여줍니다.</p><div class="mock-ui"><small>PRODUCT DETAIL · PRICE</small><div class="mock-price">38,000원 <em>재고 3개 남음 · 품절 임박</em></div></div></article>
      <article class="merchant-card"><span class="tiny-label">03 / REVIEW PROMO</span><h3>후기 작성 유도 배너</h3><p>상품 상세의 후기 영역 위에 참여 문구와 후기 작성 버튼을 배치합니다.</p><div class="mock-ui"><small>JUST ABOVE PRODUCT REVIEWS</small><div class="mock-prompt"><b>구매하신 상품의 후기를 남겨 주세요<br><span style="font-weight:500;color:#8a7867">리뷰 혜택 안내</span></b><span>후기 쓰기 →</span></div></div></article>
    </div>
  </section>
  <section class="section flow">
    <div class="center"><span class="eyebrow">What's your routine?</span><h2>오늘 필요한 루틴으로<br>먼저 안내해 주세요</h2><p class="lead">스킨케어 · 메이크업과 필요한 순간을 고르면 어울리는 상품으로 연결되는 간단한 추천 도구를 제공합니다.</p></div>
    <div class="flow-grid"><article class="flow-card"><div class="photo"><img src="${I('card-skincare')}" alt="스킨케어 카테고리"></div><div class="copy"><small>01 / SKINCARE</small><h3>맑은 피부를 위해</h3><p>토너 · 세럼 · 크림 · 마스크 · 선케어로 바로 이동</p></div></article><article class="flow-card"><div class="photo"><img src="${I('card-makeup')}" alt="메이크업 카테고리"></div><div class="copy"><small>02 / MAKEUP</small><h3>오늘의 컬러를 위해</h3><p>베이스 · 립 · 아이섀도 · 마스카라 · 브러시로 바로 이동</p></div></article><article class="flow-card"><div class="photo"><img src="${I('portrait-glow')}" alt="촉촉한 피부 표현"></div><div class="copy"><small>03 / NEED</small><h3>지금 필요한 고민</h3><p>보습 · 생기 · 지속력 중 골라 어울리는 상품을 확인</p></div></article></div>
  </section>
  <section class="section shopping" id="shop">
    <div class="center"><span class="eyebrow">A clear path to the right product</span><h2>찾기 쉽고, 비교하기 편한<br>상품 탐색</h2><p class="lead">종류별 바로가기부터 추천 상품, 신규 입고, 인기 상품까지. 쇼핑 목적에 따라 필요한 제품을 빠르게 만날 수 있습니다.</p></div>
    <div class="shop-demo"><div class="shop-top"><b>SHOP BY NEED</b><span>카테고리를 눌러 상품 둘러보기</span></div><div class="category-pills"><span>전체</span><span>세럼</span><span>크림</span><span>마스크</span><span>선케어</span><span>베이스</span><span>립</span><span>아이</span></div><div class="product-row"><div class="product-card"><img src="${I('sq-cream')}" alt="크림 추천 상품"><div><b>보태니컬 페이스 크림</b><small>스킨케어</small><div class="icons">♡　＋</div></div></div><div class="product-card"><img src="${I('sq-lip')}" alt="립 상품"><div><b>데일리 립 컬러</b><small>메이크업 · 립</small><div class="icons">♡　＋</div></div></div><div class="product-card"><img src="${I('sq-eye')}" alt="아이 메이크업 상품"><div><b>아이섀도 팔레트</b><small>메이크업 · 아이</small><div class="icons">♡　＋</div></div></div><div class="product-card"><img src="${I('sq-sun')}" alt="선케어 상품"><div><b>데일리 선 플루이드</b><small>스킨케어 · 선케어</small><div class="icons">♡　＋</div></div></div></div><div class="shop-benefits"><div><b>찜하기</b><span>마음에 든 상품을 저장</span></div><div><b>빠른 장바구니</b><span>상품 카드에서 담기</span></div><div><b>정렬해서 비교</b><span>신상품·가격·리뷰순 확인</span></div></div></div>
  </section>
  <section class="section convenience">
    <div class="center"><span class="eyebrow">Small helps for everyday decisions</span><h2>구매 전 고민을 덜어주는<br>실용적인 안내</h2><p class="lead">첫 루틴을 만드는 순간부터 제품 선택과 배송 확인까지, 자주 묻는 내용을 필요한 자리에 배치했습니다.</p></div>
    <div class="convenience-grid"><div class="convenience-photo"><img src="${I('portrait-vanity')}" alt="루틴 준비를 위한 화장대"></div><div class="tool-list"><div class="tool-row"><div class="tool-icon">01</div><div><b>나만의 루틴 체크리스트</b><span>스킨케어 · 메이크업 항목을 체크하고 진행 상황 저장</span></div><em>CHECK</em></div><div class="tool-row"><div class="tool-icon">02</div><div><b>3단계 루틴 가이드</b><span>세안 · 보습 · 마무리 순서를 그림으로 안내</span></div><em>GUIDE</em></div><div class="tool-row"><div class="tool-icon">03</div><div><b>상품별 상세 문의</b><span>피부 고민이나 배송 문의를 게시판으로 연결</span></div><em>Q&amp;A</em></div><div class="tool-row"><div class="tool-icon">04</div><div><b>FAQ 아코디언</b><span>피부 타입 · 민감 피부 · 선물 · 교환 질문 빠르게 확인</span></div><em>HELP</em></div><div class="tool-row"><div class="tool-icon">05</div><div><b>마이페이지 한곳에서</b><span>관심상품 · 주문/배송 · 보유 쿠폰 조회</span></div><em>MY PAGE</em></div></div></div>
  </section>
  <section class="section proof">
    <span class="eyebrow">Stories from every routine</span><h2>사용 경험이 다음 선택으로<br>이어지도록</h2><p class="lead">상품에 연결된 구매 후기와 포토리뷰를 통해 실제 사용 경험을 확인하고, 리뷰 이벤트로 참여를 안내합니다.</p>
    <div class="review-banner"><img src="${I('scene-cream')}" alt="크림 제형 이미지"><div class="review-copy"><span class="star">★★★★★</span><h3>포토리뷰로 나누는<br>나의 뷰티 루틴</h3><p>상품 사진과 후기를 살펴보고, 구매 후에는 나만의 경험을 남겨보세요. 상품 카드마다 평점과 리뷰 수가 붙고, 메인에는 최신 포토리뷰가 모여요.</p><span class="reward">샘플 이벤트 · 포토리뷰 3,000P</span></div></div>
  </section>
  <section class="section" style="background:#f2e9df">
    <div class="split"><div><span class="eyebrow">A design that feels like a brand</span><h2>따뜻한 색과<br>정돈된 구성</h2><p class="lead">로즈 · 누드 톤과 뷰티 라이프스타일 사진, 여백을 살린 타이포그래피로 제품을 편안하게 보여줍니다. PC와 모바일 화면에 맞춰 자연스럽게 정리됩니다.</p><div class="label-row"><span>K-뷰티 메인 비주얼</span><span>반응형 화면</span><span>브랜드 컬러 구성</span></div></div><div class="img-panel"><img src="${I('scene-botanical')}" alt="보태니컬 세럼 라이프스타일 이미지"></div></div>
  </section>
  <section class="closing"><span class="eyebrow">Your shop, ready for better everyday beauty</span><h2 class="serif">필요한 기능을 갖춘<br>나만의 K-뷰티 쇼핑몰을 시작하세요</h2><p>eppum으로 이벤트를 알리고, 혜택을 전하고, 매일의 편리한 뷰티 쇼핑을 만들어보세요.</p><a href="${SAMPLE}" target="_blank" rel="noopener">샘플 사이트 둘러보기 ↗</a></section>
  <footer class="footer"><b>EPPUM</b><p>Events · Time Sale · Lucky Coupon · Everyday Beauty Shopping</p><p>※ 이미지와 상품 예시는 eppum 사이트 화면 구성을 소개하기 위한 샘플입니다. 이벤트 혜택·상품·재고·가격·기간은 운영 설정에 따라 변경될 수 있습니다.</p></footer>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(DC, 'detail.html'), html);
const left = html.match(/food|식품|식탁|PETPIA|반려|강아지|고양이|wear|Together|목둘레/gi) || [];
console.log('ok', html.length, '| 남은 옛 단어', left);
