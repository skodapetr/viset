const path = require("path");

const config = {
    "devtool": "source-map",
    "entry": [
        path.join(__dirname, "client/index.jsx")
    ],
    "output": {
        "path": path.resolve(__dirname, "build"),
        "filename": "bundle.js",
        "publicPath": "/"
    },
    "resolve": {
        // Enable implicit resolution of jsx files.
        // Otherwise we would need to specify the jsx extension.
        "extensions": [".js", ".jsx"]
    },
    "module": {
        "loaders": [{
            "test": /\.jsx?$/,
            "exclude": /node_modules/,
            "loaders": ["babel-loader"]
        }]
    }
};

module.exports = config;
