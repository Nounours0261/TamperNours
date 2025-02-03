// ==UserScript==
// @name         AniList Year Selector
// @namespace    Nounours0261
// @version      1.2
// @description  Add a text input for year selection on AniList
// @author       ChatGPT & Nours
// @match        https://anilist.co/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anilist.co
// @run-at       document-idle
// @require      https://github.com/Nounours0261/TamperNours/raw/refs/heads/main/waitForList.js
// @grant        none
// ==/UserScript==

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

async function replaceSlider()
{
    const slider = (await waitForList("[role='slider']"))[0];
    if (slider.hasAttribute("noursyear"))
    {
        return;
    }
    slider.setAttribute("noursyear", "");
    slider.style.display = "none";
    slider.parentElement.style.display = "none";

    const minYear = parseInt(slider.getAttribute("aria-valuemin"));
    const maxYear = parseInt(slider.getAttribute("aria-valuemax"));

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

    const container = document.createElement('div');
    container.style.cssText = "margin-top: 10px; display: grid; grid-template-columns: 1fr 32px; background-color: #151f2e; border-radius: 3px;";
    container.append(input, button);
    slider.parentElement.previousElementSibling.appendChild(container);
}

function newPage()
{
    if (/^https:\/\/anilist\.co\/user\/[^\/]+\/animelist.*$/.test(window.location.href) ||
        /^https:\/\/anilist\.co\/user\/[^\/]+\/mangalist.*$/.test(window.location.href))
    {
        replaceSlider();
    }
}

async function main()
{
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        newPage();
    };
    window.addEventListener('popstate', newPage);
    newPage();
}

main();