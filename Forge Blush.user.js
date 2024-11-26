// ==UserScript==
// @name         Forge Blush
// @namespace    Nounours0261
// @version      1
// @description  Make 'em blush + reorganize main page
// @author       ChatGPT & Nours
// @match        https://intra.forge.epita.fr/*
// @icon         https://media1.tenor.com/m/aj-1zn21KtkAAAAd/kana-arima-oshi-no-ko.gif
// @run-at       document-idle
// @grant        none
// ==/UserScript==

function addOverlayImage(projectElement, imageUrl)
{
    projectElement.style.position = "relative";
    const overlay = document.createElement("div");
    overlay.style.cssText = `position: absolute; width: 100%; height: 100%; background-image: url(${imageUrl}); background-size: auto;
                             background-repeat: no-repeat; pointer-events: none; z-index: 10; background-position: center;`;
    projectElement.appendChild(overlay);
}

function updateTitleWithSvg(title, text) {
    const svg = title.querySelector('svg');
    title.textContent = "";
    title.appendChild(svg);
    title.appendChild(document.createTextNode(text));
}

function removeProjects(selector, condition) {
    selector.querySelectorAll(".project").forEach((project) => {
        if (condition(project.getElementsByClassName("project__dates")[0].children[0].textContent))
        {
            project.remove();
        }
    });
}

function reorganizeProjects()
{
    let title = document.getElementsByClassName("title")[0];
    let projects = document.getElementsByClassName("projects")[0];
    let oldProjects = projects.cloneNode(true);
    let oldTitle = title.cloneNode(true);

    updateTitleWithSvg(title, "Current Tenants");
    removeProjects(projects, (dateText) => dateText.includes("currently"));

    updateTitleWithSvg(oldTitle, "Older Tenants");
    removeProjects(oldProjects, (dateText) => !dateText.includes("currently"));
    document.getElementsByClassName("body")[0].appendChild(oldTitle);
    document.getElementsByClassName("body")[0].appendChild(oldProjects);
}

const mainUrl = "https://intra.forge.epita.fr/";

function main()
{
    if (window.location == mainUrl)
    {
        reorganizeProjects();
    }
    document.querySelectorAll(".project").forEach((project) => { addOverlayImage(project, "https://i.imgur.com/wHYw2GF.png"); });
}

main();