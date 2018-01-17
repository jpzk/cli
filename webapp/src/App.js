import React, { Component } from 'react';
import Footer from './components/Footer'
import Main from './components/Main'
import PrettyPrint from './components/PrettyPrint'
import RightPanel from './components/RightPanel'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="padded container">
          <div className="row">
            <div className="col-xs-12">
              <Main />
            </div>
          </div>
        </div>
        <div className="padded container">
          <div className="row">
            <div className="col-xs-12 col-md-6">
              <PrettyPrint>
              </PrettyPrint>
            </div>
            <div className="col-xs-12 col-md-6">
              <RightPanel />
            </div>
          </div>
        </div>
          <Footer />
    </div>
    );
  }
}

export default App;
