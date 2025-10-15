import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription
} from 'n8n-workflow';

import { scrapflyClient } from './handlers/client';
import { Scrape } from './handlers/scrape/operations';
import { Extraction } from './handlers/extraction/operations';
import { Screenshot } from './handlers/screenshot/operations';
import { Account } from './handlers/account/operations';
import { version } from '../../package.json';

export class Scrapfly implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scrapfly',
		name: 'Scrapfly',
		icon: 'file:scrapfly.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description:
			'Scrapfly data collection APIs for web page scraping, screenshots, and AI data extraction',
		defaults: {
			name: 'Scrapfly',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'ScrapflyApi',
				required: true,
			},
		],
		properties: [
			// resources
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Scrape',
						value: 'Scrape',
					},
					{
						name: 'Extraction',
						value: 'Extraction',
					},
					{
						name: 'Screenshot',
						value: 'Screenshot',
					},
					{
						name: 'Account',
						value: 'Account',
					},
				],
				default: 'Scrape',
			},
			// operations
			...Scrape,
			...Extraction,
			...Screenshot,
			...Account,
		],
	};

async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];
	const length = items.length;

	for (let i = 0; i < length; i++) {
		try {
			const resource = this.getNodeParameter('resource', i) as string;
			const client = new scrapflyClient(this, i, version, items[i]);
			let responseData;

			switch (resource) {
				case 'Scrape':
					responseData = await client.scrape();
					break;
				case 'Extraction':
					responseData = await client.extract();
					break;
				case 'Screenshot':
					responseData = await client.screenshot();
					break;
				case 'Account':
					responseData = await client.account();
					break;
				default:
					throw new Error(`Unsupported resource: ${resource}`);
			}

			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(responseData),
				{ itemData: { item: i } },
			);
			returnData.push(...executionData);
		} catch (error) {
			if (this.continueOnFail()) {
				const executionErrorData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray({ error: (error as Error).message }),
					{ itemData: { item: i } },
				);
				returnData.push(...executionErrorData);
				continue;
			}
			throw error;
		}
	}

	return [returnData];
	}
}
