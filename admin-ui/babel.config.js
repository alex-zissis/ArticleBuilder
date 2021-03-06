module.exports = {
    presets: [
        "@babel/preset-react",
        "@babel/preset-env",
        "@babel/preset-typescript",
    ],
    plugins: [
        [
            "module-resolver",
            {
                root: ["./src"],
                alias: {
                    "~": "./src",
                    "~/areas": "./areas",
                    "~/components": "./components",
                    "~/elements": "./elements",
                    "~/hooks": "./hooks",
                    "~/queries": "./queries",
                },
            },
        ],
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-transform-runtime",
    ],
};
