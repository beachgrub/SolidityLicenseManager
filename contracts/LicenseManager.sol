pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title LicenseManager
 * @dev purpose: to manage the licences for assets via rental agreement
 */
contract LicenseManager is ERC721Token, Ownable {
    using SafeMath for uint256;
    string public name = 'LicenseManager';
    // Cost to rent a license for a day in wei
    uint256 public dailyLicenseCost;

    // Mapping from license ID to license holder
    // It will be the owner if not currently licensed
    mapping (uint256 => address) private licenseHolder;

    // Mapping from license ID to release time if held by licensor
    mapping (uint256 => uint256) private licReleaseTime;


    // Constructor
    function LicenseManager() public {
        // Initial cost in wei for a daily license
        dailyLicenseCost = 1000;
    }

    /**
    * @dev Function to create a new license and add it to the owner
    * @param _licenseId The id of license to mint.
    * @return A boolean that indicates if the operation was successful.
    */
    function createLicense(uint256 _licenseId) onlyOwner public returns (bool) {
        // Make sure this token has not already owned
        require(ownerOf(_licenseId) == address(0));
        _mint(msg.sender, _licenseId);
        return true;
    }

    /**
    * @dev Releases license held by licensor once the time has expired.
    * @param _licenseId The id of license to mint.
    */
    function releaseLicense(uint256 _licenseId) public {
        // There is a license holder
        require(licenseHolder[_licenseId] != address(0));
        require(now >= licReleaseTime[_licenseId]);

        // Clear out the license
        licenseHolder[_licenseId] = address(0);
    }

    /**
    * @dev Obtain a license held by licensor once the time has expired.
    * @param _licenseId The id of license to mint.
    * @param _daysOfLicense How many days you wish to hold it.
    * requires the transaction sends funds for number of days times the daily cost
    */
    function obtainLicense(uint256 _licenseId, uint256 _daysOfLicense) public payable {
        // There is a license owner
        require(ownerOf(_licenseId) != address(0));
        // The correct funds are sent
        require(msg.value == _daysOfLicense * dailyLicenseCost);
        // check if license can be released
        releaseLicense(_licenseId);
        // make sure no one holds license already
        require(licenseHolder[_licenseId] == address(0));

        // if the funds were sent to owner
        if (ownerOf(_licenseId).send(msg.value)) {
            // Grant the license
            licenseHolder[_licenseId] = msg.sender;
            licReleaseTime[_licenseId] = now + (_daysOfLicense * 1 days);
		}
    }

    /**
    * @dev Gets the licenseHolder of the specified license
    * @param _licenseId uint256 ID of the license to query the licenseHolder of
    * @return owner address currently marked as the licenseHolder of the given license ID
    */
    function getLicenseHolder(uint256 _licenseId) public view returns (address) {
        address holder = licenseHolder[_licenseId];
        require(holder != address(0));
        return holder;
    }

    /**
    * @dev Gets the time left on the license of the specified license
    * @param _licenseId uint256 ID of the license to query the timeleft
    * @return time left in clocks
    */
    function getLicenseTimeLeft(uint256 _licenseId) public view returns (uint256) {
        address holder = licenseHolder[_licenseId];
        require(holder != address(0));
        return (licReleaseTime[_licenseId] - now);
    }

}