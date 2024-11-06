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

const mainUrl = "https://intra.forge.epita.fr/";

function addOverlayImage(projectElement, imageUrl, cropX = 0, cropY = 0, overlayHeight = '150px') {
    // Create the overlay element
    const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "159px";
    overlay.style.backgroundImage = `url(${imageUrl})`;
    overlay.style.backgroundSize = "cover";
    overlay.style.backgroundRepeat = "no-repeat";

    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "none";
    overlay.style.zIndex = "10";
    projectElement.style.position = "relative";

    const updateOverlayPosition = () => {
        const width = projectElement.offsetWidth;
        const cropY = -(19 / 40) * width + 98.75;
        overlay.style.backgroundPosition = `0 ${cropY}px`;
    };

    const resizeObserver = new ResizeObserver(updateOverlayPosition);
    resizeObserver.observe(projectElement);
    updateOverlayPosition();
    projectElement.appendChild(overlay);
}

function matchProject(project, old)
{
    let dad = project.getElementsByClassName("project__dates")[0]
    console.log(dad);
    let child = dad.children[0];
    console.log(child);
    let string = child.textContent;
    console.log(string);
    return string.includes("currently") != old;
}

function reorganizeProjects()
{
    let title = document.getElementsByClassName("title")[0];
    let projects = document.getElementsByClassName("projects")[0];
    let oldProjects = projects.cloneNode(true);
    let oldTitle = title.cloneNode(true);

    var svg = title.querySelector('svg');
    title.textContent = "";
    title.appendChild(svg);
    title.appendChild(document.createTextNode("Current Tenants"));

    svg = oldTitle.querySelector('svg');
    oldTitle.textContent = "";
    oldTitle.appendChild(svg);
    oldTitle.appendChild(document.createTextNode("Older Tenants"));

    projects.querySelectorAll(".project").forEach((project) => {
        if (matchProject(project, false))
        {
            console.log("remove from new", project);
            project.remove();
        }
    });
    oldProjects.querySelectorAll(".project").forEach((project) => {
        if (matchProject(project, true))
        {
            console.log("remove from old", project);
            project.remove();
        }
    });
    document.getElementsByClassName("body")[0].appendChild(oldTitle);
    document.getElementsByClassName("body")[0].appendChild(oldProjects);
}

(function() {
    'use strict';
    if (window.location == mainUrl)
    {
    reorganizeProjects();
    }
    const projectElements = document.querySelectorAll(".project");
    projectElements.forEach((project, index) => {
        addOverlayImage(project, "https://www.pngall.com/wp-content/uploads/13/Anime-Blush-PNG-Image.png", 0, -250);
    });
})();
