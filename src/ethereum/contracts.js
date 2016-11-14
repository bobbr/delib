'use strict';
const Addresses = require('./../models/Addresses');
const config = require('./../config/config');

/**
 * Contains the contract related properties and methods
 */
function Contracts() {
  /** Paths to contract related folders */
  this.paths = {
    contract: config.paths.contract,
    built: config.paths.built,
    address: config.paths.address
  };

  /** Contains address model methods */
  this.addresses = {};

  /**
   * Set an address for a contract to use for future transactions.
   * @param {string} name
   * @param {string} address
   * @returns {string} - The index of the address saved
   */
  this.addresses.set = (name, address) => {
    Addresses.path = this.paths.address;
    return Addresses.set(name, address);
  };

  /**
   * Get a deployed contract address based on index.
   * @param {string} name
   * @param {number} index
   * @returns {string}
   */
  this.addresses.get = (name, index) => {
    Addresses.path = this.paths.address;
    return Addresses.get(name, index);
  };

  /**
   * Get all the deployed addresses of a contract
   * @param {string} name
   * @returns {Array}
   */
  this.addresses.getAll = (name) => {
    Addresses.path = this.paths.address;
    return Addresses.getAll(name);
  };
}

const contracts = new Contracts();

module.exports = contracts;