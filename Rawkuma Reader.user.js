// ==UserScript==
// @name         Rawkuma Reader
// @namespace    Nounours0261
// @version      1
// @description  Remove unnecessary elements from the Rawkuma website
// @author       Nours
// @match        https://rawkuma.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://rawkuma.net
// @run-at       document-idle
// @grant        none
// ==/UserScript==

const pastelColors = [
    "#FFB3B3", // pastel red
    "#ADD8E6", // pastel blue
    "#FFFFB3", // pastel yellow
    "#B3FFB3", // pastel green
    "#FFD1A4", // pastel orange
    "#D9B3FF", // pastel purple
];

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
            const newPos = Math.round(startScroll);
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
        const newPos = Math.round(startScroll);
        const curPos = Math.round(window.pageYOffset);
        while (newPos + pageSize < curPos - 1)
        {
            newPos += pageSize;
            console.log(newPos, curPos);
        }
        window.scroll(0, newPos);
    }
}

function makeChapList(options, color)
{
    const listContainer = document.createElement('div');
    listContainer.id = "chapList";
    listContainer.style.cssText = `margin: 10px 0;`;

    const toggleButton = document.createElement('button');
    const img = document.createElement("img");
    img.src = "https://cdn-icons-png.flaticon.com/512/151/151867.png";
    img.style.cssText = `height: 100%; object-fit: cover;`;
    toggleButton.appendChild(img);
    toggleButton.style.cssText = `border-radius: 5px; width: 100%; height: 50px;  text-align: center; background-color: ${color};
    border: none; cursor: pointer; font-size: 16px; align-items: center; justify-content: center;`;
    toggleButton.addEventListener('click', () => { listContent.style.display = listContent.style.display === 'flex' ? 'none' : 'flex'; });

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

function makeImageButton(image, color, url)
{
    const res = document.createElement("a");
    res.style.cssText = `height: 50px; padding: 7px 10px; border: none; cursor: pointer; margin: 10px 0px; align-items: center; justify-content: center;
    background-color: ${color}; border-radius: 5px; display:flex;`;
    const img = document.createElement("img");
    img.src = image;
    img.style.cssText = `height: 100%; object-fit: cover;`;
    res.appendChild(img);
    res.href = url;
    return res;
}

function makeButtonDiv(mangaHome, chapOptions, next, prev, color)
{
    const res = document.createElement("div");
    res.style.cssText = `display: none; grid-template-columns: repeat(5, 1fr); gap: 10px; padding: 0px 10px;
    width: 100%; background-color: #000; position: fixed; top: 0px;`;
    res.append(makeImageButton("https://cdn-icons-png.flaticon.com/256/25/25694.png", color, "https://rawkuma.net/"));
    res.appendChild(makeImageButton("https://cdn-icons-png.flaticon.com/512/4/4259.png", color, mangaHome.href));
    res.appendChild(makeChapList(chapOptions, color));
    res.appendChild(makeImageButton("https://i.imgur.com/GsmN65J.png", color, prev.href));
    res.appendChild(makeImageButton("https://i.imgur.com/JiJBlRZ.png", color, next.href));
    res.id = "topDiv";

    return res;
}

function makeTitleDiv(title, color)
{
    const div = document.createElement('div');
    div.textContent = title;
    div.style.cssText = `position: fixed; bottom: 0px; width: 100%; background-color: #000; padding: 5px; text-align: center;
    display: none; font-size: 1.2rem; color: ${color};`;
    return div;
}

async function main()
{
    // Grabbing info
    let chapOptions = document.querySelector("#chapter").querySelectorAll("option[data-id]");
    let sources = Array.from(document.querySelectorAll("img.ts-main-image")).map((img) => { return img.src; });
    let mangaHome = document.querySelector(".allc a");
    let next = document.querySelector(".ch-next-btn");
    let prev = document.querySelector(".ch-prev-btn");
    let title = document.querySelector(".entry-title").textContent;
    const color = pastelColors[Math.floor(Math.random() * pastelColors.length)];

    //Deleting everything
    document.body.innerHTML = "";
    jQuery(window).off("keydown");
    jQuery(window).off("click");

    const topDiv = makeButtonDiv(mangaHome, chapOptions, next, prev, color);
    document.body.appendChild(topDiv);
    const imgDiv = makeImgDiv(sources);
    document.body.appendChild(imgDiv);
    const titleDiv = makeTitleDiv(title, color);
    document.body.appendChild(titleDiv);

    addStyle();
    window.addEventListener('keydown', (event) => handleKeydown(event, window.innerHeight, 70));
    window.addEventListener('click', (e) => {
        if (!topDiv.contains(e.target))
        {
            topDiv.style.display = topDiv.style.display == "grid" ? "none" : "grid";
            titleDiv.style.display = titleDiv.style.display == "block" ? "none" : "block";
        }
    });
}

main();