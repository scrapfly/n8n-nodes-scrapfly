import { IExecuteFunctions, NodeApiError, IHttpRequestOptions } from 'n8n-workflow';
import { DefineScrapeParams } from './params';
import { ScrapflyError } from '../utils';

async function handleLargeObject(
	this: IExecuteFunctions,
	userAgent: string,
	apiHost: string,
	result: any,
	format: 'clob' | 'blob',
): Promise<any> {
	const options: IHttpRequestOptions = {
		headers: {
			'accept-encoding': 'gzip, deflate, br',
			'user-agent': userAgent,
		},
		method: 'GET',
		url: result.content,
		json: true,
		returnFullResponse: true,
		encoding: 'arraybuffer',
	};

	const content = await this.helpers.httpRequestWithAuthentication.call(this, 'ScrapflyApi', options);

	if (format === 'clob') {
		result.format = 'text';
		result.content = content;
	} else if (format === 'blob') {
		result.format = 'binary';
		result.content = content.toString('base64'); // buffer to base64
	}

	return result;
}

export async function scrape(this: IExecuteFunctions, i: number, userAgent: string, apiHost: string): Promise<any> {
	let responseData;

	const params = DefineScrapeParams.call(this, i);
	const method = this.getNodeParameter('method', i) as string;
	const options: IHttpRequestOptions = {
		headers: {
			accept: 'application/json',
			'accept-encoding': 'gzip, deflate, br',
			'user-agent': userAgent,
		},
		method: method as any,
		url: `${apiHost}/scrape?${params.toString()}`,
		json: true,
	};

	// add request body if the method is POST, PUT, or PATCH
	if (['POST', 'PUT', 'PATCH'].includes(method) && params.has('body')) {
		options.body = params.get('body');
		params.delete('body');
	}

	try {
		responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'ScrapflyApi', options);
		const format = responseData.result.format;
		if (format === 'clob' || format === 'blob') {
			responseData.result = await handleLargeObject.call(
				this,
				userAgent,
				apiHost,
				responseData.result,
				format,
			);
		}

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
