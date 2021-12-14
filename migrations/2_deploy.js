const Wines = artifacts.require("node_modules/@openzeppelin/contracts/build/Wines");

module.exports = function(deployer) {
    deployer.deploy(Wines, "My NFT","NFT", "https://my-server/nftdemo/tokens/");
};
