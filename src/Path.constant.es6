const PATH = Object.keys(System.packages)
                   .find(p => p.match(/test-jspm-babel/))
                   .replace(System.baseURL, '');

export default PATH;
