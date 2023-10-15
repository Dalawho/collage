require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");
const secret = require('./secret.json');
require("@nomiclabs/hardhat-etherscan");
require('@typechain/hardhat')
require('@nomiclabs/hardhat-ethers')
require('@openzeppelin/hardhat-upgrades');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        enabled: true,
        url: "https://eth-mainnet.alchemyapi.io/v2/HDTL1ubfVBzCD2IkhXNdk-kDB0mteTCG",
        blockNumber: 15508498
      }
    },
    rinkeby: 
    {
      url: secret.alchemyUrl,
      accounts: [secret.Key]
    },
    goerli: {
      url: secret.infuraUrl,
      accounts: [secret.Key]
    },
    mainnet: {
      url: secret.mainnetUrl,
      accounts: [secret.Key]
    }
  },
  gasReporter: {
    enabled: true,
    currency: 'EUR',
    gasPrice: 10,
    reporterOptions : {
    token: 'ETH',
    gasPriceApi: 'https://api.etherscan.io/api?module=proxy&action=eth_gasPrice'
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: 'RDD3Y9EIZADWPVM67ZYE8NTBMRT3SNNP1B'
  //}
   },
   typechain: {
     outDir: 'src/types',
     target: 'ethers-v5',
     alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
     dontOverrideCompile: false // defaults to false
   },
};


