import { ChangeDetectorRef,
         Component,
         EventEmitter,
         Inject,
         Input,
         Output             } from 'ng-facade/core';

import template from './SearchForm.template.html!text';
import styles   from './SearchForm.styles.min.css!text';

/* eslint-disable no-multi-spaces */
@Component({
    selector: 'xref-search-form',
    styles:   [ styles ],
    template,
}) /* eslint-enable no-multi-spaces */
@Inject({ ref: ChangeDetectorRef, localization: 'localizationService' })
class SearchFormComponent {
    @Input() searchValues = {};
    @Output() search = new EventEmitter();
    @Output() clear = new EventEmitter();

    ngOnInit() {
        this.localization.localize({
            component: 'search-form',
            path:      './lang/',
        });
    }

    clearForm() {
        for (const key of Object.keys(this.searchValues)) {
            this.searchValues[key] = null;
        }
        this.clear.emit();
        this.ref.detectChanges();
    }
}

export default SearchFormComponent;
