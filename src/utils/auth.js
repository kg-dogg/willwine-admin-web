import lockr from 'lockr'

const TokenKey = 'auth_token'

export function getToken() {
  return lockr.get( TokenKey )
}

export function setToken( token ) {
  return lockr.set( TokenKey, token );
}

export function removeToken() {
  return lockr.remove( TokenKey )
}