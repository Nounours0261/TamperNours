// ==UserScript==
// @name         WaniKaNours
// @namespace    Nounours0261
// @version      1.4
// @description  Useful features on WaniKani
// @author       ChatGPT & Nours
// @match        https://www.wanikani.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @run-at       document-start
// @require      https://github.com/Nounours0261/TamperNours/raw/refs/heads/main/waitForList.js
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
        if (cl && cl[0].includes("container") && !curNode.hasAttribute("katakanours"))
        {
            curNode.setAttribute("katakanours", "");
            document.querySelectorAll(`#section-reading .subject-readings__reading-items,
                                       #section-reading .subject-section__text,
                                       #section-reading .reading-with-audio__reading`).forEach((e) => {e.innerHTML = hitoka(e.innerHTML);});
        }
    }
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
            curNode.setAttribute("katakanours", "");
            document.querySelectorAll(`#reading .reading-with-audio__reading,
                                       #reading .wk-text`).forEach((e) => {e.innerHTML = hitoka(e.innerHTML);});
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
        if (!observingLes)
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
    if (c.children[0].hasAttribute("expanded"))
    {
        const f = (await waitForList(".character-header"))[0];

        if (f.classList.contains("character-header--kanji"))
        {
            if (c.children[0].classList.contains("subject-section--components"))
            {
                c.insertBefore(c.children[2], c.children[0]);
            }
            else
            {
                c.insertBefore(c.children[0], c.children[3]);
            }
        }

        if (f.classList.contains("character-header--vocabulary"))
        {
            c.insertBefore(c.children[1], c.children[0]);
        }
    }
}

async function handleDollar()
{
    const info = (await waitForList(`.subject-info[data-loaded=true]`))[0];
    rotateInfo(info);
    if (!Array.from(await waitForList(`.subject-section`)).every((e) => { return e.hasAttribute("expanded") }))
    {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "e", bubbles: true, }));
    }
}

async function handleEnter()
{
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "f", bubbles: true, }));
    wrapKanjiWithLinks("character-header__characters");
}

function handleKeys(e)
{
    if (e.key == "$")
    {
        const response = document.getElementById("user-response");
        if (response && response.getAttribute("enabled") == "false")
        {
            handleDollar();
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

function wrapKanjiWithLinks(className)
{
    const targetElement = document.querySelector(`.${className}`);
    if (!targetElement)
    {
        console.error(`Element with class '${className}' not found.`);
        return;
    }
    console.log(targetElement);
    const updatedContent = targetElement.innerText.replace(/[\u4E00-\u9FFF]/g, (kanji) =>
    {
        return `<a href="https://www.wanikani.com/kanji/${kanji}" target="_blank" style="text-decoration: none; color: inherit;">${kanji}</a>`;
    });
    targetElement.innerHTML = updatedContent;
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