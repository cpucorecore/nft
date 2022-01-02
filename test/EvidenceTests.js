
const Evidence = artifacts.require("Evidence");

contract("Evidence", accounts => {

    it("after mint 1 nft then burn 1 nft", () => {
        let evidence;
        let txId1 = "0xfd73d78160e163067451f8ae48109d64228d9d363fca25d004c95ed40689f725";
        let txId2 = "0x4ad1e53ed315fbf1b9c4c16f0b5e89e6da14ae193fb00d95c266f5554fc4b7d3"

        return Evidence.deployed()
            .then(instance => {
                evidence = instance;
                return evidence.saveTxId(1, txId1);
            })
            .then(() => {
                return evidence.saveTxId(1, txId2);
            })
            .then(() => evidence.getTxIds.call(1))
            .then(value => {
                let txIds = value.valueOf();

                assert.equal(
                    txIds.length,
                    2,
                    "total supply not be 1"
                );

                assert.equal(
                    txIds[0],
                    txId1,
                    ""
                );

                assert.equal(
                    txIds[1],
                    txId2,
                    ""
                );
            })
    })
})