import { IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';

export async function account(this: IExecuteFunctions, userAgent: string, apiHost: string): Promise<any> {
	let responseData;
	const options: IHttpRequestOptions = {
		headers: {
			accept: 'application/json',
			'accept-encoding': 'gzip, deflate, br',
			'user-agent': userAgent,
		},
		method: 'GET',
		url: `${apiHost}/account`,
		json: true,
	};

	responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'ScrapflyApi', options);
	return responseData;
}
