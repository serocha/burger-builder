import React, { Component, Fragment } from 'react';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

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
		totalPrice: 4,
		purchasable: false,
		purchasing: false
	}

	updatePurchaseState (ingredients) {
		
		const sum = Object.keys(ingredients)
			.map( (igKey) => {
				return ingredients[igKey]
			})
			.reduce( (sum, el) => {
				return sum + el;
			}, 0);
		this.setState( {purchasable: sum > 0} );
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
		this.updatePurchaseState(updatedIngredients);
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
		this.updatePurchaseState(updatedIngredients);
	}

	purchaseHandler = () => {
		this.setState({purchasing: true})
	}

	purchaseCancelHandler = () => {
		this.setState({purchasing: false})
	}

	purchaseContinueHandler = () => {
		alert('You continue!');
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
				<Modal 
					show={this.state.purchasing}
					modalClosed={this.purchaseCancelHandler} >
					<OrderSummary 
						ingredients={this.state.ingredients}
						price={this.state.totalPrice}
						purchaseCancel={this.purchaseCancelHandler} 
						purchaseContinue={this.purchaseContinueHandler} /> 
				</Modal>
				<Burger ingredients={this.state.ingredients} />
				<BuildControls 
					ingredientAdded={this.addIngredientHandler}
					ingredientRemoved={this.removeIngredientHandler}
					disabled={disabledInfo}
					purchasable={this.state.purchasable} 
					ordered={this.purchaseHandler}
					price={this.state.totalPrice} />
			</Fragment>
		);
	}
}

export default BurgerBuilder;