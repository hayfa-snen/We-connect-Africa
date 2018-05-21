# We-connect-Africa
This project configures 5 nodes, each with their own PrivateTransactionManager. Usage:

  - `raft-init.sh`: Initialize accounts and keystores
  - `raft-start.sh`: Launch `constellation` and `geth` nodes, then send a private transaction
  - `stop.sh`: Stop all `constellation` and `geth` nodes

All logs and temporary data will be written to the `qdata` folder.


## Smart contracts:
There are 3 smart contracts, all stored in the `contracts.sol` file and lightly commented:

1- bankContract:

This contract implements the main logic of the cross-border payement system. One PRIVATE instance of the contract must be deployed for EACH participating bank on the network and it will store private transaction data and balance. It has many verification steps to avoid bank personification, fraud and overdraft transactions. Most of the checks are made by the contract itself, but the overdraft protection must be made by an active regulator node. 

2- regulatorTransactionList:

This contract stores and serves the public data to the private contracts. Public data are transactions hashes and participating banks information.

3- supplyContract:

This contract stores and serves position and owner of supplies.

## Transaction confirmation logic:
Transactions are published privately by the sender bank and must only be sent to the recipient and to the regulator nodes (privateFor parameter). They are created in an UNCONFIRMED state and are only final if they are confirmed. After publishing the private transaction, the sender bank must publish the same transaction hash in the public transaction log (regulatorTransactionList public contract) to ensure that all the parts are aware of the transaction. Transactions can only be confirmed and reflect on bank balances if they are stored in the public transaction log and they can be confirmed by two ways:

1- By the regulator calling the confirmTransactionRegulator function

2- By the sender bank calling confirmTransactionBank function. This function ensures that the confirmation timer has expired before confirming the transaction. 

This two phase commit is needed because there is no overdraft protecting in the bankContract code because different bank instances have different data. For example, bank1 smart contract published in the bank1 node has the balance variable set, but the same contract with the same address in the bank2 node has no value in the balance data because this data is private to bank1 and the regulator. The regulator node´s contracts have all the data as it must be part of every private transaction. The logic behind this proccess is that, after a transaction is published, the regulator can check the sender balance against the newly published transaction. If the value intended for the transfer is higher than the bank balance, the regulator must block this transaction during the confirmation time. If the value is below the balance OR if the regulator is offline, the sender bank can confirm its own transaction after the confirmation time. This is a resiliency feature to ensure that the cross-border payement system endures a regulator outage.

## Environment setup:
### Virtual machine Quorum and Constellation install:
1- Start with a clean Ubuntu 16.04 virtual machine install

2- Run "install.sh" script to install Constellation, GO and Quorum
 
### Quorum set up and start:
1- call raft-init.sh to initialize accounts and keystores

2- Bring the 5 nodes up calling raft-start.sh

3- Connect to the nodes calling:

terminal 1: ``$ geth attach ipc:qdata/dd1/geth.ipc``

terminal 2: ``$ geth attach ipc:qdata/dd2/geth.ipc``

terminal 3: ``$ geth attach ipc:qdata/dd3/geth.ipc``

terminal 4: ``$ geth attach ipc:qdata/dd4/geth.ipc``

terminal 5: ``$ geth attach ipc:qdata/dd5/geth.ipc``

Terminal 1-3 are banks 1-3, terminal 4 is the regulator and terminal 5 is the observer used to test privacy.

### Running cross-border payement:
4- Run the following commands, three times for each one, in the javascript quorum console on terminal 4 (regulator):
 
	- loadScript("deploy-bankContract.js");
	
	- loadScript("deploy-supplyContract.js");

5- Take note of the 3 bank contract addresses. It can take some seconds, but the geth console will eventually provide an output like "Contract mined! address: 0x...". These are bank1, bank2 and bank3 private contracts instances addresses (the same for supply1, supply2 and supply3 addresses).

6- Run the following command one time in the javascript console on terminal 4 (regulator): 

``loadScript("deploy-regulatorTransactionList.js");``

7- Take note of the contract address. It is the public transaction log contract address.

8- Run the following script in each of the five javascript quorum consoles (all terminals). Change the first 4 lines using the addresses written before. The addresses must be between double quotes (I.e. "0x937540f5002fd57b0111e049f2da603fcaec78b8").

