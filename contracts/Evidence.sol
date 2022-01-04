pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

contract Evidence {
    struct Receipt {
        bytes32 txId;
        string ext;
    }

    mapping(uint256 => Receipt[]) private tokenId2receipts;

    function saveReceipt(uint256 tokenId, bytes32 txId, string memory ext) public {
        Receipt[] storage receipts = tokenId2receipts[tokenId];
        Receipt memory receipt = Receipt(txId, ext);
        receipts.push(receipt);
    }

    function getReceipts(uint256 tokenId) public view returns (Receipt[] memory receipts) {
        return tokenId2receipts[tokenId];
    }
}
