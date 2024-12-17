const iframeForOpen = document.createElement('iframe');
iframeForOpen.style.display = "none";

function fixedOpen(url)
{
	document.body.appendChild(iframeForOpen);
    iframeForOpen.contentWindow.open(url);
}