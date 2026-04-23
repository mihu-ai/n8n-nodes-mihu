import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class MihuApi implements ICredentialType {
	name = 'mihuApi';
	displayName = 'Mihu AI API';
	documentationUrl = 'https://developers.mihu.ai';
	icon = 'file:../nodes/Mihu/mihu.svg' as const;
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
			placeholder: 'acme',
			description: 'Your Mihu AI subdomain (e.g. acme for acme.mihu.ai)',
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