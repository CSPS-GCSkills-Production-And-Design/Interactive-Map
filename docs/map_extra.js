console.log("Loaded");
var isActive, oldStrokeColor, oldFillColor;
window.onhashchange = funcRef;
window.onload = updateTitle;
// var closeButton=document.querySelector("#Close");
// closeButton.onclick=function(){console.log("Closing");window.close()}
var css = '.svgLink:hover{text-decoration:underline;fill:#0000ff;} #MapTitle{ background-color: rgba(10,10,10,.8);color:#fff;position:absolute;font-size:28px;top:0px;margin:auto;width:100%;text-align:center;padding:1em;font-family:SANS-SERIF,Sans; }.sozi-frame-list{top:8em;list-style:none;}.sozi-frame-number { position: absolute; top: 8em;}',
	style = document.createElement('style'),
	mapTag = document.createElement('div');
mapTag.id = "MapTitle";
mapTag.innerHTML = "Canada";
style.type = 'text/css';
if (style.styleSheet) {
	// This is required for IE8 and below.
	style.styleSheet.cssText = css;
} else {
	style.appendChild(document.createTextNode(css));
}
document.head.appendChild(style);
var body = document.querySelector("body");
// body.appendChild(mapTag);
var frameGeo = document.querySelector("#GeoLoc");
var frameName = document.querySelector("#TreatyName");
frameName.textContent = "Canada"
var listdoc = document.querySelectorAll(".sozi-title-level-0"),
	Treaties = [],
	ListVisible = false;
listdoc.forEach(function (i, index) {
	Treaties[index] = {
		'name': i.childNodes[0].innerText,
		'href': i.childNodes[0].href
	}
})
var AppendList = document.querySelector("#TreatyList");
var fragment = document.createDocumentFragment();
for (i in Treaties) {
	var a = document.createElementNS('http://www.w3.org/2000/svg', 'a');
	var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	text.setAttribute('style', 'font-size:13px;line-height:1.25;font-family:sans-serif;');
	text.setAttribute('class', 'svgLink');
	a.setAttribute('href', Treaties[i].href);
	a.setAttribute('onmouseup', 'toggleList()');
	var tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
	var cutText = Treaties[i].name.substring(0, 90);
	if (Treaties[i].name.length > cutText.length) {
		cutText += "..."
	}
	tspan.textContent = cutText;
	tspan.setAttribute("y", 78 + (22 * i));
	tspan.setAttribute("x", 25);
	a.appendChild(tspan);
	text.appendChild(a)
	fragment.appendChild(text);
}
AppendList.appendChild(fragment);


function toggleList(condt) {
	if (condt) {
		ListVisible = false
	} else {
		ListVisible = !ListVisible
	}
	if (ListVisible) {
		document.querySelector("#TreatyList").setAttribute("style", "visibility:visible")
	} else {
		document.querySelector("#TreatyList").setAttribute("style", "visibility:hidden")
	}

}

function updateTitle() {
	var locc = this.location.hash;
	var loc = locc.split('#')[1];
	var clickedFrame = -1;
	soziPresentationData.frames.some(function (el, i) {
		if (el.frameId == loc) {
			clickedFrame = i;
			return true;
		}
	});
	// var clickedFrame = soziPresentationData.frames.findIndex(function(element) { return element.frameId == loc });
	// var thisTitle = sozi.player.currentFrame.title;
	var thisTitle = soziPresentationData.frames[clickedFrame].title;
	var thisGeo = soziPresentationData.frames[clickedFrame].notes;
	// var thisTitle = soziPresentationData.frames[clickedFrame].title;
	console.log(thisTitle);
	// frameNum.innerHTML = thisTitle;
	frameName.textContent = "";
	newTspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
	frameName.appendChild(newTspan);
	frameName.firstChild.textContent = thisTitle;
	frameGeo.textContent = thisGeo;
}

function funcRef(e) {
	var loc = this.location.hash;
	var hash = loc.split('_')[1];
	var changeStroke = document.querySelector("#" + hash);
	var style = window.getComputedStyle(changeStroke),
		strokeColor = style.getPropertyValue('stroke');
	fillColor = style.getPropertyValue('fill');
	if (isActive) {
		isActive.setAttribute("stroke-width", "10px");
		isActive.setAttribute("stroke", oldStrokeColor);
		isActive.setAttribute("fill", oldFillColor)
	}
	changeStroke.setAttribute("fill", "#FFF");
	changeStroke.setAttribute("stroke-width", "5px");
	changeStroke.setAttribute("stroke", "#F00");
	oldFillColor = fillColor;
	oldStrokeColor = strokeColor;
	isActive = changeStroke;
	updateTitle();
	toggleList(true);
	fitText("#TreatyName", "#BottomRectangle");
}

function fitText(textSelector, ContainerSelector) {
	var longText = document.querySelector(textSelector),
		fitIn = document.querySelector(ContainerSelector),
		textHeight = parseFloat(longText.style['fontSize']) * parseFloat(longText.style["lineHeight"]),
		startY = longText.getBBox().y + textHeight,
		startX = longText.getBBox().x,
		DeltaX = startX - fitIn.getBBox().x,
		numCharsLeft = longText.getNumberOfChars(),
		charSize = textHeight/2/*Math.ceil(longText.getBoundingClientRect().width / longText.getNumberOfChars())*/,
		maxWidth = fitIn.getBoundingClientRect().width ,
		textLength = longText.getBoundingClientRect().width,
		numLines = Math.ceil(textLength / maxWidth),
		maxChars = Math.floor(maxWidth / charSize),
		wholeText = longText.textContent,
		nextLine = wholeText;

	console.log("Lines " + numLines);
	console.log("maxChars " + maxChars);
	console.log("numCharsLeft " + numCharsLeft);
	if(numCharsLeft>maxChars){numLines++}
	// console.log(textHeight);
	if (numLines > 1) {
		for (var i = 1; i <= numLines; i++) {
			var toKeep = (nextLine.length - maxChars) % maxChars
			console.log("keep:" + toKeep)
			if (i != numLines) {
				var toKeep = maxChars
				var lastSpaceBeforeCut = nextLine.substr(0, toKeep).lastIndexOf(" ")
			}
			if (lastSpaceBeforeCut == -1) {
				lastSpaceBeforeCut = nextLine.substr(0, toKeep)
			}
			var adjustedText = nextLine.substr(0, lastSpaceBeforeCut+1)
			numCharsLeft = numCharsLeft - adjustedText.length
			console.log("Left: " + numCharsLeft)
			toChange = longText.querySelector(":nth-child(" + (i) + ")")
			toChange.textContent = adjustedText
			nextLine = nextLine.substr(lastSpaceBeforeCut ),
				lineUnder = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
			lineUnder.textContent = nextLine
			lineUnder.setAttribute("x", startX)
			lineUnder.setAttribute("y", startY + (textHeight * i));
			longText.appendChild(lineUnder);
		}
	}
}