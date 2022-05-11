function ether(amount) {
 return ethers.utils.parseUnits(amount.toString(), "ether")
}

module.exports = ether
