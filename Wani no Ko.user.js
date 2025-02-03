// ==UserScript==
// @name         Wani no Ko
// @namespace    Nounours0261
// @version      1.4
// @description  Change the colors and icons on WaniKani
// @author       Nours
// @match        https://www.wanikani.com/*
// @icon         https://i.imgur.com/vfOcObX.png
// @run-at       document-start
// @require      https://github.com/Nounours0261/TamperNours/raw/refs/heads/main/waitForList.js
// @grant        none
// ==/UserScript==

const chibis = {
    ai: "https://i.imgur.com/iW4FOVG.png",
    ruby: "https://i.imgur.com/8s9j6Jb.png",
    kana: "https://i.imgur.com/vfOcObX.png",
    aqua: "https://i.imgur.com/mijTPZu.png",
    mem: "https://i.imgur.com/ZQP0RgV.png"
};

const banners = {
    kanji: "https://i.imgur.com/kTi1ZaX.png",
    vocabulary: "https://i.imgur.com/9P1kTZj.png",
    radical: "https://i.imgur.com/oJQyOJF.png",
};

function preloadImage(url)
{
    let mog = new Image()
    mog.src = url;
}

let sepDiv;
let chibi;

async function startup()
{
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = styleText;
    (await waitForList("html"))[0].appendChild(style);

    for (let chibiImg in chibis)
    {
        preloadImage(chibis[chibiImg]);
    }
    for (let banner in banners)
    {
        preloadImage(banners[banner]);
    }

    chibi = document.createElement('div');
    chibi.classList.add("chibiNours");
    sepDiv = document.createElement('div');
    sepDiv.id = "sepDiv";
}

async function styleUp()
{
    let charHeader = (await waitForList(".character-header"))[0];
    charHeader.firstElementChild.before(chibi);
    let meaning = charHeader.querySelector(".character-header__meaning");
    if (meaning)
    {
        meaning.before(sepDiv);
    }
}

async function replaceLevelUp()
{
    const imgElement = (await waitForList(".level-up-alert__image img", 50))[0];
    if (!imgElement)
    {
        return;
    }
    let svgURL = imgElement.src;
    fetch(svgURL)
        .then(response => response.text())
        .then(svgContent => {
        const svgElement = new DOMParser().parseFromString(svgContent, "image/svg+xml").documentElement;
        imgElement.replaceWith(svgElement);
    })
        .catch(error => console.error("Error loading SVG:", error));
}

async function replaceIcons()
{
    const icons = await waitForList(".srs-progress__stage-icon");
    for (let i = 0; i < icons.length; i++)
    {
        icons[i].firstElementChild.remove();
        let newIcon = document.createElement("div");
        newIcon.classList.add("chibiIcon");
        icons[i].appendChild(newIcon);
    }
}

let observer = null;

function noChibis(mutation)
{
    const addedNodes = Array.from(mutation.addedNodes).filter(node => node !== sepDiv && node !== chibi);

    const removedNodes = Array.from(mutation.removedNodes).filter(node => node !== sepDiv && node !== chibi);

    return (addedNodes.length > 0 || removedNodes.length > 0);
}

async function runScript(url) {
    if (!url)
    {
        url = window.location.href;
    }
    if (url.match(".*subject-lessons/start.*") || url.match(".*subject-lessons/-?[0-9]*/[0-9]{4}.*"))
    {
        styleUp();
        observer = new MutationObserver(mutations => mutations.every(noChibis) && styleUp());
        observer.observe((await waitForList("body"))[0], { childList: true, subtree:true });
    }
    if (/^https:\/\/www\.wanikani\.com(\/(dashboard\/?)?)?$/.test(url))
    {
        replaceLevelUp();
        replaceIcons();
    }
    if (url.match("https://www.wanikani.com/subjects/review"))
    {
        styleUp();
    }
}

function main()
{
    startup();
    runScript();
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        runScript(args[2]);
    };
    window.addEventListener('popstate', runScript);
}

