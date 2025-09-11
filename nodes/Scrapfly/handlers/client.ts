import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { scrape } from './scrape/scrape';
import { extract } from './extraction/extraction';
import { screenshot } from './screenshot/screenshot';
import { account } from './account/account';

export class scrapflyClient {
	private context: IExecuteFunctions;
	private i: number;
	private userAgent: string;
	private item: INodeExecutionData;
	private apiHost: string;

	constructor(context: IExecuteFunctions, i: number, version: string, item: INodeExecutionData) {
		this.context = context;
		this.i = i;
		this.userAgent = `n8n integration v${version}`;
		this.item = item;
		this.apiHost = 'https://api.scrapfly.io';
	}

	async scrape(): Promise<any> {
		return await scrape.call(this.context, this.i, this.userAgent, this.apiHost);
	}

	async extract(): Promise<any> {
		return await extract.call(this.context, this.i, this.userAgent, this.apiHost);
	}

	async screenshot(): Promise<any> {
		return await screenshot.call(this.context, this.i, this.item, this.userAgent, this.apiHost);
	}

	async account(): Promise<any> {
		return await account.call(this.context, this.userAgent, this.apiHost);
	}
}
