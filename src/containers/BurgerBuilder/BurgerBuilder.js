import React, {useEffect, useState} from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';
import axios from '../../axios-orders';

const BurgerBuilder = props => {
    const [purchasing, setPurchasing] = useState(false);

    useEffect(()=> {
        props.onInitIngredients();
    }, [])

    const updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
                        .map(ingKey => {
                            return ingredients[ingKey];
                        })
                        .reduce((sum, el) => {
                            return sum + el;
                        }, 0);
        return sum > 0;
    }

    const purchaseHandler = () => {
        if(props.isAuthenticated){
            setPurchasing(true);
        }
        else {
            props.onSetAuthRedirectPath('/checkout')
            props.history.push('/auth');
        };
    }

    const purchaseCancelHandler = () => {
        setPurchasing(false)
    }

    const purchaseContinueHandler = () => {
        props.onInitPurchase();
        props.history.push('/checkout');
    }

    const disabledInfo = {
        ...props.ings
    };

    for(let key in disabledInfo){
        disabledInfo[key] = disabledInfo[key] <= 0
    }
    
    let orderSummary =  null;
    let burger = props.error ? <p>Ingredients can not be loaded</p> : <Spinner />;

    if (props.ings !== null){
        burger = (
            <Aux>
                <Burger ingredients={props.ings} />
                <BuildControls 
                    ingredientAdded={props.onIngredientAdded}
                    ingredientRemoved={props.onIngredientRemoved}
                    disabled={disabledInfo}
                    price={props.price}
                    ordered={purchaseHandler}
                    purchasable = {updatePurchaseState(props.ings)}
                    isAuth={props.isAuthenticated} />
            </Aux>
            );
        orderSummary = <OrderSummary 
            ingredients={props.ings}
            price={props.price}
            purchaseCanceled={purchaseCancelHandler}
            purchaseContinued={purchaseContinueHandler} />;
    }

    return (
        <Aux>
            <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </Aux>
    );
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (igName) => dispatch(actions.addIngredient(igName)),
        onIngredientRemoved: (igName) => dispatch(actions.removeIngredient(igName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));