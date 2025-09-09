import { IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';

export async function account(this: IExecuteFunctions, userAgent: string): Promise<any> {
	let responseData;
	const options: IHttpRequestOptions = {
		headers: {
			accept: 'application/json',
			'accept-encoding': 'gzip, deflate, br',
			'user-agent': userAgent,
		},
		method: 'GET',
		url: 'https://api.scrapfly.io/account',
		json: true,
	};

	responseData = await this.helpers.requestWithAuthentication.call(this, 'ScrapflyApi', options);
	return responseData;
}
