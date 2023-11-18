import React from 'react'
import { Link } from 'react-router-dom';
import logo from '../logo.svg';
import '../App.css';

const Home = () => {
    return (
        <div>
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
                <Link to="/">Home</Link>
                <Link to="/otherpage">Other Page</Link>
            </header>
        </div>
    )
}

export default Home