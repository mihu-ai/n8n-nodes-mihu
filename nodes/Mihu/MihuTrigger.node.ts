import {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IDataObject,
} from 'n8n-workflow';

export class MihuTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Mihu AI Trigger',
		name: 'mihuTrigger',
		icon: 'file:mihu.svg',
		group: ['trigger'],
		version: 1,
		description: 'AI Agents for voice, text and your entire contact center',
		usableAsTool: true,
		defaults: { name: 'Mihu AI Trigger' },
		inputs: [],
		outputs: ['main'],
		credentials: [{ name: 'mihuApi', required: true }],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: '={{$parameter["webhookPath"]}}',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				options: [
					{
						name: 'New Voice Evaluation',
						value: 'voice_evaluation',
						description: 'Triggers when a voice session report is generated',
					},
					{
						name: 'New Text Evaluation',
						value: 'text_evaluation',
						description: 'Triggers when a text session report is generated',
					},
				],
				default: 'voice_evaluation',
				required: true,
			},
			{
				displayName: 'Webhook Path',
				name: 'webhookPath',
				type: 'string',
				default: 'mihu-webhook',
				description: 'Unique path for this webhook — change if using multiple Mihu triggers in one workflow',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const staticData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				if (staticData.webhookUrl === webhookUrl) {
					return true;
				}
				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const event = this.getNodeParameter('event') as string;
				const staticData = this.getWorkflowStaticData('node');

				await this.helpers.httpRequest({
					method: 'POST',
					url: event === 'voice_evaluation'
						? 'https://integration.mihu.ai/webhook/d7c9d1df-40f4-4622-9c69-e3d3ceedcc1c'
						: 'https://integration.mihu.ai/webhook/52418198-97b5-4d82-8a4c-7933a8083192',
					body: {
						targetUrl: webhookUrl,
						event,
					},
					json: true,
				});

				staticData.webhookUrl = webhookUrl;
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const staticData = this.getWorkflowStaticData('node');

				try {
					await this.helpers.httpRequest({
						method: 'POST',
						url: 'https://integration.mihu.ai/webhook/52418198-97b5-4d82-8a4c-7933a8083192',
						body: { targetUrl: webhookUrl },
						json: true,
					});
				} catch {
					// unsubscribe failed — non-critical
				}

				delete staticData.webhookUrl;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const raw = this.getBodyData() as IDataObject;
		const event = this.getNodeParameter('event') as string;

		if (raw.event && raw.event !== event && raw.event !== 'conversation_end_report') {
			return { noWebhookResponse: true };
		}

		const data = (raw.data ?? raw) as IDataObject;
		const sa = (data.sentiment_analysis ?? {}) as IDataObject;

		const result: IDataObject = {
			id: (data.call_id as string) ?? (data.session_evaluation_uuid as string) ?? Date.now().toString(),
			event: (raw.event as string) ?? event,
			call_id: data.call_id ?? null,
			session_evaluation_uuid: data.session_evaluation_uuid ?? null,
			conversation_uuid: data.conversation_uuid ?? null,
			agent_id: data.agent_id ?? null,
			session_type: data.session_type ?? null,
			duration: data.duration ?? null,
			number: data.number ?? null,
			phone_number: data.contact_info
				? ((data.contact_info as IDataObject).phone_number ?? null)
				: (data.number ?? null),
			conversation: data.conversation ?? null,
			sentiment: sa.sentiment ? ((sa.sentiment as IDataObject).value ?? null) : null,
			sentiment_confidence: sa.sentiment ? ((sa.sentiment as IDataObject).confidence ?? null) : null,
			emotion: sa.emotion ? ((sa.emotion as IDataObject).value ?? null) : null,
			intent: sa.intent ? ((sa.intent as IDataObject).value ?? null) : null,
			satisfaction: sa.satisfaction ? ((sa.satisfaction as IDataObject).value ?? null) : null,
			success: sa.success ? ((sa.success as IDataObject).value ?? null) : null,
			human_escalation: sa.human_escalation ? ((sa.human_escalation as IDataObject).value ?? null) : null,
			knowledge_gap: sa.knowledge_gap ? ((sa.knowledge_gap as IDataObject).value ?? null) : null,
			call_end_analysis: data.call_end_analysis ?? null,
			pipeline: data.pipeline ?? null,
			pipeline_change: data.pipeline_change ?? null,
			appointment: data.appointment ?? null,
			timestamp: data.timestamp ?? null,
		};

		if (data.fields && typeof data.fields === 'object') {
			const excludeKeys = ['account_domain', 'Authorization', 'api_key'];
			const fields = data.fields as IDataObject;
			for (const key of Object.keys(fields)) {
				if (!excludeKeys.includes(key)) {
					result[`contact_${key}`] = fields[key] ?? null;
				}
			}
		}

		return {
			workflowData: [[{ json: result }]],
		};
	}
}