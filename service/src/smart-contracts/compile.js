const fs = require('fs');
const path = require('path');
const solc = require('solc');

// Read the Solidity contract
const contractPath = path.resolve(__dirname, './contracts/BlockchainIDSystem.sol');
const source = fs.readFileSync(contractPath, 'utf8');

// Define the input for the compiler
const input = {
    language: 'Solidity',
    sources: {
        'BlockchainIDSystem.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
};


// Define the import callback function
function findImports(importPath) {
    if (importPath.startsWith('@openzeppelin/')) {
        const openZeppelinPath = path.resolve(__dirname, '../../node_modules', importPath);
        return { contents: fs.readFileSync(openZeppelinPath, 'utf8') };
    } else {
        return { error: 'File not found' };
    }
}

// Compile the contract
const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

// Check for compilation errors
if (output.errors) {
    output.errors.forEach((err) => {
        console.error(err.formattedMessage); // Log each error
    });
    throw new Error('Compilation failed');
}

// Access the compiled contract
const contractName = 'BlockchainIDSystem';
const abi = output.contracts['BlockchainIDSystem.sol'][contractName].abi;
const bytecode = output.contracts['BlockchainIDSystem.sol'][contractName].evm.bytecode.object;

module.exports = { abi, bytecode };