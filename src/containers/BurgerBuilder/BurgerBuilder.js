import React, { Component, Fragment } from 'react';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

const INGREDIENT_PRICES = {
	salad: 0.5,
	cheese: 0.5,
	meat: 3,
	bacon: 1
}

class BurgerBuilder extends Component {
	state = {
		ingredients: {
			salad: 0,
			bacon: 0,
			cheese: 0,
			meat: 0
		},
		totalPrice: 4
	}

	addIngredientHandler = (type) => {
		//map ingredients to a new object to avoid mutating state
		const updatedIngredients = {
			...this.state.ingredients
		};
		//add 1 count to the ingredient being added
		updatedIngredients[type] = this.state.ingredients[type] + 1;
		//merge new state with old state
		//total price is current total plus price of added ingredient
		//send the updated count
		this.setState({totalPrice: this.state.totalPrice + INGREDIENT_PRICES[type], ingredients: updatedIngredients});
		console.log(this.state.totalPrice)
	}

	removeIngredientHandler = (type) => {
		const updatedIngredients = {
			...this.state.ingredients
			};
		if(updatedIngredients[type] === 0) {
			return;
		}
			updatedIngredients[type] = this.state.ingredients[type] - 1;
			this.setState({totalPrice: this.state.totalPrice - INGREDIENT_PRICES[type], ingredients: updatedIngredients});
		
		console.log(this.state.totalPrice)
		
	}

	render() {
		const disabledInfo = {
			...this.state.ingredients
		};
		for (let key in disabledInfo){
			disabledInfo[key] = disabledInfo[key] <= 0
		}
		return(
			<Fragment>
				<Burger ingredients={this.state.ingredients} />
				<BuildControls 
					ingredientAdded={this.addIngredientHandler}
					ingredientRemoved={this.removeIngredientHandler}
					disabled={disabledInfo} 
					price={this.state.totalPrice} />
			</Fragment>
		);
	}
}

export default BurgerBuilder;