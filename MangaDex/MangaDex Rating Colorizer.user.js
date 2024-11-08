// ==UserScript==
// @name         MangaDex Rating Colorizer
// @namespace    Nounours0261
// @version      1
// @description  Useful features on MangaDex
// @author       ChatGPT & Nours
// @match        https://mangadex.org/*
// @icon         https://avatars.githubusercontent.com/u/100574686?s=280&v=4
// @run-at       document-start
// @grant        window.close
// ==/UserScript==

function waitForList(selector = "*", parent = document) {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            const list = parent.querySelectorAll(selector);
            console.log("tried", selector);
            if (list.length != 0) {
                clearInterval(interval);
                resolve(list);
            }
        }, 100);
    });
}

function getColorForRating(rating) {
    const shades = [
        '#f72c1e',
        '#f72c1e',
        '#f7541e',
        '#f77c1e',
        '#f7bd1e',
        '#f7ec1e',
        '#cce01b',
        '#91e01b',
        '#2fe01b',
        '#17eb50'
    ];
    return shades[rating - 1] || '#e0f7fa';
}

function handleRatMutation(mutation, ratButton)
{
    if (mutation.addedNodes.length != 0 && mutation.addedNodes[0].tagName == "SPAN")
    {
        const rating = parseInt(mutation.addedNodes[0].textContent.trim(), 10);
        ratButton.style.backgroundColor = getColorForRating(rating);
        ratButton.classList.remove('primary');
    }
}

async function findAndColorRating()
{
    console.log("findcolor");
    const libButton = (await waitForList("[data-v-8d292eb9][data-v-c2249ac3]"))[0];
    const ratButton = (await waitForList("[data-v-fde6a51a] > [data-v-8d292eb9]"))[0];
    const spanF = (await waitForList("span", ratButton))[0];

    libButton.classList.remove('primary');
    libButton.classList.add('accent');
    ratButton.classList.remove('primary');

    if (spanF.textContent)
    {
        const rating = parseInt(spanF.textContent.trim(), 10);
        ratButton.style.backgroundColor = getColorForRating(rating);
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
        checkChapters();
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

async function checkChapters()
{
    const chaps = await waitForList("[role=alert], .chapter");
    if (!chaps[0].classList.contains("chapter"))
    {
        if (window.confirm("There are no chapters ! Close tab ?"))
        {
            window.close();
        }
    }
}

function manageMangaDexFeatures()
{
    chapPage(window.location.href.includes("title"));
}

function main()
{
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        manageMangaDexFeatures();
    };
    window.addEventListener('popstate', manageMangaDexFeatures());
}

main();