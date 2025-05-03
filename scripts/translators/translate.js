// scripts/translators/translate.js

const fs = require('fs').promises;
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Import translator functions (add others as they are created)
const { translateToBuildroot } = require('./buildroot-translator');
// const { translateToYocto } = require('./yocto-translator'); // Example
// const { translateToPtxdist } = require('./ptxdist-translator'); // Example

const argv = yargs(hideBin(process.argv))
    .usage('Usage: node $0 -i <input.json> -o <outputDir> -t <buildSystem>')
    .option('i', {
        alias: 'input',
        describe: 'Path to the elhclf_config.json file',
        type: 'string',
        demandOption: true, // Make input file mandatory
    })
    .option('o', {
        alias: 'output',
        describe: 'Directory to save the generated configuration file(s)',
        type: 'string',
        demandOption: true, // Make output directory mandatory
    })
    .option('t', {
        alias: 'type',
        describe: 'Target build system type',
        choices: ['buildroot', 'yocto', 'ptxdist'], // Add more as supported
        demandOption: true, // Make type mandatory
    })
    .help()
    .alias('h', 'help')
    .argv;

async function main() {
    try {
        // 1. Read and Parse JSON
        const jsonPath = path.resolve(argv.input);
        console.log(`Reading configuration from: ${jsonPath}`);
        const jsonData = await fs.readFile(jsonPath, 'utf8');
        const config = JSON.parse(jsonData); // Add try-catch for JSON parsing errors

        // 2. Select Translator and Generate Config
        let outputContent = '';
        let outputFilename = ''; // Specific to the build system

        console.log(`Translating for build system: ${argv.type}`);
        switch (argv.type) {
            case 'buildroot':
                outputContent = translateToBuildroot(config);
                outputFilename = '.config'; // Buildroot's standard config filename
                break;
            // Add cases for 'yocto', 'ptxdist' here
            default:
                throw new Error(`Unsupported build system type: ${argv.type}`);
        }

        // 3. Write Output File
        const outputDir = path.resolve(argv.output);
        await fs.mkdir(outputDir, { recursive: true }); // Ensure output directory exists
        const outputPath = path.join(outputDir, outputFilename);
        console.log(`Writing ${argv.type} configuration to: ${outputPath}`);
        await fs.writeFile(outputPath, outputContent);

        console.log('Translation complete!');

    } catch (error) {
        console.error("Error during translation:", error.message);
        if (error instanceof SyntaxError) {
            console.error("Invalid JSON file provided.");
        }
        process.exit(1); // Exit with error code
    }
}

main();