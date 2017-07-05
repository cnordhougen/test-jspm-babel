/**
 * Deletes every iterable property from an object. If the property
 * has it's own destroy() method, that method is called.
 *
 * @param {Object} obj
 */
module.exports = destroy;

function destroy(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key) && obj[key]) {
            try {
                if (typeof obj[key].destroy === 'function') {
                    obj[key].destroy();
                }
                delete obj[key];
            } catch (e) {
                // Some objects throw "Permission Denied..." errors
                // when you try to inspect or delete them.  It's not
                // a big deal to just swallow and carry on.
            }
        }
    }
}
