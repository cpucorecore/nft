const Evidence = artifacts.require("build/contracts/Evidence");

module.exports = function(deployer) {
    deployer.deploy(Evidence);
};
