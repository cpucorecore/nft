const helper = require("./helpers/truffleTestHelper");

const NFT = artifacts.require("NFT");

contract("NFT", accounts => {
    let baseTokenURI = 'http://my_test_nft.org/tokens/';

    it("after mintNFT the tokenId of minted nft can transfer", () => {
        let nft;
        let account_one = accounts[0];
        let account_two = accounts[1];

        return NFT.deployed()
            .then(instance => {
                nft = instance;
                return nft.mintNFT(account_one, 1, baseTokenURI + '1');
            })
            .then(() => {
                return nft.transferFrom(account_one, account_two, 1);
            })
            .then(() => {
                return nft.ownerOf.call(1);
            })
            .then(owner => {
                assert.equal(
                    owner,
                    account_two,
                    "wrong owner"
                )
            })
    })

    it("after interval time transfer allowed", () => {
        let nft;
        let account_one = accounts[0];
        let account_two = accounts[1];

        return NFT.deployed()
            .then(instance => {
                nft = instance;
                return nft.mintNFT(account_one, 10, baseTokenURI + '10');
            })
            .then(() => {
                return nft.transferFrom(account_one, account_two, 10);
            })
            .then(() => {
                web3.currentProvider
                return helper.advanceTime(60)
            })
            .then(() => {
                return nft.transferFrom(account_two, account_one, 10, {from: account_two});
            })
            .then(() => {
                return nft.ownerOf(10)
            })
            .then(owner => {
                assert.equal(
                    owner,
                    account_one,
                    "wrong owner"
                )
            })
    })
})