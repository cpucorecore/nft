const ERC721PresetMinterPauserAutoId = artifacts.require("node_modules/@openzeppelin/contracts/build/ERC721PresetMinterPauserAutoId");

module.exports = function(deployer) {
    deployer.deploy(ERC721PresetMinterPauserAutoId, "My NFT","NFT", "https://my-server/nftdemo/tokens/");
};