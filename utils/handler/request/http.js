const axios = require('axios');
const extApiConfig = require('../../../config/extApiConfig.json');
const { BadRequestError } = require('../error');
const baseUrl = extApiConfig.extBaseUrl
const apis = extApiConfig.APIS
const baseUrlPlaceHolder = "<__extBaseUrl__>"
module.exports = async (api_name, data, other) => {
    data = data || null;

    return new Promise((resolve, reject) => {
        const api = apis[api_name]
        if (!api) {
            throw new Error(`${api_name} not found`)
        }
        // const api = apis.wallet_create
        let _url = api.url
        if (other) {
            const _urlArr = _url.split("/:")
            for (let i = 1; i < _urlArr.length; i++) {
                _urlArr[i] = other.params[_urlArr[i]]

            }
            _url = _urlArr.join('/')
        }

        let url = _url.replace(baseUrlPlaceHolder, baseUrl)

        const options = {
            url,
            method: api.method
        }
        if (api.method == "post" || api.method == "put")
            options.data = data
        if (api.headers.Apikey) {
            options.headers = {
                Apikey: process.env.EXT_API_KEY
            }
        }
        axios(options).then((res) => {
            resolve(res.data)
        }).catch(err => {
            const error = new BadRequestError(err.response.data.message,{},"BadRequestError",err.response.data.message)
            reject(error)
        })
    })

}