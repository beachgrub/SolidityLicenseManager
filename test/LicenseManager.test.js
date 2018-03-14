const LicenseManager = artifacts.require('LicenseManager')
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('LicenseManager', accounts => {
  let licenseManager = null;
  const _firstLicenseId = 1;
  const _secondLicenseId = 5;
  const _unknownLicenseId = 3;
  const _creator = accounts[0];
  const _renter = accounts[1];
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const _costPerDayWei = 100000;

  beforeEach(async function () {
    licenseManager = await LicenseManager.new({ from: _creator });
    await licenseManager.createLicense(_firstLicenseId, { from: _creator });
    await licenseManager.createLicense(_secondLicenseId, { from: _creator });
  });

  describe('totalSupply', function () {
    it('has a total supply equivalent to the inital supply', async function () {
      const totalSupply = await licenseManager.totalSupply();
      totalSupply.should.be.bignumber.equal(2);
    });
  });

  describe('checkOwner', function () {
    it('owner of each of the license is correct', async function () {
      const owner1 = await licenseManager.ownerOf(_firstLicenseId);
      const owner2 = await licenseManager.ownerOf(_secondLicenseId);
      owner1.should.be.equal(_creator);
      owner2.should.be.equal(_creator);
    });

    it('unknown license reverts', async function () {
      try {
        const owner3 = await licenseManager.ownerOf(_unknownLicenseId);
        assert.fail('Expected revert not received');
      } catch (error) {
        const revertFound = error.message.search('revert') >= 0;
        assert(revertFound, `Expected "revert", got ${error} instead`);
      }
    });
  });

  describe('testRates', function () {
    it('rate is 0 if not set', async function () {
      const rate1 = await licenseManager.getLicenseRate(_firstLicenseId);
      rate1.should.be.bignumber.equal(0);
    });

    it('rate is correct when set', async function () {
      await licenseManager.setLicenseRate(_secondLicenseId, _costPerDayWei, { from: _creator });
      const rate = await licenseManager.getLicenseRate(_secondLicenseId);
      rate.should.be.bignumber.equal(_costPerDayWei);
    });
  });

  describe('test license contract', function () {
    it('license can be obtained', async function () {
      await licenseManager.setLicenseRate(_secondLicenseId, _costPerDayWei, { from: _creator });
      await licenseManager.obtainLicense(_secondLicenseId, 1, { value: _costPerDayWei, from: _renter });
      const timeleft = await licenseManager.getLicenseTimeLeft(_secondLicenseId);
      // test for 1 day in seconds
      timeleft.should.be.bignumber.equal(1 * 60 * 60 * 24);
      const holder = await licenseManager.getLicenseHolder(_secondLicenseId);
      holder.should.be.equal(_renter);
    });
  });

  describe('test license contract failed', function () {
    it('license not enough payment', async function () {
      await licenseManager.setLicenseRate(_secondLicenseId, _costPerDayWei, { from: _creator });
      try {
        await licenseManager.obtainLicense(_secondLicenseId, 1, { value: _costPerDayWei * 0.25, from: _renter });
        assert.fail('Expected revert not received');
      } catch (error) {
        const revertFound = error.message.search('revert') >= 0;
        assert(revertFound, `Expected "revert", got ${error} instead`);
      }
    });
  });
});