import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class MihuApi implements ICredentialType {
	name = 'mihuApi';
	displayName = 'Mihu AI API';
	documentationUrl = 'https://mihu.ai/docs';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
		{
			displayName: 'Account Domain',
			name: 'accountDomain',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'flexicar',
			description: 'Your Mihu AI subdomain (e.g. flexicar, minders)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '=https://{{$credentials.accountDomain}}.mihu.ai',
			url: '/api/v1/contacts?limit=1',
		},
	};
}