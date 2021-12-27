const Wines = artifacts.require("build/contracts/NFT");

module.exports = function(deployer) {
    deployer.deploy(Wines, "NFT","NFT");
};
