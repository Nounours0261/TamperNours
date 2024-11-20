// ==UserScript==
// @name         Forge Optimizer
// @namespace    Nounours0261
// @version      1
// @description  Make Forge navigation easier
// @author       Nours & ChatGPT
// @match        https://intra.forge.epita.fr/*
// @icon         https://static.vecteezy.com/system/resources/previews/032/180/007/original/color-icon-for-forge-vector.jpg
// @run-at       document-idle
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js
// ==/UserScript==

//Settings
const openPdf = true; //When first opening an exercise's page, open the pdf automatically
const reorganizeSections = true; //Reorganize the order of the sections to have relevant information at the top
const skipMidPages = true; //When arriving on an activity's page, if it only contains one exercise, go to this exercise automatically
const autoReload = true; //Reload every [reloadTime] seconds when there is a tag pending
const reloadTime = 5;
const providedFilesAlert = true;

const rainbow = [
    ['#ff0000', '#ff4d4d', '#ff6666'], // Red
    ['#ff1a00', '#ff5c33', '#ff704d'], // Red-Orange
    ['#ff3300', '#ff6600', '#ff8533'], // Deep Orange
    ['#ff4d00', '#ff751a', '#ff8c4d'], // Orange
    ['#ff6600', '#ff8533', '#ff9933'], // Orange-Yellow
    ['#ff8000', '#ff9933', '#ffb366'], // Yellowish Orange
    ['#ff9933', '#ffb84d', '#ffcc66'], // Yellow-Orange
    ['#ffb300', '#ffd966', '#ffe066'], // Yellow
    ['#ffcc00', '#ffeb80', '#ffff99'], // Bright Yellow
    ['#ffff00', '#ffff66', '#f0e68c'], // Yellow-Green
    ['#e6ff00', '#ccff66', '#e6ffb3'], // Yellow-Greenish
    ['#ccff00', '#bfff00', '#a3ff33'], // Greenish Yellow
    ['#99ff33', '#b3ff66', '#ccff99'], // Lime Green
    ['#66ff33', '#7fff3f', '#9fff66'], // Green
    ['#33ff33', '#66ff66', '#99ff99'], // True Green
    ['#00ff40', '#33ff66', '#66ff80'], // Greenish Cyan
    ['#00ff80', '#33ffaa', '#66ffd2'], // Cyan
    ['#00ffaa', '#33ffcc', '#80ffe6'], // Light Cyan
    ['#00ffff', '#66ffff', '#99ffff'], // Cyan-Blue
    ['#00bfff', '#33ccff', '#66d9ff'], // Light Blue
    ['#0080ff', '#3399ff', '#66b2ff'], // True Blue
    ['#0040ff', '#3366ff', '#6699ff'], // Indigo Blue
    ['#6600ff', '#8533ff', '#9933ff'], // Blueish Purple
    ['#8000ff', '#9933ff', '#b366ff'], // Purple
    ['#9933ff', '#b366ff', '#cc80ff'], // Violet Purple
    ['#bf00ff', '#d966ff', '#e066ff'], // Magenta
    ['#cc00cc', '#e066ff', '#f280f2'], // Magenta-Pink
    ['#e600ac', '#f280c2', '#ff99cc'], // Deep Pink
    ['#ff0099', '#ff66b2', '#ff99cc'], // Pink
    ['#ff3399', '#ff80bf', '#ffb3d9'], // Pinkish Red
    ['#ff6680', '#ff99a3', '#ffccd2'], // Soft Red
    ['#ff8080', '#ffb3b3', '#ffd6d6'], // Light Red
];

