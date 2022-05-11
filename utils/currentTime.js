async function currentTime() {
 const blockNumber = await ethers.provider.getBlockNumber();
 const { timestamp } = await ethers.provider.getBlock(blockNumber);

 return timestamp;
}

module.exports = currentTime