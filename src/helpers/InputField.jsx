import React from "react";
import "../css/App.css";

export default class InputField extends React.Component {

  // Return the value of the input field
  getInput()
  {
    return this.refs.input.value;
  }

  // Clear the input field
  clear()
  {
    this.refs.input.value = "";
    this.clearError();
  }

  // Set the error message
  setError(err)
  {
    this.refs.errorField.innerHTML = err;
  }

  // Clear the error field
  clearError()
  {
    if (this.refs.errorField.innerHTML != "")
    {
      this.refs.errorField.innerHTML = "";
    }
  }

  // Display the input fields
  render()
  {
    return (
      <div className="form-group">
      	<label className="cols-sm-2 control-label">{this.props.label}</label>
        <div className="cols-sm-10">
          <div className="input-group">
        		<span className="input-group-addon"></span>
         			<input required className='gameDetails form-control' 
                  ref="input"
                  onChange={this.clearError.bind(this)}
                  {...this.props}/>
        	</div>
          <div className="errorField" ref="errorField"></div>
        </div>
      </div>
    );
  }
}
