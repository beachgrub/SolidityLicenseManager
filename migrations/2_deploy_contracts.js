var LicenseManager = artifacts.require("LicenseManager");
var LicenseSale = artifacts.require("LicenseSale");

module.exports = function(deployer) {
  // Deploy LicenseManager, then deploy LicenseSale, passing in LicenseManager's newly deployed address
  deployer.deploy(LicenseManager).then(function() {
    return deployer.deploy(LicenseSale, LicenseManager.address);
  });
};