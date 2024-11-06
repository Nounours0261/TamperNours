// ==UserScript==
// @name         WaniKaNours
// @namespace    Nounours0261
// @version      1
// @description  Useful features on WaniKani
// @author       ChatGPT & Nours
// @match        https://www.wanikani.com/*
// @icon         https://img.stackreaction.com/apps/logos/wanikani_192.png
// @run-at       document-start
// @grant        none
// ==/UserScript==

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

function handleRevMutation(mutation)
{
    for (let curNode of mutation.addedNodes)
    {
        const cl = curNode.classList;
        if (!(cl && cl[0].includes("container") && !curNode.getAttribute("katakanours")))
        {
            continue;
        }
        curNode.setAttribute("katakanours", true);
        const readingSection = document.getElementById("section-reading");
        if (!readingSection)
        {
            continue;
        }
        const hiraElm = readingSection.querySelectorAll(".subject-readings__reading-items, .subject-section__text, .reading-with-audio__reading");
        if (!hiraElm)
        {
            continue;
        }
        for (let e of hiraElm)
        {
            e.innerHTML = hitoka(e.innerHTML);
        }
    }
}

function waitForElement(id) {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            const element = document.getElementById(id);
            if (element) {
                clearInterval(interval);
                resolve(element);
            }
        }, 100);
    });
}

async function kataReviews(start)
{
    if (start)
    {
        if (!revObserver)
        {
            revObserver = new MutationObserver((mutations) => { mutations.forEach(handleRevMutation); });
        }
        if (!observingRev)
        {
            observingRev = true;
            let subInfo = await waitForElement("subject-info");
            revObserver.observe(subInfo, {childList: true});
        }
    }
    else
    {
        if (observingRev)
        {
            observingRev = false;
            revObserver.disconnect();
        }
    }
}

function handleLesMutation(mutation)
{
    for (let curNode of mutation.addedNodes)
    {
        if (curNode.id == "turbo-body" && !curNode.getAttribute("katakanours"))
        {
            curNode.setAttribute("katakanours", true);
            const readingSection = document.getElementById("reading");
            const hiraElm = readingSection.querySelectorAll(".reading-with-audio__reading, .wk-text");
            if (!hiraElm)
            {
                continue;
            }
            for (let e of hiraElm)
            {
                e.innerHTML = hitoka(e.innerHTML);
            }
        }
    }
}

async function kataLessons(start)
{
    if (start)
    {
        if (!lesObserver)
        {
            lesObserver = new MutationObserver((mutations) => { mutations.forEach(handleLesMutation); });
        }
        if (observingLes)
        {
            observingLes = true;
            lesObserver.observe(document.getElementsByTagName("body")[0], {childList: true});
        }
    }
    else
    {
        if (observingLes)
        {
            observingLes = false;
            lesObserver.disconnect();
        }
    }
}

function openAuto(k)
{
    if (k.key == "Enter")
    {
        let buttons = document.getElementsByClassName("additional-content__item additional-content__item--item-info");
        if (!buttons)
        {
            return;
        }
        buttons[0].click();
    }
}

function runScript() {
    const url = window.location.href;
    if (true) {
        kataReviews(url.includes("review"));
        kataLessons(url.includes("subject-lessons") && !url.includes("quiz") && !url.includes("picker"));
        kataReviews(url.includes("subject-lessons") && url.includes("quiz"));
    }
}

function changeBG()
{
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    .character-header--vocabulary {
        background-image: url('to-replace') !important;
        background-size: cover; /* Adjusts the size of the image */
        background-position: center; /* Centers the image */
    }
    .character-header--kanji {
        background-image: url('to-replace') !important;
        background-size: cover; /* Adjusts the size of the image */
        background-position: center; /* Centers the image */
    }
    .character-header--radical {
        background-image: url('to-replace') !important;
        background-size: cover; /* Adjusts the size of the image */
        background-position: center; /* Centers the image */
    }
`;
    document.head.appendChild(style);
}

function main()
{
    'use strict';
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        runScript();
    };
    window.addEventListener('popstate', runScript);
    window.addEventListener('keydown', openAuto);
    runScript();
    changeBG();
}

main();