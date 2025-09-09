import { IExecuteFunctions, NodeApiError, IHttpRequestOptions } from 'n8n-workflow';
import { DefineScrapeParams } from './params';

interface scrapeError {
	scrapflyErrorCode: string;
	httpCode: string;
	message: string;
}

async function handleLargeObject(
	this: IExecuteFunctions,
	userAgent: string,
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
		json: false,
		encoding: 'arraybuffer',
	};

	const content = await this.helpers.requestWithAuthentication.call(this, 'ScrapflyApi', options);

	if (format === 'clob') {
		result.format = 'text';
		result.content = content;
	} else if (format === 'blob') {
		result.format = 'binary';
		result.content = content.toString('base64'); // buffer to base64
	}

	return result;
}

export async function scrape(this: IExecuteFunctions, i: number, userAgent: string): Promise<any> {
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
		url: `https://api.scrapfly.io/scrape?${params.toString()}`,
		json: true,
	};

	// add request body if the method is POST, PUT, or PATCH
	if (['POST', 'PUT', 'PATCH'].includes(method) && params.has('body')) {
		options.body = params.get('body');
		params.delete('body');
	}

	try {
		responseData = await this.helpers.requestWithAuthentication.call(this, 'ScrapflyApi', options);
		const format = responseData.result.format;
		if (format === 'clob' || format === 'blob') {
			responseData.result = await handleLargeObject.call(
				this,
				userAgent,
				responseData.result,
				format,
			);
		}

		return responseData;
	} catch (e: any) {
		const error: scrapeError = {
			scrapflyErrorCode: 'Error',
			httpCode: 'Code',
			message: 'Message',
		};

		const body = e.cause.error;
		error.httpCode = e.httpCode || error.httpCode;

		if (
			body.result &&
			(body.result.error || (body.result.success === false && body.result.status_code !== 200))
		) {
			error.scrapflyErrorCode = body.result.error?.code || error.scrapflyErrorCode;
			error.message = body.result.error?.message || error.message;
		} else {
			error.scrapflyErrorCode = body.code || error.scrapflyErrorCode;
			error.message = body.message || error.message;
		}

		throw new NodeApiError(this.getNode(), e, {
			httpCode: error.httpCode,
			description: `[${error.scrapflyErrorCode}] ${error.message}`,
			message: error.message,
		});
	}
}
