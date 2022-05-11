// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TimeLock is ReentrancyGuard {
    struct User {
        uint256 startingTime;
        uint256 closingTime;
    }

    mapping(address => User) users;
    mapping(address => uint256) public balance;

    event TimeStampSet(uint256 indexed startingTime, uint256 indexed closingTime);

    function setTimeStamp(uint256 startingTime, uint256 closingTime) public {
        require(
            users[msg.sender].startingTime == 0 &&
                users[msg.sender].closingTime == 0,
            "Time has already been set"
        );
        users[msg.sender] = User(startingTime, closingTime);

        emit TimeStampSet(startingTime, closingTime);
    }

    function store() public payable nonReentrant {
        require(msg.value > 0, "Amount should be greater than zero");
        balance[msg.sender] = balance[msg.sender] + msg.value;
    }

    function withdraw(uint256 amount) public nonReentrant {
        User storage currentUser = users[msg.sender];
        require(
            block.timestamp > currentUser.closingTime ||
                block.timestamp < currentUser.startingTime,
            "Contract is still locked"
        );
        require(amount <= balance[msg.sender]);
        payable(msg.sender).transfer(amount);

        balance[msg.sender] = balance[msg.sender] - amount;
    }
}
