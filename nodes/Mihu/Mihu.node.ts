import {
	IExecuteFunctions,
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
					{ name: 'Create Call', value: 'create', action: 'Create a call' },
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

			// ── CONTACT FIELDS ──────────────────────────────────────
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

			// ── CALL FIELDS ──────────────────────────────────────────
			{
				displayName: 'Agent ID',
				name: 'agentId',
				type: 'string',
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

			// ── WHATSAPP FIELDS ──────────────────────────────────────
			{
				displayName: 'Agent ID',
				name: 'agentId',
				type: 'string',
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

			// ── DATASET FIELDS ───────────────────────────────────────
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
				displayName: 'Agent UUID',
				name: 'agentUuid',
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

			// ── APPOINTMENT FIELDS ───────────────────────────────────
			{
				displayName: 'Appointment UUID',
				name: 'appointmentUuid',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['appointment'], operation: ['update', 'updateStatus', 'delete'] } },
			},
			{
				displayName: 'Schedule UUID',
				name: 'scheduleUuid',
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
				name: 'contactUuid',
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

			// ── TASK FIELDS ──────────────────────────────────────────
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
				displayName: 'Agent UUID',
				name: 'agentUuid',
				type: 'string',
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

			// ── LISTING FIELDS ───────────────────────────────────────
			{
				displayName: 'Listing UUID',
				name: 'listingUuid',
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
				displayName: 'Agent UUID',
				name: 'agentUuid',
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

				if (resource === 'contact') {
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
						const status = this.getNodeParameter('status', i, '') as string;
						if (status) body.status = status;
						const notes = this.getNodeParameter('notes', i, '') as string;
						if (notes) body.notes = notes;
						const res = await req('POST', `${baseURL}/appointments`, body);
						responseData = (res.data as IDataObject) ?? res;
					} else if (operation === 'update') {
						const uuid = this.getNodeParameter('appointmentUuid', i) as string;
						const body: IDataObject = {};
						const fields: Array<[string, string]> = [
							['title', 'title'], ['startTime', 'start_time'],
							['endTime', 'end_time'], ['status', 'status'], ['notes', 'notes'],
						];
						for (const [param, key] of fields) {
							const v = this.getNodeParameter(param, i, '');
							if (v) body[key] = v;
						}
						const res = await req('PUT', `${baseURL}/appointments/${uuid}`, body);
						responseData = (res.data as IDataObject) ?? res;
					} else if (operation === 'updateStatus') {
						const uuid = this.getNodeParameter('appointmentUuid', i) as string;
						const status = this.getNodeParameter('status', i) as string;
						const res = await req('POST', `${baseURL}/appointments/${uuid}/status`, { status });
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
						const name = this.getNodeParameter('contactName', i, '') as string;
						if (name) contact.name = name;
						const surname = this.getNodeParameter('contactSurname', i, '') as string;
						if (surname) contact.surname = surname;
						const email = this.getNodeParameter('contactEmail', i, '') as string;
						if (email) contact.email = email;
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