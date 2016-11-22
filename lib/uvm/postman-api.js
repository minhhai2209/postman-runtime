(function (universe) {

    universe.PostmanApi = function (masked, options) {
        masked = masked || {};
        options = options || {};

        var environment = options.environment,
            globals = options.globals,
            insensitiveHeaders = {},
            insensitiveCookies = {},
            cookie,
            prop,
            i;

        var qasymphony = universe.qasymphony,
            globalEnvironment = qasymphony.environment,
            globalGlobals = qasymphony.globals;

        for (prop in options.responseHeaders) {
            if (options.responseHeaders.hasOwnProperty(prop)) {
                (insensitiveHeaders[prop.toLowerCase()] = options.responseHeaders[prop]);
            }
        }

        if (options.responseCookies) {
            for (i = 0; i < options.responseCookies.length; i++) {
                cookie = options.responseCookies[i];
                if ((typeof cookie.name) === 'string') {
                    insensitiveCookies[cookie.name.toLowerCase()] = cookie;
                }
            }
        }

        if (qasymphony.nextRequest) {
            masked.nextRequest = qasymphony.nextRequest;
            delete qasymphony.nextRequest;
        }

        for (var p in globalEnvironment) {
            if (globalEnvironment.hasOwnProperty(p)) {
                environment[p] = globalEnvironment[p];
            }
        }

        for (var p in globalGlobals) {
            if (globalGlobals.hasOwnProperty(p)) {
                globals[p] = globalGlobals[p];
            }
        }

        return {
            getResponseCookie: (masked.scriptType === 'test') ? function (cookieName) {
                return insensitiveCookies[cookieName.toLowerCase()];
            } : undefined,
            getResponseHeader: (masked.scriptType === 'test') ? function (headerString) {
                return insensitiveHeaders[headerString.toLowerCase()];
            } : undefined,
            setEnvironmentVariable: function (key, value) {
                (value === false || value) &&
                value.toString && (typeof value.toString === 'function') && (value = value.toString());
                environment[key] = value;
                globalEnvironment[key] = value;
            },
            getEnvironmentVariable: function (key) {
                return environment[key] || globalEnvironment[key];
            },
            clearEnvironmentVariables: function () {
                for (var key in environment) {
                    if (environment.hasOwnProperty(key)) {
                        delete environment[key];
                        delete globalEnvironment[key];
                    }
                }
            },
            clearEnvironmentVariable: function (key) {
                delete environment[key];
                delete globalEnvironment[key];
            },
            getGlobalVariable: function (key) {
                return globals[key] || globalGlobals[key];
            },
            setGlobalVariable: function (key, value) {
                (value === false || value) &&
                value.toString && (typeof value.toString === 'function') && (value = value.toString());
                globals[key] = value;
                globalGlobals[key] = value;
            },
            clearGlobalVariables: function () {
                for (var key in globals) {
                    if (globals.hasOwnProperty(key)) {
                        delete globals[key];
                        delete globalGlobals[key];
                    }
                }
            },
            clearGlobalVariable: function (key) {
                delete globals[key];
                delete globalGlobals[key];
            },
            setNextRequest: function (what) {
                masked.nextRequest = what;
            }
        };
    };
}(this));