import angular from 'angular';
import 'angular-mocks';

import InjectionSetup from '../../util/injection/InjectionSetup';

function inject(list, f) {
    const iSetup = new InjectionSetup(list);
    return angular.mock.inject(iSetup.$inject.concat([ f ]));
}

export default inject;
