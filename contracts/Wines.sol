pragma solidity ^0.8.0;

import "./ERC721URIStorage.sol";

contract Wines is ERC721URIStorage {
    constructor(string memory name, string memory symbol, string memory baseURI) ERC721(name, symbol) {}

    function issueWineNFT(address to, uint256 tokenId, string memory tokenURI) public
    {
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

    function burnWineNFT(uint256 tokenId) public
    {
        _burn(tokenId);
    }
}
