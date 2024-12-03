// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BlockchainIDSystem is Ownable {
    struct User {
        string login;
        bytes32 passwordHash;
        bool isLoggedIn;
        PersonalData personalData;
        string[] verificationLogins;
    }

    struct PersonalData {
        string firstName;
        string lastName;
        string middleName;
        string dateOfBirth;
        string gender;
        string citizenship;
        string placeOfBirth;
        string confirmationDate;
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
            placeOfBirth: placeOfBirth,
            confirmationDate: ""
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

        users[targetLogin].verificationLogins.push(verifierLogin);
        users[targetLogin].personalData.confirmationDate = block.timestamp.toString();

        emit VerificationConfirmed(verifierLogin, targetLogin);
    }

    function getPersonalData(string memory login) public view onlyLoggedIn(login) returns (PersonalData memory, string[] memory) {
        User storage user = users[login];
        return (user.personalData, user.verificationLogins);
    }

    function getVerificationRequests(string memory login) public view onlyLoggedIn(login) returns (VerificationRequest[] memory) {
        return verificationRequests[login];
    }
}
