App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load licenses.
    $.getJSON('./license.json', function(data) {
      var licenseRow = $('#licenseRow');
      var licenseTemplate = $('#licenseTemplate');

      for (i = 0; i < data.length; i ++) {
        console.log("data: "+data[i].name);
        licenseTemplate.find('.panel-title').text(data[i].name);
        licenseTemplate.find('img').attr('src', data[i].picture);
        licenseTemplate.find('.owner').text(data[i].owner);
        licenseTemplate.find('.licensor').text(data[i].licensor);
        licenseTemplate.find('.rate').text(data[i].rate);
        licenseTemplate.find('.timeLeft').text(data[i].timeLeft);
        licenseTemplate.find('.btn-license').attr('data-id', data[i].id);

        licenseRow.append(licenseTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('LicenseManager.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var LicenseManagerArtifact = data;
      App.contracts.LicenseManager = TruffleContract(LicenseManagerArtifact);

      // Set the provider for our contract.
      App.contracts.LicenseManager.setProvider(App.web3Provider);

//      return App.getBalances();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-license', App.handleLicense);
  },

  handleLicense: function(event) {
    event.preventDefault();

    var licenseId = parseInt($(event.target).data('id'));

    var licenseInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.LicenseManager.deployed().then(function(instance) {
        licenseInstance = instance;

      //  return licenseInstance.transfer(toAddress, amount, {from: account});
      }).then(function(result) {
        alert('Transfer Successful!');
//        return App.getBalances();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },


};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
