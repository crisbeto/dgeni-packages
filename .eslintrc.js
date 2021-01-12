module.exports = {
    env: {
        node: true,
        jasmine: true,
        es6: true,
    },
    extends: 'eslint:recommended',
    rules: {
        'no-unused-vars': 'off',
        'no-prototype-builtins': 'off',
    },
    ignorePatterns: [
        'typescript/**/*.js',
        'examples/templates/**/*.js'
    ],
};