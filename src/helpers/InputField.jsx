import React from "react";
import "../css/App.css";

export default class InputField extends React.Component {

    getInput()
    {
        return this.refs.input.value;
    }

    clear()
    {
        this.refs.input.value = "";
        this.clearError();
    }

    setError(err)
    {
        this.refs.errorField.innerHTML = err;
    }

    clearError()
    {
        if (this.refs.errorField.innerHTML != "")
        {
            this.refs.errorField.innerHTML = "";
        }
    }

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

