import ngfTemplate  from '../util/directive/ngfTemplate';
import CommonModule from '../common/CommonModule';

const ngEvents = [
    'blur',
    'change',
    'checked',
    'click',
    'dblclick',
    'focus',
    'keydown',
    'keypress',
    'keyup',
    'mousedown',
    'mouseenter',
    'mouseleave',
    'mousemove',
    'mouseover',
    'mouseup',
    'submit'
];

const TEMPLATE_REPLS = [
    {
        description: 'Basic browser events e.g. (click) => ng-click',
        replace:     new RegExp(`\\((${ngEvents.join('|')})\\)="`, 'g'),
        with:        (m, eventName) => `ng-${eventName}="`,
    },
    {
        description: '[innerHTML] => ng-bind-html',
        replace:     /\[innerHTML]="/g,
        with:        'ng-bind-html="',
    },
];

const BrowserModule = {
    getModule() {
        ngfTemplate.registerAllReplacements('Browser', TEMPLATE_REPLS);
        return CommonModule.getModule();
    }
};

export default BrowserModule;
