# LicenseManager

Smart contract based on ERC721 token standard for creating licenced items.

### Overview

This contract represents a license manager that the owner to create licensable items and sell them.
These items can further be licensed (rented) by other users for a specified amount of time for specified rate.

### Usage

Contract Owner can create a license asset with:

    createLicense(LICENSE_ID)

These can be transfered to a new owner with:

    transfer(TO_ADDRESS, LICENSE_ID)

By default, licenses are can not be licensed until the daily license rate is set:

    isLicenseAvailable(LICENSE_ID) == false
    setLicenseRate(LICENSE_ID, RATE)
    isLicenseAvailable(LICENSE_ID) == true

A user can obtain a license by paying RATE*DURATION:

    obtainLicense(LICENSE_ID, DURATION)

Check if a user has a current valid license for an item:

    hasLicense(USER_ADDRESS, LICENSE_ID)

To check how long a license duration is for:

    getLicenseTimeLeft(LICENSE_ID)

This project and uses [truffle](https://github.com/trufflesuite/truffle) Ethereum smart contracts development framework. In order to run it, install truffle first:

    npm install -g truffle

It is also based on the standard zeppelin-solidity libraries (https://openzeppelin.org).  These are installed with the following:

    npm install zeppelin-solidity

### Running tests

To run all of the smart contract tests use following command in your console:

    truffle test

## Contributions

All comments, ideas for improvements and pull requests are welcomed.

## License

MIT License

Copyright (c) 2018 Darwin 3D, LLC. (Jeff Lander jeffl@darwin3d.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.