import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
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
					{ name: 'Appointment', value: 'appointment' },
					{ name: 'Call', value: 'call' },
					{ name: 'Contact', value: 'contact' },
					{ name: 'Dataset', value: 'dataset' },
					{ name: 'Listing', value: 'listing' },
					{ name: 'Task', value: 'task' },
					{ name: 'WhatsApp', value: 'whatsapp' },
				],
				default: 'contact',
			},

			// ─── OPERATIONS ─────────────────────────────────────────

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
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['call'] } },
				options: [
					{ name: 'Create Call', value: 'create', action: 'Initiate an outbound call' },
				],
				default: 'create',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['whatsapp'] } },
				options: [
					{ name: 'Send Template', value: 'sendTemplate', action: 'Send a WhatsApp template message' },
				],
				default: 'sendTemplate',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['dataset'] } },
				options: [
					{ name: 'Create Record', value: 'createRecord', action: 'Add a new record to a dataset' },
					{ name: 'Delete Record', value: 'deleteRecord', action: 'Delete a record from a dataset' },
					{ name: 'Find', value: 'find', action: 'Find a dataset by ID' },
					{ name: 'List Records', value: 'listRecords', action: 'Get all records from a dataset' },
					{ name: 'Send Text Prompt', value: 'sendTextPrompt', action: 'Import plain text as training data' },
					{ name: 'Assign to Agent', value: 'assignToAgent', action: 'Link a dataset to an AI agent' },
					{ name: 'Sync', value: 'sync', action: 'Sync and refresh a dataset' },
					{ name: 'Update Record', value: 'updateRecord', action: 'Update an existing record' },
				],
				default: 'createRecord',
			},
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

			// ─── CONTACT FIELDS ──────────────────────────────────────

			{
				displayName: 'Phone Number',
				name: 'phone_number',
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
				name: 'number_type',
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
				name: 'country_code',
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
				name: 'primary_language',
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
				name: 'contact_uuid',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['contact'], operation: ['find', 'update', 'delete'] } },
			},

			// ─── CALL FIELDS ─────────────────────────────────────────

			{
				displayName: 'Agent ID',
				name: 'agent_id',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['call'], operation: ['create'] } },
			},
			{
				displayName: 'Phone Number',
				name: 'phone_number',
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
				name: 'custom_prompt',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
				displayOptions: { show: { resource: ['call'], operation: ['create'] } },
			},
			{
				displayName: 'Overwrite Prompt',
				name: 'overwrite_prompt',
				type: 'boolean',
				default: false,
				displayOptions: { show: { resource: ['call'], operation: ['create'] } },
			},
			{
				displayName: 'Start Message',
				name: 'start_message',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['call'], operation: ['create'] } },
			},

			// ─── WHATSAPP FIELDS ─────────────────────────────────────

			{
				displayName: 'Agent ID',
				name: 'agent_id',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['whatsapp'], operation: ['sendTemplate'] } },
			},
			{
				displayName: 'Template ID',
				name: 'template_id',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['whatsapp'], operation: ['sendTemplate'] } },
			},
			{
				displayName: 'Phone Number',
				name: 'phone_number',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['whatsapp'], operation: ['sendTemplate'] } },
			},
			{
				displayName: 'Parameter 1',
				name: 'parameter_1',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['whatsapp'], operation: ['sendTemplate'] } },
			},
			{
				displayName: 'Parameter 2',
				name: 'parameter_2',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['whatsapp'], operation: ['sendTemplate'] } },
			},
			{
				displayName: 'Parameter 3',
				name: 'parameter_3',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['whatsapp'], operation: ['sendTemplate'] } },
			},
			{
				displayName: 'Header Type',
				name: 'header_type',
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
				name: 'header_url',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['whatsapp'], operation: ['sendTemplate'] } },
			},

			// ─── DATASET FIELDS ──────────────────────────────────────

			{
				displayName: 'Dataset UUID',
				name: 'dataset_uuid',
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
				name: 'record_id',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['dataset'], operation: ['updateRecord', 'deleteRecord'] } },
			},
			{
				displayName: 'Record Data (JSON)',
				name: 'record_data',
				type: 'string',
				required: true,
				default: '{}',
				placeholder: '{"Location": "New York", "Price": "1999"}',
				displayOptions: { show: { resource: ['dataset'], operation: ['createRecord', 'updateRecord'] } },
			},
			{
				displayName: 'Agent UUID',
				name: 'agent_uuid',
				type: 'string',
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

			// ─── APPOINTMENT FIELDS ──────────────────────────────────

			{
				displayName: 'Appointment UUID',
				name: 'appointment_uuid',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['appointment'], operation: ['update', 'updateStatus', 'delete'] } },
			},
			{
				displayName: 'Schedule UUID',
				name: 'schedule_uuid',
				type: 'string',
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
				name: 'start_time',
				type: 'string',
				required: true,
				default: '',
				placeholder: '2026-03-01T10:00:00.000Z',
				displayOptions: { show: { resource: ['appointment'], operation: ['create', 'update'] } },
			},
			{
				displayName: 'End Time',
				name: 'end_time',
				type: 'string',
				required: true,
				default: '',
				placeholder: '2026-03-01T11:00:00.000Z',
				displayOptions: { show: { resource: ['appointment'], operation: ['create', 'update'] } },
			},
			{
				displayName: 'Status',
				name: 'status',
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
				name: 'contact_uuid',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['appointment'], operation: ['create'] } },
			},
			{
				displayName: 'Notes',
				name: 'notes',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['appointment'], operation: ['create', 'update'] } },
			},

			// ─── TASK FIELDS ─────────────────────────────────────────

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
				name: 'phone_number',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['task'], operation: ['create'] } },
			},
			{
				displayName: 'Agent UUID',
				name: 'agent_uuid',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['task'], operation: ['create'] } },
			},
			{
				displayName: 'Scheduled At',
				name: 'scheduled_at',
				type: 'string',
				default: '',
				placeholder: '2026-03-01T14:00:00.000Z',
				displayOptions: { show: { resource: ['task'], operation: ['create'] } },
			},
			{
				displayName: 'Auto Queue',
				name: 'auto_queue',
				type: 'boolean',
				default: false,
				displayOptions: { show: { resource: ['task'], operation: ['create'] } },
			},

			// ─── LISTING FIELDS ──────────────────────────────────────

			{
				displayName: 'Listing UUID',
				name: 'listing_uuid',
				type: 'string',
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
				name: 'campaign_type',
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
				displayName: 'Agent UUID',
				name: 'agent_uuid',
				type: 'string',
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
				name: 'start_date',
				type: 'string',
				default: '',
				placeholder: '2026-03-01',
				displayOptions: { show: { resource: ['listing'], operation: ['create'] } },
			},
			{
				displayName: 'End Date',
				name: 'end_date',
				type: 'string',
				default: '',
				placeholder: '2026-03-31',
				displayOptions: { show: { resource: ['listing'], operation: ['create'] } },
			},
			{
				displayName: 'Auto Start',
				name: 'auto_start',
				type: 'boolean',
				default: false,
				displayOptions: { show: { resource: ['listing'], operation: ['create'] } },
			},
			{
				displayName: 'Max Calls Per Day',
				name: 'max_calls_per_day',
				type: 'number',
				default: 3,
				displayOptions: { show: { resource: ['listing'], operation: ['create'] } },
			},
			{
				displayName: 'Retry Interval (Minutes)',
				name: 'retry_interval_minutes',
				type: 'number',
				default: 120,
				displayOptions: { show: { resource: ['listing'], operation: ['create'] } },
			},
			{
				displayName: 'Contact Phone Number',
				name: 'contact_phone',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['listing'], operation: ['sendContacts'] } },
			},
			{
				displayName: 'Contact Name',
				name: 'contact_name',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['listing'], operation: ['sendContacts'] } },
			},
			{
				displayName: 'Contact Surname',
				name: 'contact_surname',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['listing'], operation: ['sendContacts'] } },
			},
			{
				displayName: 'Contact Email',
				name: 'contact_email',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['listing'], operation: ['sendContacts'] } },
			},
			{
				displayName: 'Contact UUID',
				name: 'contact_uuid',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['listing'], operation: ['deleteContact'] } },
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('mihuApi');
		const baseURL = `https://${credentials.accountDomain}.mihu.ai/api/v1`;

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;
			let responseData: any;

			// ── CONTACT ──────────────────────────────────────────────
			if (resource === 'contact') {
				if (operation === 'create') {
					const body: Record<string, any> = {
						phone_number: this.getNodeParameter('phone_number', i),
						name: this.getNodeParameter('name', i),
						surname: this.getNodeParameter('surname', i),
						email: this.getNodeParameter('email', i),
						number_type: this.getNodeParameter('number_type', i),
						country_code: this.getNodeParameter('country_code', i),
						timezone: this.getNodeParameter('timezone', i),
						primary_language: this.getNodeParameter('primary_language', i),
						status: this.getNodeParameter('status', i) || 'Active',
					};
					// Remove empty values
					Object.keys(body).forEach(k => { if (!body[k]) delete body[k]; });
					responseData = await this.helpers.requestWithAuthentication.call(this, 'mihuApi', {
						method: 'POST', url: `${baseURL}/contacts`, body, json: true,
					});
				} else if (operation === 'find') {
					const uuid = this.getNodeParameter('contact_uuid', i) as string;
					const res: any = await this.helpers.requestWithAuthentication.call(this, 'mihuApi', {
						method: 'GET', url: `${baseURL}/contacts/${uuid}`, json: true,
					});
					responseData = res.data || res;
				} else if (operation === 'update') {
					const uuid = this.getNodeParameter('contact_uuid', i) as string;
					const body: Record<string, any> = {};
					const fields = ['name','surname','email','phone_number','number_type','country_code','timezone','primary_language','status'];
					for (const f of fields) {
						try { const v = this.getNodeParameter(f, i); if (v) body[f] = v; } catch (_) {}
					}
					const res: any = await this.helpers.requestWithAuthentication.call(this, 'mihuApi', {
						method: 'PUT', url: `${baseURL}/contacts/${uuid}`, body, json: true,
					});
					responseData = res.data || res;
				} else if (operation === 'delete') {
					const uuid = this.getNodeParameter('contact_uuid', i) as string;
					await this.helpers.requestWithAuthentication.call(this, 'mihuApi', {
						method: 'DELETE', url: `${baseURL}/contacts/${uuid}`, json: true,
					});
					responseData = { deleted: true, contact_uuid: uuid };
				}
			}

			// ── CALL ─────────────────────────────────────────────────
			else if (resource === 'call') {
				if (operation === 'create') {
					const body: Record<string, any> = {
						agentId: this.getNodeParameter('agent_id', i),
						participant: { number: this.getNodeParameter('phone_number', i) },
					};
					const about = this.getNodeParameter('about', i) as string;
					if (about) body.participant.about = about;
					const customPrompt = this.getNodeParameter('custom_prompt', i) as string;
					if (customPrompt) {
						body.prompt = {
							overwrite: this.getNodeParameter('overwrite_prompt', i),
							content: customPrompt,
						};
					}
					const startMessage = this.getNodeParameter('start_message', i) as string;
					if (startMessage) body.message = { start: startMessage };
					responseData = await this.helpers.requestWithAuthentication.call(this, 'mihuApi', {
						method: 'POST', url: `${baseURL}/call`, body, json: true,
					});
				}
			}

			// ── WHATSAPP ─────────────────────────────────────────────
			else if (resource === 'whatsapp') {
				if (operation === 'sendTemplate') {
					const body: Record<string, any> = {
						agentId: this.getNodeParameter('agent_id', i),
						templateId: this.getNodeParameter('template_id', i),
						phoneNumber: this.getNodeParameter('phone_number', i),
					};
					const parameters: Record<string, string> = {};
					for (let p = 1; p <= 3; p++) {
						const val = this.getNodeParameter(`parameter_${p}`, i) as string;
						if (val) parameters[`field${p}`] = val;
					}
					if (Object.keys(parameters).length > 0) body.parameters = parameters;
					const headerUrl = this.getNodeParameter('header_url', i) as string;
					if (headerUrl) {
						body.header = {
							type: this.getNodeParameter('header_type', i),
							url: headerUrl,
						};
					}
					responseData = await this.helpers.requestWithAuthentication.call(this, 'mihuApi', {
						method: 'POST', url: `${baseURL}/whatsapp/template`, body, json: true,
					});
				}
			}

			// ── DATASET ──────────────────────────────────────────────
			else if (resource === 'dataset') {
				if (operation === 'sendTextPrompt') {
					const body: Record<string, any> = {
						name: this.getNodeParameter('name', i),
						data: this.getNodeParameter('data', i),
					};
					const desc = this.getNodeParameter('description', i) as string;
					if (desc) body.description = desc;
					responseData = await this.helpers.requestWithAuthentication.call(this, 'mihuApi', {
						method: 'POST', url: `${baseURL}/data/import/copypaste`, body, json: true,
					});
				} else if (operation === 'createRecord') {
					const datasetUuid = this.getNodeParameter('dataset_uuid', i) as string;
					const recordData = JSON.parse(this.getNodeParameter('record_data', i) as string);
					responseData = await this.helpers.requestWithAuthentication.call(this, 'mihuApi', {
						method: 'POST', url: `${baseURL}/data/${datasetUuid}/records`, body: { record: recordData }, json: true,
					});
				} else if (operation === 'updateRecord') {
					const datasetUuid = this.getNodeParameter('dataset_uuid', i) as string;
					const recordId = this.getNodeParameter('record_id', i) as string;
					const recordData = JSON.parse(this.getNodeParameter('record_data', i) as string);
					responseData = await this.helpers.requestWithAuthentication.call(this, 'mihuApi', {
						method: 'PUT', url: `${baseURL}/data/${datasetUuid}/records/${recordId}`, body: { record: recordData }, json: true,
					});
				} else if (operation === 'deleteRecord') {
					const datasetUuid = this.getNodeParameter('dataset_uuid', i) as string;
					const recordId = this.getNodeParameter('record_id', i) as string;
					responseData = await this.helpers.requestWithAuthentication.call(this, 'mihuApi', {
						method: 'DELETE', url: `${baseURL}/data/${datasetUuid}/records/${recordId}`, json: true,
					});
				} else if (operation === 'sync') {
					const datasetUuid = this.getNodeParameter('dataset_uuid', i) as string;
					responseData = await this.helpers.requestWithAuthentication.call(this, 'mihuApi', {
						method: 'POST', url: `${baseURL}/data/${datasetUuid}/sync`, json: true,
					});
				} else if (operation === 'assignToAgent') {
					const datasetUuid = this.getNodeParameter('dataset_uuid', i) as string;
					const agentUuid = this.getNodeParameter('agent_uuid', i) as string;
					responseData = await this.helpers.requestWithAuthentication.call(this, 'mihuApi', {
						method: 'POST', url: `${baseURL}/data/${datasetUuid}/assign`, body: { agent_uuid: agentUuid }, json: true,
					});
				} else if (operation === 'find') {
					const datasetUuid = this.getNodeParameter('dataset_uuid', i) as string;
					const res: any = await this.helpers.requestWithAuthentication.call(this, 'mihuApi', {
						method: 'GET', url: `${baseURL}/data/${datasetUuid}`, json: true,
					});
					responseData = res.data || res;
				} else if (operation === 'listRecords') {
					const datasetUuid = this.getNodeParameter('dataset_uuid', i) as string;
					const res: any = await this.helpers.requestWithAuthentication.call(this, 'mihuApi', {
						method: 'GET', url: `${baseURL}/data/${datasetUuid}/records?page=1&per_page=100`, json: true,
					});
					responseData = { records: res.data?.data || [] };
				}
			}

			// ── APPOINTMENT ──────────────────────────────────────────
			else if (resource === 'appointment') {
				if (operation === 'findAll') {
					const res: any = await this.helpers.requestWithAuthentication.call(this, 'mihuApi', {
						method: 'GET', url: `${baseURL}/appointments`, json: true,
					});
					responseData = { appointments: Array.isArray(res.data) ? res.data : [] };
				} else if (operation === 'create') {
					const body: Record<string, any> = {
						schedule_uuid: this.getNodeParameter('schedule_uuid', i),
						title: this.getNodeParameter('title', i),
						start_time: this.getNodeParameter('start_time', i),
						end_time: this.getNodeParameter('end_time', i),
					};
					const contactUuid = this.getNodeParameter('contact_uuid', i) as string;
					if (contactUuid) body.contact_uuid = contactUuid;
					const status = this.getNodeParameter('status', i) as string;
					if (status) body.status = status;
					const notes = this.getNodeParameter('notes', i) as string;
					if (notes) body.notes = notes;
					const res: any = await this.helpers.requestWithAuthentication.call(this, 'mihuApi', {
						method: 'POST', url: `${baseURL}/appointments`, body, json: true,
					});
					responseData = res.data || res;
				} else if (operation === 'update') {
					const uuid = this.getNodeParameter('appointment_uuid', i) as string;
					const body: Record<string, any> = {};
					const fields = ['title','start_time','end_time','status','notes'];
					for (const f of fields) {
						try { const v = this.getNodeParameter(f, i); if (v) body[f] = v; } catch (_) {}
					}
					const res: any = await this.helpers.requestWithAuthentication.call(this, 'mihuApi', {
						method: 'PUT', url: `${baseURL}/appointments/${uuid}`, body, json: true,
					});
					responseData = res.data || res;
				} else if (operation === 'updateStatus') {
					const uuid = this.getNodeParameter('appointment_uuid', i) as string;
					const status = this.getNodeParameter('status', i) as string;
					const res: any = await this.helpers.requestWithAuthentication.call(this, 'mihuApi', {
						method: 'POST', url: `${baseURL}/appointments/${uuid}/status`, body: { status }, json: true,
					});
					responseData = res.data || res;
				} else if (operation === 'delete') {
					const uuid = this.getNodeParameter('appointment_uuid', i) as string;
					await this.helpers.requestWithAuthentication.call(this, 'mihuApi', {
						method: 'DELETE', url: `${baseURL}/appointments/${uuid}`, json: true,
					});
					responseData = { deleted: true, appointment_uuid: uuid };
				}
			}

			// ── TASK ─────────────────────────────────────────────────
			else if (resource === 'task') {
				if (operation === 'create') {
					const body: Record<string, any> = {
						title: this.getNodeParameter('title', i),
						type: this.getNodeParameter('type', i),
						contact: { phone_number: this.getNodeParameter('phone_number', i) },
						agent_uuid: this.getNodeParameter('agent_uuid', i),
					};
					const scheduledAt = this.getNodeParameter('scheduled_at', i) as string;
					if (scheduledAt) body.scheduled_at = scheduledAt;
					const autoQueue = this.getNodeParameter('auto_queue', i) as boolean;
					if (autoQueue) body.auto_queue = autoQueue;
					const res: any = await this.helpers.requestWithAuthentication.call(this, 'mihuApi', {
						method: 'POST', url: `${baseURL}/tasks`, body, json: true,
					});
					responseData = res.data || res;
				}
			}

			// ── LISTING ──────────────────────────────────────────────
			else if (resource === 'listing') {
				if (operation === 'create') {
					const body: Record<string, any> = {
						name: this.getNodeParameter('name', i),
						campaign_type: this.getNodeParameter('campaign_type', i),
						agent_uuid: this.getNodeParameter('agent_uuid', i),
						contacts: [],
					};
					const desc = this.getNodeParameter('description', i) as string;
					if (desc) body.description = desc;
					const startDate = this.getNodeParameter('start_date', i) as string;
					if (startDate) body.start_date = startDate;
					const endDate = this.getNodeParameter('end_date', i) as string;
					if (endDate) body.end_date = endDate;
					const autoStart = this.getNodeParameter('auto_start', i) as boolean;
					if (autoStart) body.auto_start = autoStart;
					const maxCalls = this.getNodeParameter('max_calls_per_day', i) as number;
					const retryInterval = this.getNodeParameter('retry_interval_minutes', i) as number;
					body.rule = {
						type: body.campaign_type,
						max_calls_per_day: maxCalls,
						retry_interval_minutes: retryInterval,
					};
					const res: any = await this.helpers.requestWithAuthentication.call(this, 'mihuApi', {
						method: 'POST', url: `${baseURL}/listings`, body, json: true,
					});
					responseData = res.data || res;
				} else if (operation === 'sendContacts') {
					const listingUuid = this.getNodeParameter('listing_uuid', i) as string;
					const contact: Record<string, any> = {
						phone_number: this.getNodeParameter('contact_phone', i),
					};
					const name = this.getNodeParameter('contact_name', i) as string;
					if (name) contact.name = name;
					const surname = this.getNodeParameter('contact_surname', i) as string;
					if (surname) contact.surname = surname;
					const email = this.getNodeParameter('contact_email', i) as string;
					if (email) contact.email = email;
					responseData = await this.helpers.requestWithAuthentication.call(this, 'mihuApi', {
						method: 'POST', url: `${baseURL}/listings/${listingUuid}/contacts`, body: { contacts: [contact] }, json: true,
					});
				} else if (operation === 'deleteContact') {
					const listingUuid = this.getNodeParameter('listing_uuid', i) as string;
					const contactUuid = this.getNodeParameter('contact_uuid', i) as string;
					await this.helpers.requestWithAuthentication.call(this, 'mihuApi', {
						method: 'DELETE', url: `${baseURL}/listings/${listingUuid}/contacts/${contactUuid}`, json: true,
					});
					responseData = { deleted: true, listing_uuid: listingUuid, contact_uuid: contactUuid };
				}
			}

			returnData.push({ json: responseData ?? {} });
		}

		return [returnData];
	}
}