const styleText = `:root {
            /* Colors */
            --color-purple: #8657a7;
            --color-pink: #d94358;
            --color-light-pink: #e276a1;
            --color-blue: #3988b0;
            --color-green: #5fbd6c;
            --color-yellow: #f1ae3b;

            --color-radical: var(--color-light-pink);
            --color-radical-dark: #c75b86;
            --color-radical-highlight: #f88fb9;
            --color-radical-lowlight: #dd568c;

            --color-kanji: var(--color-pink);
            --color-kanji-dark: #c73f52;
            --color-kanji-highlight: #e96c7d;
            --color-kanji-lowlight: #ca273e;

            --color-vocabulary: var(--color-purple);
            --color-vocabulary-dark: #6f438e;
            --color-vocabulary-highlight: #a372c6;
            --color-vocabulary-lowlight: #763e9d;

            --color-level-progress-bar-progress: var(--color-pink);
            --color-review-forecast-bar: var(--color-purple);
            --color-subject-srs-progress-stage-complete-background: var(--color-green);
            --color-alert-system-background: var(--color-pink);
            --color-button-quiz-background: var(--color-green);
            --color-button-lesson-picker-border: var(--color-kanji-dark);
            --color-button-lesson-picker-text-shadow: var(--color-kanji-dark);
            --color-button-lesson-picker-box-shadow: var(--color-kanji-dark);
            --color-button-lesson-picker-hover-border: var(--color-kanji-dark);
            --color-button-lesson-picker-hover-background: var(--color-kanji-dark);

            --color-srs-progress-apprentice: var(--color-blue);
            --color-srs-progress-guru: var(--color-purple);
            --color-srs-progress-master: var(--color-yellow);
            --color-srs-progress-enlightened: var(--color-light-pink);
            --color-srs-progress-burned: var(--color-pink);
        }

        /* Level Up Image */
        .sparkle {
            stroke: var(--color-purple) !important;
        }

        .am {
            fill: var(--color-pink) !important;
        }

        .ar, .ap {
            fill: var(--color-purple) !important;
        }

        .aq {
            fill: var(--color-light-pink) !important;
        }

        .footer__item--copyright {
            background-color: var(--color-pink);
        }

        .character-header__srs-container {
            z-index: 2;
        }

        .character-header {
            anchor-name: --banner;
            background-size: auto 100%;
            background-position: left;
            background-repeat: no-repeat;
            overflow: hidden;
        }

        .character-header__characters {
            padding: 0 2vh 0.5vh 2vh;
            border-radius: 15px;
        }

        .chibiNours {
            position-anchor: --banner;
            position: absolute;
            top: 10px;
            left: 10px;
            --nheight: calc(anchor-size(height) - 20px);
            height: var(--nheight);
            width: calc(var(--nheight) / 481 * 489);
            pointer-events: none;
            background-size: auto 100%;
        }

        .character-header__meaning {
            border-radius: 8px;
            padding: 0px 1.5vh 0.3vh 1.5vh;
            flex-basis: 0%;
            white-space: nowrap;
        }

        .chibiIcon {
            height: 70px;
            width: 71.2px;
            background-size: auto 100%;
        }

        #sepDiv {
            flex-basis: 100%;
        }

        #section-context .subject-section__text p:not([lang="ja"]):not(:hover),
        .context-sentence-group p:not([lang="ja"]):not(:hover),
        .subject-collocations__collocation-text:not([lang="ja"]):not(:hover),
        .context-sentences .wk-text:not([lang="ja"]):not(:hover) {
            z-index: -100;
            background-color: #eee;
            color: rgba(0, 0, 0, 0);
            text-shadow: none;
        }

            .srs-progress__stage--apprentice .chibiIcon {
                background-image: url(https://i.imgur.com/mijTPZu.png);
            }

            .srs-progress__stage--guru .chibiIcon {
                background-image: url(https://i.imgur.com/iW4FOVG.png);
            }

            .srs-progress__stage--master .chibiIcon {
                background-image: url(https://i.imgur.com/ZQP0RgV.png);
            }

            .srs-progress__stage--enlightened .chibiIcon {
                background-image: url(https://i.imgur.com/8s9j6Jb.png);
            }

            .srs-progress__stage--burned .chibiIcon {
                background-image: url(https://i.imgur.com/vfOcObX.png);
            }

            .sitemap__expandable-chunk--vocabulary,
            .sitemap__expandable-chunk--vocabulary:before {
                background: var(--color-vocabulary);
            }

            .sitemap__section-header--vocabulary:hover,
            .sitemap__section-header--vocabulary:focus,
            .sitemap__section--open .sitemap__section-header--vocabulary {
                color: var(--color-vocabulary);
                border-color: var(--color-vocabulary);
            }

            .page-header__icon--vocabulary {
                background-color: var(--color-vocabulary);
                background-image: linear-gradient(var(--color-vocabulary), var(--color-vocabulary-lowlight));
            }

            .character-header--vocabulary {
                background-color: var(--color-vocabulary);
                background-image: url(https://i.imgur.com/9P1kTZj.png);
                text-shadow: 2px 2px 0 var(--color-vocabulary-dark);
            }

            .character-header--vocabulary .character-header__meaning {
                text-shadow: 3px 3px 0 var(--color-vocabulary-dark);
            }

            .character-header--vocabulary .character-header__characters,
            .character-header--vocabulary .character-header__meaning {
                background-color: var(--color-vocabulary-lowlight);
            }

            .character-header--vocabulary .chibiNours {
                background-image: url(https://i.imgur.com/iW4FOVG.png);
            }

            .sitemap__expandable-chunk--kanji,
            .sitemap__expandable-chunk--kanji:before {
                background: var(--color-kanji);
            }

            .sitemap__section-header--kanji:hover,
            .sitemap__section-header--kanji:focus,
            .sitemap__section--open .sitemap__section-header--kanji {
                color: var(--color-kanji);
                border-color: var(--color-kanji);
            }

            .page-header__icon--kanji {
                background-color: var(--color-kanji);
                background-image: linear-gradient(var(--color-kanji), var(--color-kanji-lowlight));
            }

            .character-header--kanji {
                background-color: var(--color-kanji);
                background-image: url(https://i.imgur.com/kTi1ZaX.png);
                text-shadow: 2px 2px 0 var(--color-kanji-dark);
            }

            .character-header--kanji .character-header__meaning {
                text-shadow: 3px 3px 0 var(--color-kanji-dark);
            }

            .character-header--kanji .character-header__characters,
            .character-header--kanji .character-header__meaning {
                background-color: var(--color-kanji-lowlight);
            }

            .character-header--kanji .chibiNours {
                background-image: url(https://i.imgur.com/vfOcObX.png);
            }

            .sitemap__expandable-chunk--radicals,
            .sitemap__expandable-chunk--radicals:before {
                background: var(--color-radical);
            }

            .sitemap__section-header--radicals:hover,
            .sitemap__section-header--radicals:focus,
            .sitemap__section--open .sitemap__section-header--radicals {
                color: var(--color-radical);
                border-color: var(--color-radical);
            }

            .page-header__icon--radical {
                background-color: var(--color-radical);
                background-image: linear-gradient(var(--color-radical), var(--color-radical-lowlight));
            }

            .character-header--radical {
                background-color: var(--color-radical);
                background-image: url(https://i.imgur.com/oJQyOJF.png);
                text-shadow: 2px 2px 0 var(--color-radical-dark);
            }

            .character-header--radical .character-header__meaning {
                text-shadow: 3px 3px 0 var(--color-radical-dark);
            }

            .character-header--radical .character-header__characters,
            .character-header--radical .character-header__meaning {
                background-color: var(--color-radical-lowlight);
            }

            .character-header--radical .chibiNours {
                background-image: url(https://i.imgur.com/8s9j6Jb.png);
            }

            .level-up-alert__image img {
            visibility: hidden;
            }

            .subject-section__subsection:has(#user_meaning_note),
            .subject-section__subsection:has(#user_reading_note),
            .subject-slide .subject-section:has(#user_meaning_note),
            .subject-slide .subject-section:has(#user_reading_note)
            {
                display: none;
            }`;

