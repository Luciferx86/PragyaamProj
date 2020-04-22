import React, { Component } from 'react';
import { Router, Scene, Actions } from 'react-native-router-flux'
import MovieDetail from './src/components/MovieDetail'
import App from './src/App'



const MyRouter = () => {
  return (
    <Router>
      <Scene key="root">
        <Scene key="home"
          component={App}
          title="Home"

          // hideNavBar
          initial
        />
        <Scene key="movieDetail"
          component={MovieDetail}
          title="Movie Detail"
        // hideNavBar
        // initial
        />
      </Scene>
    </Router>
  );
}

export default MyRouter;