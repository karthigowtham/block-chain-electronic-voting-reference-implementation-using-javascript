import React, { Component } from 'react';
import voteImg from './voteIcon.png';
import './App.css';
import { Switch, Route, Link } from 'react-router-dom'
import Home from './Component/Home';
import Vote from './Component/Vote';
import Result from './Component/Result';
import axios from 'axios';

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/vote' component={Vote} />
      <Route exact path='/result' component={Result} />
    </Switch>
  </main>
)

const Menu = () => (
  <nav className='nav nav-pills nav-justified'>
    <Link to='/' className='nav-link'>Home</Link>
    <Link to='/vote' className='nav-link'>Vote</Link>
    <Link to='/result' className='nav-link'>Result</Link>
  </nav>
)

class App extends Component {
  state = {
    user: '',
    connectedUrl: ''
  }

  componentDidMount() {
    axios.get('/login/getUser').then(
      resp => {
        this.setState({
          user: resp.data.user.username,
          connectedUrl: resp.data.user.connectedUrl
        });
      });
  }
  
  render() {
    return (
      <div className="row">
        <div className="col-sm-4">
          <Menu />
          <hr />
          <div className="display-1 m-b-2">
            Blector
        </div>
          <img src={voteImg} className="logo" alt="Blector Logo" />
          <hr />
          <p>Election using block chain technology</p>
          <span>Connected to :{this.state.connectedUrl} </span>
        </div>
        <div className='col-sm-8 content'>
          <div className="col-md-12 col-md-offset-3">
            Welcome :{this.state.user}
            <Main />
          </div>
          <br />
        </div>
      </div>
    );
  }
}

export default App;
