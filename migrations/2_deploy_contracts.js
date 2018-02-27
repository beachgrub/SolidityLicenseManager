var LicenseManager = artifacts.require("LicenseManager");

module.exports = function(deployer) {
  deployer.deploy(LicenseManager);
};