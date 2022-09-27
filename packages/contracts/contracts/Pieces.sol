// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

interface IRender {
    function tokenURI(uint256 tokenId) external view returns(string memory); 
    function addToken(bytes memory _data, uint16 destLen, string memory name) external;
}


contract Pieces is ERC1155, AccessControl, ERC1155Burnable {
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    error payRightAmount();

    struct Layer {
        address creator;
        uint16 maxSupply;
        uint80 price;
    }

    IRender public render;

    Layer[] layers;

    constructor() ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(URI_SETTER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        layers.push(Layer(msg.sender,0,0));
    }

    function setBurner(address newBurner) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(BURNER_ROLE, newBurner);
    }

    function setURI(string memory newuri) public onlyRole(URI_SETTER_ROLE) {
        _setURI(newuri);
    }

    function setRender( address _newRender) public onlyRole(DEFAULT_ADMIN_ROLE) {
        render = IRender(_newRender);
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        payable
    {
        if(msg.value != amount*uint256(layers[id].price)) revert payRightAmount();
        _mint(account, id, amount, data);
    }

    function createToken(uint16 maxSupply, uint80 price, bytes memory data, uint16 destLen, string memory name)
        public
    {
        //check whether data is valid gfx data
        //add layer
        layers.push(Layer(msg.sender, maxSupply, price));
        //saveData
        render.addToken(data, destLen, name);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyRole(MINTER_ROLE)
    {
        _mintBatch(to, ids, amounts, data);
    }

    function tokenURI(uint256 tokenId) public view returns(string memory) {
        return render.tokenURI(tokenId);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function burn(
        address account,
        uint256 id,
        uint256 value
    ) public override onlyRole(BURNER_ROLE) {

        _burn(account, id, value);
    }
}
