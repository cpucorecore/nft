pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

contract Evidence {
    struct Receipt {
        bytes32 txId;
        string ext;
    }

    mapping(uint256 => Receipt[]) private tokenId2receipts;
    mapping(uint256 => uint256) private tokenId2receiptsCount;

    function saveReceipt(uint256 tokenId, bytes32 txId, string memory ext) public {
        Receipt[] storage receipts = tokenId2receipts[tokenId];
        Receipt memory receipt = Receipt(txId, ext);
        receipts.push(receipt);
        tokenId2receiptsCount[tokenId]++;
    }

    function getReceiptsCount(uint256 tokenId) public view returns (uint256) {
        return tokenId2receiptsCount[tokenId];
    }

    function getReceipt(uint256 tokenId, uint256 index) public view returns (Receipt memory receipts) {
        require(index < tokenId2receiptsCount[tokenId], "index out of range");
        return tokenId2receipts[tokenId][index];
    }
}
