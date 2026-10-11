// 网页入场动画：5 个感叹号依次弹入，稳定后淡出，进入首屏。
// prefers-reduced-motion：直接跳过。

const LOGO_SRC  = encodeURI('网页入场动画素材/MYGO的logo蓝色的.jpeg');
const GROUP_SRC = encodeURI('网页入场动画素材/收尾动作.jpg');

const STAGGER   = 130;   // 每个 ! 弹出的间隔 (ms)
const BANG_DUR  = 500;   // 每个 ! 的弹入动画时长 (ms)，与 CSS 一致
const HOLD      = 400;   // 最后一个 ! 弹入完成后的停留时间 (ms)
const FADE_OUT  = 350;   // overlay 淡出时长 (ms)，与 CSS transition 一致

function buildOverlay() {
  const ov = document.createElement('div');
  ov.id = 'intro';
  ov.setAttribute('aria-hidden', 'true');
  ov.innerHTML = `
    <div class="intro-bg"></div>
    <div class="intro-bangs" aria-hidden="true">
      <span class="intro-bang">!</span>
      <span class="intro-bang">!</span>
      <span class="intro-bang">!</span>
      <span class="intro-bang">!</span>
      <span class="intro-bang">!</span>
    </div>
  `;
  return ov;
}

function run() {
  const ov    = buildOverlay();
  document.body.prepend(ov);
  const bangs = ov.querySelectorAll('.intro-bang');
  const COUNT = bangs.length;

  // ① 蓝幕淡入
  requestAnimationFrame(() => ov.classList.add('intro-visible'));

  // ② 依次弹入：每隔 STAGGER ms 触发一个，速度相同
  bangs.forEach((el, i) => {
    setTimeout(() => el.classList.add('intro-bang-in'), i * STAGGER);
  });

  // ③ 最后一个 ! 弹入完成 + 停留后，整体淡出
  const lastBangEnd = (COUNT - 1) * STAGGER + BANG_DUR + HOLD;
  setTimeout(() => {
    ov.classList.add('intro-done');
  }, lastBangEnd);

  setTimeout(() => {
    ov.remove();
  }, lastBangEnd + FADE_OUT + 50);
}

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // 不插入任何元素，页面直接正常展示
} else {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
}
