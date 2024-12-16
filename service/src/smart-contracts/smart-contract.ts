const Web3Lib = require('web3');
const { compile } = require('../../../blockchain/compile');
const fs = require('fs');

let accounts;
let owner;
let LAID;
let contract: any;

const web3 = new Web3Lib.Web3('http://127.0.0.1:8545');

let fromAddress: string;

export async function buildClient() {
    accounts = await web3.eth.getAccounts();
    owner = accounts[0];

    if (fs.existsSync('contractCache.txt')) {
        const data = fs.readFileSync('contractCache.txt', 'utf8');
        const contractData = JSON.parse(data);
        const contractAddress = contractData.contractAddress;
        const abi = contractData.abi;

        contract = new web3.eth.Contract(abi, contractAddress);
        fromAddress = accounts[0];
        return contractAddress;
    } else {
        const { abi, bytecode } = compile();
        LAID = await deployContract(owner, abi, bytecode);

        const contractAddress = LAID.options.address;

        contract = new web3.eth.Contract(abi, contractAddress);
        fromAddress = accounts[0];

        fs.writeFileSync('contractCache.txt', JSON.stringify({ abi: abi, contractAddress: contractAddress }));
        return contractAddress;
    }
}

async function deployContract(account: string, abi: any, bytecode: any) {
    return await new web3.eth.Contract(abi)
        .deploy({ data: bytecode })
        .send({ from: account, gas: 30000000 });
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

export async function getAllUserLogins(): Promise<any> {
    try {
        const response = await contract.methods.getAllUserLogins().call({ from: fromAddress });
        return response;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

//#endregion


//#region personalData

export async function getPersonalData(login: string): Promise<any> {
    try {
        const response = await contract.methods.getPersonalData(login).call({ from: fromAddress });
        return {
            personalData: response["0"],
            verifiers: response["1"],
        }
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

export async function setPersonalData(login: string, personalData: any): Promise<boolean> {
    try {
        await contract.methods.setPersonalData(login, personalData).send({ from: fromAddress });
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}

//#endregion


//#region requests

export async function getAllVerificationRequests(): Promise<any> {
    try {
        const response = await contract.methods.getAllVerificationRequests().call({ from: fromAddress });
        return response;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

export async function requestVerification(requesterLogin: string, verifierLogin: string): Promise<boolean> {
    try {
        await contract.methods.requestVerification(requesterLogin, verifierLogin).send({ from: fromAddress });
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}

export async function revertVerification(requesterLogin: string, verifierLogin: string): Promise<boolean> {
    try {
        await contract.methods.revertVerification(requesterLogin, verifierLogin).send({ from: fromAddress });
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}

export async function confirmVerification(requesterLogin: string, verifierLogin: string): Promise<boolean> {
    try {
        await contract.methods.confirmVerification(requesterLogin, verifierLogin).send({ from: fromAddress });
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}

export async function rejectVerification(requesterLogin: string, verifierLogin: string): Promise<boolean> {
    try {
        await contract.methods.rejectVerification(requesterLogin, verifierLogin).send({ from: fromAddress });
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}

export async function getPersonalDataToConfirm(requesterLogin: string, verifierLogin: string): Promise<any> {
    try {
        const response = await contract.methods.getPersonalDataToConfirm(requesterLogin, verifierLogin).call({ from: fromAddress });
        return response;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

export async function getConfirmedVerifications(login: string): Promise<any> {
    try {
        const response = await contract.methods.getConfirmedVerifications(login).call({ from: fromAddress });
        return response;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

//#endregion