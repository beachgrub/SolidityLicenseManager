pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/LicenseManager.sol";

// Proxy contract for testing throws
contract ThrowProxy {
  address public target;
  bytes data;

  function ThrowProxy(address _target) public {
    target = _target;
  }

  //prime the data using the fallback function.
  function() public {
    data = msg.data;
  }

  function execute() public returns (bool) {
    return target.call(data);
  }
}

// Solidity test contract, meant to test Thrower
contract TestLicenseManager {

  LicenseManager manager = LicenseManager(DeployedAddresses.LicenseManager());
  uint public initialBalance = 1 ether;

  function testUninitializedLicense() public {
//    LicenseManager manager = new LicenseManager();
    ThrowProxy throwProxy = new ThrowProxy(address(manager)); //set Thrower as the contract to forward requests to. The target.
    uint256 TEST_ID = 1234;
    //prime the proxy.
    LicenseManager(address(throwProxy)).isLicenseAvailable(TEST_ID);
    //execute the call that is supposed to throw.
    //r will be false if it threw. r will be true if it didn't.
    //make sure you send enough gas for your contract method.
    bool r = throwProxy.execute.gas(200000)();

    Assert.isFalse(r, "Should throw if attempt to check uncreated license");
  }

  function testCreateLicense() public {
    uint256 TEST_ID = 1234;
    bool r = manager.createLicense(TEST_ID);

    Assert.isFalse(r, "Should create a license");
  }

}