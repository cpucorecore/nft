pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

contract Evidence {
    mapping(uint256 => bytes32[]) private tokenId2txIds;
    mapping(uint256 => string[]) private tokenId2exts;

    function saveReceipt(uint256 tokenId, bytes32 txId, string memory ext) public {
        bytes32[] storage txIds = tokenId2txIds[tokenId];
        txIds.push(txId);

        string[] storage exts = tokenId2exts[tokenId];
        exts.push(ext);
    }

    function getTxIds(uint256 tokenId) public view returns (bytes32[] memory) {
        return tokenId2txIds[tokenId];
    }

    function getExts(uint256 tokenId) public view returns (string[] memory) {
        return tokenId2exts[tokenId];
    }

    function getCount(uint256 tokenId) public view returns (uint256) {
        return tokenId2txIds[tokenId].length;
    }
}
