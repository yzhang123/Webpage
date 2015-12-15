var button_display;
var text_input;
var frame;
var tiltDeg;
var perspective;
var frameContainer;
var transformContainer;

// called when html is loaded
function Main() {
	
button_display = $("#display");
text_input = $("#searchField");
frame = $("#iframe");
transformContainer = $("#transformContainer");
frameContainer = $("#frameContainer");
tiltDeg = 30;
perspective = 1600;

frameContainer.css("perspective", perspective + "px")
transformContainer.css("transform",  "rotateX(" + tiltDeg + "deg)");
var pageContainerHeight = transformContainer.height();
var extendedHeightForRotation = 1/(Math.cos(tiltDeg*Math.PI/ 180)/pageContainerHeight - Math.sin(tiltDeg*Math.PI/ 180)/perspective);
frame.css("height", extendedHeightForRotation + "px");
var offsetY = extendedHeightForRotation - pageContainerHeight;
frame.css("transform", "translateY(-" + offsetY + "px)");

text_input.keydown(function(event)
{
	if (event.keyCode == 13)
	{
		display();
	}	
});




}

function display()
{
	var url = validateURL(text_input[0].value);
	frame[0].src = text_input[0].value = url;
	 	
}

// checks if url is validate (contains protocol etc) and returns just in case the correct one
function validateURL(url)
{
	if (url.search(/^http[s]?\:\/\//)==-1) // does not start with "http"
	{
		url = "http://" + url;
	}
	return url; 
	
}

window.onload = Main;