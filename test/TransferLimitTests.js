const helper = require("./helpers/truffleTestHelper");
const truffleAssert = require("truffle-assertions");

const NFT = artifacts.require("NFT");

contract("NFT", accounts => {
    let baseTokenURI = 'http://my_test_nft.org/tokens/';
    let transferInterval = 60;

    it("after mintNFT the tokenId of minted nft can transfer", () => {
        let nft;
        let tokenId = 1;
        let account_one = accounts[0];
        let account_two = accounts[1];

        return NFT.deployed()
            .then(instance => {
                nft = instance;
                return nft.mintNFT(account_one, tokenId, baseTokenURI + tokenId);
            })
            .then(() => {
                return nft.transferFrom(account_one, account_two, tokenId);
            })
            .then(() => {
                return nft.ownerOf.call(tokenId);
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
        let tokenId = 10;
        let account_one = accounts[0];
        let account_two = accounts[1];

        return NFT.deployed()
            .then(instance => {
                nft = instance;
                return nft.mintNFT(account_one, tokenId, baseTokenURI + tokenId);
            })
            .then(() => {
                return nft.transferFrom(account_one, account_two, tokenId);
            })
            .then(() => {
                return helper.advanceTime(transferInterval)
            })
            .then(() => {
                return nft.transferFrom(account_two, account_one, tokenId, {from: account_two});
            })
            .then(() => {
                return nft.ownerOf(tokenId)
            })
            .then(owner => {
                assert.equal(
                    owner,
                    account_one,
                    "wrong owner"
                )
            })
    })

    it("in max transfer count test", () => {
        let nft;
        let tokenId = 100;
        let account_one = accounts[0];
        let account_two = accounts[1];

        return NFT.deployed()
            .then(instance => {
                nft = instance;
                return nft.mintNFT(account_one, tokenId, baseTokenURI + tokenId);
            })
            .then(() => {
                return nft.transferFrom(account_one, account_two, tokenId);
            })
            .then(() => {
                return helper.advanceTime(transferInterval)
            })
            .then(() => {
                return nft.transferFrom(account_two, account_one, tokenId, {from: account_two});
            })
            .then(() => {
                return nft.ownerOf(tokenId)
            })
            .then(owner => {
                assert.equal(
                    owner,
                    account_one,
                    "wrong owner"
                )
            })
    })

    it("out of max transfer count test", () => {
        let nft;
        let tokenId = 1000;
        let account_one = accounts[0];
        let account_two = accounts[1];

        return NFT.deployed()
            .then(instance => {
                nft = instance;
                return nft.mintNFT(account_one, tokenId, baseTokenURI + tokenId);
            })
            .then(() => {
                return nft.transferFrom(account_one, account_two, tokenId);
            })
            .then(() => {
                return helper.advanceTime(transferInterval)
            })
            .then(() => {
                return nft.transferFrom(account_two, account_one, tokenId, {from: account_two});
            })
            .then(() => {
                return helper.advanceTime(transferInterval);
            })
            .then(async () => {
                await truffleAssert.reverts(
                    nft.transferFrom(account_one, account_two, tokenId),
                    "Returned error: VM Exception while processing transaction: revert token has been transfer by 2 times, maxTransferCount=2",
                    "should be error when transfer reached max transfer count"
                );
            })
    })
})