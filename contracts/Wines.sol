pragma solidity >=0.6.0 <0.8.0;

import "./ERC721.sol";

contract Wines is ERC721 {
    constructor(string memory name, string memory symbol) ERC721(name, symbol) public {}

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
