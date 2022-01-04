
const Evidence = artifacts.require("Evidence");

contract("Evidence", accounts => {

    it("after mint 1 nft then burn 1 nft", () => {
        let evidence;
        let txId1 = "0xfd73d78160e163067451f8ae48109d64228d9d363fca25d004c95ed40689f725";
        let ext1 = "{\"k1\":\"v1\"}";
        let txId2 = "0x4ad1e53ed315fbf1b9c4c16f0b5e89e6da14ae193fb00d95c266f5554fc4b7d3";
        let ext2 = "{\"k1\":\"v1\"}";

        return Evidence.deployed()
            .then(instance => {
                evidence = instance;
                return evidence.saveReceipt(1, txId1, ext1);
            })
            .then(() => {
                return evidence.saveReceipt(1, txId2, ext2);
            })
            .then(() => evidence.getReceipts.call(1))
            .then(value => {
                let receipts = value.valueOf();

                assert.equal(
                    receipts.length,
                    2,
                    "total supply not be 1"
                );

                assert.equal(
                    receipts[0].txId,
                    txId1,
                    "txId should be equal"
                );

                assert.equal(
                    receipts[0].ext,
                    ext1,
                    "ext should be equal"
                )

                assert.equal(
                    receipts[1].txId,
                    txId2,
                    "txId should be equal"
                );

                assert.equal(
                    receipts[1].ext,
                    ext2,
                    "ext should be equal"
                )
            })
    })
})