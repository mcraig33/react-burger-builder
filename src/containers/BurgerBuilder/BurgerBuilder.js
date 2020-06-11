import React, {Component} from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import {connect} from 'react-redux';
import * as burgerBuilderActions from '../../store/actions/index';

class BurgerBuilder extends Component {
    state = {
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount () {
        // axios.get('https://react-my-burger-49e04.firebaseio.com/ingredients.json')
        //         .then(response => {
        //             this.setState({ingredients: response.data})
        //         })
        //         .catch(error => {
        //             this.setState({error: true})
        //         });
    }

    updatePurchaseState (ingredients) {
        const sum = Object.keys(ingredients)
                        .map(ingKey => {
                            return ingredients[ingKey];
                        })
                        .reduce((sum, el) => {
                            return sum + el;
                        }, 0);
        return sum > 0;
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        this.props.history.push('/checkout');
    }

    render () {
        const disabledInfo = {
            ...this.props.ings
        };

        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        
        let orderSummary =  null;
        let burger = this.state.error ? <p>Ingredients can not be loaded</p> : <Spinner />;

        if (this.props.ings !== null){
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls 
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        price={this.props.price}
                        ordered={this.purchaseHandler}
                        purchasable = {this.updatePurchaseState(this.props.ings)} />
                </Aux>
                );
            orderSummary = <OrderSummary 
                ingredients={this.props.ings}
                price={this.props.price}
                purchaseCanceled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler} />;
        }

        if(this.state.loading) {
            orderSummary = <Spinner />;
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings:state.ingredients,
        price: state.totalPrice
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (igName) => dispatch(burgerBuilderActions.addIngredient(igName)),
        onIngredientRemoved: (igName) => dispatch(burgerBuilderActions.removeIngredient(igName))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));