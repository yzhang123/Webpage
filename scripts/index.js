var button_display;
var text_input;
var frame;


// called when html is loaded
function Main() {
	
button_display = document.getElementById("display");
text_input = document.getElementById("searchField");
frame = document.getElementById("iframe");

}

function display()
{
	var text = text_input.value;
	frame.src = text;	
}

window.onload = Main;