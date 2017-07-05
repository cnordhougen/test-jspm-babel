import QueryEncoder from './QueryEncoder';

const defaultQueryEncoder = new QueryEncoder();

class URLSearchParams {
    constructor(rawParams = [], queryEncoder = defaultQueryEncoder) {
        this.paramsMap = new Map();
        this.queryEncoder = queryEncoder || encodeURIComponent;

        if (typeof rawParams === 'string') {
            rawParams = rawParams.split('&')
                                 .map(p => p.split('=').map(decodeURIComponent))
                                 .filter(p => p.length === 2);
        } else if (rawParams !== null && typeof rawParams === 'object'
            && Object.getPrototypeOf(rawParams) === Object.prototype) {
            rawParams = Object.keys(rawParams).map(k => [ k, rawParams[k] ]);
        }
        if (rawParams instanceof URLSearchParams) {
            this.replaceAll(rawParams);
        } else if (Array.isArray(rawParams)) {
            for (const [ param, val ] of rawParams) {
                this.append(param, val);
            }
        } else {
            throw new TypeError('rawParams must be a string, object, array, or URLSearchParams');
        }
    }

    clone() {
        const clone = new URLSearchParams(null, this.queryEncoder);
        clone.appendAll(this);
        return clone;
    }

    has(param) {
        return this.paramsMap.has(param);
    }

    get(param) {
        return this.has(param) ? this.paramsMap.get(param)[0] : null;
    }

    getAll(param) {
        return this.has(param) ? this.paramsMap.get(param) : null;
    }

    set(param, val) {
        if (val) {
            this.paramsMap.set(param, [].concat(val).map(String));
        }
    }

    setAll(searchParams) {
        for (const [ param, val ] of searchParams.paramsMap.entries()) {
            this.set(param, val);
        }
    }

    append(param, val) {
        if (val) {
            const list = this.has(param) ? this.getAll(param) : [];
            this.set(param, list.concat(val));
        }
    }

    appendAll(searchParams) {
        for (const [ param, val ] of searchParams.paramsMap.entries()) {
            this.append(param, val);
        }
    }

    replaceAll(searchParams) {
        this.paramsMap = searchParams.paramsMap;
    }

    toString() {
        const parts = [];
        for (const [ param, vals ] of this.paramsMap.entries()) {
            for (const v of vals) {
                const enck = this.queryEncoder.encodeKey(param)
                    , encv = this.queryEncoder.encodeValue(v);
                parts.push(`${enck}=${encv}`);
            }
        }
        return parts.join('&');
    }

    delete(param) {
        this.paramsMap.delete(param);
    }

    entries() {
        return this.paramsMap.entries();
    }

    keys() {
        return this.paramsMap.keys();
    }

    values() {
        return this.paramsMap.values();
    }
}

export default URLSearchParams;
