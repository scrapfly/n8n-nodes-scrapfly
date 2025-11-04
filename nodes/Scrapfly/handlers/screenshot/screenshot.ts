import { IExecuteFunctions, INodeExecutionData, NodeApiError, IHttpRequestOptions } from 'n8n-workflow';
import { DefineScreenshotParams } from './params';
import { ScrapflyError } from '../utils';

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
			accept: `image/${format}, application/json`,
			'accept-encoding': 'gzip, deflate, br',
			'user-agent': userAgent,
		},
		method: 'GET',
		url: `${apiHost}/screenshot?${params.toString()}`,
		returnFullResponse: true,
		encoding: 'arraybuffer',
		json: false
	};

	try {
		responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'ScrapflyApi', options);

		const mimeType = responseData.headers?.['content-type'] || `image/${format}`;

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

		// convert to buffer
		const binaryBuffer = Buffer.isBuffer(responseData.body) 
			? responseData.body 
			: Buffer.from(responseData.body);

		item.binary![dataPropertyNameDownload] = await this.helpers.prepareBinaryData(
			binaryBuffer,
			fileName as string,
			mimeType as string,
		);

		return item;
	} catch (e: any) {
		const error: ScrapflyError = {
			scrapflyError: 'Error',
			httpCode: 'Code',
			message: 'Message',
		};

		if (e.context.data) {
			let errorData = e.context.data;
			
			// on failure, parse the error data as json
			if (Buffer.isBuffer(errorData)) {
				try {
					errorData = JSON.parse(errorData.toString('utf8'));
				} catch (parseError) {
					error.message = errorData.toString('utf8') || error.message;
					throw new NodeApiError(this.getNode(), error, {
						httpCode: error.httpCode,
						description: error.message,
						message: error.scrapflyError
					});
				}
			}
			
			error.httpCode = errorData.http_code || error.httpCode;
			error.scrapflyError = errorData.code || error.scrapflyError;
			error.message = errorData.message || error.message;
		}

		throw new NodeApiError(this.getNode(), error, {
            httpCode: error.httpCode,
            description: error.message,
            message: error.scrapflyError
		});
	}
}
