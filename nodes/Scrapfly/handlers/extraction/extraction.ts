import { IExecuteFunctions, NodeApiError, IHttpRequestOptions } from 'n8n-workflow';
import { DefineExtractionParams } from './params';

interface extractionError extends Record<string, any> {
	scrapflyErrorCode: string;
	httpCode: string;
	message: string;
}

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
		responseData = await this.helpers.requestWithAuthentication.call(this, 'ScrapflyApi', options);
		return responseData;
	} catch (e: any) {
		const error: extractionError = {
			scrapflyErrorCode: 'Error',
			httpCode: 'Code',
			message: 'Message'
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
		error.scrapflyErrorCode = body?.code || error.scrapflyErrorCode;
		error.message = body?.message || error.message;

		throw new NodeApiError(this.getNode(), error, {
			httpCode: error.httpCode,
			description: error.message,
			message: error.scrapflyErrorCode,
		});
	}
}
