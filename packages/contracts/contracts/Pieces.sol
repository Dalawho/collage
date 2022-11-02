// SPDX-License-Identifier: MIT
// Add withdraw logic for artists

pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";

interface IRender {
    function tokenURI(uint256 tokenId) external view returns(string memory); 
    function addToken(bytes memory _data, uint16 destLen, string memory name) external;
}

contract Pieces is Initializable, ERC1155Upgradeable, OwnableUpgradeable, ERC1155BurnableUpgradeable, ERC1155SupplyUpgradeable {
    
    event ArtworkAdded(uint256 indexed id, address indexed creator, string name, uint80 price, uint16 maxSupply);

    error payRightAmount();
    error notBurnAllowed();
    error toManyTokens();

    struct Layer {
        address creator;
        uint8 maxSupply;
        uint8 supplyMinted;
        uint80 price;
    }

    IRender public render;
    address public burnerAllowed;

    Layer[] public layers;

    function initialize() initializer public {
        __ERC1155_init("Pieces");
        __ERC1155Burnable_init();
        __Ownable_init();
        __ERC1155Supply_init();
        layers.push(Layer(msg.sender,0,0,0));
    }

    function setBurner(address newBurner) public onlyOwner {
        burnerAllowed = newBurner;
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function setRender( address _newRender) public onlyOwner {
        render = IRender(_newRender);
    }

    function mint(address account, uint256 id, uint8 amount, bytes memory data)
        public
        payable
    {
        Layer memory _layer = layers[id];
        if(msg.value != amount*uint256(_layer.price)) revert payRightAmount();
        if(amount + _layer.supplyMinted > _layer.maxSupply) revert toManyTokens();
        layers[id].supplyMinted += amount;
        _mint(account, id, amount, data);
    }

    function getPriceAndBurn(uint8[4] calldata layerIds)
        public
        returns (uint256 totalPrice)
    {
        for(uint id; id < 4; id++) {
            if(layerIds[id] == 0) continue;
            Layer memory _layer = layers[layerIds[id]];
            if(_layer.supplyMinted + 1 > _layer.maxSupply) revert toManyTokens();
            layers[layerIds[id]].supplyMinted += 1;
            totalPrice += uint256(_layer.price);
        }
    }

    function getPrice(uint8[4] calldata layerIds)
        public view
        returns (uint256 totalPrice)
    {
        for(uint id; id < 4; id++) {
            if(layerIds[id] == 0) continue;
            Layer memory _layer = layers[layerIds[id]];
            totalPrice += uint256(_layer.price);
        }
    }

    function createToken(uint8 maxSupply, uint80 price, uint8 mintAmount, bytes memory data, uint16 destLen, string memory name)
        public
    {
        //check whether data is valid gfx data
        //add layer
        uint256 _tokenId = layers.length; 
        layers.push(Layer(msg.sender, maxSupply, 0, price));
        //saveData
        render.addToken(data, destLen, name);
        emit ArtworkAdded(_tokenId, msg.sender, name, price, maxSupply);
        if(mintAmount > 0){
            _mint(msg.sender, _tokenId, mintAmount, bytes("0"));
            layers[_tokenId].supplyMinted += mintAmount;
        } 
    }

    // function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
    //     public
    // {
    //     _mintBatch(to, ids, amounts, data);
    // }

    function tokenURI(uint256 tokenId) public view returns(string memory) {
        return render.tokenURI(tokenId);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155Upgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function burn(
        address account,
        uint256 id,
        uint256 value
    ) public override  {
        if(msg.sender != burnerAllowed) revert notBurnAllowed();
        _burn(account, id, value);
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC1155Upgradeable, ERC1155SupplyUpgradeable)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
