import React, { useState } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import productsReducer from './store/reducers/products';
import NavigationContainer from './navigation/NavigationContainer';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { composeWithDevTools } from 'redux-devtools-extension';
import cartReducer from './store/reducers/cart';
import orderReducer from './store/reducers/orders';
import ReduxThunk from 'redux-thunk';
import authReducer from './store/reducers/auth';

//remove below line before deployment
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: orderReducer,
  auth: authReducer
})

//remove composeWithDevTools before deployement
const store = createStore(rootReducer, composeEnhancer(applyMiddleware(ReduxThunk)),);

//replace above line with below and remove composeWithDevTools() before deployment
//const store = createStore(rootReducer, composeWithDevTools(), applyMiddleware(ReduxThunk));


const fetchFonts = ()=>{
  return Font.loadAsync({
    'open-sans' : require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold' : require('./assets/fonts/OpenSans-Bold.ttf')
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  
  if(!fontLoaded){
    return <AppLoading startAsync={fetchFonts}
    onFinish={() => {
      setFontLoaded(true);
    }}
    />
  }
 
  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}

