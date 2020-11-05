import Web3 from 'web3'
import { hexToNumberString, toChecksumAddress } from 'web3-utils'

class Provider {
  /**
   * Constructor params.
   *
   * @param options {object}
   * @param {object} options.config
   * @param {number} options.config.id
   * @param {string} options.config.rpcUrl
   * @param {number} options.config.rpcCallRetryAttempt
   * @param {object} options.provider
   * @param {string} options.rpcUrl - node api endpoint.
   * @returns {*}
   */
  constructor(options) {
    this.address = ''
    this.version = 'new'

    this.config = options.config
    this.web3 = new Web3(new Web3.providers.HttpProvider(options.rpcUrl))
  }

  async initProvider(provider) {
    try {
      this.provider = provider
      this.web3 = new Web3(provider)

      await this._checkVersion()
      return await this._initProvider()
    } catch (err) {
      throw new Error(`Provider method initProvider has error: ${err.message}`)
    }
  }

  /**
   * Send a request to the provider.
   *
   * @param params {object}
   * @returns {*}
   */
  async sendRequest(params) {
    try {
      const request = (args) =>
        this.version === 'old'
          ? this._sendAsync(args)
          : this.provider.request(args)

      return await request(params)
    } catch (err) {
      throw new Error(`Provider method sendRequest has error: ${err.message}`)
    }
  }

  /**
   * Calling a custom method on the provider.
   *
   * @param params {object}
   * @param {string} params.methodName
   * @param {string} params.data
   * @param {string} params.to
   * @param {string} params.from
   * @param {string} params.gas
   * @param {number} params.value
   * @returns {*}
   */
  async contractRequest({ methodName, data, to, from, gas, value = 0 }) {
    const { rpcCallRetryAttempt, blockGasLimit } = this.config

    try {
      const params = {
        to,
        data,
        value,
        from: from || this.address,
        gas: gas || blockGasLimit + 100000,
      }

      return await this._repeatUntilResult(
        () => this.web3.eth[methodName](params),
        rpcCallRetryAttempt
      )
    } catch (err) {
      throw new Error(
        `Provider method contractRequest has error: ${err.message}`
      )
    }
  }

  /**
   * Get your address balance.
   *
   * @param params {object}
   * @param {string} params.address.
   * @returns {*}
   */
  async getBalance({ address }) {
    const { rpcCallRetryAttempt } = this.config

    try {
      const params = {
        method: 'eth_getBalance',
        params: [address, 'latest'],
      }

      const balance = await this._repeatUntilResult(
        () => this.sendRequest(params),
        rpcCallRetryAttempt
      )

      return hexToNumberString(balance)
    } catch (err) {
      throw new Error(`Provider method getBalance has error: ${err.message}`)
    }
  }

  /**
   * Waiting for receipt of the transaction.
   *
   * @param params {object}
   * @param {string} params.txHash
   * @returns {*}
   */
  async waitForTxReceipt({ txHash }) {
    const { rpcCallRetryAttempt } = this.config

    try {
      const params = {
        method: 'eth_getTransactionReceipt',
        params: [txHash],
      }

      return await this._repeatUntilResult(
        () => this.sendRequest(params),
        rpcCallRetryAttempt * 10
      )
    } catch (err) {
      throw new Error(
        `Provider method waitForTxReceipt has error: ${err.message}`
      )
    }
  }

  /**
   * Get network version, the current provider.
   *
   * @param params {object}
   * @param {array} params.txs
   * @param {function} params.callback
   * @returns {*}
   */
  async batchRequest({ txs, callback }) {
    try {
      const web3 = new Web3(this.provider)

      const batch = new web3.BatchRequest()
      const txsPromisesBucket = []

      for (const params of txs) {
        const txPromise = new Promise((resolve, reject) => {
          const tx = web3.eth.sendTransaction.request(
            params,
            (error, txHash) => {
              if (error) {
                reject(error)
              } else {
                resolve(txHash)
              }
            }
          )
          batch.add(tx)
        })
        txsPromisesBucket.push(txPromise)
      }

      batch.execute()

      callback(txsPromisesBucket)

      return await Promise.all(txsPromisesBucket)
    } catch (err) {
      throw new Error(err.message)
    }
  }

