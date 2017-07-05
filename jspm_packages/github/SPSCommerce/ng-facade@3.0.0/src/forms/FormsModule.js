import ngfTemplate from '../util/directive/ngfTemplate';

const TEMPLATE_REPLS = [
    {
        description: 'ngModel => ng-model',
        replace:     /\[\(ngModel\)]="/g,
        with:        'ng-model="',
    },
];

const FormsModule = {
    getModule() {
        ngfTemplate.registerAllReplacements('Forms', TEMPLATE_REPLS);
    }
};

export default FormsModule;
