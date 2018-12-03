import { asyncRouterMap, constantRouterMap } from '@/router';

function hasPermission( roles, route ) {
  if ( route.meta && route.meta.role ) {
    return roles.some( role => {
      return route.meta.role.indexOf( role.name ) >= 0
    } )
  } else {
    return true
  }
}

const permission = {
  state: {
    routers: constantRouterMap
    , addRouters: []
    , hasRouter: false
  , }
  , mutations: {
    SET_ROUTERS: ( state, routers ) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat( routers );
    }
    , HAS_ROUTERS: ( state ) => {
      state.hasRouter = true;
    }
    , RESET_ROUTERS: ( state ) => {
      state.hasRouter = false;
    }
  }
  , actions: {
    GenerateRoutes( { commit }, data ) {
      return new Promise( resolve => {
        const { roles } = data;

        const accessedRouters = asyncRouterMap.filter( v => {
          const isAdmin = roles.some( role => {
            return role.name == 'admin';
          } );
          if ( isAdmin ) {
            return true;
          }

          if ( hasPermission( roles, v ) ) {
            if ( v.children && v.children.length > 0 ) {
              v.children = v.children.filter( child => {

                if ( hasPermission( roles, child ) ) {
                  // console.log( "wwwwwww", child );

                  return child
                }
                return false;
              } );
              return v
            } else {
              return v
            }
          }
          return false;
        } );
        commit( 'SET_ROUTERS', accessedRouters );
        resolve();
      } )
    }
    , SetRoutes( { commit } ) {
      commit( 'HAS_ROUTERS' );
    }
    , ResetRoutes( {commit} ) {
      commit( 'RESET_ROUTERS' )
    }
  }
};

export default permission;