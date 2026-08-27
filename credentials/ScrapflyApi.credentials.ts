import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
	ICredentialTestRequest,
} from 'n8n-workflow';

export class ScrapflyApi implements ICredentialType {
	// This string is the credential type id that shipped in 0.1.8. Renaming it orphans
	// every saved credential and breaks the `ScrapflyApi` lookups in nodes/Scrapfly.
	// eslint-disable-next-line n8n-nodes-base/cred-class-field-name-uppercase-first-char -- id is public API
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
