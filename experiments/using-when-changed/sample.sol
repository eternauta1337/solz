pragma solidity ^0.4.21;

contract sample {

  address public owner;
  uint256 public thing3;
  
  constructor() public {
    owner = msg.sender;
  }

  // function() payable {}
}
