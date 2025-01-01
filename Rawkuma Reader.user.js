// ==UserScript==
// @name         Rawkuma Reader
// @namespace    Nounours0261
// @version      1
// @description  Remove unnecessary elements from the Rawkuma website
// @author       Nours
// @match        https://rawkuma.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://rawkuma.com
// @run-at       document-idle
// @require      https://github.com/Nounours0261/TamperNours/raw/refs/heads/main/waitForList.js
// @grant        none
// ==/UserScript==

function makeImgDiv(sources)
{
    const div = document.createElement('div');
    div.id = "imgDiv";
    div.style.cssText = `display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%;`;

    for (let i = 0; i < sources.length; i++)
    {
        let img = document.createElement("img");
        img.src = sources[i];
        img.classList.add("noursImg");
        div.appendChild(img);
    }

    return div;
}

function addStyle()
{
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `/*portrait*/ @media screen and (max-aspect-ratio: 1/1) { .noursImg { height: auto; width: 100vw; } }
                      /*landscape*/ @media screen and (min-aspect-ratio: 1/1) { .noursImg { height: 100vh; width: auto; } }
                      #topDiv, #topDiv button {
                      font-family: "Arial"
                      }`;
    document.head.appendChild(style);
}

function handleKeydown(event, pageSize, startScroll)
{
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight')
    {
        event.preventDefault();
        event.stopPropagation();
        if (window.pageYOffset + window.innerHeight + pageSize >= document.body.scrollHeight - 2)
        {
            console.log("page end");
        }
        else
        {
            let newPos = Math.round(startScroll);
            const curPos = Math.round(window.pageYOffset);
            while (newPos < curPos + 1)
            {
                newPos += pageSize;
            console.log(newPos, curPos);
            }
            window.scroll(0, newPos);
        }
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft')
    {
        event.preventDefault();
        event.stopPropagation();
        let newPos = Math.round(startScroll);
        const curPos = Math.round(window.pageYOffset);
        while (newPos + pageSize < curPos - 1)
        {
            newPos += pageSize;
            console.log(newPos, curPos);
        }
        window.scroll(0, newPos);
    }
}

function makeChapList(options)
{
    const listContainer = document.createElement('div');
    listContainer.id = "chapList";
    listContainer.style.cssText = `min-height: 50px; margin: 10px 0;`;

    const toggleButton = document.createElement('button');
    toggleButton.innerText = 'Chapter selection';
    toggleButton.style.cssText = `border-radius: 5px; width: 100%; height: 50px;  text-align: center; background-color: #68d8d6;
    border: none; cursor: pointer; font-size: 16px; align-items: center; justify-content: center;`;
    toggleButton.addEventListener('click', () => { listContent.style.display = listContent.style.display === 'flex' ? 'none' : 'flex'; });
    toggleButton.addEventListener('click', () => { listContent.scrollTop = 50; }, { once: true });

    const listContent = document.createElement('div');
    listContent.style.cssText = `display: none; padding: 5px 10px; overflow-y: auto; max-height: 200px; text-align: center;
    flex-direction: column;`;

    options.forEach((option, index) => {
        const link = document.createElement('a');
        link.href = option.value;
        link.innerText = option.innerText.replace('Chapter ','');;
        link.style.cssText = `display: block; margin: 2px 0; padding: 0 5px; border: 2px solid #fff;`;
        listContent.appendChild(link);
    });

    listContainer.appendChild(toggleButton);
    listContainer.appendChild(listContent);
    return listContainer;
}

function makeSimpleButton(text, color, url)
{
    const button = document.createElement("a");
    button.style.cssText = `border-radius: 5px; width: auto; height: 50px; padding: 7px 10px; text-align: center; background-color: ${color};
                            display: flex; cursor: pointer; margin: 10px 0; color: #000000; font-size: 16px; align-items: center; justify-content: center;`;
    button.textContent = text;
    button.href = url;
    return button;
}

function makeHomeButton()
{
    let res = document.createElement("a");
    res.style.cssText = `height: 50px; padding: 7px 10px; border: none; cursor: pointer; margin: 10px 0; align-items: center; justify-content: center;
    background-color: #68d8d6; border-radius: 5px; display:flex;`;
    let img = document.createElement("img");
    img.src = "https://rawkuma.com/wp-content/uploads/2024/02/Rawkuma-Hero-Icon-top-light-mode-2.png";
    img.style.cssText = `height: 100%; object-fit: cover;`;
    res.appendChild(img);
    res.href = "https://rawkuma.com/";
    return res;
}

function makeButtonDiv(id, mangaHome, chapOptions, next, prev)
{
    let res = document.createElement("div");
    res.style.cssText = `display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; padding: 0px 10px`;
    res.id = id;
    res.append(makeHomeButton());
    res.appendChild(makeSimpleButton("Manga homepage", "#68d8d6", mangaHome.href));
    res.appendChild(makeChapList(chapOptions));
    res.appendChild(makeSimpleButton("Prev", "#68d8d6", prev.href));
    res.appendChild(makeSimpleButton("Next", "#68d8d6", next.href));
    return res;
}

async function main()
{
    let chapOptions = document.querySelector("#chapter").querySelectorAll("option[data-id]");
    let sources = Array.from(await waitForList("img.ts-main-image")).map((img) => { return img.src; });
    let mangaHome = (await waitForList(".allc a"))[0];
    let next = (await waitForList(".ch-next-btn"))[0];
    let prev = (await waitForList(".ch-prev-btn"))[0];

    document.body.innerHTML = "";

    let topDiv = makeButtonDiv("topDiv", mangaHome, chapOptions, next, prev);
    document.body.appendChild(topDiv);
    let imgDiv = makeImgDiv(sources);
    document.body.appendChild(imgDiv);
    document.body.appendChild(makeButtonDiv("bottomDiv", mangaHome, chapOptions, next, prev));

    jQuery(window).off("keydown");
    jQuery(window).off("click");
    addStyle();
    window.addEventListener('keydown', (event) => handleKeydown(event, window.innerHeight, 70));
    if (window.scrollY == 0)
    {
        setTimeout(() => {window.scrollBy({ top: 70, left: 0 })}, 400);
    }
}

main();