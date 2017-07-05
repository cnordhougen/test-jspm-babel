function loadModules(...moduleLists) {
    if (moduleLists.length === 0) {
        return Promise.resolve([]);
    }

    let results = [];
    function recur(i, list) {
        const loads = list.map(t => (t.getModule ? t.getModule(...results) : t));
        return Promise.all(loads).then(modules => {
            moduleLists[i] = modules;
            return loadModules(results, ...moduleLists.slice(i));
        });
    }

    for (const [ i, list ] of moduleLists.entries()) {
        if (list) {
            const flist = [].concat(list).filter(t => t);
            if (flist.find(t => t.getModule)) {
                return recur(i, flist);
            }
            results = results.concat(flist.map(m => m.name || m));
        }
    }

    return Promise.resolve(results);
}

export default loadModules;
