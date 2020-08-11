import React, {useEffect, useState, useCallback} from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';
import axios from '../../axios-orders';

const BurgerBuilder = props => {
    const [purchasing, setPurchasing] = useState(false);

    const dispatch = useDispatch();

    const ings = useSelector(state => state.burgerBuilder.ingredients);
    const price = useSelector(state => state.burgerBuilder.totalPrice);
    const error = useSelector(state => state.burgerBuilder.error);
    const isAuthenticated = useSelector(state => state.authtoken !== null);

    const onIngredientAdded = (igName) => dispatch(actions.addIngredient(igName));
    const onIngredientRemoved = (igName) => dispatch(actions.removeIngredient(igName));
    const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()),[dispatch]);
    const onInitPurchase = () => dispatch(actions.purchaseInit);
    const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));

    useEffect(()=> {
        onInitIngredients();
    }, [onInitIngredients])

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
        if(isAuthenticated){
            setPurchasing(true);
        }
        else {
            onSetAuthRedirectPath('/checkout')
            props.history.push('/auth');
        };
    }

    const purchaseCancelHandler = () => {
        setPurchasing(false)
    }

    const purchaseContinueHandler = () => {
        onInitPurchase();
        props.history.push('/checkout');
    }

    const disabledInfo = {
        ...ings
    };

    for(let key in disabledInfo){
        disabledInfo[key] = disabledInfo[key] <= 0
    }
    
    let orderSummary =  null;
    let burger = error ? <p>Ingredients can not be loaded</p> : <Spinner />;

    if (ings !== null){
        burger = (
            <Aux>
                <Burger ingredients={ings} />
                <BuildControls 
                    ingredientAdded={onIngredientAdded}
                    ingredientRemoved={onIngredientRemoved}
                    disabled={disabledInfo}
                    price={price}
                    ordered={purchaseHandler}
                    purchasable = {updatePurchaseState(ings)}
                    isAuth={isAuthenticated} />
            </Aux>
            );
        orderSummary = <OrderSummary 
            ingredients={ings}
            price={price}
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

export default (withErrorHandler(BurgerBuilder, axios));