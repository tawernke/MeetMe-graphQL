import React from 'react'
import { Query } from "react-apollo"
import { CURRENT_USER_QUERY } from './User'
import Signin from './Signin'

const PleaseSignIn = props => (
  <Query query={CURRENT_USER_QUERY}>
    {({data, loading}) => {
      if(loading) return <p></p>
      if(!data.me) {
        return <Signin match={props.match} history={props.history}/>
      }
      return props.children
    }}
  </Query>
)

export default PleaseSignIn