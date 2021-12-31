const helper = require("./helpers/truffleTestHelper");
const truffleAssert = require("truffle-assertions");

const NFT = artifacts.require("NFT");

let baseTokenURI = 'http://my_test_nft.org/tokens/';
let transferInterval = 60;
let tokenId = 1;

contract("NFT", accounts => {
    it("after mintWithTokenURI the tokenId of minted nft can transfer", () => {
        let nft;
        let account_one = accounts[0];
        let account_two = accounts[1];

        return NFT.deployed()
            .then(instance => {
                nft = instance;
                return nft.mintWithTokenURI(account_one, tokenId, baseTokenURI + tokenId);
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
})

contract("NFT", accounts => {
    it("after interval time transfer allowed", () => {
        let nft;
        let account_one = accounts[0];
        let account_two = accounts[1];

        return NFT.deployed()
            .then(instance => {
                nft = instance;
                return nft.mintWithTokenURI(account_one, tokenId, baseTokenURI + tokenId);
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
})

contract("NFT", accounts => {
    it("in max transfer count test", () => {
        let nft;
        let account_one = accounts[0];
        let account_two = accounts[1];

        return NFT.deployed()
            .then(instance => {
                nft = instance;
                return nft.mintWithTokenURI(account_one, tokenId, baseTokenURI + tokenId);
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
})

contract("NFT", accounts => {
    it("out of max transfer count test", () => {
        let nft;
        let account_one = accounts[0];
        let account_two = accounts[1];

        return NFT.deployed()
            .then(instance => {
                nft = instance;
                return nft.mintWithTokenURI(account_one, tokenId, baseTokenURI + tokenId);
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
                    "Returned error: VM Exception while processing transaction: revert Transfer too many: token has been transfer by 2 times, maxTransferCount=2",
                    "should be error when transfer reached max transfer count"
                );
            })
    })
})

contract("NFT", accounts => {
    it("test IssueTransferAllowed=false", () => {
        let nft;
        let account_one = accounts[0];
        let account_two = accounts[1];

        return NFT.deployed()
            .then(instance => {
                nft = instance;
                return nft.setIssueTransferAllowed(false)
            })
            .then(() => {
                return nft.mintWithTokenURI(account_one, tokenId, baseTokenURI + tokenId);
            })
            .then(async () => {
                try {
                    await nft.transferFrom(account_one, account_two, tokenId);
                } catch (error) {
                    assert.isOk(error.toString().includes("Transfer too fast"), "should throw Transfer too fast exception")
                }
            })
    })
})

contract("NFT", accounts => {
    it("test MaxTransferCount=0", () => {
        let nft;
        let account_one = accounts[0];
        let account_two = accounts[1];

        return NFT.deployed()
            .then(instance => {
                nft = instance;
                return nft.setMaxTransferCount(0);
            })
            then(() => {
                return nft.mintWithTokenURI(account_one, tokenId, baseTokenURI + tokenId);
            })
            .then(() => {
                return nft.transferFrom(account_one, account_two, tokenId);
            })
            .then(() => {return helper.advanceTime(transferInterval);})
            .then(() => {
                return nft.transferFrom(account_two, account_one, tokenId, {from: account_two});
            })
            .then(() => {return helper.advanceTime(transferInterval);})
            .then(() => {
                return nft.transferFrom(account_one, account_two, tokenId);
            })
            .then(() => {return helper.advanceTime(transferInterval);})
            .then(() => {
                return nft.transferFrom(account_two, account_one, tokenId, {from: account_two});
            })
            .then(() => {return helper.advanceTime(transferInterval);})
            .then(() => {
                return nft.transferFrom(account_one, account_two, tokenId);
            })
            .then(() => {return helper.advanceTime(transferInterval);})
            .then(() => {
                return nft.transferFrom(account_two, account_one, tokenId, {from: account_two});
            })
    })
})

contract("NFT", accounts => {
    it("test TransferInterval=0", () => {
        let nft;
        let account_one = accounts[0];
        let account_two = accounts[1];

        return NFT.deployed()
            .then(instance => {
                nft = instance;
                return nft.setMaxTransferCount(0);
            })
            .then(() => {
                return nft.setTransferInterval(0);
            })
            .then(() => {
                return nft.mintWithTokenURI(account_one, tokenId, baseTokenURI + tokenId);
            })
            .then(() => {
                return nft.transferFrom(account_one, account_two, tokenId);
            })
            .then(() => {
                return nft.transferFrom(account_two, account_one, tokenId, {from: account_two});
            })
            .then(() => {
                return nft.transferFrom(account_one, account_two, tokenId);
            })
            .then(() => {
                return nft.transferFrom(account_two, account_one, tokenId, {from: account_two});
            })
            .then(() => {
                return nft.transferFrom(account_one, account_two, tokenId);
            })
            .then(() => {
                return nft.transferFrom(account_two, account_one, tokenId, {from: account_two});
            })
    })
})