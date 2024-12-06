const Web3Lib = require('web3');
const { abi, bytecode } = require('../../../blockchain/compile');

let accounts;
let userImageStore;
let contract: any;

const web3 = new Web3Lib.Web3('http://127.0.0.1:8545');

let fromAddress: string;

export async function buildClient() {
    await deployContract();
    const contractAddress = userImageStore!.options.address;
    contract = new web3.eth.Contract(abi, contractAddress);
    fromAddress = accounts![0];
}

async function deployContract() {
    accounts = await web3.eth.getAccounts();
    userImageStore = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: 30000000 });
}

//#region auth

export async function registerUser(login: string, password: string): Promise<boolean> {
    try {
        await contract.methods.registerUser(login, password).send({ from: fromAddress });
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}

export async function loginUser(login: string, password: string): Promise<boolean> {
    try {
        await contract.methods.loginUser(login, password).send({ from: fromAddress });
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}

export async function logoutUser(login: string): Promise<void> {
    try {
        await contract.methods.logoutUser(login).send({ from: fromAddress });
    }
    catch (error) {
        console.error(error);
    }
}

//#endregion