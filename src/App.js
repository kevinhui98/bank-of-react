/*==================================================
src/App.js

This is the top-level component of the app.
It contains the top-level state.
==================================================*/
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// Import other components
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import LogIn from './components/Login';
import Credits from './components/Credits';
import Debits from './components/Debits';

class App extends Component {
  constructor() {  // Create and initialize state
    super();
    this.state = {
      accountBalance: 0,
      debitList: [],
      creditList: [],
      currentUser: {
        userName: 'Joe Smith',
        memberSince: '11/22/99',
      }
    }
  }
  //addDebit function that updates the state of the debitList base on user input
  addDebit = (e) => {
    e.preventDefault();
    let newDebit = {
      id: this.state.creditList.length + 1,
      description: e.target.description.value,
      amount: e.target.amount.value,
      date: new Date().toISOString()
    }
    this.setState({
      debitList: [...this.state.debitList, newDebit]
    })
  }
  // addCredit function that updates the state of the creditList base on user input
  addCredit = (e) => {
    e.preventDefault();
    let newCredit = {
      id: this.state.creditList.length + 1,
      description: e.target.description.value,
      amount: e.target.amount.value,
      date: new Date().toISOString()
    }
    this.setState({
      creditList: [...this.state.creditList, newCredit]
    })
  }

  componentDidMount() {
    fetch('https://moj-api.herokuapp.com/credits')
      .then(res => res.json())
      .then(data => {
        this.setState({
          creditList: data
        })
      })
    fetch('https://moj-api.herokuapp.com/debits')
      .then(res => res.json())
      .then(data => {
        this.setState({
          debitList: data
        })
      })
  }
  //on change of credit and debit list, update the account balance
  componentDidUpdate(prevProps, prevState) {
    if (prevState.creditList !== this.state.creditList || prevState.debitList !== this.state.debitList) {
      let creditTotal = 0;
      let debitTotal = 0;
      this.state.creditList.forEach(credit => {
        creditTotal += parseFloat(credit.amount);
      })
      this.state.debitList.forEach(debit => {
        debitTotal += parseFloat(debit.amount);
      })
      this.setState({
        accountBalance: (creditTotal - debitTotal).toFixed(2)
      })
    }
  }

  // Update state's currentUser (userName) after "Log In" button is clicked
  mockLogIn = (logInInfo) => {
    const newUser = { ...this.state.currentUser }
    newUser.userName = logInInfo.userName
    this.setState({ currentUser: newUser })
    console.log(this.state.currentUser)
  }


  // Create Routes and React elements to be rendered using React components
  render() {
    // Create React elements and pass input props to components
    const HomeComponent = () => (<Home accountBalance={this.state.accountBalance} />);
    const UserProfileComponent = () => (
      <UserProfile userName={this.state.currentUser.userName} memberSince={this.state.currentUser.memberSince} />
    );
    const LogInComponent = () => (<LogIn user={this.state.currentUser} mockLogIn={this.mockLogIn} />)
    const CreditsComponent = () => (<Credits credits={this.state.creditList} addCredit={this.addCredit} />)
    const DebitsComponent = () => (<Debits debits={this.state.debitList} addDebit={this.addDebit} />)

    // Important: Include the "basename" in Router, which is needed for deploying the React app to GitHub Pages
    return (
      <Router basename="/bank-of-react">
        <div>
          <Route exact path="/" render={HomeComponent} />
          <Route exact path="/userProfile" render={UserProfileComponent} />
          <Route exact path="/login" render={LogInComponent} />
          <Route exact path="/credits" render={CreditsComponent} />
          <Route exact path="/debits" render={DebitsComponent} />
        </div>
      </Router>
    );
  }
}

export default App;