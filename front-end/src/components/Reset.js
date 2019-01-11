import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { CURRENT_USER_QUERY } from './User'

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`;

class Reset extends Component {
  state = {
    password: "",
    confirmPassword: ""
  };
  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    return (
      <Mutation
        mutation={RESET_MUTATION}
        variables={{
          resetToken: this.props.match.params.resetToken,
          password: this.state.password,
          confirmPassword: this.state.confirmPassword
        }}
        //when this mutation has been called, the CURRENT_USER_QUERY should be called and refreshed
        // of their data
        refetchQueries={[{ query: CURRENT_USER_QUERY}]}
      >
        {(reset, { error, loading, called }) => (
          <form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await reset();
              this.setState({ password: "", confirmPassword: "", });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset your Password</h2>
              <p>{error}</p>
              <label htmlFor="password">
                Password
                <input
                  className="form-control"
                  type="password"
                  name="password"
                  placeholder="password"
                  value={this.state.password}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor="confirmPassword">
                Confirm your Password
                <input
                  className="form-control"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your Password"
                  value={this.state.confirmPassword}
                  onChange={this.saveToState}
                />
              </label>
              <button className="btn btn-primary" type="submit">Reset your Password!</button>
            </fieldset>
          </form>
        )}
      </Mutation>
    );
  }
}

export default Reset;
