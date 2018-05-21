/*
bankContract: JPMorgan Quorum smart contract implementing a private payment system. Must be deployed as a PRIVATE contract
*/

contract bankContract {

uint public balance=0;
address public thisBankContract;
bool public isRegulatorNode = false;
uint public confirmationTime = 60;

address public TransactionListAddress;
address public regulator;

//totalTransactions: counts all the transactions that the bank is part of, confirmed or not.
uint public totalTransactions = 0;

struct transaction {
    uint value;
    address senderContract;
    address destinationContract;
    bool confirmed;
    uint senderBalanceAtTransfer;
}

mapping (bytes32 => transaction) public transactions;
mapping (uint => bytes32) public transactionIDs;


modifier onlyRegulator() { 
    if (msg.sender != regulator) throw;_
} 

//This modifier ensures that the msg.sender is a valid bank contract address
modifier validSenderContract() { 
    regulatorTransactionList transactionListContractModifier = regulatorTransactionList(TransactionListAddress);
    if (!transactionListContractModifier.getBankExistance(msg.sender)) throw;_
} 

//This modifier ensures that the msg.sender is THE valid bank transaction address 
//It prevents bank impersonation attack
modifier authorizedSender() { 
    regulatorTransactionList transactionListContractModifier = regulatorTransactionList(TransactionListAddress);
    if (transactionListContractModifier.getBankSender(address(this))!= msg.sender) throw;_
} 

function bankContract() {
    regulator = msg.sender;
}

function setTransactionListAddress (address _contractAddress) onlyRegulator {
    TransactionListAddress = _contractAddress;
}

/* sendValue: creates a private transaction between banks. The transaction
is stored in the private transaction log that is only shared between the sender,
the receiver and the regulator. The transaction is created NOT CONFIRMED. In 
this state, no funds have changed hands. The funds are only moved and balances
updated if the transaction is CONFIRMED in a another function call, achieving finality
*/
function sendValue (address _destination , uint _value, string _random) authorizedSender {

    uint destinationTransactionID;
    bytes32 transactionID;

    regulatorTransactionList transactionListContract = regulatorTransactionList(TransactionListAddress);

    transactionID=sha3(address(this),_destination,_value,block.timestamp,_random);

    transactionIDs[totalTransactions]=transactionID;

    if ((!transactionListContract.getBankExistance(_destination)) || (!transactionListContract.getBankState(address(this)))) throw;

    bankContract destinationContract = bankContract(_destination);
    destinationContract.receiveValue(_value,_random);

    transactions[transactionID].value=_value;
    transactions[transactionID].senderContract=address(this);
    transactions[transactionID].destinationContract=_destination;
    transactions[transactionID].senderBalanceAtTransfer=balance;
    transactions[transactionID].confirmed=false;

    totalTransactions++;
}

/* receiveValue: creates a copy of the transaction created by the sendValue 
function in the recipient bank contract.
*/
function receiveValue (uint _value, string _random)  validSenderContract {

    bytes32 transactionID;

    transactionID=sha3(msg.sender,address(this),_value,block.timestamp,_random);

    transactionIDs[totalTransactions]=transactionID;

    transactions[transactionID].value=_value;
    transactions[transactionID].senderContract=msg.sender;
    transactions[transactionID].destinationContract=address(this);
    transactions[transactionID].confirmed=false;

    totalTransactions++;
}

function setRegulatorNode () onlyRegulator {
    isRegulatorNode=true;
}

function setBalance(uint _balance) onlyRegulator {
    balance=_balance;
}


function setConfirmationTime(uint _seconds) onlyRegulator  {
    confirmationTime=_seconds;
}

function setThisBankContract(address _thisBankContract) onlyRegulator {
    thisBankContract = _thisBankContract;
}

/*confirmTransactionRegulator: regulator exclusive function to confirm a 
transaction. The transaction MUST be in the public transaction log to be 
confirmed, even by the regulator. This ensures that every part is aware of the 
transaction or must report inconsistence to the regulator. Overdraft protection
was not possible because there is no consensus on private contracts.
Balances are updated on both contracts if all checks are successful.
*/
function confirmTransactionRegulator(bytes32 _transactionID) onlyRegulator {
    
    regulatorTransactionList transactionListContract = regulatorTransactionList(TransactionListAddress);
    
    if ((!transactions[_transactionID].confirmed)&&
    (!transactionListContract.getTransactionState(_transactionID))&&
    (transactionListContract.getTransactionExistance(_transactionID))) {
        transactions[_transactionID].confirmed=true;
    
        if (transactions[_transactionID].destinationContract == address(this)) {
            if ((transactions[_transactionID].destinationContract == thisBankContract) ||
            (isRegulatorNode)) {
                balance+=transactions[_transactionID].value;
            }
        bankContract senderContract = bankContract(transactions[_transactionID].senderContract);
                
        senderContract.confirmTransactionPair(_transactionID);
        }
        
        if (transactions[_transactionID].senderContract == address(this)) {
            if ((transactions[_transactionID].senderContract == thisBankContract) ||
            (isRegulatorNode)) {
                balance-=transactions[_transactionID].value;
            }
            bankContract destinationContract = bankContract(transactions[_transactionID].destinationContract);
                
            destinationContract.confirmTransactionPair(_transactionID);
        }
    }
}

/*confirmTransactionBank: bank exclusive function to confirm a 
transaction. A bank can only confirm a transaction after the confirmationTime
seconds has passed. The transaction MUST be in the public transaction log to be 
confirmed. This ensures that every part is aware of the 
transaction or must report inconsistence to the regulator. Overdraft protection
was not possible because there is no consensus on private contracts.
Balances are updated on both contracts if all checks are successful.
*/
function confirmTransactionBank(bytes32 _transactionID) authorizedSender {
    
    regulatorTransactionList transactionListContract = regulatorTransactionList(TransactionListAddress);
    
    if ((block.timestamp-transactionListContract.getTransactionTimestamp(_transactionID) > confirmationTime) &&
        (!transactions[_transactionID].confirmed)&&
        (!transactionListContract.getTransactionState(_transactionID))&&
        (transactionListContract.getTransactionExistance(_transactionID))){
        
        if (transactions[_transactionID].senderContract == address(this)) {
            transactions[_transactionID].confirmed=true;
            if ((transactions[_transactionID].senderContract == thisBankContract) ||
            (isRegulatorNode)) 
                balance-=transactions[_transactionID].value;
                
            bankContract destinationContract = bankContract(transactions[_transactionID].destinationContract);
            
            destinationContract.confirmTransactionPair(_transactionID);
        }
            
    }
}

/*confirmTransactionPair: updates the balance of the other leg of the 
transaction. Can only be called by a bank contract address
*/
function confirmTransactionPair(bytes32 _transactionID) validSenderContract {

    if (!transactions[_transactionID].confirmed) {
        transactions[_transactionID].confirmed=true;
    
        if (transactions[_transactionID].destinationContract == address(this))
            if ((transactions[_transactionID].destinationContract == thisBankContract)||(isRegulatorNode)) 
                balance+=transactions[_transactionID].value;
                
        if (transactions[_transactionID].senderContract == address(this))
            if ((transactions[_transactionID].senderContract == thisBankContract)||(isRegulatorNode)) 
                balance-=transactions[_transactionID].value;
    }
}

}