main();

//It's better to have the CSS ready to make less calculations, so only use this when making changes then use the result directly
const types = {
    vocabulary: "ai",
    kanji: "kana",
    radical: "ruby",
};

const levels = {
    apprentice: "aqua",
    guru: "ai",
    master: "mem",
    enlightened: "ruby",
    burned: "kana",
}

function generateCSS()
{
    let res = `
        :root {
            /* Colors */
            --color-purple: #8657a7;
            --color-pink: #d94358;
            --color-light-pink: #e276a1;
            --color-blue: #3988b0;
            --color-green: #5fbd6c;
            --color-yellow: #f1ae3b;

            --color-radical: var(--color-light-pink);
            --color-radical-dark: #c75b86;
            --color-radical-highlight: #f88fb9;
            --color-radical-lowlight: #dd568c;

            --color-kanji: var(--color-pink);
            --color-kanji-dark: #c73f52;
            --color-kanji-highlight: #e96c7d;
            --color-kanji-lowlight: #ca273e;

            --color-vocabulary: var(--color-purple);
            --color-vocabulary-dark: #6f438e;
            --color-vocabulary-highlight: #a372c6;
            --color-vocabulary-lowlight: #763e9d;

            --color-level-progress-bar-progress: var(--color-pink);
            --color-review-forecast-bar: var(--color-purple);
            --color-subject-srs-progress-stage-complete-background: var(--color-green);
            --color-alert-system-background: var(--color-pink);
            --color-button-quiz-background: var(--color-green);
            --color-button-lesson-picker-border: var(--color-kanji-dark);
            --color-button-lesson-picker-text-shadow: var(--color-kanji-dark);
            --color-button-lesson-picker-box-shadow: var(--color-kanji-dark);
            --color-button-lesson-picker-hover-border: var(--color-kanji-dark);
            --color-button-lesson-picker-hover-background: var(--color-kanji-dark);

            --color-srs-progress-apprentice: var(--color-blue);
            --color-srs-progress-guru: var(--color-purple);
            --color-srs-progress-master: var(--color-yellow);
            --color-srs-progress-enlightened: var(--color-light-pink);
            --color-srs-progress-burned: var(--color-pink);
        }

        /* Level Up Image */
        .sparkle {
            stroke: var(--color-purple) !important;
        }

        .am {
            fill: var(--color-pink) !important;
        }

        .ar, .ap {
            fill: var(--color-purple) !important;
        }

        .aq {
            fill: var(--color-light-pink) !important;
        }

        .footer__item--copyright {
            background-color: var(--color-pink);
        }

        .character-header__srs-container {
            z-index: 2;
        }

        .character-header {
            anchor-name: --banner;
            background-size: auto 100%;
            background-position: left;
            background-repeat: no-repeat;
            overflow: hidden;
        }

        .character-header__characters {
            padding: 0 2vh 0.5vh 2vh;
            border-radius: 15px;
        }

        .chibiNours {
            position-anchor: --banner;
            position: absolute;
            top: 10px;
            left: 10px;
            --nheight: calc(anchor-size(height) - 20px);
            height: var(--nheight);
            width: calc(var(--nheight) / 481 * 489);
            pointer-events: none;
            background-size: auto 100%;
        }

        .character-header__meaning {
            border-radius: 8px;
            padding: 0px 1.5vh 0.3vh 1.5vh;
            flex-basis: 0%;
            white-space: nowrap;
        }

        .chibiIcon {
            height: 70px;
            width: 71.2px;
            background-size: auto 100%;
        }

        #sepDiv {
            flex-basis: 100%;
        }

        #section-context .subject-section__text p:not([lang="ja"]):not(:hover),
        .context-sentence-group p:not([lang="ja"]):not(:hover),
        .subject-collocations__collocation-text:not([lang="ja"]):not(:hover),
        .context-sentences .wk-text:not([lang="ja"]):not(:hover) {
            z-index: -100;
            background-color: #eee;
            color: rgba(0, 0, 0, 0);
            text-shadow: none;
        }

        .level-up-alert__image img {
            visibility: hidden;
        }

        .subject-section__subsection:has(#user_meaning_note),
            .subject-section__subsection:has(#user_reading_note),
            .subject-section:has(#user_meaning_note),
            .subject-section:has(#user_reading_note)
            {
                display: none;
        }
    `;

    for (let level in levels) {
        res += `
            .srs-progress__stage--${level} .chibiIcon {
                background-image: url(${chibis[levels[level]]});
            }
        `;
    }

    for (let type in types) {
        res += `
            .sitemap__expandable-chunk--${type + (type == "radical" ? "s" : "")},
            .sitemap__expandable-chunk--${type + (type == "radical" ? "s" : "")}:before {
                background: var(--color-${type});
            }

            .sitemap__section-header--${type + (type == "radical" ? "s" : "")}:hover,
            .sitemap__section-header--${type + (type == "radical" ? "s" : "")}:focus,
            .sitemap__section--open .sitemap__section-header--${type + (type == "radical" ? "s" : "")} {
                color: var(--color-${type});
                border-color: var(--color-${type});
            }

            .page-header__icon--${type} {
                background-color: var(--color-${type});
                background-image: linear-gradient(var(--color-${type}), var(--color-${type}-lowlight));
            }

            .character-header--${type} {
                background-color: var(--color-${type});
                background-image: url(${banners[type]});
                text-shadow: 2px 2px 0 var(--color-${type}-dark);
            }

            .character-header--${type} .character-header__meaning {
                text-shadow: 3px 3px 0 var(--color-${type}-dark);
            }

            .character-header--${type} .character-header__characters,
            .character-header--${type} .character-header__meaning {
                background-color: var(--color-${type}-lowlight);
            }

            .character-header--${type} .chibiNours {
                background-image: url(${chibis[types[type]]});
            }`;
    }
    console.log(res);
}