const sites = {
  "index.hu": countReadTimeIndex,
  "444.hu": countReadTime444,
  "24.hu": countReadTime24
};

chrome.extension.sendMessage({}, () => {
  let readyStateCheckInterval = setInterval(() => {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      initExtension();
    }
  }, 10);
});

function initExtension() {
  const url = window.location.href;

  Object.keys(sites).forEach(key => {
    if (url.indexOf(key) > -1) {
      delayedRun(sites[key], 0);
    }
  });
}

// INDEX
function countReadTimeIndex() {
  const words = document.querySelector(".cikk-torzs");
  if (!words) return;

  const wordCount = words.innerText.split(" ").length;
  injectReadTimeIndex(parseFloat(wordCount / 275).toFixed(1));
}

function injectReadTimeIndex(readTime) {
  const title = document.querySelector("#content .cikk-header .content-title");
  if (!title) return;
  title.innerHTML = `${title.innerHTML} ${getReadTimeContent(readTime)}`;
}

// 444
function countReadTime444() {
  const words = document.querySelector("#content-main");
  if (!words) return;

  const wordCount = words.innerText.split(" ").length;
  injectReadTime444(parseFloat(wordCount / 275).toFixed(1));
}

function injectReadTime444(readTime) {
  const title = document.querySelector("#headline h1");
  if (!title) return;
  const element = document.createElement("div");
  element.innerHTML = getReadTimeContent(readTime);
  title.insertAdjacentElement("afterEnd", element);
}

// 24
function countReadTime24() {
  const words = document.querySelector(".is_article .post-body");
  if (!words) return;

  const wordCount = words.innerText.split(" ").length;
  injectReadTime24(parseFloat(wordCount / 275).toFixed(1));
}

function injectReadTime24(readTime) {
  const title = document.querySelector(".is_content .author-block-wrapper");
  if (!title) return;
  const element = document.createElement("div");
  element.innerHTML = getReadTimeContent(readTime);
  title.insertAdjacentElement("beforeBegin", element);
}

function getReadTimeContent(readTime) {
  return `
  <div style="display: flex; align-items: center; padding: 5px 0;">
    <svg style="width: 14px; height: 14px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" fill="rgba(0,0,0, .5)">
      <path d="M23,27l-8-7l-8,7V5c0-1.105,0.895-2,2-2h12c1.105,0,2,0.895,2,2V27z"></path>
    </svg>
    <span style="font-size: 13px; font-weight: 600; color: rgba(0,0,0, .5); margin-left: 2px;">${readTime} perc</span>
  </div>
  `;
}

function delayedRun(fn, delay) {
  setTimeout(() => {
    fn();
  }, delay);
}