/*Contract regulatorTransactionList: Must be deployed as a PUBLIC contract
Maintains a public transaction log without sensitive information like banks
involved and values. Additionally it maintains a public bank list, including 
transaction and contract addresses.
*/

contract regulatorTransactionList {
    
struct transaction {
    bool exists;    
    uint timestamp;
    bool blocked;
}

struct Bank {
    string name;
    bool authorized;
    bool exists;
    address authorizedSender;
}

address public regulator;
    
mapping (bytes32 => transaction) public transactions;
    
mapping (address => Bank) public banks;
    
modifier onlyRegulator() { 
    if (msg.sender != regulator) throw;_
}
    
function regulatorTransactionList() {
    regulator=msg.sender;
}
    
function addTransaction (bytes32 _transactionID) {
    transactions[_transactionID].exists=true;
    transactions[_transactionID].timestamp=block.timestamp;
    transactions[_transactionID].blocked=false;
}

function getTransactionExistance (bytes32 _transactionID) public constant returns (bool) {
    return (transactions[_transactionID].exists);
}

function getTransactionState (bytes32 _transactionID) public constant returns (bool) {
    return (transactions[_transactionID].blocked);
}

function getTransactionTimestamp (bytes32 _transactionID) public constant returns (uint) {
    return (transactions[_transactionID].timestamp);
}

function getBankExistance (address _contract) public constant returns (bool) {
    return (banks[_contract].exists);
}

function getBankState (address _contract) public constant returns (bool) {
    return (banks[_contract].authorized);
}

function getBankSender (address _contract) public constant returns (address) {
    return (banks[_contract].authorizedSender);
}

function getRegulator () public constant returns (address) {
    return (regulator);
}

function blockTransaction(bytes32 _transactionID) onlyRegulator {
    if (transactions[_transactionID].exists) {
        transactions[_transactionID].blocked=true;
    }
}

function unblockTransaction(bytes32 _transactionID) onlyRegulator {
    if (transactions[_transactionID].exists) {
        transactions[_transactionID].blocked=false;
    }
}

function addBank (string _name, address _contract, address _sender) onlyRegulator {
    banks[_contract].name=_name;
    banks[_contract].exists=true;
    banks[_contract].authorized=true;
    banks[_contract].authorizedSender=_sender;
}

function blockBank (address _contract) onlyRegulator {
    banks[_contract].authorized=false;
}

function authorizeBank (address _contract) onlyRegulator {
    banks[_contract].authorized=true;
}

}





