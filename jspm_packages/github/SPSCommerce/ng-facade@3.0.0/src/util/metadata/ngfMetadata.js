/* I sure would like to use a polyfill for the proposed
 * Reflect metadata API but it doesn't appear to work in
 * the version of babel that we're using. So. Here's a
 * barebones implementation.
 */
const NGF_METADATA_PROP = Symbol('ngfMetadata');

const ngfMetadata = {
    define(k, v, target) {
        if (!target.hasOwnProperty(NGF_METADATA_PROP)) {
            Object.defineProperty(target, NGF_METADATA_PROP, { value: new Map() });
        }
        target[NGF_METADATA_PROP].set(k, v);
    },

    has(k, target) {
        if (target.hasOwnProperty(NGF_METADATA_PROP)) {
            return target[NGF_METADATA_PROP].has(k);
        }
    },

    get(k, target, defaultValue) {
        if (ngfMetadata.has(k, target)) {
            return target[NGF_METADATA_PROP].get(k);
        }
        return defaultValue;
    }
};

export default ngfMetadata;
