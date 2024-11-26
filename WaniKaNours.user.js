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

function waitForList(selector, times) {
    let step = times ? 1 : 0;
    times = times ? times : 10;
    return new Promise((resolve) => {
        let interval;
        const testFunction = () => {
            const list = document.querySelectorAll(selector);
            if (list.length != 0 || times <= 0) {
                clearInterval(interval);
                resolve(list);
            }
            times -= step;
        };
        testFunction();
        interval = setInterval(testFunction, 100);
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
            let subInfo = (await waitForList("#subject-info"))[0];
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

function runScript()
{
    const url = window.location.href;
    kataReviews(url.includes("review"));
    kataLessons(url.includes("subject-lessons") && !url.includes("quiz") && !url.includes("picker"));
    kataReviews(url.includes("subject-lessons") && url.includes("quiz"));
}

async function rotateInfo(info)
{
    const c = info.children[0];
    c.insertBefore(c.children[1], c.children[0]);
}

async function handleBackspace()
{
    const info = (await waitForList(`.subject-info[data-loaded=true]`))[0];
    if (!Array.from(await waitForList(`.subject-section`)).every((e) => { return e.hasAttribute("expanded") }))
    {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "e", bubbles: true, }));
    }
    rotateInfo(info);
}

async function handleEnter()
{
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "f", bubbles: true, }));
    const info = (await waitForList(`.subject-info[data-loaded=true]`))[0];
    if (!Array.from(await waitForList(`.subject-section`)).every((e) => { return e.hasAttribute("expanded") }))
    {
        const f = info.children[0].children[0];
        const type = f.classList.contains("subject-section--meaning")
        ? "vocab"
        : (f.classList.contains("subject-section--components") ? "kanji" : "radical");
        if (type == "kanji")
        {
            const meaningDiv = document.createElement("div");
            meaningDiv.prepend(info.children[0].children[0], info.children[0].children[1]);
            info.children[0].prepend(meaningDiv);
        }
        info.setAttribute("noursType", type);
    }
    if (info.children[0].children[1].hasAttribute("expanded"))
    {
        rotateInfo(info);
    }
}

async function handleKeys(e)
{
    if (e.key == "Backspace")
    {
        const response = document.getElementById("user-response");
        if (response && response.getAttribute("enabled") == "false")
        {
            handleBackspace();
        }
    }
    if (e.key == "Enter")
    {
        const response = document.getElementsByClassName("additional-content__item--item-info")[0];
        if (response && !response.classList.contains("additional-content__item--open"))
        {
            handleEnter();
        }
    }
}

async function main()
{
    runScript();
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        runScript();
    };
    window.addEventListener('popstate', runScript);
    document.addEventListener('keydown', handleKeys);
}

main();