// ==UserScript==
// @name         AniList Year Selector
// @namespace    Nounours0261
// @version      1
// @description  Adds an input for year selection on AniList
// @author       ChatGPT & Nours
// @match        https://anilist.co/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/AniList_logo.svg/512px-AniList_logo.svg.png
// @run-at       document-idle
// @grant        none
// ==/UserScript==

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

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

async function replaceSlider()
{
    if (document.getElementById("noursyear"))
    {
        console.log("already replaced slider");
        return;
    }
    const slider = await waitForElement("[role='slider']");
    const minYear = 1950;
    const maxYear = parseInt(slider.getAttribute("aria-valuemax"));

    const container = document.createElement('div');
    container.id = "noursyear";
    container.style.cssText = "margin-top: 10px; display: grid; grid-template-columns: 1fr 32px; background-color: #151f2e; border-radius: 3px;";

    const input = document.createElement('input');
    input.type = 'number';
    input.min = minYear;
    input.max = maxYear;
    input.placeholder = "Year";
    input.classList.add("nours");
    input.style.cssText = "background-color: #151f2e; color: #c0c4cc; height: 32px; border: 0; padding: 0 10px 0 15px; outline: none; border-radius: 3px;";
    input.onchange = () => {
        const year = clamp(parseInt(input.value) || minYear, minYear, maxYear);
        slider.__vue__.firstValue = year;
        input.value = year === minYear ? "" : year;
        icon.style.visibility = year !== minYear ? "visible" : "hidden";
    };

    const button = document.createElement('button');
    button.style.cssText = "width: 32px; height: 32px; border: 0; background-color: #151f2e; border-radius: 3px;";
    const icon = document.createElement('i');
    icon.className = "el-icon-circle-close";
    icon.style.cssText = "color: #c0c4cc; padding: 0 3px 0 0; visibility: hidden;";
    button.appendChild(icon);
    button.onclick = () => {
        input.value = "";
        slider.__vue__.firstValue = minYear;
        icon.style.visibility = "hidden";
    };

    const style = document.createElement('style');
    style.textContent = `
        .nours::placeholder { color: #c0c4cc; opacity: 1; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
    `;
    document.head.appendChild(style);

    container.append(input, button);
    slider.parentElement.previousElementSibling.appendChild(container);

    slider.style.display = "none";
    slider.parentElement.style.display = "none";
}

async function main()
{
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        if (window.location.href.match("https://anilist.co/user/Nounours0261/animelist*"))
        {
            replaceSlider();
        }
    };
    window.addEventListener('popstate', () => {
        if (window.location.href.match("https://anilist.co/user/Nounours0261/animelist*"))
        {
            replaceSlider();
        }
    });
    if (window.location.href.match("https://anilist.co/user/Nounours0261/animelist*"))
    {
        replaceSlider();
    }
    else
    {
        console.log("no match");
    }
}

main();