  /**
   * Get network version, the current provider.
   */
  async checkNetworkVersion() {
    try {
      return await this.sendRequest({ method: 'net_version' })
    } catch (err) {
      throw new Error(
        `Provider method _checkNetworkVersion has error: ${err.message}`
      )
    }
  }

  /**
   * Initialize provider.
   *
   */
  async _initProvider() {
    try {
      const request = () =>
        this.version
          ? this.provider.enable()
          : this.sendRequest({ method: 'eth_requestAccounts' })

      const [account] = await request('')

      if (!account) {
        throw new Error('Locked metamask')
      }

      this.address = account

      this.provider.on('accountsChanged', (accounts) =>
        this._onAccountsChanged(accounts)
      )
      this.provider.on('chainChanged', (id) => this._onNetworkChanged({ id }))

      this.config.id = await this.checkNetworkVersion()

      return toChecksumAddress(account)
    } catch (err) {
      throw new Error(`Provider method _initProvider has error: ${err.message}`)
    }
  }

  /**
   * Subscribe to event in provider.
   *
   * @param method {string}
   * @param {function} callback
   * @returns {*}
   */
  on(method, callback) {
    if (method) {
      this.provider.on(method, callback)
    }
  }

  /**
   * Send a request to the provider (old api).
   *
   * @param options {object}
   * @param {string} params.method.
   * @param {string} params.params.
   * @param {string} params.from.
   * @returns {*}
   */
  _sendAsync({ method, params, from }) {
    const { id } = this.config

    switch (id) {
      case 77:
      case 99:
      case 100:
        from = undefined
        break
    }

    return new Promise((resolve, reject) => {
      const callback = (err, response) => {
        if (err || response.error) {
          reject(err)
        }

        resolve(response.result)
      }

      this.provider.sendAsync(
        {
          method,
          params,
          jsonrpc: '2.0',
          from,
        },
        callback
      )
    })
  }

  /**
   * Send a request to the provider (old api).
   *
   * @param options {object}
   * @param {string} params.method.
   * @param {string} params.params.
   * @returns {*}
   */
  async _send({ method, params }) {
    try {
      return await this.provider.send(method, params)
    } catch (err) {
      throw new Error(`Provider method _send has error: ${err.message}`)
    }
  }

  /**
   * Set network id.
   *
   * @param params {object}
   * @param {string} params.id.
   * @returns {*}
   */
  _onNetworkChanged({ id, callback }) {
    if (id) {
      this.network = id
      if (typeof callback === 'function') {
        callback()
      }
      window.location.reload()
    }
  }

  /**
   * Set default address to the provider.
   *
   * @param accounts {String[]}.
   * @returns {*}
   */
  _onAccountsChanged(accounts) {
    const [account] = accounts

    if (account) {
      this.address = toChecksumAddress(account)
      window.location.reload()
    }
  }

  /**
   * Check version currently provider.
   *
   */
  _checkVersion() {
    if (this.provider && this.provider.request) {
      this.version = 'new'
    } else {
      this.version = 'old'
    }
  }

  /**
   * Repeat the function call as many times as needed.
   *
   * @function action.
   * @function totalAttempts {number}
   * @function retryAttempt {number}
   * @returns {*}
   */
  _repeatUntilResult(action, totalAttempts, retryAttempt = 1) {
    return new Promise((resolve, reject) => {
      const iteration = async () => {
        const result = await action()

        if (!result) {
          if (retryAttempt <= totalAttempts) {
            retryAttempt++
            setTimeout(iteration, 1000 * retryAttempt)
          } else {
            return reject(new Error('Tx not minted'))
          }
        } else {
          resolve(result)
        }
      }

      iteration()
    })
  }
}

export default Provider
