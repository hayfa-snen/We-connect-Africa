var supplycontractContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"_transactionID","type":"bytes32"}],"name":"getTransactionExistance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_contract","type":"address"},{"name":"_sender","type":"address"}],"name":"addBank","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_contract","type":"address"}],"name":"blockBank","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_contract","type":"address"}],"name":"getBankExistance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_transactionID","type":"bytes32"}],"name":"getTransactionTimestamp","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_contract","type":"address"}],"name":"getBankSender","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"transactions","outputs":[{"name":"exists","type":"bool"},{"name":"timestamp","type":"uint256"},{"name":"blocked","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_contract","type":"address"}],"name":"authorizeBank","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"banks","outputs":[{"name":"name","type":"string"},{"name":"authorized","type":"bool"},{"name":"exists","type":"bool"},{"name":"authorizedSender","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_contract","type":"address"}],"name":"getBankState","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_transactionID","type":"bytes32"}],"name":"addTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_transactionID","type":"bytes32"}],"name":"unblockTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_transactionID","type":"bytes32"}],"name":"getTransactionState","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"regulator","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_transactionID","type":"bytes32"}],"name":"blockTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getRegulator","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]);
var supplycontract = supplycontractContract.new(
   {
     from: web3.eth.accounts[0], 
     data: '0x6060604052341561000f57600080fd5b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610fcc8061005e6000396000f3006060604052600436106100e6576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063054380f9146100eb5780631eaa25561461012a57806321574ff8146101c5578063288bdecf146101fe5780632fbff5201461024f578063506542601461028a578063642f2eaf146103035780636f74a2c01461035457806380c3b8c21461038d5780638c41eae61461048857806394bbaa80146104d9578063b809e2f914610500578063c71cca1614610527578063dd8fee1414610566578063e5f9f94d146105bb578063f7e317f4146105e2575b600080fd5b34156100f657600080fd5b610110600480803560001916906020019091905050610637565b604051808215151515815260200191505060405180910390f35b341561013557600080fd5b6101c3600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061066c565b005b34156101d057600080fd5b6101fc600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061085a565b005b341561020957600080fd5b610235600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610913565b604051808215151515815260200191505060405180910390f35b341561025a57600080fd5b61027460048080356000191690602001909190505061096c565b6040518082815260200191505060405180910390f35b341561029557600080fd5b6102c1600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610994565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561030e57600080fd5b610328600480803560001916906020019091905050610a00565b604051808415151515815260200183815260200182151515158152602001935050505060405180910390f35b341561035f57600080fd5b61038b600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610a44565b005b341561039857600080fd5b6103c4600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610afd565b604051808060200185151515158152602001841515151581526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828103825286818151815260200191508051906020019080838360005b8381101561044a57808201518184015260208101905061042f565b50505050905090810190601f1680156104775780820380516001836020036101000a031916815260200191505b509550505050505060405180910390f35b341561049357600080fd5b6104bf600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610bff565b604051808215151515815260200191505060405180910390f35b34156104e457600080fd5b6104fe600480803560001916906020019091905050610c58565b005b341561050b57600080fd5b610525600480803560001916906020019091905050610ceb565b005b341561053257600080fd5b61054c600480803560001916906020019091905050610db2565b604051808215151515815260200191505060405180910390f35b341561057157600080fd5b610579610de7565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156105c657600080fd5b6105e0600480803560001916906020019091905050610e0c565b005b34156105ed57600080fd5b6105f5610ed2565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b600060016000836000191660001916815260200190815260200160002060000160009054906101000a900460ff169050919050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156106c757600080fd5b82600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001908051906020019061071d929190610efb565b506001600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160016101000a81548160ff0219169083151502179055506001600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160006101000a81548160ff02191690831515021790555080600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160026101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156108b557600080fd5b6000600260008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160006101000a81548160ff02191690831515021790555050565b6000600260008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160019054906101000a900460ff169050919050565b6000600160008360001916600019168152602001908152602001600020600101549050919050565b6000600260008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160029054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b60016020528060005260406000206000915090508060000160009054906101000a900460ff16908060010154908060020160009054906101000a900460ff16905083565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610a9f57600080fd5b6001600260008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160006101000a81548160ff02191690831515021790555050565b6002602052806000526040600020600091509050806000018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610ba95780601f10610b7e57610100808354040283529160200191610ba9565b820191906000526020600020905b815481529060010190602001808311610b8c57829003601f168201915b5050505050908060010160009054906101000a900460ff16908060010160019054906101000a900460ff16908060010160029054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905084565b6000600260008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160009054906101000a900460ff169050919050565b6001806000836000191660001916815260200190815260200160002060000160006101000a81548160ff0219169083151502179055504260016000836000191660001916815260200190815260200160002060010181905550600060016000836000191660001916815260200190815260200160002060020160006101000a81548160ff02191690831515021790555050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610d4657600080fd5b60016000826000191660001916815260200190815260200160002060000160009054906101000a900460ff1615610daf57600060016000836000191660001916815260200190815260200160002060020160006101000a81548160ff0219169083151502179055505b50565b600060016000836000191660001916815260200190815260200160002060020160009054906101000a900460ff169050919050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610e6757600080fd5b60016000826000191660001916815260200190815260200160002060000160009054906101000a900460ff1615610ecf576001806000836000191660001916815260200190815260200160002060020160006101000a81548160ff0219169083151502179055505b50565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610f3c57805160ff1916838001178555610f6a565b82800160010185558215610f6a579182015b82811115610f69578251825591602001919060010190610f4e565b5b509050610f779190610f7b565b5090565b610f9d91905b80821115610f99576000816000905550600101610f81565b5090565b905600a165627a7a72305820e0813f84c4801f3855422fca230c97b75c73adfcd13199358b24319581ecc5410029', 
     gas: '4700000'
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
 })
