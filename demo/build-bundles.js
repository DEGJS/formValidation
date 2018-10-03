const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonJs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');

const buildBundles = async function() {
    // at path src/js/components/
    const entryPoints = [
        'rule-demos',
        'example-form'
    ];

    const bundlePromises = entryPoints.map(bundle);
    Promise.all(bundlePromises).then(resp => {
        console.log('All bundles complete.')
    })
    .catch(err => console.error(err))
}

const bundle = async function(entryName) {
    const inputOpts = {
        input: `src/js/components/${entryName}.js`,
        plugins: [
            resolve(),
            commonJs(),
            babel()
        ]
    };
    const outputOpts = {
        file: `src/js/${entryName}-bundle.js`,
        format: 'iife',
        name: `${entryName}-bundle.js`
    };

    const rollupBundle = await rollup.rollup(inputOpts);
    return rollupBundle.write(outputOpts);
}

module.exports = buildBundles();