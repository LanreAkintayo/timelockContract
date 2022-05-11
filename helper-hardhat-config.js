const { ethers, network } = require("hardhat");

const networkConfig = {
  default: {
    name: "hardhat",
  },
  31337: {
    name: "localhost",

    4: {
      name: "rinkeby",
    },
  },
};






/**
 * Beware that due to the need of calling two separate ganache methods and rpc calls overhead
 * it's hard to increase time precisely to a target point so design your test to tolerate
 * small fluctuations from time to time.
 *
 * @param target time in seconds
 */








module.exports = {
  networkConfig,
  developmentChains,
  increaseTimeTo,
 duration,
 currentTime,
  ether
};
