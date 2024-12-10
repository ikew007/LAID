// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BlockchainIDSystem is Ownable {
    using Strings for uint256;

    struct Verifier {
        string login;
        string confirmationDate;
    }

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

    struct VerificationRequest {
        string requesterLogin;
        string targetLogin;
    }

    mapping(string => User) private users;
    mapping(string => VerificationRequest[]) private verificationRequests;

    event UserRegistered(string login);
    event UserLoggedIn(string login);
    event UserLoggedOut(string login);
    event PersonalDataUpdated(string login);
    event VerificationRequested(string requesterLogin, string targetLogin);
    event VerificationConfirmed(string verifierLogin, string targetLogin);

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

    function updatePersonalData(
        string memory login,
        string memory firstName,
        string memory lastName,
        string memory middleName,
        string memory dateOfBirth,
        string memory gender,
        string memory citizenship,
        string memory placeOfBirth
    ) public onlyLoggedIn(login) {
        User storage user = users[login];

        user.personalData = PersonalData({
            firstName: firstName,
            lastName: lastName,
            middleName: middleName,
            dateOfBirth: dateOfBirth,
            gender: gender,
            citizenship: citizenship,
            placeOfBirth: placeOfBirth
        });

        emit PersonalDataUpdated(login);
    }

    function requestVerification(string memory requesterLogin, string memory targetLogin) public onlyLoggedIn(requesterLogin) {
        require(bytes(users[targetLogin].login).length > 0, "Target user does not exist.");
        verificationRequests[targetLogin].push(VerificationRequest({
            requesterLogin: requesterLogin,
            targetLogin: targetLogin
        }));

        emit VerificationRequested(requesterLogin, targetLogin);
    }

    function confirmVerification(string memory verifierLogin, string memory targetLogin) public onlyLoggedIn(verifierLogin) {
        require(bytes(users[targetLogin].login).length > 0, "Target user does not exist.");

        VerificationRequest[] storage requests = verificationRequests[targetLogin];
        bool requestFound = false;

        for (uint256 i = 0; i < requests.length; i++) {
            if (keccak256(abi.encodePacked(requests[i].requesterLogin)) == keccak256(abi.encodePacked(verifierLogin))) {
                requestFound = true;

                // Remove the confirmed request
                for (uint256 j = i; j < requests.length - 1; j++) {
                    requests[j] = requests[j + 1];
                }
                requests.pop();
                break;
            }
        }

        require(requestFound, "Verification request not found.");

        User storage targetUser = users[targetLogin];

        targetUser.verifiers.push(Verifier({
            login: verifierLogin,
            confirmationDate: block.timestamp.toString()
        }));

        emit VerificationConfirmed(verifierLogin, targetLogin);
    }

    function getPersonalData(string memory login) public view onlyLoggedIn(login) returns (PersonalData memory, Verifier[] memory) {
        User storage user = users[login];
        return (user.personalData, user.verifiers);
    }

    function setPersonalData(string memory login, PersonalData memory personalData) public onlyLoggedIn(login) {
        users[login].personalData = personalData;
    }

    function getVerificationRequests(string memory login) public view onlyLoggedIn(login) returns (VerificationRequest[] memory) {
        return verificationRequests[login];
    }
}
