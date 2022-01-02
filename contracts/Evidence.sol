pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

contract Evidence {
    mapping(uint256 => bytes32[]) private tokenId2txIds;

    function saveTxId(uint256 tokenId, bytes32 txId) public {
        bytes32[] storage txIds = tokenId2txIds[tokenId];
        txIds.push(txId);
    }

    function getTxIds(uint256 tokenId) public view returns (bytes32[] memory txIds) {
        return tokenId2txIds[tokenId];
    }
}
