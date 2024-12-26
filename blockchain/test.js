const Web3Lib = require('web3');
const { compile } = require('./compile');
const { expect } = require("chai");

let accounts;
let owner;
let LAID;

const web3 = new Web3Lib.Web3('http://127.0.0.1:8545');

async function deployContract(account, abi, bytecode) {
    return await new web3.eth.Contract(abi)
        .deploy({ data: bytecode })
        .send({ from: account, gas: 30000000 });
}

describe('BlockchainIDSystem', function () {
    let userId1, userId2;

    before(async () => {
        const { abi, bytecode } = compile();
        accounts = await web3.eth.getAccounts();
        owner = accounts[0];
        LAID = await deployContract(owner, abi, bytecode);
    });

    it('should deploy the contract', async () => {
        expect(LAID.options.address).to.exist;
    });

    it('should register users', async () => {
        await LAID.methods.registerUser("testUser1", "testPassword1").send({ from: accounts[0] });
        await LAID.methods.registerUser("testUser2", "testPassword2").send({ from: accounts[1] });

        userId1 = web3.utils.keccak256(web3.eth.abi.encodeParameters(['string'], ["testUser1"]));
        userId2 = web3.utils.keccak256(web3.eth.abi.encodeParameters(['string'], ["testUser2"]));

        expect(userId1).to.be.a('string');
        expect(userId2).to.be.a('string');
    });

    it('should prevent duplicate user registration', async () => {
        try {
            await LAID.methods.registerUser("testUser1", "testPassword1").send({ from: accounts[2] });
            throw new Error("Expected error not thrown");
        } catch (error) {
            expect(error.cause.errorArgs.message).to.include("User with this login already exists.");
        }
    });

    it('should login users with correct credentials', async () => {
        await LAID.methods.loginUser("testUser1", "testPassword1").send({ from: accounts[0] });
        await LAID.methods.loginUser("testUser2", "testPassword2").send({ from: accounts[1] });
    });
    
    it('should not login with incorrect credentials', async () => {
        try {
            await LAID.methods.loginUser("testUser1", "wrongPassword").send({ from: accounts[0] });
            throw new Error("Expected error not thrown");
        } catch (error) {
            expect(error.cause.errorArgs.message).to.include("Incorrect password.");
        }
    });

    it('should log out a user', async () => {
        await LAID.methods.loginUser("testUser1", "testPassword1").send({ from: accounts[0] });
        await LAID.methods.logoutUser("testUser1").send({ from: accounts[0] });
    
        try {
            await LAID.methods.setPersonalData("testUser1", {
                firstName: "John",
                lastName: "Doe",
                middleName: "M",
                dateOfBirth: "2000-01-01",
                gender: "Male",
                citizenship: "USA",
                placeOfBirth: "New York"
            }).send({ from: accounts[0] });
            throw new Error("Expected error not thrown");
        } catch (error) {
            expect(error.cause.errorArgs.message).to.include("User must be logged in to perform this action.");
        }
    });

    it('should allow a logged-in user to set personal data', async () => {
        await LAID.methods.loginUser("testUser1", "testPassword1").send({ from: accounts[0] });
    
        const personalData = {
            firstName: "John",
            lastName: "Doe",
            middleName: "M",
            dateOfBirth: "2000-01-01",
            gender: "Male",
            citizenship: "USA",
            placeOfBirth: "New York"
        };
    
        await LAID.methods.setPersonalData("testUser1", personalData).send({ from: accounts[0] });
    
        const result = await LAID.methods.getPersonalData("testUser1").call({ from: accounts[0] });
    
        const retrievedData = result[0];
        const verifiers = result[1];
    
        expect(retrievedData.firstName).to.equal(personalData.firstName);
        expect(retrievedData.lastName).to.equal(personalData.lastName);
        expect(verifiers).to.be.an('array').that.is.empty;
    });

    it('should allow a user to request verification from another user', async () => {
        await LAID.methods.loginUser("testUser1", "testPassword1").send({ from: accounts[0] });
        await LAID.methods.loginUser("testUser2", "testPassword2").send({ from: accounts[1] });
    
        await LAID.methods.requestVerification("testUser1", "testUser2").send({ from: accounts[0] });
    
        const requests = await LAID.methods.getAllVerificationRequests().call();
        expect(requests).to.have.lengthOf(1);
        expect(requests[0].requesterLogin).to.equal("testUser1");
        expect(requests[0].verifierLogin).to.equal("testUser2");
    });

    it('should allow a user to revert a verification request', async () => {
        await LAID.methods.loginUser("testUser1", "testPassword1").send({ from: accounts[0] });
        await LAID.methods.loginUser("testUser2", "testPassword2").send({ from: accounts[1] });
    
        await LAID.methods.revertVerification("testUser1", "testUser2").send({ from: accounts[0] });
    
        const requests = await LAID.methods.getAllVerificationRequests().call();
        expect(requests).to.have.lengthOf(0);
    });

    it('should allow a verifier to confirm a verification request', async () => {
        await LAID.methods.loginUser("testUser1", "testPassword1").send({ from: accounts[0] });
        await LAID.methods.loginUser("testUser2", "testPassword2").send({ from: accounts[1] });
    
        await LAID.methods.requestVerification("testUser1", "testUser2").send({ from: accounts[0] });
        await LAID.methods.confirmVerification("testUser1", "testUser2").send({ from: accounts[1] });
    
        const verifications = await LAID.methods.getConfirmedVerifications("testUser1").call();
        expect(verifications).to.have.lengthOf(1);
        expect(verifications[0].login).to.equal("testUser2");
    });

    it('should prevent unauthorized actions', async () => {
        try {
            await LAID.methods.loginUser("testUser1", "testPassword1").send({ from: accounts[0] });
            await LAID.methods.logoutUser("testUser1").send({ from: accounts[0] });
            await LAID.methods.setPersonalData("testUser1", {
                firstName: "Jane",
                lastName: "Doe",
                middleName: "A",
                dateOfBirth: "1990-01-01",
                gender: "Female",
                citizenship: "Canada",
                placeOfBirth: "Toronto"
            }).send({ from: accounts[1] });
            throw new Error("Expected error not thrown");
        } catch (error) {
            expect(error.cause.errorArgs.message).to.include("User must be logged in to perform this action.");
        }
    });

    it('should not allow verification requests for non-existent verifier', async () => {
        await LAID.methods.loginUser("testUser1", "testPassword1").send({ from: accounts[0] });
    
        try {
            await LAID.methods.requestVerification("testUser1", "nonExistentUser").send({ from: accounts[0] });
            throw new Error("Expected error not thrown");
        } catch (error) {
            expect(error.cause.errorArgs.message).to.include("Verifier does not exist.");
        }
    });
    
    it('should not allow verification requests to self', async () => {
        await LAID.methods.loginUser("testUser1", "testPassword1").send({ from: accounts[0] });
    
        try {
            await LAID.methods.requestVerification("testUser1", "testUser1").send({ from: accounts[0] });
            throw new Error("Expected error not thrown");
        } catch (error) {
            expect(error.cause.errorArgs.message).to.include("Requester and verifier cannot be the same.");
        }
    });
    
    it('should return all registered user logins', async () => {
        const logins = await LAID.methods.getAllUserLogins().call();
        expect(logins).to.include("testUser1");
        expect(logins).to.include("testUser2");
        expect(logins).to.have.lengthOf(2);
    });

    it('should allow a verifier to reject a verification request', async () => {
        await LAID.methods.loginUser("testUser1", "testPassword1").send({ from: accounts[0] });
        await LAID.methods.loginUser("testUser2", "testPassword2").send({ from: accounts[1] });
    
        await LAID.methods.requestVerification("testUser1", "testUser2").send({ from: accounts[0] });
        await LAID.methods.rejectVerification("testUser1", "testUser2").send({ from: accounts[1] });
    
        const requests = await LAID.methods.getAllVerificationRequests().call();
        expect(requests).to.be.empty;
    });
});
