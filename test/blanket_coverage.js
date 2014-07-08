// blanket code coverage tools
// used by mocha
var blanket = require("blanket")({
        "pattern": ["/server/", "/client/"],
        "data-cover-only": ["/server/", "/client/"]
    }),
    requireDir = require("require-dir");


requireDir("./unit");
requireDir("./integration");
