import { IExecuteFunctions, NodeApiError, IHttpRequestOptions } from 'n8n-workflow';
import { DefineExtractionParams } from './params';
import { ScrapflyError } from '../utils';

export async function extract(this: IExecuteFunctions, i: number, userAgent: string, apiHost: string): Promise<any> {
	let responseData;
	const requestBody = this.getNodeParameter('body', i) as string;
	const content_type = this.getNodeParameter('content_type', i) as string;

	const params = DefineExtractionParams.call(this, i);
	const options: IHttpRequestOptions = {
		headers: {
			accept: 'application/json',
			'accept-encoding': 'gzip, deflate, br',
			'user-agent': userAgent,
			'content-type': content_type,
		},
		method: 'POST',
		url: `${apiHost}/extraction?${params.toString()}`,
		json: true,
		returnFullResponse: true
	};

	options.body = requestBody;

	try {
		responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'ScrapflyApi', options);
		return responseData;
	} catch (e: any) {
		const error: ScrapflyError = {
			scrapflyError: 'Error',
			httpCode: 'Code',
			message: 'Message',
		};

		if (e.context.data) {
			error.httpCode = e.context.data.http_code || error.httpCode;
			error.scrapflyError = e.context.data.code || error.scrapflyError;
			error.message = e.context.data.message || error.message;
		}

		throw new NodeApiError(this.getNode(), error, {
            httpCode: error.httpCode,
            description: error.message,
            message: error.scrapflyError
		});
	}
}
