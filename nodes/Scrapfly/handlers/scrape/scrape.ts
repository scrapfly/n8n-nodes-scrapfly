import { IExecuteFunctions, NodeApiError, IHttpRequestOptions } from 'n8n-workflow';
import { DefineScrapeParams } from './params';

interface scrapeError extends Record<string, any> {
    scrapflyErrorCode: string;
    httpCode: string;
    message: string;
}

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
		responseData = await this.helpers.requestWithAuthentication.call(this, 'ScrapflyApi', options);
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
		const error: scrapeError = {
			scrapflyErrorCode: 'Error',
			httpCode: 'Code',
			message: 'Message',
		};

		let body;
		
        if (Array.isArray(e.messages) && e.messages.length > 0) {
            try {
				const message = e.messages[0];			
				const jsonResponse = message.replace(/^\s*\d+\s*-\s*/, "");
                body = JSON.parse(jsonResponse);
            }
            catch (err) {
                body = e.description;
            }
        }
        else {
            body = e.description;
        }
	
		error.httpCode = e.httpCode || error.httpCode;

		if (body && body.result &&
			(body.result.error || (body.result.success === false && body.result.status_code !== 200))) {
			error.scrapflyErrorCode = body.result.error?.code || error.scrapflyErrorCode;
			error.message = body.result.error?.message || error.message;
		} else if (body) {
			error.scrapflyErrorCode = body.code || error.scrapflyErrorCode;
			error.message = body.message || error.message;
		} else {
			error.message = e.message || 'Unknown error occurred';
		}

		throw new NodeApiError(this.getNode(), error, {
            httpCode: error.httpCode,
            description: error.message,
            message: error.scrapflyErrorCode
		});
	}
}
