console.log("content.js loaded")

let clickPos = { x: 0, y: 0 };

setTimeout(() => {
  document.addEventListener('contextmenu', e => {
    if (e.clientX > 0 || e.clientY > 0) {
      clickPos = { x: e.clientX, y: e.clientY };
    }
  }, false);
}, 2000);

chrome.runtime.onMessage.addListener((msg, _, respond) => {
  if (msg === 'GET_IMAGE' && clickPos.x > 0 && clickPos.y > 0) {
    const el = document.elementFromPoint(clickPos.x, clickPos.y);
    respond(findImg(el));
    return true
  }
});

function findImg(el) {
  if (!el) return null;
  if (el.tagName === 'IMG') return el.src;

  const bg = getComputedStyle(el).backgroundImage;
  const match = bg.match(/url\("?([^"]+)"?\)/);
  if (match) return match[1];

  const img = el.querySelector('img');
  if (img) return img.src;

  return el.parentElement ? findImg(el.parentElement) : null;
}
