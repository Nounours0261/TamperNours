// ==UserScript==
// @name         Kana-chan
// @namespace    Kana-chan
// @version      Kana-chan
// @description  Kana-chan
// @author       Kana-chan
// @match        *://*/*
// @icon         https://media1.tenor.com/m/9e6n8-LUhH8AAAAd/oshi-no-ko-arima.gif
// @run-at       document-start
// @grant        none
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

function addGIF()
{
    const kanachan = document.createElement('img');
    kanachan.src = sources[randint(0, sources.length)];
    kanachan.style.position = 'fixed';
    kanachan.style.bottom = '10px';
    kanachan.style.right = '10px';
    kanachan.style.zIndex = '9999';
    kanachan.style.width = '200px';
    kanachan.style.height = 'auto';
    kanachan.style.opacity = '0.5';
    kanachan.style.pointerEvents = 'none';
    document.body.appendChild(kanachan);
}

addGIF();