import React, { Component } from 'react'
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Link } from 'react-router-dom'
import {CURRENT_USER_QUERY}  from "./User";

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION(
    $email: String!
    $password: String!
  ) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

class Signin extends Component {
  state = {
    email: "",
    name: "",
    password: ""
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  update = (cache, payload) => {
    const user = cache.readQuery({ query: CURRENT_USER_QUERY })
    this.props.history.push(`/${user.me.id}`);
  }

  render() {
    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        update={this.update}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signup, { error, loading }) => {
          return <form method="post" onSubmit={async e => {
                e.preventDefault();
                await signup();
                this.setState({ name: "", email: "", password: "" });
              }}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign in to your account</h2>
                <p>{error}</p>
                <input name="email" className="form-control" placeholder="email" onChange={this.saveToState} />
                <input name="password" className="form-control" placeholder="password" onChange={this.saveToState} />
                <button type="submit" className="btn btn-primary logon-button">
                  Sign in
                </button>
                <p>
                  No account? Click <Link to="/signup">here</Link> to signup
                </p>
              </fieldset>
            </form>;
        }}
      </Mutation>
    );
  }
}

export default Signin