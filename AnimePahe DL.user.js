// ==UserScript==
// @name         AnimePahe DL
// @namespace    Nounours0261
// @version      1
// @description  idk
// @author       Nours
// @match        https://animepahe.ru/anime/*
// @match        https://animepahe.ru/play/*
// @match        https://pahe.win/*
// @match        https://kwik.si/f/*
// @icon         https://freeiconshop.com/wp-content/uploads/edd/download-flat.png
// @run-at       document-idle
// @require      https://github.com/Nounours0261/TamperNours/raw/refs/heads/main/waitForList.js
// @require      https://github.com/Nounours0261/TamperNours/raw/refs/heads/main/fixedOpen.js
// @grant        none
// ==/UserScript==

function getRes(input)
{
    const match = input.match(/(\d+)p/);
    return match ? parseInt(match[1], 10) : null;
}

function inRange(a, b, c)
{
    return (b - c) < a && a < (b + c);
}

function makeHomeButton(text, color, res)
{
    const button = document.createElement("button");
    button.textContent = text;
    button.style.padding = "12px 24px";
    button.style.fontSize = "16px";
    button.style.color = "#ffffff";
    button.style.backgroundColor = color;
    button.style.border = "none";
    button.style.borderRadius = "8px";
    button.style.cursor = "pointer";
    button.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.2)";
    button.onclick = () => { homeStartDL(res); };
    return button;
}

async function homeStartDL(res)
{
    let isAsc = (await waitForList(".btn.btn-dark.btn-sm.active"))[0].innerText.includes("asc");
    let episodes = await waitForList(".episode-wrap a.play");
    fixedOpen(episodes[isAsc ? 0 : (episodes.length - 1)].href + "#NoursDL" + res);
}

async function startHome()
{
    let animeContent = (await waitForList(".anime-content", 100))[0];
    const container = document.createElement("div");
    container.style.cssText = `width: auto; height: 60px; display: flex; justify-content: center; align-items: center; gap: 20px;`;

    container.appendChild(makeHomeButton("Low", "#ef476f", "360p"));
    container.appendChild(makeHomeButton("Mid", "#ffd166", "720p"));
    container.appendChild(makeHomeButton("High", "#06d6a0", "1080p"));
    animeContent.appendChild(container);
}

function episodePickDL(buttonList, res)
{
    let maybe = [];
    buttonList.forEach((b) => { inRange(getRes(b.innerText), getRes(res), 200) && maybe.push(b); });
    console.log(maybe[0]);
    return maybe[0];
}

async function episodeStartDL(res)
{
    let buttonList = (await waitForList("#pickDownload a", 100));
    let link = episodePickDL(buttonList, res);
    if (link)
    {
        link.click();
    }
    else
    {
        window.alert("Could not download the specified resolution !");
        return;
    }

    let nextList = (await waitForList(".sequel a", 20));
    if (nextList.length != 0)
    {
        window.location.href = nextList[0].href + "#NoursDL" + res;
    }
    else
    {
        setTimeout(window.close, 150);
    }
}

function episodeGetRes()
{
    const url = window.location.href;
    if (url.charAt(url.length-5) == "L")
    {
        return url.substr(url.length - 4);
    }
    return url.substr(url.length - 5);
}

async function startEpisode()
{
    let buttonList = (await waitForList("#pickDownload a", 100));
    buttonList.forEach((link) => { link.onclick = (event) => {
        event.preventDefault();
        fixedOpen(link.href);
    }; });

    if (window.location.href.includes("#NoursDL"))
    {
        episodeStartDL(episodeGetRes());
    }
}

async function startMid()
{
    let button = (await waitForList(".redirect"))[0];
    let observer = new MutationObserver((mutations) => { button.href.includes("kwik.si") && button.click(); });
    observer.observe(button, { attributes: true });
}

async function startKwik()
{
    let buttonList = await waitForList("[type=submit]", 100);
    if (buttonList.length == 0)
    {
        window.alert("Couldn't find a download button, try adjusting the selectors");
    }
    else if (buttonList.length == 1)
    {
        buttonList[0].click();
        setTimeout(window.close, 15000);
    }
    else
    {
        console.log(buttonList);
        window.alert("Found too many buttons, try adjusting the selectors");
    }
}

function main()
{
    if (window.location.href.match("https://animepahe.ru/anime/*"))
    {
        startHome();
    }
    if (window.location.href.match("https://animepahe.ru/play/*"))
    {
        startEpisode();
    }
    if (window.location.href.match("https://pahe.win/*"))
    {
        startMid();
    }
    if (window.location.href.match("https://kwik.si/f/*"))
    {
        startKwik();
    }
}

main();