/// <reference path="nouislider.min.js"/>

// constants
var URL_INITIAL = "https://wikipedia.org";
var ABSOLUTE_TILT_MIN = -50;
var ABSOLUTE_TILT_MAX = 50;

var text_input;
var frame;
var perspective;
var transformContainer;
var slider;
var sliderContainer;
var pinButton;

// called when html is loaded
function Main() {
	text_input = $("#searchField");
	slider = $("#slider")[0];
    sliderHandle = $("#sliderHandle");
	sliderContainer = $("#sliderContainer");
	frame = $("#iframe");
	transformContainer = $("#transformContainer");
	pinButton = $("#pinButton");
    
	perspective = 1600;
	// enter-key triggers navigation
	text_input.keydown(function(event)
	{
		if (event.keyCode == 13) 
			navigateTo(text_input.val());
	});
    // text input goes full screen
	text_input.click(requestFullScreen);
	
	noUiSlider.create(slider, {
	    animate: false,
		start: 0,
		connect: "lower",
		orientation: "vertical",
		range: {
			"min": ABSOLUTE_TILT_MIN,
			"max": ABSOLUTE_TILT_MAX
		}
	});
    
    // sliding handler does: 
    // changes page tilt, keeps slider visible for 3 more sec
	slider.noUiSlider.on("slide", function(){
        var tilt = parseInt(slider.noUiSlider.get());
        setTilt(tilt);
        keepSliderVisible();
    });
    
    $("#sliderContainer, #sliderHandle").on("click", keepSliderVisible);
    
    setTilt(0);
    initDeviceOrientation();
    navigateTo(URL_INITIAL);

}

// tilt according to gyro, always active
var deviceTilt = null;
// delta between current tilt and device tilt when page is loose
var addToDeviceTiltWhenLoose = null;
// tilt as indicated by slider for gui
var currentTilt = null;

// sets current tilt to given value
function setTilt(value)
{
    if (value < ABSOLUTE_TILT_MIN )
        value = ABSOLUTE_TILT_MIN;
        
    if (value > ABSOLUTE_TILT_MAX )
        value = ABSOLUTE_TILT_MAX;
        
    if (currentTilt == value) return;
    currentTilt = value;
    
    // when Loose update delta
    if (addToDeviceTiltWhenLoose !== null)
        addToDeviceTiltWhenLoose = currentTilt - deviceTilt;
    
    // update slider for consistency
    slider.noUiSlider.set(value);
    
    // update iframe tilt direction
    transformContainer.css("perspective", perspective + "px");
	if (value < 0) {
		frame.css("transform-origin", "top");
		transformContainer.css("perspective-origin", "bottom");
	} else {
		frame.css("transform-origin", "bottom");
		transformContainer.css("perspective-origin", "top");
	}
    var scale = 1 / Math.cos(value / 180 * Math.PI);
	frame.css("transform", "rotateX(" + value + "deg) scale(1," + scale + ")");
}

// registers gyro if available
function initDeviceOrientation()
{
    if (window.DeviceOrientationEvent)
        window.addEventListener('deviceorientation', onOrientationUpdate, false);
}

// callback called when gyro provides new values
function onOrientationUpdate(eventData)
{
    if (eventData.beta !== null)
    {
        var firstTimeCalled = deviceTilt === null;
        if(window.innerHeight > window.innerWidth){
            deviceTilt = eventData.beta;
        } else 
        {
            deviceTilt = -eventData.gamma;
        }
        
        // when loose update current tilt
        if (addToDeviceTiltWhenLoose !== null)
            setTilt(deviceTilt + addToDeviceTiltWhenLoose);

        if (firstTimeCalled) {
            pinButton.show();
            onPinButtonClick(); // to show back pin     
        }
    }
}

function requestFullScreen()
{
    var elem = document.documentElement;
    if (elem.requestFullScreen)
        elem.requestFullScreen();
    else if (elem.webkitRequestFullScreen) // for chrome
        elem.webkitRequestFullScreen();
}

// displays webpage due to input url
function navigateTo(url)
{
	url = validateURL(url);
    text_input.val(url);
    frame.attr("src", "loading.html");
	frame.one("load", function() {
        frame.attr("src", url);
    });
    
    frame.focus(); // not focusing text box to avoid key board
    requestFullScreen();
}

// checks if url is validate (contains protocol etc) and returns just in case the correct one
function validateURL(url)
{
	if (url.search(/^http[s]?\:\/\//) == -1) // does not start with "http"
		url = "http://" + url;
	return url; 
}

// called when pin button clicked => change button style and stop/initiate deltaWhenLoose 
function onPinButtonClick()
{
    if (addToDeviceTiltWhenLoose !== null)
    {
        pinButton.removeClass("pinButtonActive");
        addToDeviceTiltWhenLoose = null;
    }
    else
    {
        pinButton.addClass("pinButtonActive");
        addToDeviceTiltWhenLoose = currentTilt - deviceTilt;
    }
}

function showSlider()
{
    sliderContainer.addClass("sliderVisible");
    sliderHandle.css("opacity", "0");
}
function hideSlider()
{
    sliderContainer.removeClass("sliderVisible");
    sliderHandle.css("opacity", "1");
}

var timeOutHandle;
function keepSliderVisible(e)
{
	clearTimeout(timeOutHandle);
    showSlider();
    // callback hideslider after 3 seconds
    timeOutHandle = setTimeout(hideSlider, 3000);
}