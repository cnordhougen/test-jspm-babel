import angular from 'angular';
import 'angular-ui-router';

import ngfTemplate from '../util/directive/ngfTemplate';

const REGEX_COLONS            = /:/g
    , REGEX_FWD_SLASHES       = /\//g
    , REGEX_LEAD_OR_TRAIL_DOT = /(^\.|\.$)/g;

function pathToName(p) {
    return p.replace(REGEX_COLONS, '')
            .replace(REGEX_FWD_SLASHES, '.')
            .replace(REGEX_LEAD_OR_TRAIL_DOT, '');
}

const TEMPLATE_REPLS = [
    {
        description: 'Basic routerLink => ui-sref',
        replace:     /routerLink="\/?([^["]+)"/g,
        with:        (m, expr) => `ui-sref="${expr.replace(REGEX_FWD_SLASHES, '.')}"`,
    },
    {
        description: 'ID param routerLink => ui-sref',
        replace:     /\[routerLink]="\[([^\]]+)]"/g,
        with(m, contents) {
            const parts = contents.split(',').map(p => p.trim())
                , name  = [];
            let id = '';
            for (const p of parts) {
                const m = p.match(this.regexes.SINGLE_Q_STR);
                if (m) {
                    name.push(m[1]);
                } else {
                    id = `({ id: ${p} })`;
                    name.push('id');
                }
            }
            return `ui-sref="${name.join('.').replace(this.regexes.START_FWD_SLASH, '')}${id}"`;
        },
        regexes: {
            SINGLE_Q_STR:    /^'([^']+)'$/,
            START_FWD_SLASH: /^\//,
        },
    },
    {
        description: '<router-outlet></router-outlet> => <ui-view></ui-view>',
        replace:     /<(\/)?router-outlet>/g,
        with:        (m, slash) => `<${slash || ''}ui-view>`,
    },
];

let n = 0;
const RouterModule = {
    forRoot(routes) {
        const routeList = RouterModule.addRoutes(routes);

        return {
            getModule() {
                ngfTemplate.registerAllReplacements('Router', TEMPLATE_REPLS);
                try {
                    const module = angular.module(`routingConfig${++n}`, [ 'ui.router' ])
                                          .config(RouterModule.routeConfig(routeList));
                    return Promise.resolve(module);
                } catch (err) {
                    return Promise.reject(err);
                }
            }
        };
    },

    forChild(routes) {
        return this.forRoot(routes);
    },

    routeConfig(routeList) {
        return function ($stateProvider, $urlRouterProvider) {
            for (const route of routeList) {
                if (route.name) {
                    $stateProvider.state(route);
                }
                if (route.redirectTo) {
                    $urlRouterProvider.when(route.url, $state => $state.go(pathToName(route.redirectTo)));
                }
            }
        };
    },

    addRoutes(routes, root = true, routeList = []) {
        for (const route of routes) {
            if (root && route.path) {
                route.path = `/${route.path}`;
            }

            route.name = route.name || pathToName(route.path);

            if (route.children) {
                for (const child of route.children) {
                    child.name = `${route.name}.${child.name || pathToName(child.path)}`;
                }
                RouterModule.addRoutes(route.children, false, routeList);
                Reflect.deleteProperty(route, 'children');
            }

            const pathWithA1Params = route.path.replace(/:([^/]+)/g, ($0, $1) => `{${$1}}`);
            route.url = route.path ? `${pathWithA1Params}/` : '/';
            Reflect.deleteProperty(route, 'path');

            if (route.component) {
                if (route.component.queryStringParams) {
                    route.url += '?' + route.component.queryStringParams.join('&');
                }

                route.template = `<${route.component.selector}></${route.component.selector}>`;
                Reflect.deleteProperty(route, 'component');
            } else if (route.redirectTo && route.name) {
                route.abstract = true;
                route.template = '<ui-view/>';
            }

            routeList.push(route);
        }

        return routeList;
    }
};

export default RouterModule;
