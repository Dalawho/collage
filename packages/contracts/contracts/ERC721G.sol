pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract ERC721G {

    // Standard ERC721 Events
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved,
        uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator,
        bool approved);

    // Standard ERC721 Global Variables
    string public name; // Token Name
    string public symbol; // Token Symbol

    // ERC721G Global Variables
    uint256 public tokenIndex; // The running index for the next TokenId
    /// @custom:oz-upgrades-unsafe-allow state-variable-immutable
    uint256 public immutable startTokenId; // Bytes Storage for the starting TokenId
    /// @custom:oz-upgrades-unsafe-allow state-variable-immutable
    uint256 public immutable maxBatchSize;

    /** @dev instructions:
     *  name_ sets the token name
     *  symbol_ sets the token symbol
     *  startId_ sets the starting tokenId (recommended 0-1)
     *  maxBatchSize_ sets the maximum batch size for each mint (recommended 5-20)
     */
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor(
    string memory name_, string memory symbol_, 
    uint256 startId_, uint256 maxBatchSize_) {
        name = name_;
        symbol = symbol_;
        tokenIndex = startId_;
        startTokenId = startId_;
        maxBatchSize = maxBatchSize_;
    }

    // ERC721G Structs
    struct OwnerStruct {
        address owner; // stores owner address for OwnerOf
        LayerStruct[4] layers;
    }

    struct LayerStruct {
        uint8 layerId;
        uint8 xOffset;
        uint8 yOffset;
    }

    struct BalanceStruct {
        uint32 balance; // stores the token balance of the address
        uint32 mintedAmount; // stores the minted amount of the address on mint
        uint32 allowListMinted;
        // 24 Free Bytes
    }

    // ERC721G Mappings
    mapping(uint256 => OwnerStruct) public _tokenData; // ownerOf replacement
    mapping(address => BalanceStruct) public _balanceData; // balanceOf replacement
    mapping(uint256 => OwnerStruct) public mintIndex; // uninitialized ownerOf pointer

    // ERC721 Mappings
    mapping(uint256 => address) public getApproved; // for single token approvals
    mapping(address => mapping(address => bool)) public isApprovedForAll; // approveall

    ///// ERC721G: ERC721-Like Simple Read Outputs /////
    function totalSupply() public virtual view returns (uint256) {
        return tokenIndex - startTokenId;
    }
    function balanceOf(address address_) public virtual view returns (uint256) {
        return _balanceData[address_].balance;
    }

    ///// ERC721G: Range-Based Logic /////
    
    /** @dev explanation:
     *  _getTokenDataOf() finds and returns either the (and in priority)
     *      - the initialized storage pointer from _tokenData
     *      - the uninitialized storage pointer from mintIndex
     * 
     *  if the _tokenData storage slot is populated, return it
     *  otherwise, do a reverse-lookup to find the uninitialized pointer from mintIndex
     */
    function _getTokenDataOf(uint256 tokenId_) public virtual view
    returns (OwnerStruct memory) {
        // The tokenId must be above startTokenId only
        require(tokenId_ >= startTokenId, "TokenId below starting Id!");
        
        // If the _tokenData is initialized (not 0x0), return the _tokenData
        if (_tokenData[tokenId_].owner != address(0)
            || tokenId_ >= tokenIndex) {
            return _tokenData[tokenId_];
        }

        // Else, do a reverse-lookup to find  the corresponding uninitialized pointer
        else { unchecked {
            uint256 _lowerRange = tokenId_;
            while (mintIndex[_lowerRange].owner == address(0)) { _lowerRange--; }
            return mintIndex[_lowerRange];
        }}
    }

    /** @dev explanation: 
     *  ownerOf calls _getTokenDataOf() which returns either the initialized or 
     *  uninitialized pointer. 
     *  Then, it checks if the token is staked or not through stakeTimestamp.
     *  If the token is staked, return the stakingAddress, otherwise, return the owner.
     */
    function ownerOf(uint256 tokenId_) public virtual view returns (address) {
        OwnerStruct memory _OwnerStruct = _getTokenDataOf(tokenId_);
        return _OwnerStruct.owner;
    }

    /** @dev explanation:
     *  _trueOwnerOf() calls _getTokenDataOf() which returns either the initialized or
     *  uninitialized pointer.
     *  It returns the owner directly without any checks. 
     *  Used internally for proving the staker address on unstake.
     */
    function _trueOwnerOf(uint256 tokenId_) public virtual view returns (address) {
        return _getTokenDataOf(tokenId_).owner;
    }

    ///// ERC721G: Internal Single-Contract Staking Logic /////
    
    /** @dev explanation:
     *  _initializeTokenIf() is used as a beginning-hook to functions that require
     *  that the token is explicitly INITIALIZED before the function is able to be used.
     *  It will check if the _tokenData slot is initialized or not. 
     *  If it is not, it will initialize it.
     *  Used internally for staking logic.
     */
    function _initializeTokenIf(uint256 tokenId_, OwnerStruct memory _OwnerStruct) 
    internal virtual {
        // If the target _tokenData is not initialized, initialize it.
        if (_tokenData[tokenId_].owner == address(0)) {
            _tokenData[tokenId_] = _OwnerStruct;
        }
    }

    /** @dev explanation:
     *  _setStakeTimestamp() is our staking / unstaking logic.
     *  If timestamp_ is > 0, the action is "stake"
     *  If timestamp_ is == 0, the action is "unstake"
     * 
     *  We grab the tokenData using _getTokenDataOf and then read its values.
     *  As this function requires INITIALIZED tokens only, we call _initializeTokenIf()
     *  to initialize any token using this function first.
     * 
     *  Processing of the function is explained in in-line comments.
     */


    ///// ERC721G Range-Based Internal Minting Logic /////
    
    /** @dev explanation:
     *  _mintInternal() is our internal batch minting logic. 
     *  First, we store the uninitialized pointer at mintIndex of _startId
     *  Then, we process the balances changes
     *  Finally, we phantom-mint the tokens using Transfer events loop.
     */
    function _mintInternal(address to_, uint256 amount_) internal virtual {
        // cannot mint to 0x0
        require(to_ != address(0), "ERC721G: _mintInternal to 0x0");

        // we limit max mints to prevent expensive gas lookup
        require(amount_ <= maxBatchSize, 
            "ERC721G: _mintInternal over maxBatchSize");

        // process the token id data
        uint256 _startId = tokenIndex;
        uint256 _endId = _startId + amount_;

        // push the required phantom mint data to mintIndex
        //mintIndex[_startId].owner = to_;
        //_tokenData[_startId] = OwnerStruct();
        _tokenData[_startId].owner = to_;
        
        // process the balance changes and do a loop to phantom-mint the tokens to to_
        unchecked { 
            _balanceData[to_].balance += uint32(amount_);
            _balanceData[to_].mintedAmount += uint32(amount_);

            do { emit Transfer(address(0), to_, _startId); } while (++_startId < _endId);
        }

        // set the new token index
        tokenIndex = _endId;
    }

    function _mintAndSet(address to_, uint256 amount_, uint8 layer, uint8 layerId, uint8 xOffset, uint8 yOffset) internal virtual {
        // cannot mint to 0x0
        require(to_ != address(0), "ERC721G: _mintInternal to 0x0");

        // we limit max mints to prevent expensive gas lookup
        require(amount_ <= maxBatchSize, 
            "ERC721G: _mintInternal over maxBatchSize");

        // process the token id data
        uint256 _startId = tokenIndex;
        uint256 _endId = _startId + amount_;

        // push the required phantom mint data to mintIndex
        //mintIndex[_startId].owner = to_;
        //OwnerStruct memory _owner = OwnerStruct(to_, [LayerStruct(0,0,0),LayerStruct(0,0,0),LayerStruct(0,0,0)], height, width);
        
        _tokenData[_startId].layers[layer] = LayerStruct(layerId, xOffset, yOffset);
        _tokenData[_startId].owner = to_;

        // process the balance changes and do a loop to phantom-mint the tokens to to_
        unchecked { 
            _balanceData[to_].balance += uint32(amount_);
            _balanceData[to_].mintedAmount += uint32(amount_);

            do { emit Transfer(address(0), to_, _startId); } while (++_startId < _endId);
        }

        // set the new token index
        tokenIndex = _endId;
    }

    /** @dev explanation:
     *  _mint() is the function that calls _mintInternal() using a while-loop
     *  based on the maximum batch size (maxBatchSize)
     */
    function _mint(address to_, uint256 amount_) internal virtual {
        uint256 _amountToMint = amount_;
        while (_amountToMint > maxBatchSize) {
            _amountToMint -= maxBatchSize;
            _mintInternal(to_, maxBatchSize);
        }
        _mintInternal(to_, _amountToMint);
    }

    /** @dev explanation:
     *  _transfer() is the internal function that transfers the token from_ to to_
     *  it has ERC721-standard require checks
     *  and then uses solmate-style approval clearing
     * 
     *  afterwards, it sets the _tokenData to the data of the to_ (transferee) as well as
     *  set the balanceData.
     *  
     *  this results in INITIALIZATION of the token, if it has not been initialized yet. 
     */
    function _transfer(address from_, address to_, uint256 tokenId_) internal virtual {
        // the from_ address must be the ownerOf
        require(from_ == ownerOf(tokenId_), "ERC721G: _transfer != ownerOf");
        // cannot transfer to 0x0
        require(to_ != address(0), "ERC721G: _transfer to 0x0");

        // delete any approvals
        delete getApproved[tokenId_];

        // set _tokenData to to_
        _tokenData[tokenId_].owner = to_;

        // update the balance data
        unchecked { 
            _balanceData[from_].balance--;
            _balanceData[to_].balance++;
        }

        // emit a standard Transfer
        emit Transfer(from_, to_, tokenId_);
    }

    /** @dev explanation:
     *  balanceOf of the address returns UNSTAKED tokens only.
     *  to get the total balance of the user containing both STAKED and UNSTAKED tokens,
     *  we use this function. 
     * 
     *  this is mainly for external view only.
     *  !! NOT TO BE INTERFACED WITH CONTRACT WRITE FUNCTIONS EVER.
     */
    function totalBalanceOf(address address_) public virtual view returns (uint256) {
        return balanceOf(address_);
    }

    ///// ERC721G: ERC721 Standard Logic /////
    /** @dev clarification:
     *  no explanations here as these are standard ERC721 logics.
     *  the reason that we can use standard ERC721 logics is because
     *  the ERC721G logic is compartmentalized and supports internally 
     *  these ERC721 logics without any need of modification.
     */
    function _isApprovedOrOwner(address spender_, uint256 tokenId_) internal 
    view virtual returns (bool) {
        address _owner = ownerOf(tokenId_);
        return (
            // "i am the owner of the token, and i am transferring it"
            _owner == spender_
            // "the token's approved spender is me"
            || getApproved[tokenId_] == spender_
            // "the owner has approved me to spend all his tokens"
            || isApprovedForAll[_owner][spender_]);
    }
    
    /** @dev clarification:
     *  sets a specific address to be able to spend a specific token.
     */
    function _approve(address to_, uint256 tokenId_) internal virtual {
        getApproved[tokenId_] = to_;
        emit Approval(ownerOf(tokenId_), to_, tokenId_);
    }

    function approve(address to_, uint256 tokenId_) public virtual {
        address _owner = ownerOf(tokenId_);
        require(
            // "i am the owner, and i am approving this token."
            _owner == msg.sender 
            // "i am isApprovedForAll, so i can approve this token too."
            || isApprovedForAll[_owner][msg.sender],
            "ERC721G: approve not authorized");

        _approve(to_, tokenId_);
    }

    function _setApprovalForAll(address owner_, address operator_, bool approved_) 
    internal virtual {
        isApprovedForAll[owner_][operator_] = approved_;
        emit ApprovalForAll(owner_, operator_, approved_);
    }
    function setApprovalForAll(address operator_, bool approved_) public virtual {
        // this function can only be used as self-approvalforall for others. 
        _setApprovalForAll(msg.sender, operator_, approved_);
    }

    function _exists(uint256 tokenId_) internal virtual view returns (bool) {
        return ownerOf(tokenId_) != address(0);
    }

    function transferFrom(address from_, address to_, uint256 tokenId_) public virtual {
        require(_isApprovedOrOwner(msg.sender, tokenId_),
            "ERC721G: transferFrom unauthorized");
        _transfer(from_, to_, tokenId_);
    }
    function safeTransferFrom(address from_, address to_, uint256 tokenId_,
    bytes memory data_) public virtual {
        transferFrom(from_, to_, tokenId_);
        if (to_.code.length != 0) {
            (, bytes memory _returned) = to_.call(abi.encodeWithSelector(
                0x150b7a02, msg.sender, from_, tokenId_, data_));
            bytes4 _selector = abi.decode(_returned, (bytes4));
            require(_selector == 0x150b7a02, 
                "ERC721G: safeTransferFrom to_ non-ERC721Receivable!");
        }
    }
    function safeTransferFrom(address from_, address to_, uint256 tokenId_) 
    public virtual {
        safeTransferFrom(from_, to_, tokenId_, "");
    }

    function supportsInterface(bytes4 iid_) public virtual view returns (bool) {
        ////add EIP5050
        return iid_ == 0x01ffc9a7 || iid_ == 0x80ac58cd || iid_ == 0x5b5e139f || iid_ == 0x7f5828d0 || iid_ == 0xc8c6c9f3 || iid_ == 0x1a3f02f4; 
    }

    function walletOfOwner(address address_) public virtual view 
    returns (uint256[] memory) {
        uint256 _balance = balanceOf(address_);
        uint256[] memory _tokens = new uint256[] (_balance);
        uint256 _currentIndex;
        uint256 i = startTokenId;
        while (_currentIndex < _balance) {
            if (ownerOf(i) == address_) { _tokens[_currentIndex++] = i; }
            unchecked { ++i; }
        }
        return _tokens;
    }

    function totalMinted(address address_) public virtual view returns(uint256) {
        return _balanceData[address_].mintedAmount;
    }

    function tokenURI(uint256 tokenId_) public virtual view returns (string memory) {}

}