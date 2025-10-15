import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { urlsafe_b64encode } from '../utils';

export function DefineExtractionParams(this: IExecuteFunctions, index: number) {
	const content_type = this.getNodeParameter('content_type', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	// additional fields
	const url = additionalFields.url as string;
	const charset = additionalFields.charset as string;
	const extraction_template = additionalFields.extraction_template as string;
	const extraction_prompt = additionalFields.extraction_prompt as string;
	const extraction_model = additionalFields.extraction_model as string;
	const webhook_name = additionalFields.webhook_name as string;

	const params = new URLSearchParams({
		content_type: content_type,
	});

	if (url) {
		params.append('url', encodeURI(url));
	}

	if (charset) {
		params.append('charset', charset);
	}

	if (extraction_template) {
		const encoded_extraction_template = urlsafe_b64encode(extraction_template);
		params.append('extraction_template', 'ephemeral:' + encoded_extraction_template);
	}

	if (extraction_prompt) {
		params.append('extraction_prompt', extraction_prompt);
	}

	if (extraction_model) {
		params.append('extraction_model', extraction_model);
	}

	if (webhook_name) {
		params.append('webhook_name', webhook_name);
	}

	return params;
}
