// ==UserScript==
// @name         Forge Graph Parser
// @namespace    Nounours0261
// @version      1
// @description  Turn the ugly graphs into beautiful lists
// @author       Nours & ChatGPT
// @match        https://intra.forge.epita.fr/*
// @icon         https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/256x256/plain/graph.png
// @run-at       document-idle
// @grant        none
// ==/UserScript==

function parseNodes(nodeList)
{
    const nodes = Array.from(nodeList).map((node) => {
        const transform = node.getAttribute("transform");
        const [, x, y] = transform.match(/translate\(([^,]+),\s*([^)]+)\)/).map(parseFloat);
        const id = node.id;
        return { id, x, y };
    });
    return nodes;
}

function nearestNode(nodes, xTarget, yTarget)
{
    let threshold = 5;
    while (threshold <= 100) {
        const node = nodes.find(node =>
                                Math.abs(node.x - xTarget) <= threshold &&
                                Math.abs(node.y - yTarget) <= threshold
                               );
        if (node) return node;
        threshold += 5;
    }
    return null;
};

function parseEdges(rootElement, nodes) {
    const edges = Array.from(rootElement.querySelectorAll("path.edge-thickness-normal.transition"));
    const relationships = {};

    edges.forEach((edge) => {
        const dAttr = edge.getAttribute("d");
        const [xStart, yStart] = dAttr.match(/^M([^,]+),([^L]+)/).slice(1).map(parseFloat);
        const [xEnd, yEnd] = dAttr.match(/L([^,]+),([^L]+)$/).slice(1).map(parseFloat);

        const startNode = nearestNode(nodes, xStart, yStart);
        const endNode = nearestNode(nodes, xEnd, yEnd);

        if (startNode && endNode) {
            if (!relationships[startNode.id]) {
                relationships[startNode.id] = [];
            }
            relationships[startNode.id].push(endNode.id);
        }
    });

    if (Object.keys(relationships).length === 0) {
        console.warn("No relationships were created - check threshold or node matching logic.");
    }

    return relationships;
}

function getName(id)
{
    const labelSpan = document.getElementById(id).querySelector(".nodeLabel");
    return labelSpan ? labelSpan.textContent.trim() : (id.includes("start") ? "Root node" : "Unknown");
}

function getLink(id)
{
    const child = document.getElementById(id).querySelector("a");
    return child ? child.href.baseVal : "null";
}

function isValidated(id)
{
    return id.includes("validated=true");
}

function isAccessible(id)
{
    return id.includes("accessible=true");
}

function isRequired(id)
{
    return id.includes("required=true");
}

function logRelationships(relationships) {
    for (const startNode in relationships) {
        relationships[startNode].forEach((endNode) => {
            console.log(`${getName(startNode)}: ${getLink(startNode)} -> ${getName(endNode)}: ${getLink(endNode)}`);
        });
    }
}

function getDescendants(relationships, id, nbkids)
{
    return auxDescendants(relationships, id, -nbkids);
}

function auxDescendants(relationships, id, res = 1)
{
    for (const startNode in relationships)
    {
        if (startNode == id)
        {
            for (let i = 0; i < relationships[startNode].length; i++)
            {
                if (isRequired(relationships[startNode][i]) && !isValidated(relationships[startNode][i]))
                {
                    res += auxDescendants(relationships, relationships[startNode][i]);
                }
            }
        }
    }
    return res;
}

function getChildren(relationships, id)
{
    let res = 0;
    for (const startNode in relationships)
    {
        if (startNode == id)
        {
            for (let i = 0; i < relationships[startNode].length; i++)
            {
                res += ((isRequired(relationships[startNode][i]) && !isValidated(relationships[startNode][i])) ? 1 : 0);
            }
        }
    }
    return res;
}

function sortName(list)
{
    list.sort(function(a, b){return a.textContent.localeCompare(b.textContent);});
}

function sortKids(list)
{
    list.sort(function(a, b){
        let diff = b.getAttribute("nbkids") - a.getAttribute("nbkids");
        return diff != 0 ? diff : b.getAttribute("nbgkids") - a.getAttribute("nbgkids");
    });
}

