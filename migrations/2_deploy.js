const Wines = artifacts.require("build/contracts/NFT");

module.exports = function(deployer) {
    deployer.deploy(Wines, "my_nft_name", "my_nft_symbol", true, 2, 60);
};
