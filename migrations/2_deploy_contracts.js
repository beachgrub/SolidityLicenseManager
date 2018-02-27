var LicensedToken = artifacts.require("LicensedToken");

module.exports = function(deployer) {
  deployer.deploy(LicensedToken);
};