```
var addresstr = <COPY HERE THE PUBLIC TRANSACTION LOG CONTRACT ADDRESS>
var address1 = <COPY HERE THE BANK1 CONTRACT ADDRESS>
var address2 = <COPY HERE THE BANK1 CONTRACT ADDRESS>
var address3 = <COPY HERE THE BANK3 CONTRACT ADDRESS>

var abi = [{"constant":false,"inputs":[{"name":"_transactionID","type":"bytes32"}],"name":"confirmTransactionRegulator","outputs":[],"type":"function","payable":true},{"constant":false,"inputs":[{"name":"_seconds","type":"uint256"}],"name":"setConfirmationTime","outputs":[],"type":"function","payable":true},{"constant":false,"inputs":[{"name":"_value","type":"uint256"},{"name":"_random","type":"string"}],"name":"receiveValue","outputs":[],"type":"function","payable":true},{"constant":false,"inputs":[{"name":"_transactionID","type":"bytes32"}],"name":"confirmTransactionBank","outputs":[],"type":"function","payable":true},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"transactions","outputs":[{"name":"value","type":"uint256"},{"name":"senderContract","type":"address"},{"name":"destinationContract","type":"address"},{"name":"confirmed","type":"bool"},{"name":"senderBalanceAtTransfer","type":"uint256"}],"type":"function","payable":true},{"constant":true,"inputs":[],"name":"confirmationTime","outputs":[{"name":"","type":"uint256"}],"type":"function","payable":true},{"constant":false,"inputs":[{"name":"_contractAddress","type":"address"}],"name":"setTransactionListAddress","outputs":[],"type":"function","payable":true},{"constant":true,"inputs":[],"name":"isRegulatorNode","outputs":[{"name":"","type":"bool"}],"type":"function","payable":true},{"constant":true,"inputs":[],"name":"TransactionListAddress","outputs":[{"name":"","type":"address"}],"type":"function","payable":true},{"constant":true,"inputs":[],"name":"thisBankContract","outputs":[{"name":"","type":"address"}],"type":"function","payable":true},{"constant":false,"inputs":[{"name":"_thisBankContract","type":"address"}],"name":"setThisBankContract","outputs":[],"type":"function","payable":true},{"constant":false,"inputs":[{"name":"_destination","type":"address"},{"name":"_value","type":"uint256"},{"name":"_random","type":"string"}],"name":"sendValue","outputs":[],"type":"function","payable":true},{"constant":false,"inputs":[],"name":"setRegulatorNode","outputs":[],"type":"function","payable":true},{"constant":false,"inputs":[{"name":"_transactionID","type":"bytes32"}],"name":"confirmTransactionPair","outputs":[],"type":"function","payable":true},{"constant":true,"inputs":[],"name":"balance","outputs":[{"name":"","type":"uint256"}],"type":"function","payable":true},{"constant":true,"inputs":[],"name":"totalTransactions","outputs":[{"name":"","type":"uint256"}],"type":"function","payable":true},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"transactionIDs","outputs":[{"name":"","type":"bytes32"}],"type":"function","payable":true},{"constant":true,"inputs":[],"name":"regulator","outputs":[{"name":"","type":"address"}],"type":"function","payable":true},{"constant":false,"inputs":[{"name":"_balance","type":"uint256"}],"name":"setBalance","outputs":[],"type":"function","payable":true},{"inputs":[],"type":"constructor","payable":true},{"type":"fallback","payable":true}]

var abitr = [{"constant":true,"inputs":[{"name":"_transactionID","type":"bytes32"}],"name":"getTransactionExistance","outputs":[{"name":"","type":"bool"}],"type":"function","payable":true},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_contract","type":"address"},{"name":"_sender","type":"address"}],"name":"addBank","outputs":[],"type":"function","payable":true},{"constant":false,"inputs":[{"name":"_contract","type":"address"}],"name":"blockBank","outputs":[],"type":"function","payable":true},{"constant":true,"inputs":[{"name":"_contract","type":"address"}],"name":"getBankExistance","outputs":[{"name":"","type":"bool"}],"type":"function","payable":true},{"constant":true,"inputs":[{"name":"_transactionID","type":"bytes32"}],"name":"getTransactionTimestamp","outputs":[{"name":"","type":"uint256"}],"type":"function","payable":true},{"constant":true,"inputs":[{"name":"_contract","type":"address"}],"name":"getBankSender","outputs":[{"name":"","type":"address"}],"type":"function","payable":true},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"transactions","outputs":[{"name":"exists","type":"bool"},{"name":"timestamp","type":"uint256"},{"name":"blocked","type":"bool"}],"type":"function","payable":true},{"constant":false,"inputs":[{"name":"_contract","type":"address"}],"name":"authorizeBank","outputs":[],"type":"function","payable":true},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"banks","outputs":[{"name":"name","type":"string"},{"name":"authorized","type":"bool"},{"name":"exists","type":"bool"},{"name":"authorizedSender","type":"address"}],"type":"function","payable":true},{"constant":true,"inputs":[{"name":"_contract","type":"address"}],"name":"getBankState","outputs":[{"name":"","type":"bool"}],"type":"function","payable":true},{"constant":false,"inputs":[{"name":"_transactionID","type":"bytes32"}],"name":"addTransaction","outputs":[],"type":"function","payable":true},{"constant":false,"inputs":[{"name":"_transactionID","type":"bytes32"}],"name":"unblockTransaction","outputs":[],"type":"function","payable":true},{"constant":true,"inputs":[{"name":"_transactionID","type":"bytes32"}],"name":"getTransactionState","outputs":[{"name":"","type":"bool"}],"type":"function","payable":true},{"constant":true,"inputs":[],"name":"regulator","outputs":[{"name":"","type":"address"}],"type":"function","payable":true},{"constant":false,"inputs":[{"name":"_transactionID","type":"bytes32"}],"name":"blockTransaction","outputs":[],"type":"function","payable":true},{"inputs":[],"type":"constructor","payable":true},{"type":"fallback","payable":true}]

var contracttr=eth.contract(abitr).at(addresstr)

var contract1=eth.contract(abi).at(address1)

var contract2=eth.contract(abi).at(address2)

var contract3=eth.contract(abi).at(address3)

var bank1="0xed9d02e382b34818e88b88a309c7fe71e65f419d"
var bank2="0xca843569e3427144cead5e4d5999a3d0ccf92b8e"
var bank3="0x0fbdc686b912d7722dc86510934589e0aaf3b55a"
var regulator="0x0638e1574728b6d862dd5d3a3e0942c3be47d996"

contract1.balance()
contract2.balance()
contract3.balance()
```