function createButtons(nodes, relationships)
{
    var vlist = [];
    var alist = [];
    var nlist = [];
    nodes.forEach(node => {
        if (!isRequired(node.id))
        {
            return;
        }
        if (isAccessible(node.id))
        {
            if (isValidated(node.id))
            {
                createButton(vlist, node.id, "#e63d37", "#fffffff");
            }
            else
            {
                const nbkids = getChildren(relationships, node.id);
                const nbgkids = getDescendants(relationships, node.id, nbkids);
                createButton(alist, node.id, "#2fded8", "#000000", nbkids, nbgkids);
            }
        }
        else
        {
            createButton(nlist, node.id, "#854ede", "#ffffff");
        }
    });
    sortName(vlist);
    sortKids(alist);
    sortName(nlist);

    let nbdivs = alist.length % (alist.length - 1) + nlist.length % (nlist.length - 1) + vlist.length % (vlist.length - 1);
    let gtc = 6 / nbdivs;

    const mainDiv = document.createElement('div');
    mainDiv.style.display = 'grid';
    mainDiv.style.gridTemplateColumns = `repeat(${nbdivs}, 1fr)`;

    if (nlist.length)
    {
        const nBig = document.createElement('div');
        const ntitleDiv = document.createElement('div');
        const ntitle = document.createElement('button');
        const ncontainer = document.createElement('div');
        ntitleDiv.style.gap = '10px';
        ntitleDiv.style.padding = '20px 10px 20px';
        ntitleDiv.style.display = 'grid';
        ntitle.onclick = function() {ncontainer.style.display = (ncontainer.style.display == "grid" ? "none" : "grid");};
        ntitle.style.fontSize = '14px';
        ntitle.style.backgroundColor = "#854ede";
        ntitle.style.cursor = 'pointer';
        ncontainer.style.display = 'grid';
        ncontainer.style.gridTemplateColumns = `repeat(${gtc}, 1fr)`;
        ncontainer.style.gap = '10px';
        ncontainer.style.padding = '0px 10px 20px';
        ntitle.textContent = "Unavailable exercises (".concat(nlist.length, ")");

        for (let i = 0; i < nlist.length; i++)
        {
            ncontainer.appendChild(nlist[i]);
        }

        ntitleDiv.appendChild(ntitle);
        nBig.appendChild(ntitleDiv);
        nBig.appendChild(ncontainer);
        mainDiv.appendChild(nBig);
    }

    if (alist.length != 0)
    {
        const aBig = document.createElement('div');
        const atitleDiv = document.createElement('div');
        const atitle = document.createElement('button');
        const acontainer = document.createElement('div');
        atitleDiv.style.gap = '10px';
        atitleDiv.style.padding = '20px 10px 20px';
        atitleDiv.style.display = 'grid';
        atitle.onclick = function() {acontainer.style.display = (acontainer.style.display == "grid" ? "none" : "grid");};
        atitle.style.fontSize = '14px';
        atitle.style.backgroundColor = "#2fded8";
        atitle.style.color = "#000000";
        atitle.style.cursor = 'pointer';
        acontainer.style.display = 'grid';
        acontainer.style.gridTemplateColumns = `repeat(${gtc}, 1fr)`;
        acontainer.style.gap = '10px';
        acontainer.style.padding = '0px 10px 20px';
        atitle.textContent = "Available exercises (".concat(alist.length, ")");

        for (let i = 0; i < alist.length; i++)
        {
            acontainer.appendChild(alist[i]);
        }

        atitleDiv.appendChild(atitle);
        aBig.appendChild(atitleDiv);
        aBig.appendChild(acontainer);
        mainDiv.appendChild(aBig);
    }

    if (vlist.length != 0)
    {
        const vBig = document.createElement('div');
        const vtitleDiv = document.createElement('div');
        const vtitle = document.createElement('button');
        const vcontainer = document.createElement('div');
        vtitleDiv.style.gap = '10px';
        vtitleDiv.style.padding = '20px 10px 20px';
        vtitleDiv.style.display = 'grid';
        vtitle.onclick = function() {vcontainer.style.display = (vcontainer.style.display == "grid" ? "none" : "grid");};
        vtitle.style.fontSize = '14px';
        vtitle.style.backgroundColor = "#e63d37";
        vtitle.style.cursor = 'pointer';
        vcontainer.style.display = 'none';
        vcontainer.style.gridTemplateColumns = `repeat(${gtc}, 1fr)`;
        vcontainer.style.gap = '10px';
        vcontainer.style.padding = '0px 10px 20px';
        vtitle.textContent = "Validated exercises (".concat(vlist.length, ")");


        for (let i = 0; i < vlist.length; i++)
        {
            vcontainer.appendChild(vlist[i]);
        }

        vtitleDiv.appendChild(vtitle);
        vBig.appendChild(vtitleDiv);
        vBig.appendChild(vcontainer);
        mainDiv.appendChild(vBig);
    }

    return mainDiv;
}

function createButton(list, id, color, textColor, nbkids = -1, nbgkids = -1)
{
    let str = getName(id);
    if (str == "Root node")
    {
        return;
    }
    const button = document.createElement('button');
    if (nbkids != -1)
    {
        str = str.concat("\n👩‍👧", nbkids);
        if (nbgkids > 0)
        {
            str = str.concat("    👩‍👩‍👧‍👧", nbgkids);
        }
    }
    button.style.whiteSpace = "pre-wrap";
    button.textContent = str;
    button.style.padding = '10px';
    button.style.fontSize = '14px';
    button.style.cursor = 'pointer';
    button.style.backgroundColor = color;
    button.style.color = textColor;
    button.setAttribute("nbkids", nbkids);
    button.setAttribute("nbgkids", nbgkids);

    button.onclick = () => window.open(getLink(id), '_blank');

    list.push(button);
}

function handleGraph(graph)
{
    const rootElement = graph.getElementsByClassName("root")[0];
    const nodeList = rootElement.querySelectorAll(".node");
    if (nodeList.length < 10)
    {
        return;
    }
    const nodes = parseNodes(nodeList);
    const relationships = parseEdges(rootElement, nodes);
    const topStack = document.getElementsByClassName("top-stack")[0];
    const stack = document.getElementsByClassName("stack")[0];
    topStack.appendChild(createButtons(nodes, relationships));
    stack.appendChild(graph);
}

function handleGraphMutation(mut, graph, observer)
{
    if (mut.addedNodes.length != 0 && mut.addedNodes[0].tagName == "svg")
    {
        handleGraph(graph);
        observer.disconnect();
    }
}

function main()
{
    const graph = document.getElementById("graph");
    if (graph)
    {
        const test = new MutationObserver(
            (mutations) => { mutations.forEach(
                (m) => { handleGraphMutation(m, graph, test) }
            ); }
        );

        test.observe(graph, {childList: true});
    }
    else
    {
        console.log("This is not a GraphPage, ignoring");
    }
}

main();