contract supplyContract {
  struct Supply {
    address owner;
    string encryptedProof;
    string publicProof;
    string previousTrackingId;
  }

  mapping (string => Supply) private supplies;
  mapping (string => mapping (address => bool )) private isTransfered;


  event StoreProofCompleted(
    address from,
    string trackingId,
    string previousTrackingId
  );

  event TransferCompleted(
    address from,
    address to,
    string trackingId
  );

  function supplyContract() {}

  function storeProof(string trackingId, string previousTrackingId, string encryptedProof, string publicProof) returns(bool success) {
    
    if (hasProof(trackingId)) {
      return false;
    }

    if (sha3(previousTrackingId) != sha3("root")) {
      Supply memory pe = getProofInternal(previousTrackingId);
      if (msg.sender != pe.owner && !isTransfered[previousTrackingId][msg.sender]) {
        return false;
      }
    }

    supplies[trackingId] = Supply(msg.sender, encryptedProof, publicProof, previousTrackingId);
    StoreProofCompleted(msg.sender, trackingId, previousTrackingId);
    return true;
  }

  function transfer(string trackingId, address newOwner) returns(bool success) {
    
    if (hasProof(trackingId)) {
      Supply memory pe = getProofInternal(trackingId);
      if (msg.sender == pe.owner) {
        isTransfered[trackingId][newOwner] = true;
        TransferCompleted(msg.sender, newOwner, trackingId);
      }
      return true;
    }       
    return false;
  }

  function hasProof(string trackingId) constant internal returns(bool exists) {
    return supplies[trackingId].owner != address(0);
  }


  function getProofInternal(string trackingId) constant internal returns(Supply proof) {
    if (hasProof(trackingId)) {
      return supplies[trackingId];
    }
    throw;
  }

  function getProof(string trackingId) constant returns(address owner, string encryptedProof, string publicProof, string previousTrackingId) {
    if (hasProof(trackingId)) {
      Supply memory pe = getProofInternal(trackingId);
      owner = pe.owner;
      encryptedProof = pe.encryptedProof;
      publicProof = pe.publicProof;
      previousTrackingId = pe.previousTrackingId;
    }
  }

  function getEncryptedProof(string trackingId) constant returns(string encryptedProof) {
    if (hasProof(trackingId)) {
      return getProofInternal(trackingId).encryptedProof;
    }
  }

  function getPublicProof(string trackingId) constant returns(string publicProof) {
    if (hasProof(trackingId)) {
      return getProofInternal(trackingId).publicProof;
    }
  }

  function getOwner(string trackingId) constant returns(address owner) {
    if (hasProof(trackingId)) {
      return getProofInternal(trackingId).owner;
    }
  }

  function getPreviousTrackingId(string trackingId) constant returns(string previousTrackingId) {
    if (hasProof(trackingId)) {
      return getProofInternal(trackingId).previousTrackingId;
    }
  }
}