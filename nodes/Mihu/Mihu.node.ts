import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	NodeApiError,
	NodeOperationError,
	JsonObject,
} from 'n8n-workflow';

export class Mihu implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Mihu AI',
		name: 'mihu',
		icon: 'file:mihu.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with Mihu AI contact center and voice agent platform',
		usableAsTool: true,
		defaults: { name: 'Mihu AI' },
		inputs: ['main'],
		outputs: ['main'],
		credentials: [{ name: 'mihuApi', required: true }],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Agent', value: 'agent' },
					{ name: 'Appointment', value: 'appointment' },
					{ name: 'Call', value: 'call' },
					{ name: 'Contact', value: 'contact' },
					{ name: 'Conversation', value: 'conversation' },
					{ name: 'Dataset', value: 'dataset' },
					{ name: 'Listing', value: 'listing' },
					{ name: 'SMS', value: 'sms' },
					{ name: 'Task', value: 'task' },
					{ name: 'WhatsApp', value: 'whatsapp' },
				],
				default: 'contact',
			},

			// ── AGENT OPERATIONS ─────────────────────────────────────
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['agent'] } },
				options: [
					{ name: 'Add Note', value: 'addNote', action: 'Add a note to an agent' },
					{ name: 'Add Webhook', value: 'addWebhook', action: 'Add a webhook to an agent' },
					{ name: 'Create', value: 'create', action: 'Create an agent' },
					{ name: 'Update', value: 'update', action: 'Update an agent' },
					{ name: 'Update Training', value: 'updateTraining', action: 'Update training data for an agent' },
					{ name: 'Update Webhook', value: 'updateWebhook', action: 'Update a webhook on an agent' },
				],
				default: 'create',
			},

			// ── CONTACT OPERATIONS ───────────────────────────────────
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['contact'] } },
				options: [
					{ name: 'Create', value: 'create', action: 'Create a contact' },
					{ name: 'Delete', value: 'delete', action: 'Delete a contact' },
					{ name: 'Find', value: 'find', action: 'Find a contact' },
					{ name: 'Update', value: 'update', action: 'Update a contact' },
				],
				default: 'create',
			},

			// ── CALL OPERATIONS ──────────────────────────────────────
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['call'] } },
				options: [
					{ name: 'Create Call', value: 'create', action: 'Create a call' },
				],
				default: 'create',
			},

			// ── CONVERSATION OPERATIONS ──────────────────────────────
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['conversation'] } },
				options: [
					{ name: 'Get', value: 'get', action: 'Get a conversation' },
					{ name: 'List', value: 'list', action: 'List conversations' },
					{ name: 'List Messages', value: 'listMessages', action: 'List messages of a conversation' },
				],
				default: 'list',
			},

			// ── SMS OPERATIONS ───────────────────────────────────────
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['sms'] } },
				options: [
					{ name: 'Send SMS', value: 'send', action: 'Send an SMS message' },
				],
				default: 'send',
			},

			// ── WHATSAPP OPERATIONS ──────────────────────────────────
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['whatsapp'] } },
				options: [
					{
						name: 'Send WhatsApp Template',
						value: 'sendTemplate',
						// eslint-disable-next-line n8n-nodes-base/node-param-operation-option-action-miscased
						action: 'Send a WhatsApp template message',
					},
				],
				default: 'sendTemplate',
			},

			// ── DATASET OPERATIONS ───────────────────────────────────
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['dataset'] } },
				options: [
					{ name: 'Assign to Agent', value: 'assignToAgent', action: 'Link a dataset to an AI agent' },
					{ name: 'Create Record', value: 'createRecord', action: 'Add a new record to a dataset' },
					{ name: 'Delete Record', value: 'deleteRecord', action: 'Delete a record from a dataset' },
					{ name: 'Find', value: 'find', action: 'Find a dataset by ID' },
					{ name: 'List Records', value: 'listRecords', action: 'Get all records from a dataset' },
					{ name: 'Send Text Prompt', value: 'sendTextPrompt', action: 'Import plain text as training data' },
					{ name: 'Sync', value: 'sync', action: 'Sync and refresh a dataset' },
					{ name: 'Update Record', value: 'updateRecord', action: 'Update an existing record' },
				],
				default: 'createRecord',
			},

			// ── APPOINTMENT OPERATIONS ───────────────────────────────
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['appointment'] } },
				options: [
					{ name: 'Create', value: 'create', action: 'Create an appointment' },
					{ name: 'Delete', value: 'delete', action: 'Delete an appointment' },
					{ name: 'Find All', value: 'findAll', action: 'Get all appointments' },
					{ name: 'Update', value: 'update', action: 'Update an appointment' },
					{ name: 'Update Status', value: 'updateStatus', action: 'Update appointment status' },
				],
				default: 'create',
			},

			// ── TASK OPERATIONS ──────────────────────────────────────
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['task'] } },
				options: [
					{ name: 'Create', value: 'create', action: 'Create a scheduled task' },
				],
				default: 'create',
			},

			// ── LISTING OPERATIONS ───────────────────────────────────
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['listing'] } },
				options: [
					{ name: 'Create', value: 'create', action: 'Create a listing' },
					{ name: 'Delete Contact', value: 'deleteContact', action: 'Remove a contact from a listing' },
					{ name: 'Send Contacts', value: 'sendContacts', action: 'Add contacts to a listing' },
				],
				default: 'create',
			},

			// ═══════════════════════════════════════════════════════════
			// AGENT FIELDS
			// ═══════════════════════════════════════════════════════════

			// Agent UUID dropdown (for update, addWebhook, updateWebhook, addNote, updateTraining)
			{
				displayName: 'Agent Name or ID',
				name: 'agentUuidDropdown',
				type: 'options',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'getAgents' },
				required: true,
				default: '',
				displayOptions: { show: { resource: ['agent'], operation: ['update', 'addWebhook', 'updateWebhook', 'addNote', 'updateTraining'] } },
			},

			// Basic agent fields (create + update)
			{
				displayName: 'Name',
				name: 'agentName',
				type: 'string',
				required: true,
				default: '',
				description: 'Name of the AI agent',
				displayOptions: { show: { resource: ['agent'], operation: ['create'] } },
			},
			{
				displayName: 'Name',
				name: 'agentName',
				type: 'string',
				default: '',
				description: 'Name of the AI agent',
				displayOptions: { show: { resource: ['agent'], operation: ['update'] } },
			},
			{
				displayName: 'Description',
				name: 'agentDescription',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['agent'], operation: ['create', 'update'] } },
			},
			{
				displayName: 'Company Name',
				name: 'agentCompanyName',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['agent'], operation: ['create', 'update'] } },
			},
			{
				displayName: 'Role',
				name: 'agentRole',
				type: 'string',
				default: '',
				placeholder: 'Sales Representative',
				displayOptions: { show: { resource: ['agent'], operation: ['create', 'update'] } },
			},
			{
				displayName: 'Objective',
				name: 'agentObjective',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				displayOptions: { show: { resource: ['agent'], operation: ['create', 'update'] } },
			},
			{
				displayName: 'Tone',
				name: 'agentTone',
				type: 'string',
				default: '',
				placeholder: 'Professional, Friendly',
				displayOptions: { show: { resource: ['agent'], operation: ['create', 'update'] } },
			},
			{
				displayName: 'Behavior Guidelines',
				name: 'agentBehaviorGuidelines',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				displayOptions: { show: { resource: ['agent'], operation: ['create', 'update'] } },
			},
			{
				displayName: 'Company Service',
				name: 'agentCompanyService',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['agent'], operation: ['create', 'update'] } },
			},
			{
				displayName: 'Topic',
				name: 'agentTopic',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['agent'], operation: ['create', 'update'] } },
			},
			{
				displayName: 'Language',
				name: 'agentLanguage',
				type: 'string',
				default: 'en',
				placeholder: 'en',
				displayOptions: { show: { resource: ['agent'], operation: ['create', 'update'] } },
			},
			{
				displayName: 'Speed',
				name: 'agentSpeed',
				type: 'options',
				options: [
					{ name: 'Normal', value: 'normal' },
					{ name: 'Fast', value: 'fast' },
				],
				default: 'normal',
				displayOptions: { show: { resource: ['agent'], operation: ['create', 'update'] } },
			},
			{
				displayName: 'Timezone',
				name: 'agentTimezone',
				type: 'string',
				default: '',
				placeholder: 'Europe/Istanbul',
				displayOptions: { show: { resource: ['agent'], operation: ['create', 'update'] } },
			},
			{
				displayName: 'Status',
				name: 'agentStatus',
				type: 'options',
				options: [
					{ name: 'Completed', value: 'completed' },
					{ name: 'In Progress', value: 'in_progress' },
					{ name: 'Paused', value: 'paused' },
					{ name: 'Pending', value: 'pending' },
					{ name: 'Ready', value: 'ready' },
				],
				default: 'pending',
				displayOptions: { show: { resource: ['agent'], operation: ['create', 'update'] } },
			},
			{
				displayName: 'Custom Prompt',
				name: 'agentCustomPrompt',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
				displayOptions: { show: { resource: ['agent'], operation: ['create', 'update'] } },
			},
			{
				displayName: 'Custom LLM URL',
				name: 'agentCustomLlmUrl',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['agent'], operation: ['create', 'update'] } },
			},
			{
				displayName: 'Appointment Scheduling Enabled',
				name: 'agentAppointmentSchedulingEnabled',
				type: 'boolean',
				default: false,
				displayOptions: { show: { resource: ['agent'], operation: ['create', 'update'] } },
			},
			{
				displayName: 'Appointment Scheduling Randomly',
				name: 'agentAppointmentSchedulingRandomly',
				type: 'boolean',
				default: false,
				displayOptions: { show: { resource: ['agent'], operation: ['create', 'update'] } },
			},

			// Guidelines
			{
				displayName: 'Guidelines',
				name: 'guidelines',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				default: {},
				displayOptions: { show: { resource: ['agent'], operation: ['create', 'update'] } },
				options: [
					{
						name: 'items',
						displayName: 'Guideline',
						values: [
							{
								displayName: 'Content',
								name: 'content',
								type: 'string',
								typeOptions: { rows: 2 },
								default: '',
							},
							{
								displayName: 'Order',
								name: 'order',
								type: 'number',
								default: 0,
							},
						],
					},
				],
			},

			// Notes
			{
				displayName: 'Notes',
				name: 'agentNotes',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				default: {},
				displayOptions: { show: { resource: ['agent'], operation: ['create', 'update'] } },
				options: [
					{
						name: 'items',
						displayName: 'Note',
						values: [
							{
								displayName: 'Content',
								name: 'content',
								type: 'string',
								typeOptions: { rows: 2 },
								default: '',
							},
							{
								displayName: 'Order',
								name: 'order',
								type: 'number',
								default: 0,
							},
						],
					},
				],
			},

			// Training
			{
				displayName: 'Training',
				name: 'training',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				default: {},
				displayOptions: { show: { resource: ['agent'], operation: ['create', 'update'] } },
				options: [
					{
						name: 'items',
						displayName: 'Training Item',
						values: [
							{
								displayName: 'Content',
								name: 'content',
								type: 'string',
								typeOptions: { rows: 2 },
								default: '',
							},
							{
								displayName: 'Intent',
								name: 'intent',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Response',
								name: 'response',
								type: 'string',
								typeOptions: { rows: 2 },
								default: '',
							},
						],
					},
				],
			},

			// Procedures (JSON)
			{
				displayName: 'Procedures (JSON)',
				name: 'procedures',
				type: 'json',
				default: '[]',
				description: 'Array of procedures. Example: [{"name": "Booking", "description": "Book appointment", "steps": [{"order": 1, "description": "Ask for date"}]}].',
				displayOptions: { show: { resource: ['agent'], operation: ['create', 'update'] } },
			},

			// Settings (JSON)
			{
				displayName: 'Settings (JSON)',
				name: 'agentSettings',
				type: 'json',
				default: '{}',
				description: 'Voice and text settings. Example: {"voice": {}, "text": {}}.',
				displayOptions: { show: { resource: ['agent'], operation: ['create', 'update'] } },
			},

			// Webhook fields (addWebhook + updateWebhook)
			{
				displayName: 'Webhook UUID',
				name: 'webhookUuid',
				type: 'string',
				required: true,
				default: '',
				description: 'UUID of the webhook to update',
				displayOptions: { show: { resource: ['agent'], operation: ['updateWebhook'] } },
			},
			{
				displayName: 'Webhook URL',
				name: 'webhookUrl',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'https://your-n8n-instance.com/webhook/...',
				description: 'The URL to send webhook events to',
				displayOptions: { show: { resource: ['agent'], operation: ['addWebhook', 'updateWebhook'] } },
			},
			{
				displayName: 'Events',
				name: 'webhookEvents',
				type: 'multiOptions',
				required: true,
				options: [
					{ name: 'Conversation End Report', value: 'conversation_end_report' },
					{ name: 'Conversation Status', value: 'conversation_status' },
					{ name: 'Conversation Update', value: 'conversation_update' },
					{ name: 'Intent Call', value: 'intent_call' },
					{ name: 'Text Evaluation', value: 'text_evaluation' },
					{ name: 'Voice Evaluation', value: 'voice_evaluation' },
				],
				default: ['voice_evaluation', 'text_evaluation'],
				description: 'Events to subscribe to',
				displayOptions: { show: { resource: ['agent'], operation: ['addWebhook', 'updateWebhook'] } },
			},
			{
				displayName: 'Secret Key',
				name: 'webhookSecretKey',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'Optional secret key to sign webhook payloads',
				displayOptions: { show: { resource: ['agent'], operation: ['addWebhook', 'updateWebhook'] } },
			},
			{
				displayName: 'Active',
				name: 'webhookIsActive',
				type: 'boolean',
				default: true,
				displayOptions: { show: { resource: ['agent'], operation: ['addWebhook', 'updateWebhook'] } },
			},

			// Add Note fields
			{
				displayName: 'Note Content',
				name: 'noteContent',
				type: 'string',
				typeOptions: { rows: 3 },
				required: true,
				default: '',
				description: 'Content of the note to add',
				displayOptions: { show: { resource: ['agent'], operation: ['addNote'] } },
			},
			{
				displayName: 'Note Order',
				name: 'noteOrder',
				type: 'number',
				default: 0,
				description: 'Display order of the note',
				displayOptions: { show: { resource: ['agent'], operation: ['addNote'] } },
			},

			// Update Training fields
			{
				displayName: 'Training Items',
				name: 'trainingItems',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				required: true,
				default: {},
				description: 'Training data to set for this agent (replaces existing training)',
				displayOptions: { show: { resource: ['agent'], operation: ['updateTraining'] } },
				options: [
					{
						name: 'items',
						displayName: 'Training Item',
						values: [
							{
								displayName: 'Content',
								name: 'content',
								type: 'string',
								typeOptions: { rows: 2 },
								required: true,
								default: '',
							},
							{
								displayName: 'Intent',
								name: 'intent',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Response',
								name: 'response',
								type: 'string',
								typeOptions: { rows: 2 },
								default: '',
							},
						],
					},
				],
			},

			// ═══════════════════════════════════════════════════════════
			// CONTACT FIELDS
			// ═══════════════════════════════════════════════════════════
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { resource: ['contact'], operation: ['create'] } },
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['contact'], operation: ['create', 'update'] } },
			},
			{
				displayName: 'Surname',
				name: 'surname',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['contact'], operation: ['create', 'update'] } },
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				displayOptions: { show: { resource: ['contact'], operation: ['create', 'update'] } },
			},
			{
				displayName: 'Number Type',
				name: 'numberType',
				type: 'options',
				options: [
					{ name: 'Mobile', value: 'mobile' },
					{ name: 'Landline', value: 'landline' },
				],
				default: 'mobile',
				displayOptions: { show: { resource: ['contact'], operation: ['create', 'update'] } },
			},
			{
				displayName: 'Country Code',
				name: 'countryCode',
				type: 'string',
				default: '',
				placeholder: 'US',
				displayOptions: { show: { resource: ['contact'], operation: ['create', 'update'] } },
			},
			{
				displayName: 'Timezone',
				name: 'timezone',
				type: 'string',
				default: '',
				placeholder: 'America/New_York',
				displayOptions: { show: { resource: ['contact'], operation: ['create', 'update'] } },
			},
			{
				displayName: 'Primary Language',
				name: 'primaryLanguage',
				type: 'string',
				default: '',
				placeholder: 'en',
				displayOptions: { show: { resource: ['contact'], operation: ['create', 'update'] } },
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'Active' },
					{ name: 'Inactive', value: 'Inactive' },
				],
				default: 'Active',
				displayOptions: { show: { resource: ['contact'], operation: ['create', 'update'] } },
			},
			{
				displayName: 'Contact UUID',
				name: 'contactUuid',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['contact'], operation: ['find', 'update', 'delete'] } },
			},

			// ═══════════════════════════════════════════════════════════
			// CALL FIELDS
			// ═══════════════════════════════════════════════════════════
			{
				displayName: 'Agent Name or ID',
				name: 'agentId',
				type: 'options',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'getAgents' },
				required: true,
				default: '',
				displayOptions: { show: { resource: ['call'], operation: ['create'] } },
			},
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['call'], operation: ['create'] } },
			},
			{
				displayName: 'About (Contact Context)',
				name: 'about',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['call'], operation: ['create'] } },
			},
			{
				displayName: 'Custom Prompt',
				name: 'customPrompt',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
				displayOptions: { show: { resource: ['call'], operation: ['create'] } },
			},
			{
				displayName: 'Overwrite Prompt',
				name: 'overwritePrompt',
				type: 'boolean',
				default: false,
				displayOptions: { show: { resource: ['call'], operation: ['create'] } },
			},
			{
				displayName: 'Start Message',
				name: 'startMessage',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['call'], operation: ['create'] } },
			},

			// ═══════════════════════════════════════════════════════════
			// SMS FIELDS
			// ═══════════════════════════════════════════════════════════
			{
				displayName: 'Agent Name or ID',
				name: 'smsAgentId',
				type: 'options',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'getAgents' },
				required: true,
				default: '',
				displayOptions: { show: { resource: ['sms'], operation: ['send'] } },
			},
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string',
				required: true,
				default: '',
				placeholder: '+12345678900',
				displayOptions: { show: { resource: ['sms'], operation: ['send'] } },
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				typeOptions: { rows: 3 },
				required: true,
				default: '',
				displayOptions: { show: { resource: ['sms'], operation: ['send'] } },
			},

			// ═══════════════════════════════════════════════════════════
			// WHATSAPP FIELDS
			// ═══════════════════════════════════════════════════════════
			{
				displayName: 'Agent Name or ID',
				name: 'agentId',
				type: 'options',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'getAgents' },
				required: true,
				default: '',
				displayOptions: { show: { resource: ['whatsapp'], operation: ['sendTemplate'] } },
			},
			{
				displayName: 'Template ID',
				name: 'templateId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['whatsapp'], operation: ['sendTemplate'] } },
			},
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['whatsapp'], operation: ['sendTemplate'] } },
			},
			{
				displayName: 'Parameter 1',
				name: 'parameter1',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['whatsapp'], operation: ['sendTemplate'] } },
			},
			{
				displayName: 'Parameter 2',
				name: 'parameter2',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['whatsapp'], operation: ['sendTemplate'] } },
			},
			{
				displayName: 'Parameter 3',
				name: 'parameter3',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['whatsapp'], operation: ['sendTemplate'] } },
			},
			{
				displayName: 'Header Type',
				name: 'headerType',
				type: 'options',
				options: [
					{ name: 'Image', value: 'image' },
					{ name: 'Video', value: 'video' },
					{ name: 'Document', value: 'document' },
				],
				default: 'image',
				displayOptions: { show: { resource: ['whatsapp'], operation: ['sendTemplate'] } },
			},
			{
				displayName: 'Header URL',
				name: 'headerUrl',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['whatsapp'], operation: ['sendTemplate'] } },
			},

			// ═══════════════════════════════════════════════════════════
			// CONVERSATION FIELDS
			// ═══════════════════════════════════════════════════════════
			{
				displayName: 'Conversation UUID',
				name: 'conversationUuid',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['conversation'], operation: ['get', 'listMessages'] } },
			},
			{
				displayName: 'Phone Number Filter',
				name: 'convPhone',
				type: 'string',
				default: '',
				description: 'Filter by contact phone number (partial match)',
				displayOptions: { show: { resource: ['conversation'], operation: ['list'] } },
			},
			{
				displayName: 'Agent Name or ID',
				name: 'convAgentUuid',
				type: 'options',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'getAgents' },
				default: '',
				displayOptions: { show: { resource: ['conversation'], operation: ['list'] } },
			},
			{
				displayName: 'Channel Filter',
				name: 'convChannel',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Call', value: 'call' },
					{ name: 'SMS', value: 'sms' },
					{ name: 'WhatsApp', value: 'whatsapp' },
				],
				default: '',
				displayOptions: { show: { resource: ['conversation'], operation: ['list'] } },
			},
			{
				displayName: 'Status Filter',
				name: 'convStatus',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Active', value: 'Active' },
					{ name: 'Closed', value: 'Closed' },
				],
				default: '',
				displayOptions: { show: { resource: ['conversation'], operation: ['list'] } },
			},
			{
				displayName: 'Sort By',
				name: 'convSortBy',
				type: 'options',
				options: [
					{ name: 'Created At', value: 'created_at' },
					{ name: 'Updated At', value: 'updated_at' },
				],
				default: 'created_at',
				displayOptions: { show: { resource: ['conversation'], operation: ['list'] } },
			},
			{
				displayName: 'Sort Direction',
				name: 'convSortDir',
				type: 'options',
				options: [
					{ name: 'Descending', value: 'desc' },
					{ name: 'Ascending', value: 'asc' },
				],
				default: 'desc',
				displayOptions: { show: { resource: ['conversation'], operation: ['list'] } },
			},
			{
				displayName: 'Page',
				name: 'convPage',
				type: 'number',
				default: 1,
				displayOptions: { show: { resource: ['conversation'], operation: ['list'] } },
			},
			{
				displayName: 'Per Page',
				name: 'convPerPage',
				type: 'number',
				default: 15,
				displayOptions: { show: { resource: ['conversation'], operation: ['list'] } },
			},
			// List Messages filters
			{
				displayName: 'Sender Filter',
				name: 'msgSender',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'AI', value: 'AI' },
					{ name: 'Human', value: 'Human' },
					{ name: 'Contact', value: 'Contact' },
				],
				default: '',
				displayOptions: { show: { resource: ['conversation'], operation: ['listMessages'] } },
			},
			{
				displayName: 'Sort Direction',
				name: 'msgSortDir',
				type: 'options',
				options: [
					{ name: 'Ascending', value: 'asc' },
					{ name: 'Descending', value: 'desc' },
				],
				default: 'asc',
				displayOptions: { show: { resource: ['conversation'], operation: ['listMessages'] } },
			},
			{
				displayName: 'Page',
				name: 'msgPage',
				type: 'number',
				default: 1,
				displayOptions: { show: { resource: ['conversation'], operation: ['listMessages'] } },
			},
			{
				displayName: 'Per Page',
				name: 'msgPerPage',
				type: 'number',
				default: 25,
				displayOptions: { show: { resource: ['conversation'], operation: ['listMessages'] } },
			},

			// ═══════════════════════════════════════════════════════════
			// DATASET FIELDS
			// ═══════════════════════════════════════════════════════════
			{
				displayName: 'Dataset UUID',
				name: 'datasetUuid',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['dataset'],
						operation: ['createRecord', 'updateRecord', 'deleteRecord', 'sync', 'assignToAgent', 'find', 'listRecords'],
					},
				},
			},
			{
				displayName: 'Record ID',
				name: 'recordId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['dataset'], operation: ['updateRecord', 'deleteRecord'] } },
			},
			{
				displayName: 'Record Data (JSON)',
				name: 'recordData',
				type: 'json',
				required: true,
				default: '{}',
				displayOptions: { show: { resource: ['dataset'], operation: ['createRecord', 'updateRecord'] } },
			},
			{
				displayName: 'Agent Name or ID',
				name: 'agentUuid',
				type: 'options',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'getAgents' },
				required: true,
				default: '',
				displayOptions: { show: { resource: ['dataset'], operation: ['assignToAgent'] } },
			},
			{
				displayName: 'Dataset Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['dataset'], operation: ['sendTextPrompt'] } },
			},
			{
				displayName: 'Text Data',
				name: 'data',
				type: 'string',
				typeOptions: { rows: 6 },
				required: true,
				default: '',
				displayOptions: { show: { resource: ['dataset'], operation: ['sendTextPrompt'] } },
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['dataset'], operation: ['sendTextPrompt'] } },
			},

			// ═══════════════════════════════════════════════════════════
			// APPOINTMENT FIELDS
			// ═══════════════════════════════════════════════════════════
			{
				displayName: 'Appointment Name or ID',
				name: 'appointmentUuid',
				type: 'options',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'getAppointments' },
				required: true,
				default: '',
				displayOptions: { show: { resource: ['appointment'], operation: ['update', 'updateStatus', 'delete'] } },
			},
			{
				displayName: 'Schedule Name or ID',
				name: 'scheduleUuid',
				type: 'options',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'getSchedules' },
				required: true,
				default: '',
				displayOptions: { show: { resource: ['appointment'], operation: ['create'] } },
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['appointment'], operation: ['create', 'update'] } },
			},
			{
				displayName: 'Start Time',
				name: 'startTime',
				type: 'string',
				required: true,
				default: '',
				placeholder: '2026-03-01T10:00:00.000Z',
				displayOptions: { show: { resource: ['appointment'], operation: ['create', 'update'] } },
			},
			{
				displayName: 'End Time',
				name: 'endTime',
				type: 'string',
				required: true,
				default: '',
				placeholder: '2026-03-01T11:00:00.000Z',
				displayOptions: { show: { resource: ['appointment'], operation: ['create', 'update'] } },
			},
			{
				displayName: 'Status',
				name: 'appointmentStatus',
				type: 'options',
				options: [
					{ name: 'Approved', value: 'approved' },
					{ name: 'Pending', value: 'pending' },
					{ name: 'Cancelled', value: 'cancelled' },
				],
				default: 'pending',
				displayOptions: { show: { resource: ['appointment'], operation: ['create', 'update', 'updateStatus'] } },
			},
			{
				displayName: 'Contact UUID',
				name: 'contactUuid',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['appointment'], operation: ['create'] } },
			},
			{
				displayName: 'Notes',
				name: 'appointmentNotes',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['appointment'], operation: ['create', 'update'] } },
			},

			// ═══════════════════════════════════════════════════════════
			// TASK FIELDS
			// ═══════════════════════════════════════════════════════════
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['task'], operation: ['create'] } },
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				required: true,
				options: [
					{ name: 'Call', value: 'call' },
					{ name: 'Message', value: 'message' },
				],
				default: 'call',
				displayOptions: { show: { resource: ['task'], operation: ['create'] } },
			},
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['task'], operation: ['create'] } },
			},
			{
				displayName: 'Agent Name or ID',
				name: 'agentUuid',
				type: 'options',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'getAgents' },
				required: true,
				default: '',
				displayOptions: { show: { resource: ['task'], operation: ['create'] } },
			},
			{
				displayName: 'Scheduled At',
				name: 'scheduledAt',
				type: 'string',
				default: '',
				placeholder: '2026-03-01T14:00:00.000Z',
				displayOptions: { show: { resource: ['task'], operation: ['create'] } },
			},
			{
				displayName: 'Auto Queue',
				name: 'autoQueue',
				type: 'boolean',
				default: false,
				displayOptions: { show: { resource: ['task'], operation: ['create'] } },
			},

			// ═══════════════════════════════════════════════════════════
			// LISTING FIELDS
			// ═══════════════════════════════════════════════════════════
			{
				displayName: 'Listing Name or ID',
				name: 'listingUuid',
				type: 'options',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'getListings' },
				required: true,
				default: '',
				displayOptions: { show: { resource: ['listing'], operation: ['sendContacts', 'deleteContact'] } },
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['listing'], operation: ['create'] } },
			},
			{
				displayName: 'Campaign Type',
				name: 'campaignType',
				type: 'options',
				required: true,
				options: [
					{ name: 'Call', value: 'call' },
					{ name: 'WhatsApp', value: 'whatsapp' },
				],
				default: 'call',
				displayOptions: { show: { resource: ['listing'], operation: ['create'] } },
			},
			{
				displayName: 'Agent Name or ID',
				name: 'agentUuid',
				type: 'options',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: { loadOptionsMethod: 'getAgents' },
				required: true,
				default: '',
				displayOptions: { show: { resource: ['listing'], operation: ['create'] } },
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['listing'], operation: ['create'] } },
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'string',
				default: '',
				placeholder: '2026-03-01',
				displayOptions: { show: { resource: ['listing'], operation: ['create'] } },
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'string',
				default: '',
				placeholder: '2026-03-31',
				displayOptions: { show: { resource: ['listing'], operation: ['create'] } },
			},
			{
				displayName: 'Auto Start',
				name: 'autoStart',
				type: 'boolean',
				default: false,
				displayOptions: { show: { resource: ['listing'], operation: ['create'] } },
			},
			{
				displayName: 'Max Calls Per Day',
				name: 'maxCallsPerDay',
				type: 'number',
				default: 3,
				displayOptions: { show: { resource: ['listing'], operation: ['create'] } },
			},
			{
				displayName: 'Retry Interval (Minutes)',
				name: 'retryIntervalMinutes',
				type: 'number',
				default: 120,
				displayOptions: { show: { resource: ['listing'], operation: ['create'] } },
			},
			{
				displayName: 'Contact Phone Number',
				name: 'contactPhone',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['listing'], operation: ['sendContacts'] } },
			},
			{
				displayName: 'Contact Name',
				name: 'contactName',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['listing'], operation: ['sendContacts'] } },
			},
			{
				displayName: 'Contact Surname',
				name: 'contactSurname',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['listing'], operation: ['sendContacts'] } },
			},
			{
				displayName: 'Contact Email',
				name: 'contactEmail',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['listing'], operation: ['sendContacts'] } },
			},
			{
				displayName: 'Contact UUID',
				name: 'contactUuid',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['listing'], operation: ['deleteContact'] } },
			},
		],
	};

	methods = {
		loadOptions: {
			async getAgents(this: ILoadOptionsFunctions) {
				const credentials = await this.getCredentials('mihuApi');
				const baseURL = `https://${credentials.accountDomain}.mihu.ai/api/v1`;
				const response = await this.helpers.httpRequestWithAuthentication.call(this, 'mihuApi', {
					method: 'GET',
					url: `${baseURL}/agents?per_page=100`,
					json: true,
				}) as IDataObject;
				const data = response.data as IDataObject;
				const items = (data?.items as IDataObject[]) ?? [];
				return items.map((agent) => ({
					name: agent.name as string,
					value: agent.agent_uuid as string,
				}));
			},
			async getSchedules(this: ILoadOptionsFunctions) {
				const credentials = await this.getCredentials('mihuApi');
				const baseURL = `https://${credentials.accountDomain}.mihu.ai/api/v1`;
				const response = await this.helpers.httpRequestWithAuthentication.call(this, 'mihuApi', {
					method: 'GET',
					url: `${baseURL}/schedules`,
					json: true,
				}) as IDataObject;
				const items = (response.data as IDataObject[]) ?? [];
				return items.map((s) => ({
					name: (s.name as string) ?? (s.uuid as string),
					value: s.uuid as string,
				}));
			},
			async getAppointments(this: ILoadOptionsFunctions) {
				const credentials = await this.getCredentials('mihuApi');
				const baseURL = `https://${credentials.accountDomain}.mihu.ai/api/v1`;
				const response = await this.helpers.httpRequestWithAuthentication.call(this, 'mihuApi', {
					method: 'GET',
					url: `${baseURL}/appointments`,
					json: true,
				}) as IDataObject;
				const items = (response.data as IDataObject[]) ?? [];
				return items.map((a) => ({
					name: `${a.title ?? a.uuid} (${a.start_time ?? ''})`,
					value: a.uuid as string,
				}));
			},
			async getListings(this: ILoadOptionsFunctions) {
				const credentials = await this.getCredentials('mihuApi');
				const baseURL = `https://${credentials.accountDomain}.mihu.ai/api/v1`;
				const response = await this.helpers.httpRequestWithAuthentication.call(this, 'mihuApi', {
					method: 'GET',
					url: `${baseURL}/listings?per_page=100`,
					json: true,
				}) as IDataObject;
				const items = (response.data as IDataObject[]) ?? [];
				return items.map((l) => ({
					name: (l.name as string) ?? (l.uuid as string),
					value: l.uuid as string,
				}));
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('mihuApi');
		const baseURL = `https://${credentials.accountDomain}.mihu.ai/api/v1`;

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				let responseData: IDataObject = {};

				const req = async (method: string, url: string, body?: IDataObject): Promise<IDataObject> => {
					const opts: IDataObject = { method, url, json: true };
					if (body) opts.body = body;
					return this.helpers.httpRequestWithAuthentication.call(this, 'mihuApi', opts as Parameters<typeof this.helpers.httpRequestWithAuthentication.call>[1]) as Promise<IDataObject>;
				};

				// Helper to build agent body from parameters
				const buildAgentBody = (): IDataObject => {
					const body: IDataObject = {};

					const agentName = this.getNodeParameter('agentName', i, '') as string;
					if (agentName) body.name = agentName;

					const fields: Array<[string, string]> = [
						['agentDescription', 'description'],
						['agentCompanyName', 'company_name'],
						['agentRole', 'role'],
						['agentObjective', 'objective'],
						['agentTone', 'tone'],
						['agentBehaviorGuidelines', 'behavior_guidelines'],
						['agentCompanyService', 'company_service'],
						['agentTopic', 'topic'],
						['agentLanguage', 'language'],
						['agentSpeed', 'speed'],
						['agentTimezone', 'timezone'],
						['agentStatus', 'status'],
						['agentCustomPrompt', 'custom_prompt'],
						['agentCustomLlmUrl', 'custom_llm_url'],
					];
					for (const [param, key] of fields) {
						const v = this.getNodeParameter(param, i, '') as string;
						if (v) body[key] = v;
					}

					body.appointment_scheduling_enabled = this.getNodeParameter('agentAppointmentSchedulingEnabled', i, false);
					body.appointment_scheduling_randomly = this.getNodeParameter('agentAppointmentSchedulingRandomly', i, false);

					// Guidelines
					const guidelinesData = this.getNodeParameter('guidelines', i, {}) as IDataObject;
					const guidelineItems = (guidelinesData.items as IDataObject[]) ?? [];
					if (guidelineItems.length > 0) {
						body.guidelines = guidelineItems.map(g => ({ content: g.content, order: g.order }));
					}

					// Notes
					const notesData = this.getNodeParameter('agentNotes', i, {}) as IDataObject;
					const noteItems = (notesData.items as IDataObject[]) ?? [];
					if (noteItems.length > 0) {
						body.notes = noteItems.map(n => ({ content: n.content, order: n.order }));
					}

					// Training
					const trainingData = this.getNodeParameter('training', i, {}) as IDataObject;
					const trainingItems = (trainingData.items as IDataObject[]) ?? [];
					if (trainingItems.length > 0) {
						body.training = trainingItems.map(t => ({
							content: t.content,
							intent: t.intent || undefined,
							response: t.response || undefined,
						}));
					}

					// Procedures (JSON)
					const proceduresRaw = this.getNodeParameter('procedures', i, '[]') as string;
					try {
						const procedures = typeof proceduresRaw === 'string' ? JSON.parse(proceduresRaw) : proceduresRaw;
						if (Array.isArray(procedures) && procedures.length > 0) body.procedures = procedures;
					} catch {
						throw new NodeOperationError(this.getNode(), 'Procedures must be valid JSON array.', { itemIndex: i });
					}

					// Settings (JSON)
					const settingsRaw = this.getNodeParameter('agentSettings', i, '{}') as string;
					try {
						const settings = typeof settingsRaw === 'string' ? JSON.parse(settingsRaw) : settingsRaw;
						if (Object.keys(settings as object).length > 0) body.settings = settings;
					} catch {
						throw new NodeOperationError(this.getNode(), 'Settings must be valid JSON object.', { itemIndex: i });
					}

					return body;
				};

				if (resource === 'agent') {
					if (operation === 'create') {
						const body = buildAgentBody();
						if (!body.name) {
							throw new NodeOperationError(this.getNode(), 'Agent Name is required.', { itemIndex: i });
						}
						const res = await req('POST', `${baseURL}/agents`, body);
						responseData = (res.data as IDataObject) ?? res;
					} else if (operation === 'update') {
						const agentUuid = this.getNodeParameter('agentUuidDropdown', i) as string;
						const body = buildAgentBody();
						const res = await req('PATCH', `${baseURL}/agents/${agentUuid}`, body);
						responseData = (res.data as IDataObject) ?? res;
					} else if (operation === 'addNote') {
						const agentUuid = this.getNodeParameter('agentUuidDropdown', i) as string;
						const body: IDataObject = {
							content: this.getNodeParameter('noteContent', i),
							order: this.getNodeParameter('noteOrder', i, 0),
						};
						const res = await req('POST', `${baseURL}/agents/${agentUuid}/notes`, body);
						responseData = (res.data as IDataObject) ?? res;
					} else if (operation === 'updateTraining') {
						const agentUuid = this.getNodeParameter('agentUuidDropdown', i) as string;
						const trainingData = this.getNodeParameter('trainingItems', i, {}) as IDataObject;
						const trainingItems = (trainingData.items as IDataObject[]) ?? [];
						const body: IDataObject = {
							training: trainingItems.map(t => ({
								content: t.content,
								intent: t.intent || undefined,
								response: t.response || undefined,
							})),
						};
						const res = await req('PUT', `${baseURL}/agents/${agentUuid}/training`, body);
						responseData = (res.data as IDataObject) ?? res;
					} else if (operation === 'addWebhook') {
						const agentUuid = this.getNodeParameter('agentUuidDropdown', i) as string;
						const body: IDataObject = {
							url: this.getNodeParameter('webhookUrl', i),
							events: this.getNodeParameter('webhookEvents', i),
							is_active: this.getNodeParameter('webhookIsActive', i, true),
						};
						const secretKey = this.getNodeParameter('webhookSecretKey', i, '') as string;
						if (secretKey) body.secret_key = secretKey;
						const res = await req('POST', `${baseURL}/agents/${agentUuid}/webhooks`, body);
						responseData = (res.data as IDataObject) ?? res;
					} else if (operation === 'updateWebhook') {
						const agentUuid = this.getNodeParameter('agentUuidDropdown', i) as string;
						const webhookUuid = this.getNodeParameter('webhookUuid', i) as string;
						const body: IDataObject = {
							url: this.getNodeParameter('webhookUrl', i),
							events: this.getNodeParameter('webhookEvents', i),
							is_active: this.getNodeParameter('webhookIsActive', i, true),
						};
						const secretKey = this.getNodeParameter('webhookSecretKey', i, '') as string;
						if (secretKey) body.secret_key = secretKey;
						const res = await req('PATCH', `${baseURL}/agents/${agentUuid}/webhooks/${webhookUuid}`, body);
						responseData = (res.data as IDataObject) ?? res;
					}
				} else if (resource === 'contact') {
					if (operation === 'create') {
						const body: IDataObject = {
							phone_number: this.getNodeParameter('phoneNumber', i),
							name: this.getNodeParameter('name', i, ''),
							surname: this.getNodeParameter('surname', i, ''),
							email: this.getNodeParameter('email', i, ''),
							number_type: this.getNodeParameter('numberType', i, ''),
							country_code: this.getNodeParameter('countryCode', i, ''),
							timezone: this.getNodeParameter('timezone', i, ''),
							primary_language: this.getNodeParameter('primaryLanguage', i, ''),
							status: this.getNodeParameter('status', i, 'Active'),
						};
						Object.keys(body).forEach(k => { if (!body[k]) delete body[k]; });
						responseData = await req('POST', `${baseURL}/contacts`, body);
					} else if (operation === 'find') {
						const uuid = this.getNodeParameter('contactUuid', i) as string;
						const res = await req('GET', `${baseURL}/contacts/${uuid}`);
						responseData = (res.data as IDataObject) ?? res;
					} else if (operation === 'update') {
						const uuid = this.getNodeParameter('contactUuid', i) as string;
						const body: IDataObject = {};
						const fields: Array<[string, string]> = [
							['name', 'name'], ['surname', 'surname'], ['email', 'email'],
							['phoneNumber', 'phone_number'], ['numberType', 'number_type'],
							['countryCode', 'country_code'], ['timezone', 'timezone'],
							['primaryLanguage', 'primary_language'], ['status', 'status'],
						];
						for (const [param, key] of fields) {
							const v = this.getNodeParameter(param, i, '');
							if (v) body[key] = v;
						}
						const res = await req('PUT', `${baseURL}/contacts/${uuid}`, body);
						responseData = (res.data as IDataObject) ?? res;
					} else if (operation === 'delete') {
						const uuid = this.getNodeParameter('contactUuid', i) as string;
						await req('DELETE', `${baseURL}/contacts/${uuid}`);
						responseData = { deleted: true, contact_uuid: uuid };
					}
				} else if (resource === 'conversation') {
					if (operation === 'get') {
						const uuid = this.getNodeParameter('conversationUuid', i) as string;
						const res = await req('GET', `${baseURL}/conversations/${uuid}`);
						responseData = (res.data as IDataObject) ?? res;
					} else if (operation === 'list') {
						const qs: IDataObject = {
							page: this.getNodeParameter('convPage', i, 1),
							per_page: this.getNodeParameter('convPerPage', i, 15),
							sort_by: this.getNodeParameter('convSortBy', i, 'created_at'),
							sort_dir: this.getNodeParameter('convSortDir', i, 'desc'),
						};
						const phone = this.getNodeParameter('convPhone', i, '') as string;
						if (phone) qs.phone = phone;
						const agentUuid = this.getNodeParameter('convAgentUuid', i, '') as string;
						if (agentUuid) qs.agent_uuid = agentUuid;
						const channel = this.getNodeParameter('convChannel', i, '') as string;
						if (channel) qs.channel = channel;
						const status = this.getNodeParameter('convStatus', i, '') as string;
						if (status) qs.status = status;
						const qsStr = Object.entries(qs).map(([k, v]) => `${k}=${v}`).join('&');
						const res = await req('GET', `${baseURL}/conversations?${qsStr}`);
						const d = res.data as IDataObject;
						responseData = { conversations: (d?.data as IDataObject[]) ?? [], total: d?.total, current_page: d?.current_page };
					} else if (operation === 'listMessages') {
						const uuid = this.getNodeParameter('conversationUuid', i) as string;
						const qs: IDataObject = {
							page: this.getNodeParameter('msgPage', i, 1),
							per_page: this.getNodeParameter('msgPerPage', i, 25),
							sort_dir: this.getNodeParameter('msgSortDir', i, 'asc'),
						};
						const sender = this.getNodeParameter('msgSender', i, '') as string;
						if (sender) qs.sender = sender;
						const qsStr = Object.entries(qs).map(([k, v]) => `${k}=${v}`).join('&');
						const res = await req('GET', `${baseURL}/conversations/${uuid}/messages?${qsStr}`);
						const d = res.data as IDataObject;
						responseData = { messages: (d?.data as IDataObject[]) ?? [], total: d?.total, current_page: d?.current_page };
					}
				} else if (resource === 'call') {
					if (operation === 'create') {
						const participant: IDataObject = { number: this.getNodeParameter('phoneNumber', i) };
						const about = this.getNodeParameter('about', i, '') as string;
						if (about) participant.about = about;
						const body: IDataObject = {
							agentId: this.getNodeParameter('agentId', i),
							participant,
						};
						const customPrompt = this.getNodeParameter('customPrompt', i, '') as string;
						if (customPrompt) {
							body.prompt = {
								overwrite: this.getNodeParameter('overwritePrompt', i, false),
								content: customPrompt,
							};
						}
						const startMessage = this.getNodeParameter('startMessage', i, '') as string;
						if (startMessage) body.message = { start: startMessage };
						responseData = await req('POST', `${baseURL}/call`, body);
					}
				} else if (resource === 'sms') {
					if (operation === 'send') {
						const body: IDataObject = {
							agentId: this.getNodeParameter('smsAgentId', i),
							phoneNumber: this.getNodeParameter('phoneNumber', i),
							message: this.getNodeParameter('message', i),
						};
						responseData = await req('POST', `${baseURL}/sms/send`, body);
					}
				} else if (resource === 'whatsapp') {
					if (operation === 'sendTemplate') {
						const body: IDataObject = {
							agentId: this.getNodeParameter('agentId', i),
							templateId: this.getNodeParameter('templateId', i),
							phoneNumber: this.getNodeParameter('phoneNumber', i),
						};
						const parameters: IDataObject = {};
						for (let p = 1; p <= 3; p++) {
							const val = this.getNodeParameter(`parameter${p}`, i, '') as string;
							if (val) parameters[`field${p}`] = val;
						}
						if (Object.keys(parameters).length > 0) body.parameters = parameters;
						const headerUrl = this.getNodeParameter('headerUrl', i, '') as string;
						if (headerUrl) {
							body.header = {
								type: this.getNodeParameter('headerType', i),
								url: headerUrl,
							};
						}
						responseData = await req('POST', `${baseURL}/whatsapp/template`, body);
					}
				} else if (resource === 'dataset') {
					if (operation === 'sendTextPrompt') {
						const body: IDataObject = {
							name: this.getNodeParameter('name', i),
							data: this.getNodeParameter('data', i),
						};
						const desc = this.getNodeParameter('description', i, '') as string;
						if (desc) body.description = desc;
						responseData = await req('POST', `${baseURL}/data/import/copypaste`, body);
					} else if (operation === 'createRecord') {
						const datasetUuid = this.getNodeParameter('datasetUuid', i) as string;
						let recordData: IDataObject;
						try {
							const raw = this.getNodeParameter('recordData', i) as string;
							recordData = typeof raw === 'string' ? JSON.parse(raw) as IDataObject : raw as IDataObject;
						} catch {
							throw new NodeOperationError(this.getNode(), 'Record Data must be valid JSON. Example: {"Location": "New York", "Price": "1999"}', { itemIndex: i });
						}
						responseData = await req('POST', `${baseURL}/data/${datasetUuid}/records`, { record: recordData });
					} else if (operation === 'updateRecord') {
						const datasetUuid = this.getNodeParameter('datasetUuid', i) as string;
						const recordId = this.getNodeParameter('recordId', i) as string;
						let recordData: IDataObject;
						try {
							const raw = this.getNodeParameter('recordData', i) as string;
							recordData = typeof raw === 'string' ? JSON.parse(raw) as IDataObject : raw as IDataObject;
						} catch {
							throw new NodeOperationError(this.getNode(), 'Record Data must be valid JSON. Example: {"Price": "2499"}', { itemIndex: i });
						}
						responseData = await req('PUT', `${baseURL}/data/${datasetUuid}/records/${recordId}`, { record: recordData });
					} else if (operation === 'deleteRecord') {
						const datasetUuid = this.getNodeParameter('datasetUuid', i) as string;
						const recordId = this.getNodeParameter('recordId', i) as string;
						responseData = await req('DELETE', `${baseURL}/data/${datasetUuid}/records/${recordId}`);
					} else if (operation === 'sync') {
						const datasetUuid = this.getNodeParameter('datasetUuid', i) as string;
						responseData = await req('POST', `${baseURL}/data/${datasetUuid}/sync`);
					} else if (operation === 'assignToAgent') {
						const datasetUuid = this.getNodeParameter('datasetUuid', i) as string;
						const agentUuid = this.getNodeParameter('agentUuid', i) as string;
						responseData = await req('POST', `${baseURL}/data/${datasetUuid}/assign`, { agent_uuid: agentUuid });
					} else if (operation === 'find') {
						const datasetUuid = this.getNodeParameter('datasetUuid', i) as string;
						const res = await req('GET', `${baseURL}/data/${datasetUuid}`);
						responseData = (res.data as IDataObject) ?? res;
					} else if (operation === 'listRecords') {
						const datasetUuid = this.getNodeParameter('datasetUuid', i) as string;
						const res = await req('GET', `${baseURL}/data/${datasetUuid}/records?page=1&per_page=100`);
						const d = res.data as IDataObject;
						responseData = { records: (d?.data as IDataObject[]) ?? [] };
					}
				} else if (resource === 'appointment') {
					if (operation === 'findAll') {
						const res = await req('GET', `${baseURL}/appointments`);
						responseData = { appointments: Array.isArray(res.data) ? res.data : [] };
					} else if (operation === 'create') {
						const body: IDataObject = {
							schedule_uuid: this.getNodeParameter('scheduleUuid', i),
							title: this.getNodeParameter('title', i),
							start_time: this.getNodeParameter('startTime', i),
							end_time: this.getNodeParameter('endTime', i),
						};
						const contactUuid = this.getNodeParameter('contactUuid', i, '') as string;
						if (contactUuid) body.contact_uuid = contactUuid;
						const apptStatus = this.getNodeParameter('appointmentStatus', i, '') as string;
						if (apptStatus) body.status = apptStatus;
						const apptNotes = this.getNodeParameter('appointmentNotes', i, '') as string;
						if (apptNotes) body.notes = apptNotes;
						const res = await req('POST', `${baseURL}/appointments`, body);
						responseData = (res.data as IDataObject) ?? res;
					} else if (operation === 'update') {
						const uuid = this.getNodeParameter('appointmentUuid', i) as string;
						const body: IDataObject = {};
						const fields: Array<[string, string]> = [
							['title', 'title'], ['startTime', 'start_time'],
							['endTime', 'end_time'], ['appointmentStatus', 'status'], ['appointmentNotes', 'notes'],
						];
						for (const [param, key] of fields) {
							const v = this.getNodeParameter(param, i, '');
							if (v) body[key] = v;
						}
						const res = await req('PUT', `${baseURL}/appointments/${uuid}`, body);
						responseData = (res.data as IDataObject) ?? res;
					} else if (operation === 'updateStatus') {
						const uuid = this.getNodeParameter('appointmentUuid', i) as string;
						const apptStatus = this.getNodeParameter('appointmentStatus', i) as string;
						const res = await req('POST', `${baseURL}/appointments/${uuid}/status`, { status: apptStatus });
						responseData = (res.data as IDataObject) ?? res;
					} else if (operation === 'delete') {
						const uuid = this.getNodeParameter('appointmentUuid', i) as string;
						await req('DELETE', `${baseURL}/appointments/${uuid}`);
						responseData = { deleted: true, appointment_uuid: uuid };
					}
				} else if (resource === 'task') {
					if (operation === 'create') {
						const body: IDataObject = {
							title: this.getNodeParameter('title', i),
							type: this.getNodeParameter('type', i),
							contact: { phone_number: this.getNodeParameter('phoneNumber', i) },
							agent_uuid: this.getNodeParameter('agentUuid', i),
						};
						const scheduledAt = this.getNodeParameter('scheduledAt', i, '') as string;
						if (scheduledAt) body.scheduled_at = scheduledAt;
						const autoQueue = this.getNodeParameter('autoQueue', i, false) as boolean;
						if (autoQueue) body.auto_queue = autoQueue;
						const res = await req('POST', `${baseURL}/tasks`, body);
						responseData = (res.data as IDataObject) ?? res;
					}
				} else if (resource === 'listing') {
					if (operation === 'create') {
						const body: IDataObject = {
							name: this.getNodeParameter('name', i),
							campaign_type: this.getNodeParameter('campaignType', i),
							agent_uuid: this.getNodeParameter('agentUuid', i),
							contacts: [],
						};
						const desc = this.getNodeParameter('description', i, '') as string;
						if (desc) body.description = desc;
						const startDate = this.getNodeParameter('startDate', i, '') as string;
						if (startDate) body.start_date = startDate;
						const endDate = this.getNodeParameter('endDate', i, '') as string;
						if (endDate) body.end_date = endDate;
						const autoStart = this.getNodeParameter('autoStart', i, false) as boolean;
						if (autoStart) body.auto_start = autoStart;
						body.rule = {
							type: body.campaign_type,
							max_calls_per_day: this.getNodeParameter('maxCallsPerDay', i, 3),
							retry_interval_minutes: this.getNodeParameter('retryIntervalMinutes', i, 120),
						};
						const res = await req('POST', `${baseURL}/listings`, body);
						responseData = (res.data as IDataObject) ?? res;
					} else if (operation === 'sendContacts') {
						const listingUuid = this.getNodeParameter('listingUuid', i) as string;
						const contact: IDataObject = {
							phone_number: this.getNodeParameter('contactPhone', i),
						};
						const cname = this.getNodeParameter('contactName', i, '') as string;
						if (cname) contact.name = cname;
						const csurname = this.getNodeParameter('contactSurname', i, '') as string;
						if (csurname) contact.surname = csurname;
						const cemail = this.getNodeParameter('contactEmail', i, '') as string;
						if (cemail) contact.email = cemail;
						responseData = await req('POST', `${baseURL}/listings/${listingUuid}/contacts`, { contacts: [contact] });
					} else if (operation === 'deleteContact') {
						const listingUuid = this.getNodeParameter('listingUuid', i) as string;
						const contactUuid = this.getNodeParameter('contactUuid', i) as string;
						await req('DELETE', `${baseURL}/listings/${listingUuid}/contacts/${contactUuid}`);
						responseData = { deleted: true, listing_uuid: listingUuid, contact_uuid: contactUuid };
					}
				}

				returnData.push({ json: responseData, pairedItem: { item: i } });

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeApiError(this.getNode(), error as JsonObject);
			}
		}

		return [returnData];
	}
}