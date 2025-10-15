import { IExecuteFunctions, INodeExecutionData, NodeApiError, IHttpRequestOptions } from 'n8n-workflow';
import { DefineScreenshotParams } from './params';

interface screenshotError extends Record<string, any> {
	scrapflyErrorCode: string;
	httpCode: string;
	message: string;
}

export async function screenshot(
	this: IExecuteFunctions,
	i: number,
	item: INodeExecutionData,
	userAgent: string,
	apiHost: string,
): Promise<any> {
	let responseData;
	const params = DefineScreenshotParams.call(this, i);

	const url = params.get('url');
	const format = params.get('format') || 'jpg';
	let fileName = params.get('fileName') || (url ? url.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'unknown');
	fileName = fileName + '.' + format;

	const options: IHttpRequestOptions = {
		headers: {
			accept: 'application/json',
			'accept-encoding': 'gzip, deflate, br',
			'user-agent': userAgent,
		},
		method: 'GET',
		url: `${apiHost}/screenshot?${params.toString()}`,
		//@ts-ignore
		resolveWithFullResponse: true,
		encoding: null as unknown as IHttpRequestOptions['encoding'],
		json: true
	};

	try {
		responseData = await this.helpers.requestWithAuthentication.call(this, 'ScrapflyApi', options);

		const mimeType = responseData.headers['content-type'] || 'application/octet-stream';

		const newItem: INodeExecutionData = {
			json: item.json,
			binary: {},
			pairedItem: { item: i },
		};

		if (item.binary !== undefined) {
			Object.assign(newItem.binary!, item.binary);
		}

		item = newItem;
		const dataPropertyNameDownload = fileName;

		item.binary![dataPropertyNameDownload] = await this.helpers.prepareBinaryData(
			responseData.body as Buffer,
			fileName as string,
			mimeType as string,
		);

		return item;
	} catch (e: any) {
		const error: screenshotError = {
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
				// in case string was double-quoted
                if (typeof body === 'string') {
                    body = JSON.parse(body);
                }
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
