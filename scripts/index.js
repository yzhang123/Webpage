var button_display;
var text_input;
var frame;
var tiltDeg;
var perspective;
var frameContainer;
var transformContainer;
var slider;

// called when html is loaded
function Main() {
	
button_display = $("#display");
text_input = $("#searchField");
slider = $("#slider");
frame = $("#iframe");
transformContainer = $("#transformContainer");
frameContainer = $("#frameContainer");

tiltDeg = 0;
perspective = 1600;

/*
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
{
	// User is on mobile device and preferece cookie is not set. Ask if they want to use the mobile version.
	var useMobile = confirm("Hey there! You are using a mobile device. Do you want to be redirected to the mobile version of this website?");
	if (useMobile == false) {
		// User is on a mobile device but wants to use the regular version.
		$("link")[1].setAttribute("href", "css/style.css");
	}
	
	$("body, #frameContainer").on("swiperight",function(event)
		{
			
		}
	);
	
	
}
*/

text_input.keydown(function(event)
{
	if (event.keyCode == 13)
	{
		display();
	}	
});
tiltWebpage();
}

// displays wepage due to input url
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

function sliderchange()
{
	var slidervalue = parseInt(slider[0].value);
	tiltDeg = slidervalue;	
	tiltWebpage();
}


function tiltWebpage()
{
	frameContainer.css("perspective", perspective + "px")
	transformContainer.css("transform",  "rotateX(" + tiltDeg + "deg)");
	var pageContainerHeight = transformContainer.height();
	var extendedHeightForRotation = 1/(Math.cos(tiltDeg*Math.PI/ 180)/pageContainerHeight - Math.sin(tiltDeg*Math.PI/ 180)/perspective);
	frame.css("height", extendedHeightForRotation + "px");
	var offsetY = extendedHeightForRotation - pageContainerHeight;
	frame.css("transform", "translateY(-" + offsetY + "px)");
	//display();
}


