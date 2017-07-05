export default function loadStyles(cdef) {
    const styles = cdef.styles.join('\n')
                              .replace(
                                  /^([\t ]+)?:host-context(?:\(([^)]+)\))/gm,
                                  (m, spc, sel) => `${spc || ''}${sel} ${cdef.selector}`
                              )
                              .replace(
                                  /^([\t ]+)?:host(?:\(([^)]+)\))/gm,
                                  (m, spc, sel) => `${spc || ''}${cdef.selector}${sel}`
                              )
                              .replace(
                                  /^([\t ]+)?:host([^{]*)\{/gm,
                                  (m, spc, sel) => `${spc || ''}${cdef.selector}${sel}{`
                              )
        , styleElem = document.createElement('style')
        , styleNode = document.createTextNode(styles);

    styleElem.appendChild(styleNode);
    document.body.appendChild(styleElem);

    return styles;
}
