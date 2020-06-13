import ApolloClient from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'

const httpLink = new HttpLink({
  uri: 'http://localhost:1337/graphql',
})

const middlewareLink = setContext(async () => {
  const userInfo = await localStorage.getItem('user-info')
  const token = JSON.parse(userInfo || '{}').jwt
  if (token === undefined) return {}
  else
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
})

const link = middlewareLink.concat(httpLink)

const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache({
    addTypename: false,
  }),
  connectToDevTools: true,
})

export default apolloClient
