// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BlockchainIDSystem is Ownable {
    using Strings for uint256;

    struct User {
        string login;
        bytes32 passwordHash;
        bool isLoggedIn;
        PersonalData personalData;
        Verifier[] verifiers;
    }

    struct PersonalData {
        string firstName;
        string lastName;
        string middleName;
        string dateOfBirth;
        string gender;
        string citizenship;
        string placeOfBirth;
    }

    struct Verifier {
        string login;
        string confirmationDate;
    }

    struct VerificationRequest {
        string requesterLogin;
        string verifierLogin;
    }

    mapping(string => User) private users;
    string[] private userLogins;
    VerificationRequest[] private allVerificationRequests;

    event UserRegistered(string login);
    event UserLoggedIn(string login);
    event UserLoggedOut(string login);
    event PersonalDataUpdated(string login);
    event VerificationRequested(string requesterLogin, string verifierLogin);
    event VerificationConfirmed(string requesterLogin, string verifierLogin);

    constructor() Ownable(0x2e509A864c6376107155B0Bfb70f91FB370D876E) {}

    modifier onlyLoggedIn(string memory login) {
        require(users[login].isLoggedIn, "User must be logged in to perform this action.");
        _;
    }

    function registerUser(string memory login, string memory password) public {
        require(bytes(users[login].login).length == 0, "User with this login already exists.");

        users[login].login = login;
        users[login].passwordHash = keccak256(abi.encodePacked(password));
        users[login].isLoggedIn = false;
        userLogins.push(login);

        emit UserRegistered(login);
    }

    function loginUser(string memory login, string memory password) public {
        User storage user = users[login];
        require(bytes(user.login).length > 0, "User does not exist.");
        require(keccak256(abi.encodePacked(password)) == user.passwordHash, "Incorrect password.");

        user.isLoggedIn = true;

        emit UserLoggedIn(login);
    }

    function logoutUser(string memory login) public onlyLoggedIn(login) {
        users[login].isLoggedIn = false;

        emit UserLoggedOut(login);
    }

    function requestVerification(string memory requesterLogin, string memory verifierLogin) public onlyLoggedIn(requesterLogin) {
        require(bytes(users[verifierLogin].login).length > 0, "Verifier does not exist.");
        require(bytes(users[requesterLogin].login).length > 0, "Requester does not exist.");
        require(keccak256(abi.encodePacked(requesterLogin)) != keccak256(abi.encodePacked(verifierLogin)), "Requester and verifier cannot be the same.");

        for (uint256 i = 0; i < allVerificationRequests.length; i++) {
            require(
                keccak256(abi.encodePacked(allVerificationRequests[i].requesterLogin)) != keccak256(abi.encodePacked(requesterLogin)) ||
                keccak256(abi.encodePacked(allVerificationRequests[i].verifierLogin)) != keccak256(abi.encodePacked(verifierLogin)),
                "Verification request already exists."
            );
        }

        allVerificationRequests.push(VerificationRequest({
            requesterLogin: requesterLogin,
            verifierLogin: verifierLogin
        }));

        emit VerificationRequested(requesterLogin, verifierLogin);
    }

    function revertVerification(string memory requesterLogin, string memory verifierLogin) public onlyLoggedIn(requesterLogin) {
        require(bytes(users[verifierLogin].login).length > 0, "Verifier does not exist.");
        require(bytes(users[requesterLogin].login).length > 0, "Requester does not exist.");
        require(keccak256(abi.encodePacked(requesterLogin)) != keccak256(abi.encodePacked(verifierLogin)), "Requester and verifier cannot be the same.");

        bool requestFound = false;
        for (uint256 i = 0; i < allVerificationRequests.length; i++) {
            if (
                keccak256(abi.encodePacked(allVerificationRequests[i].requesterLogin)) == keccak256(abi.encodePacked(requesterLogin)) &&
                keccak256(abi.encodePacked(allVerificationRequests[i].verifierLogin)) == keccak256(abi.encodePacked(verifierLogin))
            ) {
                requestFound = true;

                // Remove the request
                for (uint256 j = i; j < allVerificationRequests.length - 1; j++) {
                    allVerificationRequests[j] = allVerificationRequests[j + 1];
                }
                allVerificationRequests.pop();
                break;
            }
        }

        require(requestFound, "Verification request not found.");
    }

    function confirmVerification(string memory requesterLogin, string memory verifierLogin) public onlyLoggedIn(verifierLogin) {
        require(bytes(users[verifierLogin].login).length > 0, "Verifier does not exist.");
        require(bytes(users[requesterLogin].login).length > 0, "Requester does not exist.");
        require(keccak256(abi.encodePacked(requesterLogin)) != keccak256(abi.encodePacked(verifierLogin)), "Requester and verifier cannot be the same.");

        bool requestFound = false;
        for (uint256 i = 0; i < allVerificationRequests.length; i++) {
            if (
                keccak256(abi.encodePacked(allVerificationRequests[i].requesterLogin)) == keccak256(abi.encodePacked(requesterLogin)) &&
                keccak256(abi.encodePacked(allVerificationRequests[i].verifierLogin)) == keccak256(abi.encodePacked(verifierLogin))
            ) {
                requestFound = true;

                // Remove the request
                for (uint256 j = i; j < allVerificationRequests.length - 1; j++) {
                    allVerificationRequests[j] = allVerificationRequests[j + 1];
                }
                allVerificationRequests.pop();
                break;
            }
        }

        require(requestFound, "Verification request not found.");

        User storage targetUser = users[requesterLogin];

        targetUser.verifiers.push(Verifier({
            login: verifierLogin,
            confirmationDate: block.timestamp.toString()
        }));

        emit VerificationConfirmed(requesterLogin, verifierLogin);
    }

    function rejectVerification(string memory requesterLogin, string memory verifierLogin) public onlyLoggedIn(verifierLogin) {
        require(bytes(users[verifierLogin].login).length > 0, "Verifier does not exist.");
        require(bytes(users[requesterLogin].login).length > 0, "Requester does not exist.");
        require(keccak256(abi.encodePacked(requesterLogin)) != keccak256(abi.encodePacked(verifierLogin)), "Requester and verifier cannot be the same.");

        bool requestFound = false;
        for (uint256 i = 0; i < allVerificationRequests.length; i++) {
            if (
                keccak256(abi.encodePacked(allVerificationRequests[i].requesterLogin)) == keccak256(abi.encodePacked(requesterLogin)) &&
                keccak256(abi.encodePacked(allVerificationRequests[i].verifierLogin)) == keccak256(abi.encodePacked(verifierLogin))
            ) {
                requestFound = true;

                // Remove the request
                for (uint256 j = i; j < allVerificationRequests.length - 1; j++) {
                    allVerificationRequests[j] = allVerificationRequests[j + 1];
                }
                allVerificationRequests.pop();
                break;
            }
        }

        require(requestFound, "Verification request not found.");
    }

    function getPersonalData(string memory login) public view onlyLoggedIn(login) returns (PersonalData memory, Verifier[] memory) {
        User storage user = users[login];
        return (user.personalData, user.verifiers);
    }

    function getPersonalDataToConfirm(string memory requesterLogin, string memory verifierLogin) public view onlyLoggedIn(verifierLogin) returns (PersonalData memory personalData) {
        for (uint256 i = 0; i < allVerificationRequests.length; i++) {
            if (
                keccak256(abi.encodePacked(allVerificationRequests[i].requesterLogin)) == keccak256(abi.encodePacked(requesterLogin)) &&
                keccak256(abi.encodePacked(allVerificationRequests[i].verifierLogin)) == keccak256(abi.encodePacked(verifierLogin))
            ) {
                return users[requesterLogin].personalData;
            }
        }
        revert("Verification request not found.");
    }

    function setPersonalData(string memory login, PersonalData memory personalData) public onlyLoggedIn(login) {
        users[login].personalData = personalData;

        while (users[login].verifiers.length > 0) {
            users[login].verifiers.pop();
        }
    }

    function getConfirmedVerifications(string memory login) public view onlyLoggedIn(login) returns (Verifier[] memory) {
        return users[login].verifiers;
    }

    function getAllVerificationRequests() public view returns (VerificationRequest[] memory) {
        return allVerificationRequests;
    }

    function getAllUserLogins() public view returns (string[] memory) {
        return userLogins;
    }
}