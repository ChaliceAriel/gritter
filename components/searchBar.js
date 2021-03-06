var React = require('react');
var GetTweets = require('./getTweets.js');
var FaArrowRight = require('react-icons/lib/fa/arrow-right.js');



var SearchBar = React.createClass({
	getInitialState: function(){
		return {
			newKeyword: '',
			newNumber: 0
		}
	},
	handleKeywordChange: function(event){
		this.setState({
			newKeyword: event.target.value
		})
	},
	handleNumberChange: function(event){
		var input = new RegExp('^([0-9]|[0-9][0-9])$');
		if (event.target.value.length > 0){
			if (event.target.value > 25) {
				alert('Too many tweets! Please enter a number between 1 and 25.');
			} else if (event.target.value < 1 || input.test(event.target.value) === false) {
				alert('Invalid input. Please enter a number between 1 and 25.');
			}
		}


		this.setState({
				newNumber: event.target.value
			})
	},
	handleFormSubmit: function(event){
		event.preventDefault();

		var newKeyword = this.state.newKeyword.trim();
	//	newKeyword = encodeURIComponent(newKeyword);

		var newNumber = this.state.newNumber ? this.state.newNumber.trim() : 15;

		//onKeywordSubmit is defined in getTweets.js
		this.props.onKeywordSubmit(newKeyword, newNumber);
	},
	render: function(){
		return (
			<div className="SearchBar">
			<input onChange={this.handleNumberChange}
			value={this.state.number} placeholder="9" type= "text" autoComplete="off" min="" max="25" id="inputNumber"
			data-toggle="tooltip" data-placement="left" />
				<form onSubmit = {this.handleFormSubmit}>
					<input onChange={this.handleKeywordChange}
					 placeholder="Search Keyword" type="text" autoComplete="off"
					 value={this.state.keyword} id="inputKeyword"
					 data-toggle="tooltip" data-placement="left"/>
					 <div className="counterDiv">
					 <div>
						<button className="btn searchButton"><FaArrowRight /></button>
					</div>
				 </div>
				</form>
		</div>
			)
	}
});

module.exports = SearchBar;
