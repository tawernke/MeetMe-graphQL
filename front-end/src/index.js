import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import ApolloClient from "apollo-boost"
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import {BrowserRouter as Router, Route} from 'react-router-dom'

const client = new ApolloClient({
  uri: `https://meet-me-yoga-prod.herokuapp.com/`,
  request: operation => {
    operation.setContext({
      fetchOptions: {
        credentials: "include"
      }
    });
  },
  clientState: {
    resolvers: {},
    defaults: {}
  }
});

ReactDOM.render(
    <Router>
      <ApolloProvider client={client}>
        <Route 
          path='/' 
          render={(routeProps) => <App 
            {...routeProps} 
          />}
        />
      </ApolloProvider>
    </Router>  
    , document.getElementById('root'));
registerServiceWorker();
