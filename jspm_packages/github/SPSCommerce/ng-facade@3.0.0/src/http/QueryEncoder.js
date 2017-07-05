const UNENCODE = Array.from('!$\'()*+,;A9-._~?/')
                      .map(c => [ new RegExp(`%${c.charCodeAt(0).toString(16).toUpperCase()}`, 'g'), c ]);

function defaultEncoder(s) {
    let encoded = encodeURIComponent(s);
    for (const [ regex, c ] of UNENCODE) {
        encoded = encoded.replace(regex, c);
    }
    return encoded;
}

class QueryEncoder {
    encodeKey(k) {
         return defaultEncoder(k);
    }

    encodeValue(v) {
        return defaultEncoder(v);
    }
}

export default QueryEncoder;
