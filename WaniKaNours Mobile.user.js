// ==UserScript==
// @name         WaniKaNours Mobile
// @namespace    Nounours0261
// @version      1.2
// @description  Useful features on WaniKani
// @author       ChatGPT & Nours
// @match        https://www.wanikani.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @run-at       document-start
// @require      https://github.com/Nounours0261/TamperNours/raw/refs/heads/main/waitForList.js
// @grant        none
// ==/UserScript==


let lastTap = 0;
const doubleTapDelay = 300;

document.addEventListener('touchend', (e) => {
    const touch = e.changedTouches[0];
    if (touch.clientX < window.innerWidth / 2) return;

    const currentTime = Date.now();
    const tapLength = currentTime - lastTap;

    if (tapLength < doubleTapDelay && tapLength > 0) {
        document.querySelector(".quiz-input__submit-button").click();
    }

    lastTap = currentTime;
});


function hitoka(hiragana) {
    const offset = 0x60;
    let katakana = Array.from(hiragana).map(char => {
        let codePoint = char.codePointAt(0);
        if (codePoint >= 0x3040 && codePoint <= 0x309F) {
            codePoint += offset;
        }
        return String.fromCodePoint(codePoint);
    });
    return katakana.join('');
}

let revObserver;
let observingRev = false;
let lesObserver;
let observingLes = false;

function handleRevMutation(mutation) {
    for (let curNode of mutation.addedNodes) {
        const cl = curNode.classList;
        if (cl && cl[0].includes("container") && !curNode.hasAttribute("katakanours")) {
            curNode.setAttribute("katakanours", "");
            document.querySelectorAll(`#section-reading .subject-readings__reading-items,
                                       #section-reading .subject-section__text,
                                       #section-reading .reading-with-audio__reading`).forEach((e) => {
                e.innerHTML = hitoka(e.innerHTML);
            });
        }
    }
}

async function kataReviews(start) {
    if (start) {
        if (!revObserver) {
            revObserver = new MutationObserver((mutations) => {
                mutations.forEach(handleRevMutation);
            });
        }
        if (!observingRev) {
            observingRev = true;
            let subInfo = (await waitForList("#subject-info"))[0];
            revObserver.observe(subInfo, {childList: true});
        }
    } else {
        if (observingRev) {
            observingRev = false;
            revObserver.disconnect();
        }
    }
}

function handleLesMutation(mutation) {
    for (let curNode of mutation.addedNodes) {
        if (curNode.id === "turbo-body" && !curNode.getAttribute("katakanours")) {
            curNode.setAttribute("katakanours", "");
            document.querySelectorAll(`#reading .reading-with-audio__reading,
                                       #reading .wk-text`).forEach((e) => {
                e.innerHTML = hitoka(e.innerHTML);
            });
        }
    }
}

async function kataLessons(start) {
    if (start) {
        if (!lesObserver) {
            lesObserver = new MutationObserver((mutations) => {
                mutations.forEach(handleLesMutation);
            });
        }
        if (!observingLes) {
            observingLes = true;
            lesObserver.observe(document.getElementsByTagName("body")[0], {childList: true});
        }
    } else {
        if (observingLes) {
            observingLes = false;
            lesObserver.disconnect();
        }
    }
}

function runScript() {
    const url = window.location.href;
    kataReviews(url.includes("review"));
    kataLessons(url.includes("subject-lessons") && !url.includes("quiz") && !url.includes("picker"));
    kataReviews(url.includes("subject-lessons") && url.includes("quiz"));
}

async function handleEnter() {
    document.dispatchEvent(new KeyboardEvent("keydown", {key: "f", bubbles: true,}));

    const inputWrapper = document.querySelector(".quiz-input__input-container");
    if (inputWrapper.getAttribute("correct") === false) {
        const inputEl = inputWrapper.querySelector("#user-response");
        inputEl.disabled = true;
        inputEl.disabled = false;
    }
    const container = document.querySelector(".quiz");
    container.onscroll = () => {
        container.scrollTo(0, 0);
        setTimeout(() => {
            container.onscroll = null;
        }, 50);
    };

    wrapKanjiWithLinks("character-header__characters");
}

function handleKeys(e) {
    if (e.key === "Enter") {
        const response = document.querySelector(".additional-content__item--item-info");
        if (response && !response.classList.contains("additional-content__item--open")) {
            handleEnter();
        }
    }
}

function wrapKanjiWithLinks(className) {
    const targetElement = document.querySelector(`.${className}`);
    if (!targetElement) {
        console.error(`Element with class '${className}' not found.`);
        return;
    }
    targetElement.innerHTML = targetElement.innerText.replace(/[\u4E00-\u9FFF]/g, (kanji) => {
        return `<a href="https://www.wanikani.com/kanji/${kanji}" target="_blank" style="text-decoration: none; color: inherit;">${kanji}</a>`;
    });
}


async function main() {
    runScript();
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
        originalPushState.apply(this, args);
        runScript();
    };
    window.addEventListener('popstate', runScript);
    document.addEventListener('keydown', handleKeys);
}

main();