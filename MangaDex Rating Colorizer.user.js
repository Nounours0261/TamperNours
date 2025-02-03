// ==UserScript==
// @name         MangaDex Rating Colorizer
// @namespace    Nounours0261
// @version      1.4
// @description  Useful features on MangaDex
// @author       ChatGPT & Nours
// @match        https://mangadex.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mangadex.org
// @run-at       document-idle
// @require      https://github.com/Nounours0261/TamperNours/raw/refs/heads/main/waitForList.js
// ==/UserScript==

function styleRatButton(button, rating) {
    const shades = [
        '#f73a24',
        '#f73a24',
        '#f73a24',
        '#f78b2c',
        '#f78b2c',
        '#97e724',
        '#97e724',
        '#29e838',
        '#29e838',
        'linear-gradient(90deg, #FFD700, #FFC700, #FFB700)'
    ];
    button.classList.remove('primary');
    button.style.background = shades[rating - 1];
    button.style.boxShadow = (rating == 10) ? "0 4px 6px rgba(0, 0, 0, 0.3), 0 0 10px rgba(255, 215, 0, 0.5)" : "0 0px 0px";
}

function handleRatMutation(mutation, ratButton)
{
    if (mutation.addedNodes.length != 0 && mutation.addedNodes[0].tagName == "SPAN")
    {
        styleRatButton(ratButton, parseInt(mutation.addedNodes[0].textContent.trim(), 10));
    }
}

async function findAndColorRating()
{
    const libButton = (await waitForList("[data-v-fa81b2e8][data-v-c2249ac3]"))[0];
    const ratButton = (await waitForList("[data-v-fde6a51a] > [data-v-fa81b2e8]"))[0];
    const spanF = (await waitForList("span", null, ratButton))[0];
    libButton.classList.remove('primary');
    libButton.classList.add('accent');
    ratButton.classList.remove('primary');

    if (spanF.textContent)
    {
        const rating = parseInt(spanF.textContent.trim(), 10);
        styleRatButton(ratButton, rating);
    }

    ratObserver = new MutationObserver(
        (mutations) => { mutations.forEach(
            (m) => { handleRatMutation(m, ratButton) }
        ); }
    );
    ratObserver.observe(ratButton, {childList: true});
}

let ratObserver;
let ratObserving = false;

function chapPage(start)
{
    if (start)
    {
        if (ratObserving)
        {
            ratObserver.disconnect();
        }
        findAndColorRating();
    }
    else
    {
        if (ratObserving)
        {
            ratObserver.disconnect();
            ratObserving = false;
        }
    }
}

function newPage()
{
    chapPage(window.location.href.includes("title/"));
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