import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import withData from './lib/withData'
import App from './App'

class Container extends Component {
  static async getInitialProps({Component, ctx}) {
    let pageProps = {}
    if(Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    //This exposes the query to the user
    pageProps.query = ctx.query
    return { pageProps}
  }
  render() {
    const { Component, apollo, pageProps } = this.props
    console.log(apollo)
    return (
      <ApolloProvider client={apollo}>
        <Router>
          <Route 
            path='/' 
            render={(routeProps) => <App 
              {...routeProps}
              {...pageProps}
            />}
          />
        </Router>
      </ApolloProvider>
    );
  }
}

export default withData(Container);