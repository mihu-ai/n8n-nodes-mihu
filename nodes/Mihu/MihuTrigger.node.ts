import {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';

export class MihuTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Mihu AI Trigger',
		name: 'mihuTrigger',
		icon: 'file:mihu.svg',
		group: ['trigger'],
		version: 1,
		description: 'Triggers when a Mihu AI voice or text evaluation is completed',
		defaults: {
			name: 'Mihu AI Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'mihuApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
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
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const event = this.getNodeParameter('event') as string;
				const credentials = await this.getCredentials('mihuApi');

				await this.helpers.requestWithAuthentication.call(this, 'mihuApi', {
					method: 'POST',
					url: `https://${credentials.accountDomain}.mihu.ai/api/v1/webhooks`,
					body: {
						targetUrl: webhookUrl,
						event,
					},
					json: true,
				});

				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const credentials = await this.getCredentials('mihuApi');

				try {
					await this.helpers.requestWithAuthentication.call(this, 'mihuApi', {
						method: 'DELETE',
						url: `https://${credentials.accountDomain}.mihu.ai/api/v1/webhooks`,
						body: {
							targetUrl: webhookUrl,
						},
						json: true,
					});
				} catch (_) {}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const raw = this.getBodyData() as Record<string, any>;
		const event = this.getNodeParameter('event') as string;

		// Filter by event type
		if (raw.event && raw.event !== event && raw.event !== 'conversation_end_report') {
			return { noWebhookResponse: true };
		}

		const data = raw.data || raw;

		const result: Record<string, any> = {
			id: data.call_id || data.session_evaluation_uuid || Date.now().toString(),
			event: raw.event || event,
			call_id: data.call_id || null,
			session_evaluation_uuid: data.session_evaluation_uuid || null,
			conversation_uuid: data.conversation_uuid || null,
			agent_id: data.agent_id || null,
			session_type: data.session_type || null,
			duration: data.duration || null,
			number: data.number || null,
			phone_number: data.contact_info ? data.contact_info.phone_number : data.number,
			conversation: data.conversation || null,
			sentiment: data.sentiment_analysis?.sentiment?.value || null,
			sentiment_confidence: data.sentiment_analysis?.sentiment?.confidence || null,
			emotion: data.sentiment_analysis?.emotion?.value || null,
			intent: data.sentiment_analysis?.intent?.value || null,
			intent_labels: data.sentiment_analysis?.intent_labels?.value || null,
			satisfaction: data.sentiment_analysis?.satisfaction?.value || null,
			success: data.sentiment_analysis?.success?.value || null,
			human_escalation: data.sentiment_analysis?.human_escalation?.value || null,
			knowledge_gap: data.sentiment_analysis?.knowledge_gap?.value || null,
			call_end_analysis: data.call_end_analysis || null,
			pipeline: data.pipeline || null,
			pipeline_change: data.pipeline_change || null,
			appointment: data.appointment || null,
			timestamp: data.timestamp || null,
		};

		// Dynamic contact fields
		if (data.fields && typeof data.fields === 'object') {
			const excludeKeys = ['account_domain', 'Authorization', 'api_key'];
			for (const key of Object.keys(data.fields)) {
				if (!excludeKeys.includes(key)) {
					result[`contact_${key}`] = data.fields[key] || null;
				}
			}
		}

		return {
			workflowData: [[{ json: result }]],
		};
	}
}