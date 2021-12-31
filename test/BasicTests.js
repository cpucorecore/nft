const truffleAssert = require("truffle-assertions");

const NFT = artifacts.require("NFT");

contract("NFT", accounts => {
    let baseTokenURI = 'http://my_test_nft.org/tokens/';

    it("total supply should be 0", () =>
        NFT.deployed()
            .then(instance => instance.totalSupply.call())
            .then(totalSupply => {
                assert.equal(
                    totalSupply.valueOf(),
                    0,
                    "total supply not be 0"
                )
            })
    )

    it("name test", () =>
    NFT.deployed()
        .then(instance => instance.name.call())
        .then(name => {
            assert.equal(
                name.valueOf(),
                "my_nft_name",
                "wrong name"
            )
        })
    )

    it("symbol test", () =>
        NFT.deployed()
            .then(instance => instance.symbol.call())
            .then(name => {
                assert.equal(
                    name.valueOf(),
                    "my_nft_symbol",
                    "wrong symbol"
                )
            })
    )

    it("after mint 1 nft then burn 1 nft", () => {
        let nft;
        let token1URI = baseTokenURI + '1';

        return NFT.deployed()
            .then(instance => {
                nft = instance;
                return nft.mintWithTokenURI(accounts[0], 1, token1URI);
            })
            .then(() => nft.totalSupply.call())
            .then(totalSupply => {
                assert.equal(
                    totalSupply.valueOf(),
                    1,
                    "total supply not be 1"
                )
                return nft.tokenURI.call(1)
            })
            .then(tokenURI => {
                assert.equal(
                    tokenURI,
                    token1URI,
                    "wrong token1URI"
                )
                return nft.ownerOf.call(1)
            })
            .then(token1Owner => {
                assert.equal(
                    token1Owner,
                    accounts[0],
                    "wrong owner"
                )
                return nft.balanceOf.call(accounts[0])
            })
            .then(balance => {
                assert.equal(
                    balance.valueOf(),
                    1,
                    "wrong balance"
                )
                return nft.burn(1)
            })
            .then(() => nft.totalSupply.call())
            .then(totalSupply => {
                assert.equal(
                    totalSupply.valueOf(),
                    0,
                    "wrong totalSupply"
                )
            })
            .then(async () => {
                await truffleAssert.fails(
                    nft.ownerOf(1),
                    truffleAssert.ErrorType.REVERT,
                    "Returned error: VM Exception while processing transaction: revert ERC721: owner query for nonexistent token",
                    "should be error when query a non existed tokenId"
                );
            })
    })
})