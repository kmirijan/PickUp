//get form data
var submit=()=>{
	const event=document.getElementById("event").value;
	const location=document.getElementById("location").value;

	var response=document.getElementById("response");
	response.textContent="to be implemented";
};

//main
var b_submit=document.getElementById("submit");
b_submit.addEventListener("click",submit);
initAutocomplete();