function randint(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function fullConfetti() {
    // Define all magic values as variables
    const spread = 360;
    const gravity = 0.5;
    const scalar = 1.5;
    const ticks = 150;
    const origin = { y: 0.5, x: 0.51 };

    // Different particle configurations
    const particleConfigs = [
        { particleCount: 10, startVelocity: 1 },
        { particleCount: 50, startVelocity: 5 },
        { particleCount: 150, startVelocity: 15 },
        { particleCount: 450, startVelocity: 50 }
    ];

    particleConfigs.forEach(config => {
        confetti({
            particleCount: config.particleCount,
            spread: spread,
            gravity: gravity,
            scalar: scalar,
            startVelocity: config.startVelocity,
            ticks: ticks,
            origin: origin
        });
    });
}


function smallConfetti(x, y, colors)
{
    const mainParticleCount = 300;
    const extraParticleCount = 50;
    const spread = 360;
    const gravity = 0.5;
    const scalar = 1;
    const decay = 0.95;
    const mainStartVelocity = 7;
    const extraStartVelocity = 2;
    const ticks = 50;

    confetti({
        particleCount: mainParticleCount,
        spread: spread,
        gravity: gravity,
        scalar: scalar,
        decay: decay,
        startVelocity: mainStartVelocity,
        ticks: ticks,
        colors: colors,
        origin: { y: y, x: x }
    });

    confetti({
        particleCount: extraParticleCount,
        spread: spread,
        gravity: gravity,
        scalar: scalar,
        decay: decay,
        startVelocity: extraStartVelocity,
        ticks: ticks,
        colors: colors,
        origin: { y: y, x: x }
    });
}


function rotateConfetti(x, y, times, i) {
    // Define all magic values as variables
    const particleCount = 800;
    const smallParticleCount = 60;
    const spreadAngle = 360;
    const gravity = 0
    const scalar = 1;
    const decay = 0.95;
    const mainStartVelocity = 10;
    const smallStartVelocity = 3;
    const ticks = 60;
    const delay = 50;

    const pCount = particleCount / rainbow.length;
    const smallpCount = smallParticleCount / rainbow.length;
    const angleStep = spreadAngle / rainbow.length;

    if (i >= times * rainbow.length)
    {
        for (let j = 0; j < rainbow.length * 2; j += 1)
        {
            setTimeout(function(){
                confetti({
                    particleCount: pCount * 0.5,
                    angle: angleStep * j / 2,
                    spread: angleStep / 2,
                    gravity: gravity,
                    scalar: scalar,
                    decay: decay,
                    startVelocity: mainStartVelocity,
                    ticks: ticks * 2,
                    colors: rainbow[j % rainbow.length],
                    origin: { y: y, x: x }
                });
                confetti({
                    particleCount: smallpCount,
                    spread: angleStep / 2,
                    angle: angleStep * j / 2,
                    gravity: gravity,
                    scalar: scalar,
                    decay: decay,
                    startVelocity: smallStartVelocity,
                    ticks: ticks * 2,
                    colors: rainbow[j % rainbow.length],
                    origin: { y: y, x: x }
                });
            }, 300);
        }
        return;
    }

    confetti({
        particleCount: pCount,
        angle: angleStep * i,
        spread: angleStep,
        gravity: gravity,
        scalar: scalar,
        decay: decay,
        startVelocity: mainStartVelocity,
        ticks: ticks,
        colors: rainbow[i % rainbow.length],
        origin: { y: y, x: x }
    });
    confetti({
        particleCount: smallpCount,
        spread: angleStep,
        angle: angleStep * i,
        gravity: gravity,
        scalar: scalar,
        decay: decay,
        startVelocity: smallStartVelocity,
        ticks: ticks,
        colors: rainbow[i % rainbow.length],
        origin: { y: y, x: x }
    });
    confetti({
        particleCount: pCount,
        angle: angleStep * i + 180,
        spread: angleStep,
        gravity: gravity,
        scalar: scalar,
        decay: decay,
        startVelocity: mainStartVelocity,
        ticks: ticks,
        colors: rainbow[i % rainbow.length],
        origin: { y: y, x: x }
    });
    confetti({
        particleCount: smallpCount,
        spread: angleStep,
        angle: angleStep * i + 180,
        gravity: gravity,
        scalar: scalar,
        decay: decay,
        startVelocity: smallStartVelocity,
        ticks: ticks,
        colors: rainbow[i % rainbow.length],
        origin: { y: y, x: x }
    });

    setTimeout(function() { rotateConfetti(x, y, times, i + 1); }, delay);
}

function randomColors()
{
    return rainbow[randint(0, rainbow.length)].concat(rainbow[randint(0, rainbow.length)]);
}

function launch() {
    const maxDelay = 600;
    const maxPos = 0.07;

    setTimeout(function(){smallConfetti(0.2 - maxPos + Math.random() * maxPos * 2,
                                        0.3 - maxPos + Math.random() * maxPos * 2,
                                        randomColors())}, 1000 - maxDelay + randint(0, maxDelay * 2));
    setTimeout(function(){smallConfetti(0.8 - maxPos + Math.random() * maxPos * 2,
                                        0.3 - maxPos + Math.random() * maxPos * 2,
                                        randomColors())}, 1500 - maxDelay + randint(0, maxDelay * 2));
    setTimeout(function(){smallConfetti(0.2 - maxPos + Math.random() * maxPos * 2,
                                        0.7 - maxPos + Math.random() * maxPos * 2,
                                        randomColors())}, 1000 - maxDelay + randint(0, maxDelay * 2));
    setTimeout(function(){smallConfetti(0.8 - maxPos + Math.random() * maxPos * 2,
                                        0.7 - maxPos + Math.random() * maxPos * 2,
                                        randomColors())}, 1500 - maxDelay + randint(0, maxDelay * 2));
    rotateConfetti(0.5, 0.51, 2, 0);
}

function getPFiles(doc)
{
    for (let i = 0; i < doc.children.length; i++)
    {
        if (doc.children[i].href.includes(".tar"))
        {
            return i;
        }
    }
    console.log("nothing found for ", doc);
    return -1;
}

function tagStatus(tagres)
{
    if (tagres.children.length == 0)
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

function handleExercisePage()
{
    if (document.getElementsByTagName("subject-loader").length == 0)
    {
        console.log("This is not an ExercisePage, ignoring");
        return;
    }

    var stack = document.getElementsByClassName("stack")[0];
    var c0 = stack.children[0]; //first container
    var c1 = stack.children[1]; //second container
    var subtitle = c0.children[0];
    var sub = c0.children[1]; //subject (embed version)
    var doctitle = c0.children[2];
    var doc = c0.children[3]; //documents
    var repotitle = c1.children[0];
    var repo = c1.children[1]; //repository info
    var tagpattitle = c1.children[2];
    var tagpat = c1.children[3]; //submission info
    var tagrestitle = c1.children[4];
    var tagres = c1.children[5]; //tag results

    if (tagpat.getElementsByClassName("gitUrl").length != 0)
    {
        tagpat.onclick = function() { navigator.clipboard.writeText(tagpat.getElementsByClassName("gitUrl")[0].children[0].innerText.slice(0, -1));};
    }

    if (openPdf &&
        doc.children.length != 0 &&
        performance.navigation.type != performance.navigation.TYPE_RELOAD &&
        performance.navigation.type != performance.navigation.TYPE_BACK_FORWARD &&
        !(document.referrer.includes(window.location)) &&
        tagStatus(tagres) != "FINISHED")
    {
        window.open(doc.children[0].href + "#page=3");
    }

    if (providedFilesAlert &&
        doc.children.length != 0 &&
        performance.navigation.type != performance.navigation.TYPE_RELOAD &&
        performance.navigation.type != performance.navigation.TYPE_BACK_FORWARD &&
        !(document.referrer.includes(window.location)) &&
        tagStatus(tagres) != "FINISHED")
    {
        let pfilesIndex = getPFiles(doc);
        if (pfilesIndex != -1)
        {
            if (window.confirm("There are some provided files available.\nDownload them ?"))
            {
                window.open(doc.children[pfilesIndex].href);
            }
        }
    }

    if (reorganizeSections)
    {
        if (tagStatus(tagres) != "FINISHED")
        {
            c0.insertBefore(tagrestitle, doctitle);
            c0.insertBefore(tagres, doctitle);
            c0.insertBefore(tagpattitle, doctitle);
            c0.insertBefore(tagpat, doctitle);
            c1.appendChild(subtitle);
            c1.appendChild(sub);
        }
        else
        {
            c0.insertBefore(tagrestitle, doctitle);
            c0.insertBefore(tagres, doctitle);
            c0.appendChild(tagpattitle);
            c0.appendChild(tagpat);
            c1.appendChild(subtitle);
            c1.appendChild(sub);
        }
    }

    if (autoReload && tagStatus(tagres) == "PROCESSING")
    {
        setTimeout(function(){
            location.reload()
        }, reloadTime * 1000);
    }
}

function handleMidPage()
{
    if (!skipMidPages)
    {
        return;
    }

    var managerlist = document.getElementsByClassName("managers");
    var listlist = document.getElementsByClassName("list");
    if (managerlist.length == 0 || listlist.length == 0)
    {
        console.log("This is not a MidPage, ignoring");
        return;
    }

    var list = listlist[0];
    if (list.children.length == 1)
    {
        list.children[0].click();
    }
}

function handleTutorialPage()
{
    if (window.location == "https://intra.forge.epita.fr/epita-ing-assistants-acu/piscine-2027/root/tutorials" ||
        window.location == "https://intra.forge.epita.fr/epita-ing-assistants-acu/piscine-2027/root/tutorials/")
    {
        var stack = document.getElementsByClassName("stack")[0];
        var c0 = stack.children[0]; //first container
        var c1 = stack.children[1]; //second container
        var doctitle = c0.children[0];
        var docsearch = c0.children[1];
        var docdiv = c0.children[2];
        var doclist = c0.children[3];//doc info
        var newstitle = c1.children[0];
        var news = c1.children[1]; //news info
        var valtitle = c1.children[2];
        var val = c1.children[3]; //validation info
        var managerstitle = c1.children[4];
        var managers = c1.children[5]; //managers info
        stack.insertBefore(c1, c0);
        docsearch.remove();
        docdiv.remove();
        valtitle.remove();
        val.remove();
        managerstitle.remove();
        managers.remove();
        for (var i = 1; i < doclist.children.length; i++)
        {
            doclist.insertBefore(doclist.children[i], doclist.children[0]);
        }
        c1.appendChild(doctitle);
        c1.appendChild(doclist);
        c0.appendChild(newstitle);
        c0.appendChild(news);
        stack.classList.remove("stack-reversed");
    }
    if (window.location.href.match("https://intra.forge.epita.fr/epita-ing-assistants-acu/piscine-2027/root/tutorials/*"))
    {
        console.log("amogus");
        var stack2 = document.getElementsByClassName("stack")[0];
        console.log(stack2);
        if (stack2.children.length == 0)
        {
            return;
        }
        var c2 = stack2.children[0];
        var doc = c2.children[2]; //documents
        if ((openPdf || providedFilesAlert) &&
            doc.children.length != 0 &&
            performance.navigation.type != performance.navigation.TYPE_RELOAD &&
            performance.navigation.type != performance.navigation.TYPE_BACK_FORWARD &&
            !(document.referrer.includes(window.location)))
        {
            if (openPdf)
            {
                window.open(doc.children[0].href + "#page=2");
            }
            if (providedFilesAlert)
            {
                let pfilesIndex = getPFiles(doc);
                if (pfilesIndex != -1)
                {
                    if (window.confirm("There are some provided files available.\nDownload them ?"))
                    {
                        window.open(doc.children[pfilesIndex].href);
                    }
                }
            }
        }
    }
    console.log("This is not a TutorialPage, ignoring");
}

handleExercisePage();
handleMidPage();
handleTutorialPage();