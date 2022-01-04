const Evidence = artifacts.require("Evidence");

contract("Evidence", accounts => {

    it("Evidence test", () => {
        let evidence;
        let txId1 = "0xfd73d78160e163067451f8ae48109d64228d9d363fca25d004c95ed40689f725";
        let ext1 = "{\"k1\":\"v1\"}";
        let txId2 = "0x4ad1e53ed315fbf1b9c4c16f0b5e89e6da14ae193fb00d95c266f5554fc4b7d3";
        let ext2 = "{\"k1\":\"v1\",\"k2\":\"v2\"}";

        return Evidence.deployed()
            .then(instance => {
                evidence = instance;
                return evidence.saveReceipt(1, txId1, ext1);
            })
            .then(() => {
                return evidence.saveReceipt(1, txId2, ext2);
            })
            .then(() => {
                return evidence.getTxIds.call(1)
            })
            .then(value => {
                let txIds = value.valueOf();

                assert.equal(
                    txIds.length,
                    2,
                    "count err"
                );

                assert.equal(
                    txIds[0],
                    txId1,
                    "txId should be equal"
                );

                assert.equal(
                    txIds[1],
                    txId2,
                    "txId should be equal"
                );

                return evidence.getExts.call(1);
            })
            .then(value => {
                let exts = value.valueOf();

                assert.equal(
                    exts.length,
                    2,
                    "count err"
                );

                assert.equal(
                    exts[0],
                    ext1,
                    "ext should be equal"
                );

                assert.equal(
                    exts[1],
                    ext2,
                    "ext should be equal"
                );
            })
    })
})