// ==UserScript==
// @name         Forge Optimizer
// @namespace    Nounours0261
// @version      1
// @description  Make Forge navigation easier
// @author       Nours & ChatGPT
// @match        https://intra.forge.epita.fr/*
// @icon         https://static.vecteezy.com/system/resources/previews/032/180/007/original/color-icon-for-forge-vector.jpg
// @run-at       document-idle
// @grant        GM.setValue
// @grant        GM.getValue
// @require      https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js
// ==/UserScript==

function tagStatus(tagres)
{
    if (!tagres || tagres.children.length == 0)
    {
        return "NONE";
    }
    let symbol = tagres.children[0].getElementsByTagName("trace-symbol")[0];
    let res = symbol.getAttribute("status");
    switch (res)
    {
        case "SUCCEEDED":
            if (symbol.getAttribute("successpercent") == 100)
            {
                return "FINISHED";
            }
            return "NOT YET";
        default:
            return res;
    }
}

async function handleExercisePage()
{
    const titleArray = Array.from(document.querySelectorAll(".title"));
    if (titleArray.every((e) => {return !e.innerText.includes("Subject");}))
    {
        console.log("This is not an ExercisePage, ignoring");
        return;
    }

    let openPdf = await GM.getValue("openPdf");
    let reorganizeSections = await GM.getValue("reorganizeSections");
    let autoReload = await GM.getValue("autoReload");
    let reloadTime = await GM.getValue("reloadTime");

    if (!openPdf)
    {
        openPdf = window.confirm("Do you want to open PDFs automatically ? This setting will be remembered !") ? "yes" : "no";
        await GM.setValue("openPdf", openPdf);
    }
    if (!reorganizeSections)
    {
        reorganizeSections = window.confirm("Do you want to reorganize the sections ? This setting will be remembered !") ? "yes" : "no"
        await GM.setValue("reorganizeSections", reorganizeSections);
    }
    if (!autoReload)
    {
        autoReload = window.confirm("Do you want to reload while a tag is running ? This setting will be remembered !") ? "yes" : "no";
        await GM.setValue("autoReload", autoReload);
        if (autoReload == "yes")
        {
            reloadTime = parseInt(prompt("How many seconds should the page wait before reloading ? This setting will be remembered !"));
            while (isNaN(reloadTime))
            {
                reloadTime = parseInt(prompt("Please enter a number (in seconds) !"));
            }
            await GM.setValue("reloadTime", reloadTime);
        }
    }
    else
    {
        reloadTime = parseInt(reloadTime);
    }

    console.log(`Exercise page !
openPdf: ${openPdf},
reorganizeSections: ${reorganizeSections},
autoReload: ${autoReload} ${reloadTime ? "(" + reloadTime + "s)" : ""}`);

    var stack = document.getElementsByClassName("stack")[0];
    var c0 = stack.children[0]; //first container
    var c1 = stack.children[1]; //second container
    var subtitle = titleArray.find((e) => e.innerText.includes("Subject"));
    var sub = subtitle?.nextElementSibling.classList.contains("title") ? null : subtitle?.nextElementSibling; //subject (embed version)
    var doctitle = titleArray.find((e) => e.innerText.includes("Documents"));
    var doc = doctitle?.nextElementSibling.classList.contains("title") ? null : doctitle?.nextElementSibling; //documents
    var repotitle = titleArray.find((e) => e.innerText.includes("Repository"));
    var repo = repotitle?.nextElementSibling.classList.contains("title") ? null : repotitle?.nextElementSibling;; //repository info
    var tagpattitle = titleArray.find((e) => e.innerText.includes("Submission"));
    var tagpat = tagpattitle?.nextElementSibling.classList.contains("title") ? null : tagpattitle?.nextElementSibling;; //submission info
    var tagrestitle = titleArray.find((e) => e.innerText.includes("Tags"));
    var tagres = tagrestitle?.nextElementSibling.classList.contains("title") ? null : tagrestitle?.nextElementSibling; //tag results

    if (tagpat && tagpat.getElementsByClassName("gitUrl").length != 0)
    {
        tagpat.onclick = function() { navigator.clipboard.writeText(tagpat.getElementsByClassName("gitUrl")[0].children[0].innerText.slice(0, -1));};
    }

    if (doc && openPdf == "yes" &&
        doc.children.length != 0 &&
        performance.navigation.type != performance.navigation.TYPE_RELOAD &&
        performance.navigation.type != performance.navigation.TYPE_BACK_FORWARD &&
        !(document.referrer.includes(window.location)) &&
        tagStatus(tagres) != "FINISHED")
    {
        let subject = (Array.from(doc.children)).find((e) => { return e.href.includes(".pdf") });
        if (subject)
        {
            window.open(subject.href + "#page=3");
        }
    }

    if (reorganizeSections == "yes")
    {
        tagrestitle instanceof Node && c0.appendChild(tagrestitle);
        tagres instanceof Node && c0.appendChild(tagres);
        doctitle instanceof Node && c0.appendChild(doctitle);
        doc instanceof Node && c0.appendChild(doc);
        subtitle instanceof Node && c0.appendChild(subtitle);
        sub instanceof Node && c0.appendChild(sub);
        repotitle instanceof Node && c1.appendChild(repotitle);
        repo instanceof Node && c1.appendChild(repo);
        subtitle instanceof Node && c1.appendChild(subtitle);
        sub instanceof Node && c1.appendChild(sub);
    }

    if (autoReload == "yes" && tagStatus(tagres) == "PROCESSING")
    {
        setTimeout(function(){
            location.reload()
        }, parseInt(reloadTime) * 1000);
    }
}

async function handleMidPage()
{
    var managerlist = document.getElementsByClassName("managers");
    var listlist = document.getElementsByClassName("list");
    if (managerlist.length == 0 || listlist.length != 1)
    {
        console.log("This is not a MidPage, ignoring");
        return;
    }

    let skipMidPages = await GM.getValue("skipMidPages");

    if (!skipMidPages)
    {
        skipMidPages = window.confirm("Do you want to skip empty pages automatically ? This setting will be remembered !") ? "yes" : "no";
        await GM.setValue("skipMidPages", skipMidPages);
    }

    if (skipMidPages != "yes")
    {
        return;
    }

    var list = listlist[0];
    if (list.children.length == 1)
    {
        list.children[0].click();
    }
}

handleExercisePage();
handleMidPage();