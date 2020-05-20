import React, { useEffect, useRef } from 'react';
import ShopNavigator from './ShopNavigator';
import { useSelector } from 'react-redux';
import { NavigationActions } from 'react-navigation';


const NavigationContainer = props => {
    /**
     * prop.navigation.navigate is accessible only to those componenets which
     * are rendered with the help of Navigator,
     * hence we use useRef
     */
    const navRef = useRef();
    const isAuth = useSelector(state => !!state.auth.token);

    //is isAuth changes, which means token is empty then navigate to auth screen
    useEffect(() => {
        if(!isAuth){
            navRef.current.dispatch(
                NavigationActions.navigate({ routeName: 'Auth' })
            );
        }
    },[isAuth])
    return <ShopNavigator ref={navRef}/>;
}

export default NavigationContainer;