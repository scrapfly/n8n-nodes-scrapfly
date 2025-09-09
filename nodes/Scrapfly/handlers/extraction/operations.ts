import { INodeProperties } from 'n8n-workflow';

export const Extraction: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['Extraction'],
			},
		},
		options: [
			{
				name: 'Extract Data From an HTML, Text, or Markdown Document Using AI',
				value: 'WebPageDataExtraction',
				action: 'Extract data from an html text or markdown document using ai',
				description:
					'Extracts structured data from any text content. Uses AI, LLM, and custom parsing instructions.',
			},
		],
		default: 'WebPageDataExtraction',
		noDataExpression: true,
	},
	{
		displayName: 'Body',
		name: 'body',
		type: 'string',
		required: true,
		default: '',
		description:
			'The request body must contain the content of the page you want to extract data from. The content must be in the format specified by the `content_type` HTTP parameter.',
		displayOptions: {
			show: {
				operation: ['WebPageDataExtraction'],
				resource: ['Extraction'],
			},
		},
	},
	{
		displayName: 'Content Type',
		name: 'content_type',
		type: 'string',
		required: true,
		default: 'text/html',
		description:
			'Content type of the document pass in the body - You must specify the content type of the document by using this parameter',
		displayOptions: {
			show: {
				operation: ['WebPageDataExtraction'],
				resource: ['Extraction'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		default: {},
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				operation: ['WebPageDataExtraction'],
				resource: ['Extraction'],
			},
		},
		options: [
			{
				displayName: 'URL',
				description:
					'This URL is used to transform any relative URLs in the document into absolute URLs automatically',
				name: 'url',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Charset',
				description:
					'Charset of the document pass in the body. If you are not sure, you can use the `auto` value and we will try to detect it.',
				name: 'charset',
				type: 'string',
				default: 'auto',
			},
			{
				displayName: 'Extraction Template',
				description: 'Define an extraction template to get structured data',
				name: 'extraction_template',
				type: 'json',
				default: '',
			},
			{
				displayName: 'Extraction Prompt',
				description: 'AI Extraction to auto parse the scraped document to get structured data',
				name: 'extraction_prompt',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Extraction Model',
				description: 'AI Extraction to auto parse the scraped document to get structured data',
				name: 'extraction_model',
				type: 'options',
				options: [
					{ name: 'Article', value: 'article' },
					{ name: 'Event', value: 'event' },
					{ name: 'Food Recipe', value: 'food_recipe' },
					{ name: 'Hotel', value: 'hotel' },
					{ name: 'Hotel Listing', value: 'hotel_listing' },
					{ name: 'Job Listing', value: 'job_listing' },
					{ name: 'Job Posting', value: 'job_posting' },
					{ name: 'Organization', value: 'organization' },
					{ name: 'Product', value: 'product' },
					{ name: 'Product Listing', value: 'product_listing' },
					{ name: 'Real Estate Property', value: 'real_estate_property' },
					{ name: 'Real Estate Property Listing', value: 'real_estate_property_listing' },
					{ name: 'Review List', value: 'review_list' },
					{ name: 'Search Engine Results', value: 'search_engine_results' },
					{ name: 'Social Media Post', value: 'social_media_post' },
					{ name: 'Software', value: 'software' },
					{ name: 'Stock', value: 'stock' },
					{ name: 'Vehicle Ad', value: 'vehicle_ad' },
					{ name: 'Vehicle Ad Listing', value: 'vehicle_ad_listing' },
				],
				default: 'product'
			},
			{
				displayName: 'Webhook Name',
				description:
					'Queue your data extraction request and redirect API response to a provided webhook endpoint',
				name: 'webhook_name',
				type: 'string',
				default: '',
			},
		],
	},
];
