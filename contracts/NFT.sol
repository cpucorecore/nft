pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "./ERC721.sol";
import "./Strings.sol";
import "./SafeMath.sol";

contract NFT is ERC721 {
    using Strings for uint256;
    using SafeMath for uint256;

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

    function mintWithTokenURI(address to, uint256 tokenId, string memory tokenURI) public {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

    function batchMintWithTokenURIs(address to, uint256 startTokenId, uint256 amount, string[] memory tokenURIs) public {
        require(0 != amount, "amount can not be zero");
        require(amount == tokenURIs.length, "the length of tokenURIs not equal amount");
        uint256 i=0;
        for(i=0; i<amount; i++) {
            uint256 tokenId = startTokenId.add(i);
            mintWithTokenURI(to, tokenId, tokenURIs[i]);
        }
    }

    function burn(uint256 tokenId) public {
        _burn(tokenId);
    }

    function exists(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId);
    }

    function setBaseURI(string memory baseURI_) public {
        _setBaseURI(baseURI_);
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

    function checkTokenTransferState(uint256 tokenId) public view{
        TokenTransferState memory tts = _tokenTransferStates[tokenId];

        require(tts.isValid, string(abi.encodePacked("tokenId[", tokenId.toString(), "]'s TokenTransferState not exist")));
        require(
            0 == _maxTransferCount || tts.transferCount < _maxTransferCount,
            string(abi.encodePacked(
                "Transfer too many: token has been transfer by ",
                tts.transferCount.toString(),
                " times, maxTransferCount=",
                _maxTransferCount.toString())
            )
        );

        require(
            (0 == _transferInterval || (now > tts.lastTransferTimestamp) && ((now - tts.lastTransferTimestamp) >= _transferInterval)),
            string(abi.encodePacked(
                "Transfer too fast: [now(",
                now.toString(),
                ")-lastTransferTimestamp(",
                tts.lastTransferTimestamp.toString(),
                ")<=transferInterval(",
                _transferInterval.toString(),
                ")]"
            ))
        );
    }

    function updateTransferState(uint256 tokenId) private {
        _tokenTransferStates[tokenId].lastTransferTimestamp = now;
        _tokenTransferStates[tokenId].transferCount = _tokenTransferStates[tokenId].transferCount.add(1);
    }

    function setIssueTransferAllowed(bool issueTransferAllowed_) public {
        _issueTransferAllowed = issueTransferAllowed_;
    }

    function issueTransferAllowed() public view returns(bool) {
        return _issueTransferAllowed;
    }

    function setMaxTransferCount(uint256 maxTransferCount_) public {
        _maxTransferCount = maxTransferCount_;
    }

    function maxTransferCount() public view returns(uint256) {
        return _maxTransferCount;
    }

    function setTransferInterval(uint256 transferInterval_) public {
        _transferInterval = transferInterval_;
    }

    function transferInterval() public view returns(uint256) {
        return _transferInterval;
    }

    function lastTransferTimestamp(uint256 tokenId) public view returns(uint256) {
        TokenTransferState memory tts = _tokenTransferStates[tokenId];
        require(tts.isValid, "tokenId not exist");
        return tts.lastTransferTimestamp;
    }

    function transferCount(uint256 tokenId) public view returns(uint256) {
        TokenTransferState memory tts = _tokenTransferStates[tokenId];
        require(tts.isValid, "tokenId not exist");
        return tts.transferCount;
    }
}
