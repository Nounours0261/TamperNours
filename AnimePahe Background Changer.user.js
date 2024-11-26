// ==UserScript==
// @name         AnimePahe Background Changer
// @namespace    Nounours0261
// @version      1
// @description  Change the background on AnimePahe anime pages
// @author       Nours
// @match        https://animepahe.ru/anime/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=animepahe.ru
// @run-at       document-start
// @grant        none
// ==/UserScript==

const arima1 = "https://i.imgur.com/CwZYsM5.png";

function getBGElement()
{
    var coverList = document.getElementsByClassName("anime-cover");
    if (coverList.length == 0)
    {
        console.log("cover not found, trying again");
        setTimeout(getBGElement, 10);
        return;
    }
    let bg = coverList[0].style.backgroundImage;
    let bgImageUrl = bg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
    if (bgImageUrl == "")
    {
        console.log("image not set, trying again");
        setTimeout(getBGElement, 10);
        return;
    }
    //coverList[0].style.transition = 'none';
//coverList[0].style.opacity = '1';
    coverList[0].style.backgroundImage = bg.replace(bgImageUrl, arima1);
    console.log(coverList[0].style.backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, ''));
    console.log("finished");
}

(function() {
    'use strict';
    getBGElement();
})();