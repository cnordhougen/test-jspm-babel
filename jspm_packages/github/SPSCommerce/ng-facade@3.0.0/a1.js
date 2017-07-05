import A1InjectToken from './src/util/injection/A1InjectToken';

const Compile     = new A1InjectToken('$compile')
    , Location    = new A1InjectToken('$location')
    , Parse       = new A1InjectToken('$parse')
    , RootScope   = new A1InjectToken('$rootScope')
    , Scope       = new A1InjectToken('$scope')
    , State       = new A1InjectToken('$state')
    , StateParams = new A1InjectToken('$stateParams')
    , Timeout     = new A1InjectToken('$timeout');

export {
    Compile,
    Location,
    Parse,
    RootScope,
    Scope,
    State,
    StateParams,
    Timeout
};
