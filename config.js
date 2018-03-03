var config = {
    "development": {
        'webservice': 'http://127.0.0.1:8083'
    },
    "staging": {
        'webservice': 'http://someserver.com'
    },
    "production": {
        'webservice': 'http://someprodserver.com'
    },
}

exports.get = function get(buildmode) {
    return config[buildmode] || config.development;
}