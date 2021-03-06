/* eslint handle-callback-err: "off" */
/* eslint new-cap: "off" */
const _ = require('lodash')
const Logger = require('../common/logger')

/**
 * @class Mesh
 * @param {Array.<Node>} nodes
 * @param {Object} options
 * @param {Object} options.loggerOptions
 */
class Mesh {
  constructor (nodes, options = {}) {
    // -- Properties
    /** @type {Array.<Node>} */
    this.nodes = []
    /** @type {Object} */
    this.logger = undefined
    /** @type {Object} */
    this.defaultOptions = {
      loggerOptions: {}
    }

    // -- Bootstrap
    Object.assign(this, this.defaultOptions, options)
    this.nodes = nodes
    this.logger = new Logger('Mesh', this.loggerOptions)
  }

  /**
   * @public
   * @returns {Node}
   */
  getFastestNode () {
    this.logger.debug('getFastestNode triggered.')
    // TODO: make active filter, optional
    return _.minBy(
      _.filter(this.nodes, 'active'),
      'latency'
    )
  }

  /**
   * Identifies and returns the node with the highest block height.
   * @public
   * @returns {Node}
   */
  getHighestNode () {
    this.logger.debug('getHighestNode triggered.')
    // TODO: make active filter, optional
    return _.maxBy(
      _.filter(this.nodes, 'active'),
      'blockHeight'
    )
  }

  /**
   * @public
   * @returns {Node}
   */
  getRandomNode () {
    this.logger.debug('getRandomNode triggered.')
    // TODO: getRandomNode(isActive)
    // This also picks up inactive nodes
    const targetIndex = parseInt(Math.random() * this.nodes.length)
    return this.nodes[targetIndex]
  }

  /**
   * @public
   * @returns {Node}
   */
  getNodeWithBlock (index, sort = 'latency') {
    this.logger.debug('getNodeWithBlock triggered. index:', index, 'sort:', sort)
    // NOTE: Not been used
    return _.minBy(
      _.filter(this.nodes, ({index: nIndex, active}) => {
        return active && (index <= nIndex)
      }),
      sort
    )
  }

  /**
   * @public
   * @param {string} method
   * @param {object} params
   * @returns {*}
   */
  rpc (method, params) {
    this.logger.debug('rpc triggered. method:', method, 'params:', params)
    // Alias of mesh.getHighestNode().rpc()
    return (this.getHighestNode() || this.nodes[0]).rpc[method](params)
  }
}

module.exports = Mesh
