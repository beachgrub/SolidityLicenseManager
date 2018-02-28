pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title LicenseManager
 * @dev purpose: to manage the licences for assets via rental agreement
 */
contract LicenseManager is ERC721Token, Ownable {
    using SafeMath for uint256;

    // Mapping from license ID to license holder
    // It will be the owner if not currently licensed
    mapping (uint256 => address) private licenseHolder;

    // Mapping from license ID to release time if held by licensor
    mapping (uint256 => uint256) private licReleaseTime;

    // Mapping from license ID to rental rate in wei (0 = not for rent)
    mapping (uint256 => uint256) private dailyLicenseRate;

    // Holds the accumulated rent of the owners
    mapping (address => uint256) private ownerBalances;

    // Constructor
    function LicenseManager() public {
    }

    /**
    * @dev Function to create a new license and add it to the owner
    * @param _licenseId The id of license to mint.
    * @return A boolean that indicates if the operation was successful.
    */
    function createLicense(uint256 _licenseId) onlyOwner public returns (bool) {
        _mint(msg.sender, _licenseId);
        licenseHolder[_licenseId] = msg.sender;
        return true;
    }

    /**
    * @dev Releases license held by licensor once the time has expired.
    * @param _licenseId The id of license to release.
    * @return A boolean that indicates if the operation was successful.
    */
    function releaseLicense(uint256 _licenseId) public returns (bool) {
        // There is a license holder
        require(licenseHolder[_licenseId] != address(0));
        // The time has expired
        require(now >= licReleaseTime[_licenseId]);
        // Clear out the license
        licenseHolder[_licenseId] = ownerOf(_licenseId);
        return true;
    }

    /**
    * @dev Set the rate for rental of the license in wei.
    * @param _licenseId The id of license to rent.
    * @return A boolean that indicates if the operation was successful.
    */
    function setLicenseRate(uint256 _licenseId, uint256 rate) public returns (bool) {
        // Sender is license owner
        require(ownerOf(_licenseId) == msg.sender);
        // Set the license rate
        dailyLicenseRate[_licenseId] = rate;
        return true;
    }

    /**
    * @dev Obtain a license held by licensor once the time has expired.
    * @param _licenseId The id of license to mint.
    * @param _daysOfLicense How many days you wish to hold it.
    * requires the transaction sends funds for number of days times the daily cost
    */
    function obtainLicense(uint256 _licenseId, uint256 _daysOfLicense) public payable returns (bool) {
        require(_daysOfLicense > 0);
        // There is a license owner
        require(ownerOf(_licenseId) != address(0));
        require(dailyLicenseRate[_licenseId] > 0);
        // check if license can be released
        releaseLicense(_licenseId);
        // make sure no one holds license already (owner holds)
        require(licenseHolder[_licenseId] == ownerOf(_licenseId));
        // The correct funds are sent
        require(msg.value == _daysOfLicense * dailyLicenseRate[_licenseId]);

        // Credit the funds to the owner
        ownerBalances[ownerOf(_licenseId)] = msg.value;
        // Grant the license
        licenseHolder[_licenseId] = msg.sender;
        licReleaseTime[_licenseId] = now + (_daysOfLicense * 1 days);
        return true;
    }

    /**
    * @dev Allows a user to withdraw any balance granted to them by licenses.
    */
    function withdrawBalance() public {
        address payee = msg.sender;
        uint256 payment = ownerBalances[payee];
        require(payment != 0);
        require(this.balance >= payment);
        ownerBalances[payee] = 0;
        assert(payee.send(payment));
    }

    /**
    * @dev Query the current balance of a owner.
    * @return current balance in wei    
    */
    function getBalance() public view returns (uint256) {
        return ownerBalances[msg.sender];
    }

    /**
    * @dev Gets the licenseHolder of the specified license
    * @param _licenseId uint256 ID of the license to query the licenseHolder of
    * @return owner address currently marked as the licenseHolder of the given license ID
    */
    function getLicenseHolder(uint256 _licenseId) public view returns (address) {
        address holder = licenseHolder[_licenseId];
        return holder;
    }

    /**
    * @dev Gets the license daily rate
    * @param _licenseId uint256 ID of the license to query the rate of
    * @return daily rate in wei
    */
    function getLicenseRate(uint256 _licenseId) public view returns (uint256) {
        return (dailyLicenseRate[_licenseId]);
    }

    /**
    * @dev Gets the time left on the license of the specified license
    * @param _licenseId uint256 ID of the license to query the timeleft
    * @return time left in seconds
    */
    function getLicenseTimeLeft(uint256 _licenseId) public view returns (uint256) {
        if (licenseHolder[_licenseId] == ownerOf(_licenseId) || ownerOf(_licenseId) == address(0))
            return (0);
        return (licReleaseTime[_licenseId] - now);
    }

    /**
    * @dev Gets if license is available
    * @param _licenseId uint256 ID of the license to query
    * @return returns if this license is available
    */
    function isLicenseAvailable(uint256 _licenseId) public view returns (bool) {
        return (ownerOf(_licenseId) != address(0) && 
                ownerOf(_licenseId) == licenseHolder[_licenseId] && 
                dailyLicenseRate[_licenseId] > 0);
    }

    /**
    * @dev Gets if a user has a license
    * @param _holder address to query
    * @param _licenseId uint256 ID of the license to query
    * @return returns if this license is available
    */
    function hasLicense(address _holder, uint256 _licenseId) public view returns (bool) {
        require(ownerOf(_licenseId) != address(0));
        // This is the holder of the license and time has not expired.
        return (_holder == licenseHolder[_licenseId] && (licReleaseTime[_licenseId] - now) > 0);
    }
}