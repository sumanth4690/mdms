import axios from 'axios'
const token: any = localStorage?.getItem('access_token')
export const access_token = JSON.parse(token)?.access_token || ''
export const utilityId = JSON.parse(localStorage.getItem('utilityId'))
let http = axios.create({
	baseURL: process.env.REACT_APP_API_HOST,
	headers: {
		Accept: 'application/json',
		// 'Ocp-Apim-Subscription-Key': '9640c68c7c3e445bbddf732801c6ec6a',
		// 'Ocp-Apim-Subscription-Key': 'AIzaSyB2b2OkyLLst6_PrAi2bOQl4Kj-kHz-KIw',
		// 'Ocp-Apim-Trace': 'true',
		'Access-Control-Allow-Origin': '*'
	},
})

http.interceptors.response.use(
	function (response) {
		return response
	},
	function (err) {
		if (err.response.status == 401) {
			if (err.response.config.url === '/auth/login') {
				return Promise.reject(err)
			}
			localStorage.clear()
			window.location.href = '/'
			console.log('err', err)
		}

		return Promise.reject(err)
	}
)

export default http
