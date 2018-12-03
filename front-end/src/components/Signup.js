import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { CURRENT_USER_QUERY } from "./User";

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

class Signup extends Component {
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
    console.log(user)
  }

  render() {
    return (
      <Mutation
        mutation={SIGNUP_MUTATION}
        variables={this.state}
        update={this.update}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signup, { error, loading }) => (
            <form
              method="post"
              onSubmit={async e => {
                e.preventDefault()
                await signup()
                this.setState({
                  name: '',
                  email: '',
                  password: ''
                })
              }}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign up for an account</h2>
                {/* <p>{error}</p> */}
                <input name="email" className="form-control" placeholder="email" onChange={this.saveToState} />
                <input name="name" className="form-control" placeholder="name" onChange={this.saveToState} />
                <input name="password" className="form-control" placeholder="password" onChange={this.saveToState} />
                <button type="submit" className="btn btn-primary logon-button">
                  Signup
                </button>
              </fieldset>
            </form>
          )}
      </Mutation>
    );
  }
}

export default Signup;
export { SIGNUP_MUTATION };
