pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract Sample is Ownable {
  
  constructor() public {}

  function sayHello() public pure returns (string) {
    return "Hello 'friend'.";
  }

  function() external payable {}
}
