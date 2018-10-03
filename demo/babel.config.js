module.exports = {
    "presets": [
        [
            "@babel/preset-env",
            {
            "targets": ">1%, ie 11"
            }
        ]
    ],
    "plugins": [
        "@babel/plugin-proposal-object-rest-spread"
    ]
}