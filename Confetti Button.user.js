// ==UserScript==
// @name         Confetti Button
// @namespace    Nounours0261
// @version      1
// @description  Add a button to show confetti on the screen!
// @author       ChatGPT & Nours
// @match        *://*/*
// @icon         https://thumbs.dreamstime.com/b/feux-d-artifice-14498127.jpg
// @run-at       document-idle
// @require      https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js
// ==/UserScript==

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

function makeButton()
{
    var button = document.createElement('button');
    button.innerHTML = '🎉 Show Confetti 🎉';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.style.padding = '10px';
    button.style.backgroundColor = '#ffcc00';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
    button.style.fontSize = '16px';

    document.body.appendChild(button);
    return button;
}

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

async function main()
{
    let b = makeButton();
    b.addEventListener('click', launch);
    b.style.display = 'none';
    document.addEventListener('keydown', (e) => {
        if (e.key == 'c' && e.altKey)
        {
            b.style.display = b.style.display == 'block' ? 'none' : 'block';
        }
    });
}
main();