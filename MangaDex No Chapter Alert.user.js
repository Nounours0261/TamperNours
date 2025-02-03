// ==UserScript==
// @name         MangaDex No Chapter Alert
// @namespace    Nounours0261
// @version      1
// @description  Add an alert on screen when no chapters are available
// @author       Nours
// @match        https://mangadex.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mangadex.org
// @run-at       document-idle
// @require      https://github.com/Nounours0261/TamperNours/raw/refs/heads/main/waitForList.js
// @grant        none
// ==/UserScript==

async function alertChapters()
{
    let list = await waitForList(".text-center.break-word.overflow-auto, [data-v-e82d079a]");
    if (list[0].classList.contains("text-center"))
    {
        window.alert("This manga does not have any chapters available on MangaDex.");
    }
}

function newPage()
{
    if(window.location.href.includes("title/"))
    {
        alertChapters();
    }
}

function main()
{
    setTimeout(newPage, 100);
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        setTimeout(newPage, 100);
    };
    window.addEventListener('popstate', () => {setTimeout(newPage, 100);});
}

main();