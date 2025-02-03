// ==UserScript==
// @name         AniList Home divider
// @namespace    Nounours0261
// @version      1
// @description  Separate manga and anime on AniList's home page
// @author       Nours
// @match        https://anilist.co/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://anilist.co/
// @run-at       document-idle
// @require https://github.com/Nounours0261/TamperNours/raw/refs/heads/main/waitForList.js
// @grant        none
// ==/UserScript==

async function dupReorder()
{
    let wraps = await waitForList(".list-preview-wrap");
    if (wraps.length != 1)
    {
        return;
    }

    let wrap = wraps[0];
    let covers = wrap.querySelectorAll(".cover");
    if (Array.from(covers).every(element => { console.log(element.getAttribute("lazy"), element); return element.getAttribute("lazy") == "loaded"; }))
    {
        let newWrap = wrap.cloneNode(true)
        wrap.after(newWrap);
        let newCovers = newWrap.querySelectorAll(".cover");


        wrap.querySelector(".section-header h2").innerText = "Anime In Progress";
        for (let i = 0; i < covers.length; i++)
        {
            if (/^https:\/\/anilist.co\/manga\/.+$/.test(covers[i].href))
            {
                covers[i].parentElement.remove();
            }
        }

        newWrap.querySelector(".section-header h2").innerText = "Manga In Progress";
        for (let i = 0; i < newCovers.length; i++)
        {
            if (/^https:\/\/anilist.co\/anime\/.+$/.test(newCovers[i].href))
            {
                newCovers[i].parentElement.remove();
            }
        }
    }
    else
    {
        if (!wrap.querySelector(".media-preview-card.small"))
        {
            wrap.querySelector(".list-preview").appendChild(covers[0].parentElement); //rotate elements to force site to load them
        }
        setTimeout(() => {dupReorder(wrap)}, 100);
    }
}

function newPage()
{
    if (/^https:\/\/anilist\.co\/home.*$/.test(window.location.href))
    {
        dupReorder();
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