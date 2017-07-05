class ChangeDetectorRef {
    constructor($timeout) {
        Object.defineProperty(this, '_$timeout', {
            value:      $timeout,
            enumerable: false,
        });
    }

    detectChanges() {
        this._$timeout();
    }
}
ChangeDetectorRef.inject = '$timeout';

export default ChangeDetectorRef;