9- You should see "0" as return to all contract balances calls on every node. It is fine, the contracts are still empty.

10- Run the script below ONLY on regulator node (node 4), it will initialize all the basic data in all contracts like the public transaction log address, who is the regulator node, etc.

```
var bank1InitialBalance=10000;
var bank2InitialBalance=20000;
var bank3InitialBalance=30000;

contract1.setTransactionListAddress(addresstr,{from:eth.coinbase,privateFor:["BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo=","QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc=","oNspPPgszVUFw0qmGFfWwh1uxVUXgvBxleXORHj07g8="]});
contract2.setTransactionListAddress(addresstr,{from:eth.coinbase,privateFor:["BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo=","QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc=","oNspPPgszVUFw0qmGFfWwh1uxVUXgvBxleXORHj07g8="]});
contract3.setTransactionListAddress(addresstr,{from:eth.coinbase,privateFor:["BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo=","QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc=","oNspPPgszVUFw0qmGFfWwh1uxVUXgvBxleXORHj07g8="]});

contract1.setBalance(bank1InitialBalance,{from:eth.coinbase,privateFor:["BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo="]});
contract2.setBalance(bank2InitialBalance,{from:eth.coinbase,privateFor:["QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc="]});
contract3.setBalance(bank3InitialBalance,{from:eth.coinbase,privateFor:["oNspPPgszVUFw0qmGFfWwh1uxVUXgvBxleXORHj07g8="]});

contract1.setRegulatorNode({from:eth.coinbase,privateFor:["UfNSeSGySeKg11DVNEnqrUtxYRVor4+CvluI8tVv62Y="]});
contract2.setRegulatorNode({from:eth.coinbase,privateFor:["UfNSeSGySeKg11DVNEnqrUtxYRVor4+CvluI8tVv62Y="]});
contract3.setRegulatorNode({from:eth.coinbase,privateFor:["UfNSeSGySeKg11DVNEnqrUtxYRVor4+CvluI8tVv62Y="]});

contract1.setThisBankContract(contract1.address,{from:eth.coinbase,privateFor:["BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo="]});
contract2.setThisBankContract(contract1.address,{from:eth.coinbase,privateFor:["BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo="]});
contract3.setThisBankContract(contract1.address,{from:eth.coinbase,privateFor:["BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo="]});

contract1.setThisBankContract(contract2.address,{from:eth.coinbase,privateFor:["QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc="]});
contract2.setThisBankContract(contract2.address,{from:eth.coinbase,privateFor:["QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc="]});
contract3.setThisBankContract(contract2.address,{from:eth.coinbase,privateFor:["QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc="]});

contract1.setThisBankContract(contract3.address,{from:eth.coinbase,privateFor:["oNspPPgszVUFw0qmGFfWwh1uxVUXgvBxleXORHj07g8="]});
contract2.setThisBankContract(contract3.address,{from:eth.coinbase,privateFor:["oNspPPgszVUFw0qmGFfWwh1uxVUXgvBxleXORHj07g8="]});
contract3.setThisBankContract(contract3.address,{from:eth.coinbase,privateFor:["oNspPPgszVUFw0qmGFfWwh1uxVUXgvBxleXORHj07g8="]});

contracttr.addBank("Bank1",contract1.address,bank1,{from:eth.coinbase});
contracttr.addBank("Bank2",contract2.address,bank2,{from:eth.coinbase});
contracttr.addBank("Bank3",contract3.address,bank3,{from:eth.coinbase});
```
