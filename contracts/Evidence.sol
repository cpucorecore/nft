pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "./SafeMath.sol";

contract Evidence {
    using SafeMath for uint256;

    mapping(uint256 => string[]) private tokenId2txIds;
    mapping(uint256 => string[]) private tokenId2exts;

    function saveReceipt(uint256 tokenId, string memory txId, string memory ext) public {
        string[] storage txIds = tokenId2txIds[tokenId];
        txIds.push(txId);

        string[] storage exts = tokenId2exts[tokenId];
        exts.push(ext);
    }

    function batchSaveReceipt(uint256 startTokenId, uint256 count, string memory txId, string memory ext) public {
        uint256 tokenId = 0;
        uint256 i = 0;
        for (i = 0; i < count; i++) {
            tokenId = startTokenId.add(i);
            saveReceipt(tokenId, txId, ext);
        }
    }

    function getTxIds(uint256 tokenId) public view returns (string[] memory) {
        return tokenId2txIds[tokenId];
    }

    function getTxIdByIndex(uint256 tokenId, uint256 index) public view returns (string memory) {
        require(index < getCount(tokenId), "index out of range");
        return tokenId2txIds[tokenId][index];
    }

    function getExts(uint256 tokenId) public view returns (string[] memory) {
        return tokenId2exts[tokenId];
    }

    function getExtByIndex(uint256 tokenId, uint256 index) public view returns (string memory) {
        require(index < getCount(tokenId), "index out of range");
        return tokenId2exts[tokenId][index];
    }

    function getCount(uint256 tokenId) public view returns (uint256) {
        return tokenId2txIds[tokenId].length;
    }
}
