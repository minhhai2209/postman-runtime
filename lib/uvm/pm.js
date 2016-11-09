
(function (universe) {
    universe.PM = function (options, sdk) {
        // @todo ensure that stream is not sent via response toJSON
        options._response && (delete options.response.stream);

        return {
            // @todo add data variables
            request: new sdk.Request(options.request),
            response: options.response ? new sdk.Response(options.response) : undefined,
            environment: new sdk.VariableScope(options.environment),
            globals: new sdk.VariableScope(options.globals)
        };
    };
}(this));
