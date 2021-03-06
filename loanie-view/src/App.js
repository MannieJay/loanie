import React, { Component } from 'react';
import './App.css';
import Navbar from './Component/Navbar';

class App extends Component {
  constructor() {
    super();
    this.state = {
      loginState: false,
    };
    this.handlePurchase = this.handlePurchase.bind(this);
  }
  handlePurchase() {
    this.setState({ loginState: true });
    console.log(this.state.loginState);
    window.location = '/learn_more';
  }
  render() {
    return (
      <div className="App">
        <Navbar />
        <div className="App-text-container">
          <p className="App-text-item">
            The cutting edge communication tool that makes any mortgage process smooth and
            efficient!
          </p>
          <br />
          <br />
          <br />
        </div>
        <div className="button-container">
          <button className="button1 button" onClick={this.handlePurchase}>
            {' '}
            Learn More{' '}
          </button>
        </div>
      </div>
    );
  }
}

export default App;
