// ==UserScript==
// @name         Custom Scroll
// @namespace    Nounours0261
// @version      1
// @description  Scrolls the page with keys
// @author       Nours & ChatGPT
// @match        https://jmanga.is/*
// @match        https://fto.to/title/*
// @icon         https://d1jj76g3lut4fe.cloudfront.net/uploads/images/61efba225cdcb_scroll.down.15.1.jpg
// @grant        none
// @run-at       document-idle
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

function showWarning(pagesize)
{
    const old = document.getElementById("endWarningNours");
    if (old)
    {
        old.style.display = "block";
        return;
    }
    const endWarning = document.createElement('img');
    endWarning.id = "endWarningNours";
    endWarning.src = "https://i.imgur.com/Z6MsnX4.jpeg";
    endWarning.style.position = 'fixed';
    endWarning.style.bottom = `${pagesize / 2}px`;
    endWarning.style.right = '10px';
    endWarning.style.zIndex = '9999';
    endWarning.style.width = '500px';
    endWarning.style.height = 'auto';
    endWarning.style.opacity = '1';
    endWarning.style.pointerEvents = 'none';
    endWarning.style.display = 'block';
    document.body.appendChild(endWarning);
}

function handleKeydown(event, pagesize, startScroll)
{
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight' || event.shiftKey || event.key == "Enter")
    {
        event.preventDefault();
        event.stopPropagation();
        if (window.pageYOffset + window.innerHeight + pagesize >= document.body.scrollHeight - 2)
        {
            showWarning(pagesize);
        }
        else
        {
            let newPos = Math.round(startScroll);
            const curPos = Math.round(window.pageYOffset);
            while (newPos <= curPos)
            {
                newPos += pagesize;
            }
            window.scroll(0, newPos);
        }
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft')
    {
        event.preventDefault();
        event.stopPropagation();
        const endWarning = document.getElementById("endWarningNours");
        if (endWarning)
        {
            endWarning.style.display = "none";
        }
        let newPos = Math.round(startScroll);
        const curPos = Math.round(window.pageYOffset);
        while (newPos + pagesize < curPos)
        {
            newPos += pagesize;
        }
        window.scroll(0, newPos);
    }
}

async function setup(event)
{
    event.preventDefault();
    event.stopPropagation();
    const fPageRect = (await waitForList("img"))[0].getBoundingClientRect()
    const pagesize = fPageRect.height;
    const startScroll = fPageRect.top;
    window.addEventListener('keydown', (event) => handleKeydown(event, pagesize, startScroll));
    if (window.scrollY == 0)
    {
        window.scrollBy(0, startScroll);
    }
}

function main()
{
    window.addEventListener('keydown', (event) => setup(event), { once: true });
}

main();