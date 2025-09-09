import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
	ICredentialTestRequest,
} from 'n8n-workflow';

export class ScrapflyApi implements ICredentialType {
	name = 'ScrapflyApi';
	displayName = 'ScrapflyApi API';
	documentationUrl = 'https://scrapfly.io/dashboard';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			qs: {
				key: '={{$credentials.apiKey}}'
			},
		},
	};
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.scrapfly.io/',
			url: 'account',
		},
	};	
}
