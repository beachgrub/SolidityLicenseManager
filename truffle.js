/*
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    }
  }
};
*/
var HDWalletProvider = require("truffle-hdwallet-provider");
// Replace with real account to actually deploy
// This is default ganache
var mnemonic = "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";
module.exports = {
  networks: {
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/op3aLhRH781K9MoS9dFp")
      },
      network_id: 3
    },	
    ropsten:  {
		  provider: function() {
			return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/op3aLhRH781K9MoS9dFp")
		  },
		network_id: 3,
		gas: 4000000,
	},
	development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    }
  }
};
