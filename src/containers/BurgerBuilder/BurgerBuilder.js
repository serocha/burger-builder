import React, { Component, Fragment } from 'react';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import axios from '../../axios-orders';

let INGREDIENT_PRICES = null;

class BurgerBuilder extends Component {
	state = {
		ingredients: null,
		totalPrice: 4,
		purchasable: false,
		purchasing: false,
		loading: false,
		error: false
	}

	componentDidMount () {
		axios.get('https://udemy-react-project-465d8.firebaseio.com/ingredients.json')
			.then(response => {
				this.setState({ingredients: response.data});
			})
			.catch(error => {
				this.setState({error: true});
			});
		axios.get('https://udemy-react-project-465d8.firebaseio.com/ingredient_prices.json')
			.then(response => {
				INGREDIENT_PRICES = {...response.data};
			})
			.catch(error => {
				this.setState({error: true});
			});
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
		//alert('You continue!');
		this.setState( {loading: true} );
		const order = {
			ingredients: this.state.ingredients,
			price: this.state.totalPrice, //in a real app, you'd recalc price on server to prevent tampering
			customer: {
				name: 'Shane Rocha',
				address: {
					street: 'Teststreet 1',
					zipCode: '48394',
					country: 'USA'
				},
				email: 'test@test.com'
			},
			deliveryMethod: 'fastest'
		}
		axios.post('/orders.json', order)
			.then(response => {
				this.setState({loading: false, purchasing: false} );
			})
			.catch(error => {
				this.setState({ loading: false, purchasing: false} )
			});
	}

	render() {
		const disabledInfo = {
			...this.state.ingredients
		};
		for (let key in disabledInfo){
			disabledInfo[key] = disabledInfo[key] <= 0
		}

		let orderSummary = null;
		let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

		if (this.state.ingredients) {
			burger = (<Fragment>
				<Burger ingredients={this.state.ingredients} />
				<BuildControls 
					ingredientAdded={this.addIngredientHandler}
					ingredientRemoved={this.removeIngredientHandler}
					disabled={disabledInfo}
					purchasable={this.state.purchasable} 
					ordered={this.purchaseHandler}
					price={this.state.totalPrice} />
			</Fragment>);
			orderSummary = <OrderSummary 
			ingredients={this.state.ingredients}
			price={this.state.totalPrice}
			purchaseCancel={this.purchaseCancelHandler} 
			purchaseContinue={this.purchaseContinueHandler} />;
		}
		if (this.state.loading){
			orderSummary = <Spinner />;
		}

		return(
			<Fragment>
				<Modal 
					show={this.state.purchasing}
					modalClosed={this.purchaseCancelHandler} >
					{orderSummary}
				</Modal>
				{burger}
			</Fragment>
		);
	}
}

export default withErrorHandler(BurgerBuilder, axios);