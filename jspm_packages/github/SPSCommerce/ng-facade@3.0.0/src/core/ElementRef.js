class ElementRef {
    constructor($element) {
        this.nativeElement = $element.nativeElement || $element[0];
    }
}
ElementRef.inject = '$element';

export default ElementRef;
