// ==UserScript==
// @name         Kana-chan
// @namespace    Kana-chan
// @version      1.1
// @description  Kana-chan
// @author       Kana-chan
// @match        *://*/*
// @icon         https://media1.tenor.com/m/9e6n8-LUhH8AAAAd/oshi-no-ko-arima.gif
// @run-at       document-idle
// @require      https://github.com/Nounours0261/TamperNours/raw/refs/heads/main/waitForList.js
// @grant        GM.setValue
// @grant        GM.getValue
// ==/UserScript==

const sources = ["https://media1.tenor.com/m/9e6n8-LUhH8AAAAd/oshi-no-ko-arima.gif",
                 "https://media1.tenor.com/m/tHMoILdJMCMAAAAd/oshi-no-ko-oshi-no-ko-kana.gif",
                 "https://media1.tenor.com/m/BQ2eu8wKohgAAAAd/oshi-no-ko-onk.gif",
                 "https://media1.tenor.com/m/ybN0cfnFteIAAAAd/kana-flustered.gif"];

function hasPassed(lastTime, minPassed)
{
    return new Date() - new Date(lastTime) >= minPassed;
}

function randint(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

async function swapDisplay(Kana)
{
    let display = await GM.getValue("display");
    Kana.style.display = display == 'block' ? 'none' : 'block';
    await GM.setValue("display", display == 'block' ? 'none' : 'block');
    await GM.setValue("lastAction", new Date().toISOString());
}

function loadable(url)
{
    return new Promise(
        (resolve) =>
        {
            const img = new Image();
            img.onload = () => { resolve(true); };
            img.onerror = () => { resolve(false); };
            img.src = url;
        });
}

async function addKana()
{
    let curSource = sources[randint(0, sources.length)];
    if (!await loadable(curSource))
    {
        return;
    }
    let display = await GM.getValue("display");
    let lastAction = await GM.getValue("lastAction");
    if (display == "none" && hasPassed(lastAction, 1000 * 60 * 60 * 4))
    {
        display = "block";
        await GM.setValue("display", display);
    }

    const Kana = document.createElement('img');
    Kana.src = curSource;
    Kana.style.cssText = `position: fixed; bottom: 10px; right: 20px; z-index: 999999;
    width: 200px; height: auto; opacity: 0.5; pointer-events: none; display: ${display};`;
    document.body.appendChild(Kana);

    document.addEventListener('keydown', (e) => { if (e.key == 'k' && e.altKey) {swapDisplay(Kana)} });
    window.onfocus = async () => {Kana.style.display = await GM.getValue("display")};
}

addKana();