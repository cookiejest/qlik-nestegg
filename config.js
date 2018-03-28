var config = {
    "development": {
        'webservice': 'http://localhost:8083'
    },
    "staging": {
        'webservice': 'https://nestegg-stage.herokuapp.com'
    },
    "production": {
        'webservice': 'http://someprodserver.com'
    },
}

exports.get = function get(buildmode) {
    return config[buildmode] || config.development;
}