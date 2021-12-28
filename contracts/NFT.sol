pragma solidity >=0.6.0 <0.8.0;

import "./ERC721.sol";
import "./Strings.sol";

contract NFT is ERC721 {
    using Strings for uint256;

    bool private _issueTransferAllowed;
    uint256 private _maxTransferCount;
    uint256 private _transferInterval;

    struct TokenTransferState {
        uint256 lastTransferTimestamp;
        uint256 transferCount;
        bool isValid;
    }

    mapping(uint256 => TokenTransferState) private _tokenTransferStates;

    constructor(string memory name_, string memory symbol_, bool issueTransferAllowed_, uint256 maxTransferCount_, uint256 transferInterval_) ERC721(name_, symbol_) public {
        _issueTransferAllowed = issueTransferAllowed_;
        _maxTransferCount = maxTransferCount_;
        _transferInterval = transferInterval_;
    }

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
            if (_issueTransferAllowed) {
                _tokenTransferStates[tokenId] = TokenTransferState(0, 0, true);
            } else {
                _tokenTransferStates[tokenId] = TokenTransferState(now, 0, true);
            }
        } else if(to == address(0)) { // burn
            _tokenTransferStates[tokenId].isValid = false;
            delete _tokenTransferStates[tokenId];
        } else { // transfer
            checkTokenTransferState(tokenId);
        }
    }

    function checkTokenTransferState(uint256 tokenId) public {
        TokenTransferState memory tts = _tokenTransferStates[tokenId];

        require(tts.isValid, string(abi.encodePacked("tokenId[", tokenId.toString(), "]'s TokenTransferState not exist")));
        require(
            0 != _maxTransferCount && tts.transferCount < _maxTransferCount,
            string(abi.encodePacked(
                "token has been transfer by ",
                tts.transferCount.toString(),
                " times, maxTransferCount=",
                _maxTransferCount.toString())
            )
        );

        require(
            (now > tts.lastTransferTimestamp) && ((now - tts.lastTransferTimestamp) >= _transferInterval),
            string(abi.encodePacked(
                "now(",
                now.toString(),
                ")-lastTransferTimestamp(",
                tts.lastTransferTimestamp.toString(),
                ")<=transferInterval(",
                _transferInterval.toString(),
                ")"
            ))
        );
    }

    function updateTransferState(uint256 tokenId) private {
        _tokenTransferStates[tokenId].lastTransferTimestamp = now;
        _tokenTransferStates[tokenId].transferCount++;
    }
}
