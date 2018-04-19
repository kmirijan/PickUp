var React = require('react'),
	ReactDOM = require('react.dom');



class Table extends React.Component 
{
	//var contents;
	fill (contents)
	{
		this.contents = contents;
	}
	
	renderRow(i)
	{
		return (
			<tr>
			
				<td>{this.contents[i].name}</td>
				<td>{this.contents[i].activity}</td>
				<td>{this.contents[i].loc}</td>)
					
			</tr>
		
		);
	}
	
	render()
	{
	
		return(
			<table style="width:100%">
				<tr>
					<th>Name</th>
					<th>Activity</th>
					<th>Location</th>
				</tr>

				
				<tr>
					{contents.map((val, i) =>
					<td>{contents[i].name}</td>
					<td>{contents[i].activity}</td>
					<td>{contents[i].loc}</td>)
					}
				</tr>

			</table>
		);
		
	
	}

}


class Main extends React.Component 
{
	
	var contents;
	tableFill(contents)
	{
		this.contents = contents;
	}



	render() {
		return (
		
		<!DOCTYPE html>
		<html>
		<head>
		<title>Example Site</title>
		</head>

		<body>

		<p>text</p>

		</body>

		
		<input id="sport" placeholder="Activity" size="30">
		<input id="name" placeholder="Name" size="30">
		<input id="location" placeholder="Location" size="50">

		<table style = "width:100%">
		for (var i = 0; i < contents.length; i++){
		
			
		
		}
		<table>
		<!-- Allows access to the Google Maps API, for the autocomplete feature -->
		<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA-MytEgPxlDBu5tNOGdy3G5YdN-8-_kaE&libraries=places"></script>

		<script type="text/javascript">
		Autocomplete(document.getElementById("location"), NULL);
		</script>

		</html>

		
		
		)



	
	}

}






