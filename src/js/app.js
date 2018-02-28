App = {
  web3Provider: null,
  licenseData: null,
  contracts: {},
  init: function() {
    // Load licenses.
    $.getJSON('./license.json', function(licenseData) {
      var licenseRow = $('#licenseRow');
      var licenseTemplate = $('#licenseTemplate');
      App.licenseData = licenseData;
      for (i = 0; i < licenseData.length; i ++) {
        console.log("licenseData: "+licenseData[i].name);
        licenseTemplate.find('.panel-title').text(licenseData[i].name);
        licenseTemplate.find('img').attr('src', licenseData[i].picture);
        licenseTemplate.find('.owner').text(licenseData[i].owner);
        licenseTemplate.find('.licensor').text(licenseData[i].licensor);
        licenseTemplate.find('.rate').text(licenseData[i].rate);
        licenseTemplate.find('.timeLeft').text(licenseData[i].timeLeft);
        licenseTemplate.find('.btn-license').attr('data-id', licenseData[i].id);

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

      // Use our contract to retrieve and mark the current license holders
      for (i = 0; i < App.licenseData.length; i ++) {
        var licenseId = App.licenseData[i].id;
        App.markLicenses(licenseId);
      }
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-license', App.handleLicense);
  },

  markLicenses: function(licenseId, account) {
    var licenseInstance;
    console.log("markLicenses " + licenseId);
    App.contracts.LicenseManager.deployed().then(function(instance) {
      licenseInstance = instance;
    
      return licenseInstance.getAdopters.call();
    }).then(function(licensors) {
        
//        licenseInstance.getBalance.call(account_one, {from: account_one});
      
        // if (licensors[i] !== '0x0000000000000000000000000000000000000000') {
        //   $('.panel-license').eq(i).find('button').text('Success').attr('disabled', true);
        // }
    }).catch(function(err) {
      console.log(err.message);
    });
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
