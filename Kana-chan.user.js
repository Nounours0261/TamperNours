// ==UserScript==
// @name         Kana-chan
// @namespace    Kana-chan
// @version      Kana-chan
// @description  Kana-chan
// @author       Kana-chan
// @match        *://*/*
// @icon         https://media1.tenor.com/m/9e6n8-LUhH8AAAAd/oshi-no-ko-arima.gif
// @run-at       document-start
// @grant        GM.setValue
// @grant        GM.getValue
// ==/UserScript==

const sources = ["https://media1.tenor.com/m/9e6n8-LUhH8AAAAd/oshi-no-ko-arima.gif",
                 "https://media1.tenor.com/m/tHMoILdJMCMAAAAd/oshi-no-ko-oshi-no-ko-kana.gif",
                 "https://media1.tenor.com/m/BQ2eu8wKohgAAAAd/oshi-no-ko-onk.gif",
                 "https://media1.tenor.com/m/ybN0cfnFteIAAAAd/kana-flustered.gif"];

function randint(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
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

async function addGIF()
{
    const kanachan = document.createElement('img');
    kanachan.src = sources[randint(0, sources.length)];
    kanachan.style.cssText = `position: fixed; bottom: 10px; right: 20px; zIndex: 9999;
    width: 200px; height: auto; opacity: 0.5; pointerEvents: none; display: ${await GM.getValue("display")};`;

    (await waitForList("body"))[0].appendChild(kanachan);

    document.addEventListener('keydown', async (e) => {
        if (e.key == 'k' && e.altKey)
        {
            let status = await GM.getValue("display");
            kanachan.style.display = status == 'block' ? 'none' : 'block';
            await GM.setValue("display", status == 'block' ? 'none' : 'block');
        }
    });

    window.onfocus = async function() {
        kanachan.style.display = await GM.getValue("display");
    };
}

addGIF();