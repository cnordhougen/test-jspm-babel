import ngfTemplate from '../util/directive/ngfTemplate';

const TEMPLATE_REPLS = [
    {
        description: '1+ consecutive [class.foo]="expr" => ng-class',
        get replace() {
            delete this.replace;
            return this.replace = new RegExp(`(\\s+${this.regexes.SINGLE.source})+`, 'g');
        },
        with(m) {
            const cs = m.match(this.regexes.ALL)
                        .map(m =>
                            m.replace(
                                this.regexes.SINGLE,
                                (m, classes, expr) => `'${classes}': ${expr}`
                            )
                        )
                        .join(', ');
            return ` ng-class="{ ${cs} }"`;
        },
        get regexes() {
            delete this.regexes;
            const SINGLE  = /\[class\.([^\]]+)]="((?:[^"]|\\")+[^\\"])"/
                , ALL     = new RegExp(SINGLE, 'g');
            return this.regexes = { SINGLE, ALL };
        },
    },
    {
        description: '[ngClass] => ng-class',
        replace:     /\[ngClass]="/g,
        with:        'ng-class="',
    },
    {
        description: '1+ consecutive [style.foo]="expr" => ng-style',
        get replace() {
            delete this.replace;
            return this.replace = new RegExp(`(\\s+${this.regexes.SINGLE.source})+`, 'g');
        },
        with(m) {
            const sts = m.match(this.regexes.ALL)
                         .map(m =>
                             m.replace(
                                 this.regexes.SINGLE,
                                 (m, styles, expr) => `'${styles}': ${expr}`
                             )
                         )
                         .join(', ');
            return ` ng-style="{ ${sts} }"`;
        },
        get regexes() {
            delete this.regexes;
            const SINGLE  = /\[style\.([^\]]+)]="((?:[^"]|\\")+[^\\"])"/
                , ALL     = new RegExp(SINGLE, 'g');
            return this.regexes = { SINGLE, ALL };
        },
    },
    {
        description: '[ngStyle] => ng-style',
        replace:     /\[ngStyle]="/g,
        with:        'ng-style="',
    },
    {
        description: '*ngFor => ng-repeat',
        replace:     /\*ngFor="let ([A-Za-z0-9-_]+) of/g,
        with:        (m, varName) => `ng-repeat="${varName} in`,
    },
    {
        description: '*ngIf => ng-if',
        replace:     /\*ngIf="/g,
        with:        'ng-if="',
    },
    {
        description: '[ngSwitch] => ng-switch',
        replace:     /\[ngSwitch]="/g,
        with:        'ng-switch="',
    },
    {
        description: '*ngSwitchCase => ng-switch-when',
        replace:     /\*ngSwitchCase="/g,
        with:        'ng-switch-when="',
    },
    {
        description: '*ngSwitchDefault => ng-switch-default',
        replace:     /\*ngSwitchDefault/g,
        with:        'ng-switch-default',
    },
];

const CommonModule = {
    getModule() {
        ngfTemplate.registerAllReplacements('Common', TEMPLATE_REPLS);
    }
};

export default CommonModule;
