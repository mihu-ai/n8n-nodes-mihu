# n8n-nodes-mihu

This is an n8n community node for [Mihu AI](https://mihu.ai) — an AI-powered contact center and voice agent platform.

## Installation

In your n8n instance, go to **Settings → Community Nodes → Install** and enter `n8n-nodes-mihu`.

## Credentials

You need two things to connect:

- **API Key** — found in your Mihu AI dashboard under Settings → Developer
- **Account Domain** — your Mihu subdomain (e.g. `acme` for `acme.mihu.ai`)

## Supported Resources & Operations

### Contact
- Create Contact
- Find Contact
- Update Contact
- Delete Contact

### Call
- Create Call (outbound AI call)

### WhatsApp
- Send Template Message

### Dataset
- Send Text Prompt
- Create Record
- Update Record
- Delete Record
- Sync Dataset
- Assign to Agent
- Find Dataset
- List Records

### Appointment
- Find All Appointments
- Create Appointment
- Update Appointment
- Update Appointment Status
- Delete Appointment

### Task
- Create Task

### Listing
- Create Listing
- Send Contacts to Listing
- Delete Contact From Listing

## Triggers

### Mihu AI Trigger
- **New Voice Evaluation** — fires when a voice session report is generated
- **New Text Evaluation** — fires when a text session report is generated

## Example Usage

1. Add a **Mihu AI** node to your workflow
2. Select **Resource: Contact** and **Operation: Create**
3. Fill in the phone number and other contact details
4. Execute the workflow — the contact will be created in your Mihu AI account

## Links

- [Mihu AI Website](https://mihu.ai)
- [API Documentation](https://developers.mihu.ai)
- [Support](mailto:support@mihu.ai)