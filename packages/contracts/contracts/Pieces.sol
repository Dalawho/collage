// SPDX-License-Identifier: MIT
// Add royalty

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
    
    event ArtworkAdded(uint256 indexed id, string name, Layer layer,  string collection, string category);
    event TokenBurned(uint256 indexed id); 

    error payRightAmount();
    error notBurnAllowed();
    error toManyTokens();

    struct Layer {
        address creator;
        uint8 maxSupply;
        uint8 supplyMinted;
        uint8 royalties;
        uint8 maxPerWallet;
        uint64 price;
    }

    IRender public render;
    address public burnerAllowed;
    uint256 public ADD_ARTWORK_PRICE ; 
    uint256 public constant MAX_LAYERS = 8;

    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

    Layer[] public layers;
    mapping(uint256 => address) public royaltyReciever; 

    function initialize() initializer public {
        __ERC1155_init("Pieces");
        __ERC1155Burnable_init();
        __Ownable_init();
        __ERC1155Supply_init();
        layers.push(Layer(address(0),0,0,0,0,0));
        ADD_ARTWORK_PRICE = 0.01 ether;
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

    function setAddArtworkPrice(uint256 newPrice) public onlyOwner {
        ADD_ARTWORK_PRICE = newPrice;
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
        address _royaltyReciever = royaltyReciever[id];

        payable(_royaltyReciever == address(0) ? layers[id].creator : _royaltyReciever).transfer(msg.value);
    }

    function getPriceAndBurn(uint8[MAX_LAYERS] calldata layerIds)
        public
        returns (uint256 totalPrice)
    {
        for(uint id; id < MAX_LAYERS; id++) {
            if(layerIds[id] == 0) continue;
            Layer memory _layer = layers[layerIds[id]];
            if(_layer.supplyMinted + 1 > _layer.maxSupply) revert toManyTokens();
            layers[layerIds[id]].supplyMinted += 1;
            totalPrice += uint256(_layer.price);
        }
    }

    function getPrice(uint8[MAX_LAYERS] calldata layerIds)
        public view
        returns (uint256 totalPrice)
    {
        for(uint id; id < MAX_LAYERS; id++) {
            if(layerIds[id] == 0) continue;
            Layer memory _layer = layers[layerIds[id]];
            totalPrice += uint256(_layer.price);
        }
    }

    function createToken(uint8 maxSupply, uint8 _maxPerWallet, uint64 price, uint8 mintAmount, bytes memory data, uint16 destLen, string memory name, uint8 royalties, address _royaltyReciever, address _mintTo, string memory collection, string memory category)
        public payable
    {
        //check if user payed
        if(msg.value != ADD_ARTWORK_PRICE) revert payRightAmount();
        //check whether data is valid gfx data

        //add layer
        
        uint256 _tokenId = layers.length; 
        Layer memory _layer = Layer(msg.sender, maxSupply, 0, royalties, _maxPerWallet, price);
        layers.push(_layer);
        //saveData
        render.addToken(data, destLen, name);
        if(_royaltyReciever != address(0)) {
            royaltyReciever[_tokenId] = _royaltyReciever;
        }
        emit ArtworkAdded(_tokenId, name, _layer, collection, category);
        if(mintAmount > 0){
            if(_mintTo == address(0)) { _mint(msg.sender, _tokenId, mintAmount, bytes("0")); }
            else { _mint(_mintTo, _tokenId, mintAmount, bytes("0")); } 
            layers[_tokenId].supplyMinted += mintAmount;
        } 
    }

    function tokenURI(uint256 tokenId) public view returns(string memory) {
        return render.tokenURI(tokenId);
    }

    function getLayerData(uint256 tokenId) external view returns(Layer memory, address) {
        return (layers[tokenId], royaltyReciever[tokenId]);
    } 

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155Upgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId) || (interfaceId == _INTERFACE_ID_ERC2981);
    }

    function royaltyInfo(uint256 _tokenId, uint256 _salePrice ) 
        external view 
        returns (address receiver, uint256 royaltyAmount) 
    {
        Layer memory _currentLayer = layers[_tokenId];
        address _royaltyReciever = royaltyReciever[_tokenId];
        return (_royaltyReciever == address(0) ? _currentLayer.creator : _royaltyReciever, (_salePrice*_currentLayer.royalties/10)/100);
    }

    function burn(
        address account,
        uint256 id,
        uint256 value
    ) public override  {
        if(msg.sender != burnerAllowed) revert notBurnAllowed();
        _burn(account, id, value);
        emit TokenBurned(id);
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC1155Upgradeable, ERC1155SupplyUpgradeable)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
    
}
