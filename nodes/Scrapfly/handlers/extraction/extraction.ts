import { IExecuteFunctions, NodeApiError, IHttpRequestOptions } from 'n8n-workflow';
import { DefineExtractionParams } from './params';

interface extractionError extends Record<string, any> {
	scrapflyErrorCode: string;
	httpCode: string;
	message: string;
}

export async function extract(this: IExecuteFunctions, i: number, userAgent: string): Promise<any> {
	let responseData;

	const params = DefineExtractionParams.call(this, i);
	const options: IHttpRequestOptions = {
		headers: {
			accept: 'application/json',
			'user-agent': userAgent,
		},
		method: 'POST',
		url: `https://api.scrapfly.io/extraction?${params.toString()}`,
		json: true,
		returnFullResponse: true
	};

	options.body = params.get('body');

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
