
const banner = document.querySelector('.banner'); 
const finalBanner = document.getElementById('finalBanner'); 
const finalText = document.getElementById('finalText'); 
const replayBtn = document.getElementById('replayBtn');

// ✅ 추가: 재생/일시정지 버튼(HTML에 id="playBtn", id="pauseBtn" 추가)
const playBtn  = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');

/* ====== 전역 상태 ====== */
let replayBtnactive = false;   // 중복 실행 방지
let paused = false;            // 일시정지 상태
let sequenceToken = 0;         // 시퀀스 토큰 (다시보기/재시작 시 이전 작업들 즉시 중단)

/* ====== 유틸 ====== */
// (A) 일시정지 상태면 풀릴 때까지 대기
async function waitIfPaused() {
  while (paused) {
    await new Promise(r => setTimeout(r, 60));
  }
}

// (B) sleep 중에도 일시정지/취소를 반영할 수 있게 짧게 쪼개서 기다리기
async function sleep(ms, token) {
  const step = 40; // 40ms씩 쪼갬
  let remain = ms;
  while (remain > 0) {
    // 취소(재시작)되었으면 즉시 중단
    if (token !== sequenceToken) return false;
    await waitIfPaused();
    const slice = Math.min(step, remain);
    await new Promise(r => setTimeout(r, slice));
    remain -= slice;
  }
  return true;
}

/* ====== 타이핑 함수 ====== */
async function typeText(el, text, opts = {}) {
  const speed      = opts.speed ?? 24;    // 글자당 지연
  const pauseAfter = opts.pauseAfter ?? 450;
  const showCaret  = opts.caret ?? true;
  const wipe       = opts.wipe ?? false;
  const token      = opts.token ?? sequenceToken; // 현재 시퀀스 토큰 캡처

  if (token !== sequenceToken) return false;

  if (wipe) {
    el.textContent = "";
  }

  let caretSpan = null;
  if (showCaret) {
    caretSpan = document.createElement('span');
    caretSpan.className = 'caret';
    el.appendChild(caretSpan);
  }

  for (let i = 0; i < text.length; i++) {
    // 재시작(취소) 혹은 일시정지 체크
    if (token !== sequenceToken) {
      if (caretSpan) caretSpan.remove();
      return false; // 중단
    }
    await waitIfPaused();

    const ch = text[i];
    if (caretSpan) caretSpan.remove();
    el.appendChild(document.createTextNode(ch));
    if (caretSpan) el.appendChild(caretSpan);

    const ok = await sleep(speed, token);
    if (!ok) {
      if (caretSpan) caretSpan.remove();
      return false;
    }
  }

  if (caretSpan) caretSpan.remove();

  // 문장 끝 잠깐 대기
  await sleep(pauseAfter, token);
  return token === sequenceToken;
}

/* ====== 재생 시퀀스 ====== */
async function runSequence() {
  if (replayBtnactive) return;

  replayBtnactive = true;
  replayBtn.disabled = true;

  // 🔑 새로운 실행 토큰 발급 (이전 작업 강제 중단)
  const myToken = ++sequenceToken;
  paused = false; // 재생 시작 상태로

  const texts = [
    "사랑받을 자격이 있는 당신, 꼭 살아주세요.",
    "당신의 내일은 아직 쓰여지지 않았습니다.",
    "다시 시작할 기회는 언제나 있습니다.",
    "힘들 땐 기대어도 괜찮습니다.",
    "살아있다는 것 자체가 큰 의미입니다.",
    "당신은 충분히 소중한 사람입니다.",
    "작게라도 희망은 늘 곁에 있습니다.",
    "삶은 다시 빛날 수 있습니다.",
    "당신의 목소리를 듣고 싶어 하는 사람이 있습니다.",
    "오늘의 고통이 영원하지는 않습니다.",
    "세상에 당신이 꼭 필요합니다.",
    "지금의 눈물이 내일의 희망이 됩니다.",
    "상처는 당신의 잘못이 아닙니다.",
    "힘들면 잠시 쉬어가도 괜찮습니다.",
    "누군가는 당신의 미소를 기다립니다.",
    "오늘도 버텨줘서 고맙습니다.",
    "당신의 삶은 소중합니다.",
    "도움을 요청하는 건 용기입니다.",
    "지금의 어둠도 곧 지나갑니다.",
    "당신은 혼자가 아닙니다.",
  ];
  const finale = { text: "삶은 아직 당신의 이야기를 기다리고 있습니다" };

  finalBanner.classList.remove('show');

  const spots = banner.querySelector('.spots');
  spots.querySelectorAll('li').forEach(n => n.remove());

  // 문장들 순서대로 타이핑
  for (let i = 0; i < texts.length; i++) {
    // 취소되었으면 중단
    if (myToken !== sequenceToken) break;

    const li = document.createElement('li');
    li.className = 'spot';
    spots.appendChild(li);

    const ok = await typeText(li, texts[i], { speed: 20, pauseAfter: 280, caret: true, wipe: true, token: myToken });
    if (!ok) break; // 재시작 등으로 취소된 경우
  }

  // 최종 문구
  if (myToken === sequenceToken) {
    finalBanner.classList.add('show');
    await typeText(finalText, finale.text, { speed: 18, pauseAfter: 120, caret: false, wipe: true, token: myToken });
  }

  // 정리
  if (myToken === sequenceToken) {
    replayBtnactive = false;
    replayBtn.disabled = false;
  }
}

/* ====== 초기 구동 및 버튼 바인딩 ====== */
document.addEventListener('DOMContentLoaded', () => {
  runSequence();

  // 다시 보기: 토큰을 증가시켜 기존 타이핑 즉시 중단 후 새 시퀀스
  replayBtn.addEventListener('click', () => {
    sequenceToken++;        // 현재 진행 중 작업들 즉시 중단
    paused = false;         // 재생 상태로
    runSequence();
  });

  // 재생
  if (playBtn) {
    playBtn.addEventListener('click', () => { paused = false; });
  }
  // 일시정지
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => { paused = true; });
  }
});