pragma solidity >=0.6.0 <0.8.0;

import "./ERC721.sol";
import "./Strings.sol";

contract NFT is ERC721 {
    using Strings for uint256;

    bool private issueTransferAllowed;
    uint256 private maxTransferCount;
    uint256 private transferInterval;

    struct TokenTransferState {
        uint256 lastTransferTimestamp;
        uint256 transferCount;
        bool isValid;
    }

    mapping(uint256 => TokenTransferState) private tokenTransferStates;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) public {}

    function mintNFT(address to, uint256 tokenId, string memory tokenURI) public
    {
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

    function burnNFT(uint256 tokenId) public
    {
        _burn(tokenId);
    }

    function _transfer(address from, address to, uint256 tokenId) internal override {
        super._transfer(from, to, tokenId);
        updateTransferState(tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override {
        if (from == address(0)) { // mint
            if (issueTransferAllowed) {
                tokenTransferStates[tokenId] = TokenTransferState(0, 0, true);
            } else {
                tokenTransferStates[tokenId] = TokenTransferState(now, 0, true);
            }
        } else if(to == address(0)) { // burn
            tokenTransferStates[tokenId].isValid = false;
            delete tokenTransferStates[tokenId];
        } else { // transfer
            checkTokenTransferState(tokenId);
        }
    }

    function checkTokenTransferState(uint256 tokenId) public {
        TokenTransferState memory tts = tokenTransferStates[tokenId];

        require(tts.isValid, string(abi.encodePacked("tokenId[", tokenId.toString(), "]'s TokenTransferState not exist")));
        require(tts.transferCount <= maxTransferCount, string(abi.encodePacked("out of maxTransferCount=", maxTransferCount.toString())));

        require(
            (now > tts.lastTransferTimestamp) && ((now - tts.lastTransferTimestamp) > transferInterval),
            string(abi.encodePacked(
                "now(",
                now.toString(),
                ")-lastTransferTimestamp(",
                tts.lastTransferTimestamp.toString(),
                "<=transferInterval(",
                transferInterval,
                ")"
            ))
        );
    }

    function updateTransferState(uint256 tokenId) private {
        tokenTransferStates[tokenId].lastTransferTimestamp = now;
        tokenTransferStates[tokenId].transferCount++;
    }
}
