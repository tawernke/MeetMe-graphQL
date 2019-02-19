import React from 'react'
import { WebSocketLink } from 'apollo-link-ws';
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { withClientState } from 'apollo-link-state';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloLink, Observable, split } from 'apollo-link'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import {BrowserRouter as Router, Route} from 'react-router-dom'

const httpLink = new HttpLink({
  uri: `https://meet-me-yoga-prod.herokuapp.com`,
});

const wsLink = new WebSocketLink({
  uri: `ws://meet-me-yoga-prod.herokuapp.com`,
  options: {
    reconnect: true,
  }
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const cache = new InMemoryCache();

const request = async (operation) => {
  operation.setContext({
    fetchOptions: {
      credentials: "include"
    }
  });
};

const requestLink = new ApolloLink((operation, forward) =>
  new Observable(observer => {
    let handle;
    Promise.resolve(operation)
      .then(oper => request(oper))
      .then(() => {
        handle = forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        });
      })
      .catch(observer.error.bind(observer));

    return () => {
      if (handle) handle.unsubscribe();
    };
  })
);

const client = new ApolloClient({
  link: ApolloLink.from([
    requestLink,
    withClientState({
      defaults: {},
      resolvers: {
        Mutation: {
          updateNetworkStatus: (_, { isConnected }, { cache }) => {
            cache.writeData({ data: { isConnected } });
            return null;
          }
        }
      },
      cache
    }),
    link
  ]),
  cache
});


// const client = new ApolloClient({
//   uri: `http://localhost:4444`,
//   request: operation => {
//     operation.setContext({
//       fetchOptions: {
//         credentials: "include"
//       }
//     });
//   },
//   clientState: {
//     resolvers: {},
//     defaults: {}
//   }
// });

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
