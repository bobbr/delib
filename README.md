# Delib

Simple Ethereum framework for DApps and contract management.

Delib's features include:

  * A promise based library that provides the core abstractions needed for building DApps on Ethereum.
  * A CLI for contract management. It lets you compile, build, deploy, execute methods, and get event logs.
  * Option to automatically estimate your transaction gas costs for contract deployment and methods.
  * The saving of deployed contract addresses to use or reference later.
  * The ability to create/unlock Ethereum accounts with the library and CLI.

## Table of Contents
  * [Requirements](#requirements)
  * [Installation and Setup](#install)
  * [CLI](#Cli)
  * [Library](#Ethereum)
  * [Examples](#examples)
  * [Support](#support)
  * [CLI API](#Cli+api)
  * [Library API](#Ethereum+api)

<a name="requirements"></a>

## Requirements

Must [install geth](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum). Here are the Mac OSX install commands with brew.

```
brew tap ethereum/ethereum
brew install ethereum
```

Must use [npm web3](https://www.npmjs.com/package/web3) version 0.17.0-alpha. Delib installs it as a dependency and also as a peer dependency. The current web3 version is 0.17.0-beta.

<a name="install"></a>

## Installation and Setup

### Global install

Install globally to use the CLI.

```
-> npm install -g delib
```

### Local install

Install locally to require the library.

```
-> npm install delib --save
```

Then require the library in your scripts.

```
const delib = require('delib');
```

### Project creation

To create a project call the following in the command line.

```
-> delib init
```

<a name="projectStructure"></a>
The project is structured like this:

```
project/
├── addresses/        - (addresses of deployed contracts)
├── built/            - (built Solidity contracts .sol.js)
├── contracts/        - (Solidity contracts .sol)
├── delib.js/         - (delib config file)
```

### Config file
A file called `delib.js` gets made when you create a project. It contains your project's configuration options. Use this to adjust your project file paths, connection options, and default CLI transaction options.

```
{
  /** Project file paths */
  paths: {
    contract: './contracts', // Relative path to Solidity contracts
    built: './built', // Relative path to built contracts
    address: './addresses' // Relative path to deployed contract addresses
  },

  /** RPC connection options */
  rpc: {
    host: 'localhost',
    port: 8545,
  },

  /** IPC connection options */
  ipc: {
    host: null // Relative path to IPC host
  },

  /** CLI options */
  cli: {
    /** Default transaction options */
    options: {
      from: 0, // Account index
      value: 0,
      gas: 0 // Set at 0 to estimate gas value
    }
  }
};

```

### Usage outside project
Delib can be used outside a project. Outside a project file paths will be relative to your process point of entry. You can specify paths with the library and pass them in as options for the CLI. Connection options will also need to be specified.

### Development node
Before using the library or CLI you will need to connect to an Ethereum node.

I created a package called [devchain](https://www.npmjs.com/package/devchain) that allows you to create private Ethereum blockchains. You can adjust the blockchain's mining difficulty and it comes with a geth node that automates mining and account Ether distribution. To install:

```
npm install -g devchain
```

Another option is [testrpc](https://github.com/ethereumjs/testrpc), which performs transaction instantaneously, but only allows RPC connections. To install:

```
npm install -g ethereumjs-testrpc
```

### Library and CLI integration
Building a contract with the CLI will allow it be accessible with the library. Also, deploying a contract using the library will make the following CLI contract calls refer to the library's deployed address, and vice versa. You can deploy contracts and then quickly test whether your methods are working with the CLI.  


<a name="Cli"></a>
# CLI

The CLI lets you compile and build Solidity contracts into a JavaScript file that you can then require. You can deploy the contract onto the blockchain to call methods and get event logs. You can also create, unlock, and get the balance of your accounts.

### Set connection options and project paths
The default connection and file path options are taken from the `delib.js` config file. Outside a project all project paths will be relative to where you're calling the command, and the RPC connection will default to localhost at port 8545. You can also specify connection options and paths as options.

| Options | Type | Description |
| --- | --- | --- |
| `-r --rpchost` | `<value>` | RPC host |
| `-h --rpcport` | `<port>` | RPC port |
| `-c --ipchost` | `<path>` | Relative path to IPC host |
| `-o --contract` | `<path>` | Path to contracts folder |
| `-b --built` | `<path>` | Relative path to built contracts folder |
| `-a --address` | `<path>` | Relative path to contract addresses folder |

### Adjust transaction options
The default transaction options for the CLI are located in ```delib.js```. You can also pass in your own transaction options with the CLI commands.

| Options | Type | Description |
| --- | --- | --- |
| `-i --account` | `<index>` | Account index to use for transaction |
| `-f --from` | `<address>` | From transaction option. Replaces --account |
| `-t --to` | `<address>` | To transaction option' |
| `-v --value` | `<ether>` | Value transaction option in Ether. Converts the value to wei |
| `-g --gas` | `<number>` | Gas transaction option. Estimated if not given or set to 0 |
| `-p --gasprice` | `<number>` | Gas price transaction option |
| `-n --nonce` | `<number>` | Nonce transaction option |

### Build contract
**delib build `<file>`**

Build a Solidity contract with the file name ```Contract.sol```.

```
-> delib build Contract
```

### Deploy contract
**delib deploy `<contractName> [...args]`**

Deploy a contract and pass in two arguments for its constructor. If no gas amount is given it will be estimated for you.
```
-> delib deploy Contract hello 30
```

### Execute contract method
**delib exec `<contractName> <methodName> [...args]`**

Call the method `setNumbers` on a deployed contract and pass in two numbers. The transaction options of 10000 gas with a gas value of 50000 are set as options. If no gas amount is given it will be estimated for you.
```
-> delib exec Contract setNumbers 10 20 --gas 10000 --gasprice 50000
```

### Get the logs of an event
**delib events `<contractName> <eventName> [blocksBack]`**

Get all the logs of an event called `numbersEvent`.
```
-> delib events Contract numbersEvent all
```

Get the logs from the last 10 blocks.
```
-> delib events Contract numbersEvent 10
```

### Set the address of a contract
**delib set `<contractName> <contractAddress>`**

Set the address of a contract to use. This will set its address for both CLI and library until another contract is deployed.

```
-> delib set Contract 0xa9b15bfe1d4e7bed407a011e54af36462fa0e067
```

### Get account balance
**delib balance `<accountIndex>`**

Get the Ether balance of your first account.

```
-> delib balance 0
```

### Create an account
**delib create `<password>`**

Create an account with the password "hunter1".

```
-> delib create hunter1
```

### Unlock an account
**delib unlock `<accountIndex> <password> [unlockTime]`**

Unlock your first account for 10000 seconds.

```
-> delib unlock 0 hunter1 10000
```

## [CLI API Link](#Cli+api)


<a name="Ethereum"></a>
# Library

The library gives you the freedom to customize your DApp development to fit your specific needs. You can easily write your own migration scripts, interact with smart contracts, and create tests.

### File paths
**delib.eth.contracts.paths**

To specify your own file paths use the `delib.eth.contracts.paths` object. Inside a project the paths will be relative to your project root (where `delib.js` is located). Outside a project they will be relative to your process point of entry.

```
delib.eth.contracts.paths.contract = 'relative path to contract folder';

delib.eth.contracts.paths.built = 'relative path to built folder';

delib.eth.contracts.paths.address = relative path to addresses folder';
```

### Connections
Your project's `delib.js` file sets up your RPC and IPC connections. You can also pass in connection options as arguments.

#### RPC provider
**delib.eth.init(rpcHost, rpcPort)**

To connect with the options in `delib.js`:

```
delib.eth.init();

```
Specify your own connection arguments by passing in a RPC host and a RPC port number.

```
delib.eth.init('localhost', 8000);

```

#### IPC provider
**delib.eth.initIPC(ipcPath)**

To connect with the options in `delib.js`:

```
delib.eth.initIPC();
```

You can pass in an IPC path as an argument.

```
delib.eth.initIPC('<path>/<to>/geth.ipc'); // To use the IPC provider to perform transaction you will need to changeProviders
```

The IPC connection remains on until you close it. To close it use:

```
delib.eth.closeIPC();
```

#### Switching providers
**delib.eth.changeProvider(type)**  

The provider is set to the first one initialized. To switch between the two:

```
delib.eth.changeProvider('rpc');

delib.eth.changeProvider('ipc');
```
These return a boolean indicating whether or not the change went thru.  

You can also check their connection status.

**delib.eth.checkConnection(type)**

```
delib.eth.checkConnection('rpc');

delib.eth.checkConnection('ipc');
```

### Adjust transaction options
**delib.eth.account**  
**delib.eth.options**

Choose the default account index to use for transactions. The index corresponds to the `web3.eth.accounts` array. By default the index is 0.

```
delib.eth.account = 1;
```

`delib.eth.options` contains the default options for your transactions. Options passed into deploy or contract method calls will overwrite these.

If a gas option of 0, in either the default options or passed in, is given gas usage will be automatically estimated for you.  

```
delib.eth.options = {
  from: null, // Leave at null to use the delib.eth.account index
  to: null, // Automatically takes on the address of the contract you're calling
  value: 0, // Value in wei to send
  gas: 0, // If gas is set at 0 or null the gas cost is estimated
  gasPrice: null, // If not specified it is the network mean gas value
  data: null, // Not used for delib methods
  nonce: null // Not used for delib methods
};
```

### Build contracts
**delib.eth.build(contractFiles, contractPath, buildPath)**

Pass in a file name or an array of file names you wish you build from your project's `contracts/` folder to your project's `built/` folder.

```
delib.eth.build('Test')
  .then(contracts => {
    console.log(contracts); // An array of all the contracts built.
  });
```

### Deploy contracts
**delib.eth.deploy(contractName, args, options)**

The addresses of your deployed contracts are saved in your project's `addresses/` folder. You can pass in an array of arguments for the constructor. The options parameter is optional. The promise returns an instance of the contract. You can use that instance to make method calls.

To deploy contract and call a method on the instance:

```
options = {
  gas: 1000000,
  value: 50 // wei
}

delib.eth.deploy('Test', [arg1, arg2, arg3], options)
  .then(instance => {
    const address = instance.address;

    return instance.testMethod();
  })
  .then(tx => {

  })
  .catch(err => {

  });
```

You can estimate the gas usage for deploying a contract.

**delib.eth.deploy.estimate(contractName, args, options)**

```
delib.eth.deploy.estimate('Test', [arg1, arg2, arg3])
  .then(gasEstimate => {

  })
  .catch(err => {

  });
```

You can get an array of all previously deployed addresses with `delib.eth.contracts.addresses.getAll('contractName')`. The most recently deployed address is at index 0. Using this will allow you to call previously deployed contracts.

### Execute contract methods
**delib.eth.exec(contractName)**  
**delib.eth.execAt(contractName, contractAddress)**

It will perform a transaction (which requires gas) or if it will just call and return a value by whether or not you labeled your function with constant in your Solidity contract.

To call a contract at the address you last deployed it:

```
options = {
  gas: 0 // Gas set at 0 will be estimated
};

delib.eth.exec('Test').testMethod(arg1, arg2, options)
  .then(tx => {

  })
  .catch(err => {

  });
```

You can estimate the gas usage for calling a contract method.

**delib.eth.exec(contractName).estimate**  
**delib.eth.execAt(contractName, contractAddress).estimate**

```
delib.eth.exec('Test').estimate.testMethod(arg1, arg2)
  .then(gasEstimate => {

  })
  .catch(err => {

  })
```

### Get event logs
**delib.eth.events(contractName, eventName, blocksBack, filter)**  
**delib.eth.eventsAt(contractName, contractAddress, eventName, blocksBack, filter)**

The code below gets the logs from an event called testEvent on the contract Test. It searches the last 100 blocks. To have it search all blocks pass in `'all'` instead of a number.

```
delib.eth.events('Test', 'testEvent', 100)
  .then(logs => {

  })
  .catch(err => {

  });
```

#### Filter object
You can pass in a filter object to filter your result. If filter object contains a key that's also in the event log object, the values will need to be the same or the log is filtered. Additionally, you can pass in a callback as a filter value. The callback's parameter is the value of the event log object, and gets filtered if it returns anything other than true. Click [here](https://github.com/ethereum/wiki/wiki/JavaScript-API#contract-events) to see the properties of the event log object.

The following code searches all blocks and only returns the even numbered blocks containing the event argument with a name of James.

```
filter = {
  blockNumber: function(number) {
    if (number % 2 === 0) return true;
    else return false;
  },
  // the property args contains the actual log values
  args: {
    name: 'James'
  }
};

delib.eth.events('Test', 'testEvent', 'all', filter)
  .then(logs => {

  })
  .catch(err => {

  });
```

### Account balances
**delib.eth.getBalance(index, type)**

The method to get the balance of an account takes in the account index and the Ether denomination you would like the result to be in.

Get the balance of your first account in Ether and wei:

```
delib.eth.getBalance(0, 'Ether');

delib.eth.getBalance(0, 'wei');
```

### Create accounts
**delib.eth.createAccount(password)**

This only works with an IPC connection. It creates an encrpyted JSON file containing your public and private key in your Ethereum blockchain's data directory.

```
delib.eth.createAccount('hunter1');
```

### Unlock accounts
**delib.eth.unlockAccount(index, password, timeLength)**

This only works with an IPC connection. Time length is in seconds.

```
delib.eth.unlockAccount(1, 'hunter2', 10000);
```


## [Library API Link](#Ethereum+api)


<a name="examples"></a>
# Examples

## Example 1

Initialize the project structure.
```
-> delib init
```

Create a contract file called ```Messages.sol``` in the `contracts/` folder.
```
contract Messages {
  address owner;
  string message;

  function Messages(string _message) {
    owner = msg.sender;
    message = _message;
  }

  function getOwner() constant returns (address) {
    return owner;
  }

  function setMessage(string _message) public {
    message = _message;
  }

  function getMessage() constant returns (string) {
    return message;
  }
}
```

Build ```Messages.sol``` with the CLI.
```
-> delib build Messages
```
A file called ```Messages.sol.js``` will be created in the `built/` folder.

Deploy Messages using the CLI with arguments for the constructor. Gas will be estimated for you.
```
-> delib deploy Messages hello
```
A file called ```MessagesAddresss``` will be created in your `addresses/` folder with the deployed contract's address.

In your scripts.
```
const delib = require('delib');

delib.eth.init();

// Adjust the default transaction options
delib.eth.options = {
  value: 0,
  gas: 100000,
};

// Call a method on the contract Messages
delib.eth.exec('Messages').getMessage()
  .then(message => {
    console.log(message); // -> hello

    // Call another method with your 2nd account and pass in options
    delib.eth.account = 1;
    return delib.eth.exec('Messages').setMessage('coffee', {
      gas: 100000 // gas will no longer be estimated
    });
  })
  .then(tx => {
    console.log(tx); // displays the transaction receipt
    return delib.eth.exec('Messages').getMessage();
  })
  .then(message => {
    console.log(message); // -> coffee  
  })
  .catch(err => {
    console.log(err);
  });
```
Then call methods on Messages in the command line.


```
-> delib exec Messages getMessage
coffee
```

Gas will be estimated for the following transaction.

```
-> delib exec Messages setMessage apples
Transaction response: 0x456e1934eef8c38b9de6c8fd09df0a285c8c42f86373d2c2a74157a68592209b
```

```
-> delib exec Messages getMessage
apples
```

<a name="support"></a>
# Support

If you found Delib useful please leave a star on [GitHub](https://github.com/zhiwenhuang/delib) or give feedback!

# API Reference

<a name=Cli+api></a>
## CLI
* [delib](#Cli+api)
    * [init](#Cli+init)
    * [build `<file>`](#Cli+build)
    * [deploy `<contractName> [...args]`](#Cli+deploy)
    * [exec `<contractName> <methodName> [...args]`](#Cli+exec)
    * [events `<contractName> <eventName> [fromBlock]`](#Cli+events)
    * [set `<contractName> <contractAddress>`](#Cli+set)
    * [balance `<accountIndex>`](#Cli+balance)
    * [create `<password>`](#Cli+create)
    * [unlock `<accountIndex> <password> [time]`](#Cli+unlock)

<a name="Cli+init"></a>
#### delib init
Create the config file ```delib.js``` and the [project structure](#projectStructure).

<a name="Cli+build"></a>
#### delib build `<file> -h --rpchost <value>, -r --rpcport <port>, -c --contract <path>, -b --built <path>`
Compile and build a Solidity smart contract ```.sol``` into a JavaScript file ```.sol.js``` that you can require. File paths are set in the `delib.js` config file or passed in as command line options. By default these are your project's `contracts/` and `built/` folders.

| Params | Type | Description |
| --- | --- | --- |
| `<file>` | `string` | Name of Solidity contract |
| `-r --rpchost` | `<value>` | RPC host |
| `-h --rpcport` | `<port>` | RPC port |
| `-o --contract` | `<path>` | Path to contracts folder |
| `-b --built` | `<path>` | Path to build contracts folder |

<a name="Cli+deploy"></a>
#### delib deploy `<contractName> [...args], -i --account <index>, -f --from <address>, -t --to <address>, -v --value <ether>, -g --gas <number>, -p --gasprice <number>, -n --nonce <number>, -h --rpchost <value>, -r --rpcport <port>, -b --built <path>, -a --address <path>`
Deploy a built Solidity smart contract and save its address for later use with the CLI or library. File paths are set in the `delib.js` config file or passed in as command line options. By default these are your project's `built/` and `addresses/` folders.

| Params | Type | Description |
| --- | --- | --- |
| `<contractName>` | `string` | Name of built contract |
| `[...args]` | `strings` | Arguments to pass into method |
| `-i --account` | `<index>` | Account to use for transaction. Takes the account index |
| `-f --from` | `<address>` | From transaction option. Replaces --account |
| `-t --to` | `<address>` | To transaction option' |
| `-v --value` | `<ether>` | Value transaction option in Ether. Converts the value to wei |
| `-g --gas` | `<number>` | Gas transaction option. Estimated if not given or set to 0 |
| `-p --gasprice` | `<number>` | Gas price transaction option |
| `-n --nonce` | `<number>` | Nonce transaction option |
| `-r --rpchost` | `<value>` | RPC host |
| `-h --rpcport` | `<port>` | RPC port |
| `-b --built` | `<path>` | Relative path to built contracts folder |
| `-a --address` | `<path>` | Relative path to contract addresses folder |

<a name="Cli+exec"></a>
#### delib exec `<contractName> <methodName> [...args], -i --account <index>, -f --from <address>, -t --to <address>, -v --value <ether>, -g --gas <number>, -p --gasprice <number>, -n --nonce <number>, -h --rpchost <value>, -r --rpcport <port>, -b --built <path>, -a --address <path>`
Perform a transaction or call a deployed contract's method. You can pass in a list of arguments. The most recent deployed contract address or set command address will be used.

| Params | Type | Description |
| --- | --- | --- |
| `<contractName>` | `string` | Name of built contract |
| `<methodName>` | `string` | Contract method name |
| `[...args]` | `strings` | Arguments to pass into method |
| `-i --account` | `<index>` | Account to use for transaction. Takes the account index |
| `-f --from` | `<address>` | From transaction option. Replaces --account |
| `-t --to` | `<address>` | To transaction option' |
| `-v --value` | `<ether>` | Value transaction option in Ether. Converts the value to wei |
| `-g --gas` | `<number>` | Gas transaction option. Estimated if not given or set to 0 |
| `-p --gasprice` | `<number>` | Gas price transaction option |
| `-n --nonce` | `<number>` | Nonce transaction option |
| `-r --rpchost` | `<value>` | RPC host |
| `-h --rpcport` | `<port>` | RPC port |
| `-b --built` | `<path>` | Relative path to built contracts folder |
| `-a --address` | `<path>` | Relative path to contract addresses folder |

<a name="Cli+events"></a>
#### delib events `<contractName> <eventName> [blocksBack], -h --rpchost <value>, -r --rpcport <port>, -b --built <path>, -a --address <path>`
Get the logs of a deployed contract's event. By default it gets all logs starting from block 0. You can pass in how many blocks back you wish to get logs from.

| Params | Type | Description |
| --- | --- | --- |
| `<contractName>` | `number` | Name of built contract |
| `<eventName>` | `string` | Contract event name |
| `[blocksBack]` | `number` | Number of blocks back to get logs from |
| `-r --rpchost` | `<value>` | RPC host |
| `-h --rpcport` | `<port>` | RPC port |

<a name="Cli+set"></a>
#### delib set `<contractName> <contractAddress>, -a --address <path>`
Set the address of a contract to use.

| Params | Type | Description |
| --- | --- | --- |
| `<contractName>` | `string` | Name of built contract |
| `<contractAddress>` | `string` | The address to bind to the contract |
| `-a --address` | `<path>` | Relative path to contract addresses |

<a name="Cli+balance"></a>
#### delib balance `<accountIndex>, -h --rpchost <value>, -r --rpcport <port>`
Get the balance of one of your account by its account index.

| Params | Type | Description |
| --- | --- | --- |
| `<accountIndex>` | `number` | Index of account |
| `-r --rpchost` | `<value>` | RPC host |
| `-h --rpcport` | `<port>` | RPC port |

<a name="Cli+create"></a>
#### delib create `<password>, -i --ipchost <path>`
Create a new Ethereum account.

| Params | Type | Description |
| --- | --- | --- |
| `<password>` | `string` | Account password |
| `-c --ipchost` | `<path>` | `Relative path to IPC host` |

<a name="Cli+unlock"></a>
#### delib unlock `<accountIndex> <password> [time], -i --ipchost <path>`
Unlock an Ethereum account by its account index. The argument `time` defaults to a day.

| Params | Type | Description |
| --- | --- | --- |
| `<accountIndex>` | `number` | Index of account |
| `<password>` | `string` | Account password |
| `[time]` | `number` | Time to leave account unlocked in seconds |
| `-c --ipchost` | `<path>` | `Relative path to IPC host` |

<a name="Ethereum+api"></a>

## Library
* [delib.eth](#Ethereum+api)
    * [.web3](#Ethereum+web3)
    * [.web3RPC](#Ethereum+web3RPC)
    * [.web3IPC](#Ethereum+web3IPC)
    * [.options](#Ethereum+options)
    * [.account](#Ethereum+accountIndex)
    * [.contracts](#Ethereum+contracts)
      * [.paths](#Ethereum+contracts+paths)
        * [.contract](#Ethereum+contracts+paths)
        * [.built](#Ethereum+contracts+paths)
        * [.address](#Ethereum+contracts+paths)
      * [.addresses](#Ethereum+contracts+addresses) ⇒ <code>Array</code>
        * [.set(name, address)](#Ethereum+contracts+addresses+set) ⇒ <code>number</code>
        * [.get(name, index)](#Ethereum+contracts+addresses+get) ⇒ <code>string</code>
        * [.getAll(name)](#Ethereum+contracts+addresses+getAll) ⇒ <code>Array</code>
    * [.checkConnection(type)](#Ethereum+checkConnection) ⇒ <code>boolean</code>
    * [.changeProvider(type)](#Ethereum+changeProvider) ⇒ <code>boolean</code>
    * [.init(rpcHost, rpcPort)](#Ethereum+init) ⇒ <code>Web3</code>
    * [.initIPC(ipcPath)](#Ethereum+initIPC) ⇒ <code>Web3</code>
    * [.build(contractFiles, contractPath, buildPath)](#Ethereum+buildContracts)
    * [.deploy(contractName, args, options)](#Ethereum+deploy) ⇒ <code>Promise</code> ⇒ <code>Contract</code>
      * [deploy.estimate(contractName, args, options)](#Ethereum+deploy+estimate) ⇒ <code>Promise</code> ⇒ <code>number</code>
    * [.exec(contractName)](#Ethereum+exec) ⇒ <code>Contract</code>
      * [.exec(contractName).estimate](#Ethereum+exec+estimate) ⇒ <code>Promise</code> ⇒ <code>number</code>
    * [.execAt(contractName, contractAddress)](#Ethereum+execAt) ⇒ <code>Contract</code>
      * [.execAt(contractName, contractAddress).estimate](#Ethereum+execAt+estimate) ⇒ <code>Promise</code> ⇒ <code>number</code>
    * [.events(contractName, eventName, blocksBack, filter)](#Ethereum+events) ⇒ <code>Promise</code> ⇒ <code>Array</code>
    * [.eventsAt(contractName, contractAddress, eventName, blocksBack, filter)](#Ethereum+eventsAt) ⇒ <code>Promise</code> ⇒ <code>Array</code>
    * [.getBalance(index, type)](#Ethereum+getBalance) ⇒ <code>number</code>
    * [.createAccount(password)](#Ethereum+createAccount) ⇒ <code>Promise</code> ⇒ <code>string</code>
    * [.unlockAccount(index, password, timeLength)](#Ethereum+unlockAccount) ⇒ <code>boolean</code>


<a name="Ethereum+web3"></a>
#### delib.eth.web3
The Web3 object being used as the current provider.

<a name="Ethereum+web3RPC"></a>
#### delib.eth.web3RPC
The Web3 object used for RPC connections. Will first need to initialize a RPC connection with `delib.eth.init()`.

<a name="Ethereum+web3IPC"></a>
#### delib.eth.web3IPC
The Web3 object used for IPC connections. Will first need to initialize an IPC connection with `delib.eth.initIPC()`. This object will allow you to perform Web3 personal and admin tasks.

<a name="Ethereum+contracts+paths"></a>
#### delib.eth.contracts.paths
An object that contains the paths to the Solidity contracts, built contracts, and contract addresses. If using delib in a project these paths will be relative to your project root, otherwise they will be relative to your scripts. Assign paths to this object if you don't want to create a project or if you want to customize the paths.

```
delib.eth.contracts.paths = {
  solidity: 'path to solidity contracts',
  built: 'path to built contracts',
  addresses: 'path to contract addresses'
}
```

<a name="Ethereum+contracts+addresses+set"></a>
#### delib.eth.contracts.addresses.set(name, address)
Set an address for a contract to use for future transactions.

**Returns**: <code>number</code> - The index of the set address.

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of built contract |
| address | <code>string</code> | The address of the contract |

<a name="Ethereum+contracts+addresses+get"></a>
#### delib.eth.contracts.addresses.get(name, index)
Get a deployed contract address based on index. If no index parameter is given it will return the latest address.

**Returns**: <code>string</code> - The contract address.

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of built contract |
| index | <code>number</code> | The index of the contract address |

<a name="Ethereum+contracts+addresses+getAll"></a>
#### delib.eth.contracts.addresses.getAll(name)
Get all the deployed addresses of a contract.

**Returns**: <code>Array</code> - An array of deployed contract addresses.

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of built contract |

<a name="Ethereum+options"></a>
#### delib.eth.options
The default transaction options for `delib.eth` methods. If gas is 0 or null then it will be estimated automatically for each transaction. Leave `from` null to base the address off of `delib.eth.account`.

```
{
  from: null, // The address of the account being used
  to: null, // (Optional) Destination address for this transaction
  value: null, // (Optional) Value transferred in wei
  gas: 0, // (Optional) Amount of gas to use for transaction
  gasPrice: null, // (Optional) Price of gas to be used for transaction in wei. Defaults to mean network gas price
  data: null,
  nonce: null // (Optional)
}
```

<a name="Ethereum+accountIndex"></a>
#### delib.eth.account
The index of the default account used for transactions. The index is used for web3.eth.accounts. This can be overwritten by setting an address in `delib.eth.options.from` or by passing i when performing a transaction.

<a name="Ethereum+init"></a>
#### delib.eth.init(rpcHost, rpcPort) ⇒ <code>Web3</code>
Initializes a RPC connection with an Ethereum node. The RPC provider can be set in the ```delib.js``` config file or you can pass it in as arguments. This needs to be called before performing any methods.

**Returns**: <code>Web3</code> - The Web3 object being used as a provider (RPC or IPC).

| Param | Type | Description |
| --- | --- | --- |
| rpcHost | <code>string</code> | The host URL path to the RPC connection. Optional. If not given the rpcHost path will be taken from the config file. |
| rpcPort | <code>number</code> | The port number to the RPC connection. Optional. If not given the rpcPort path will be taken from config file. |


<a name="Ethereum+initIPC"></a>
#### delib.eth.initIPC(ipcPath) ⇒ <code>Web3</code>
Initializes an IPC connection with an Ethereum node. The IPC provider can be set in the ```delib.js``` config file or you can pass it in as an argument. This needs to be called before using IPC functionality such as creating or unlocking an account. This returns a Web3 object connected via IPC that you call web3.personal and web3.admin methods on.

**Returns**: <code>Web3</code> - The Web3 object delib.eth uses for its IPC connection.  

| Param | Type | Description |
| --- | --- | --- |
| ipcPath | <code>string</code> | Path to the IPC provider. Example for Unix: process.env.HOME + '/Library/Ethereum/geth.ipc'. Optional. |

<a name="Ethereum+closeIPC"></a>

#### delib.eth.closeIPC() => <code>boolean</code>
Closes the IPC connection

**Returns** <code>boolean</code> Status of the IPC connection

<a name="Ethereum+checkConnection"></a>
#### delib.eth.checkConnection(type) => <code>boolean</code>
Check the status of a certain connection type (IPC or RPC)

**Returns** <code>boolean</code> Status of the connection.

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The connection type to test for ('rpc' or 'ipc') |


<a name="Ethereum+changeProvider"></a>
#### delib.eth.changeProvider(type) => <code>boolean</code>
Change the provider to use (RPC or IPC). It checks the connection status before switching. The connection will need to be initialized first before switching.

**Returns** <code>boolean</code> If the change went thru.

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The provider to change to ('rpc' or 'ipc') |


<a name="Ethereum+buildContracts"></a>
#### delib.eth.build(contractFiles, contractPath, buildPath)
Build a Solidity contract.

| Param | Type | Description |
| --- | --- | --- |
| contractFiles | <code>array</code> | Array of contract file names in the contracts folder |
| contractPath | <code>string</code> | Optional. Directory path where contract files are located. If none is given the directory path will be retrieved from the config file|
| buildPath | <code>string</code> | Optional. Directory path where built contracts will be put. If none is given the directory path will be retrieved from the config file. |

<a name="Ethereum+deploy"></a>
#### delib.eth.deploy(contractName, args, options) ⇒ <code>Promise</code> ⇒ <code>Contract</code>  
Deploy a built contract. If you have `delib.eth.options` value set to 0 or pass in the option then your gas cost will be automatically estimated. The address is saved in your project's `addresses/` folder and will be used for future contract calls and transactions.

**Returns**: <code>Promise</code> - The response is a Contract object of the deployed instance.  

| Param | Type | Description |
| --- | --- | --- |
| contractName | <code>string</code> | Name of built contract located in the directory provided in delib.js |
| args | <code>Array</code> | Arguments to be passed into the deployed contract as initial parameters. |
| options | <code>Object</code> | Transaction options. |

<a name="Ethereum+deploy+estimate"></a>
#### delib.eth.deploy.estimate(contractName, args, options) ⇒ <code>Promise</code> ⇒ <code>number</code>
Estimate the gas usage for deploying a contract.

**Returns**: <code>Promise</code> - The response contains the estimated gas cost.

| Param | Type | Description |
| --- | --- | --- |
| contractName | <code>string</code> | Name of built contract located in the directory provided in delib.js |
| args | <code>Array</code> | Arguments to be passed into the deployed contract as initial parameters. |
| options | <code>Object</code> | Transaction options. |

<a name="Ethereum+exec"></a>
#### delib.eth.exec(contractName) ⇒ <code>Contract</code>
Calls or performs a transaction on a deployed contract. Will take the address provided in the config file. If you have `delib.eth.options` value set to 0 or pass in the option into the contract method call your gas cost will be automatically estimated.

**Returns**: <code>Contract</code> - Contract object that you can call methods with.  

| Param | Type | Description |
| --- | --- | --- |
| contractName | <code>string</code> | Name of deployed contract |

<a name="Ethereum+exec+estimate"></a>
#### delib.eth.exec(contractName).estimate ⇒ <code>Promise</code> ⇒ <code>number</code>
Calls a deployed contract and methods called on the returned contract will return an estimated gas usage value.

**Returns**: <code>Contract</code> - Contract object that you can call methods with.  

| Param | Type | Description |
| --- | --- | --- |
| contractName | <code>string</code> | Name of deployed contract |

<a name="Ethereum+execAt"></a>
#### delib.eth.execAt(contractName, contractAddress) ⇒ <code>Contract</code>
Calls a deployed contract at a specific address. If you have `delib.eth.options` value set to 0 or pass it in as an option your gas cost will be automatically estimated.

**Returns**: <code>Contract</code> - Contract object that you can call methods with.

| Param | Type | Description |
| --- | --- | --- |
| contractName | <code>string</code> | Name of built contract located in the directory provided in delib.js. |
| contractAddress | <code>string</code> | Address of the contract. |


<a name="Ethereum+execAt+estimate"></a>
#### delib.eth.execAt(contractName, contractAddress).estimate ⇒ <code>Promise</code> ⇒ <code>number</code>
Calls a deployed contract at a specified address and methods called on the contract will return the estimated gas usage.

**Returns**: <code>Contract</code> - Contract object that you can estimate the gas usage of methods with.

| Param | Type | Description |
| --- | --- | --- |
| contractName | <code>string</code> | Name of built contract located in the directory provided in delib.js. |
| contractAddress | <code>string</code> | Address of the contract. |


<a name="Ethereum+events"></a>
#### delib.eth.events(contractName, eventName, blocksBack, filter) ⇒ <code>Promise</code>
Gets the event logs of an event.

**Returns**: <code>Promise</code> - The response contains an array event logs.  

| Param | Type | Description |
| --- | --- | --- |
| contractName | <code>string</code> | Name of built contract. |
| eventName | <code>string</code> | The name of the event method. |
| blocksBack | <code>number</code> | The number of blocks back to get logs for. 'all' gets all blocks. Defaults to 'all'|
| filter | <code>Object</code> | Object to filter the event logs. If a property in the filter object also exists in the log objects, they must match. A property can also contain a callback function that takes in the property value. It must return true. Default: { address: contractAddress }. |

<a name="Ethereum+eventsAt"></a>
#### delib.eth.eventsAt(contractName, contractAddress, eventName, blocksBack, filter) ⇒ <code>Promise</code>
Gets the event logs for an event.

**Returns**: <code>Promise</code> - The response contains an array event logs.  

| Param | Type | Description |
| --- | --- | --- |
| contractName | <code>string</code> | Name of built contract. |
| contractAddress | <code>string</code> | Address of the contract. |
| eventName | <code>string</code> | The name of the event method. |
| blocksBack | <code>number</code> | The number of blocks back to get logs for. 'all' gets all blocks. Defaults to 'all'|
| filter | <code>Object</code> | Object to filter the event logs. If a property in the filter object also exists in the log objects, they must match. A property can also contain a callback function that takes in the property value. It must return true. Default: { address: contractAddress }. |

<a name="Ethereum+createAccount"></a>
#### delib.eth.createAccount(password) ⇒ <code>Promise</code>
Creates a new Ethereum account. Needs an IPC connection.

**Returns**: <code>Promise</code> => <code>string</code> Promise return is a string of the newly created account address.  

| Param | Type | Description |
| --- | --- | --- |
| password | <code>string</code> | The password to create the new account with. |


<a name="Ethereum+unlockAccount"></a>
#### delib.eth.unlockAccount(index, password, timeLength) ⇒ <code>boolean</code>
Unlocks an Ethereum account. Needs an IPC connection.

**Returns**: <code>boolean</code> - Status if account was successfully unlocked.  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | The index of the account. |
| password | <code>string</code> | Password of account. |
| timeLength | <code>number</code> | Time in seconds to have account remain unlocked for. |

<a name="Ethereum+getBalanceEther"></a>
#### delib.eth.getBalance(index, type) ⇒ <code>number</code>
Get the Ether balance of an account in Ether denomination.

**Returns**: <code>number</code> - The amount of Ether contained in the account.  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | Index of the account to check the balance of in Ether. |
| type | <code>string</code> | The denomination. Default: 'ether' |
