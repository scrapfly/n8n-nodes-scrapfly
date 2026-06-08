import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { DefineExtractionParams } from '../../handlers/extraction/params';

describe('extraction params', () => {
    const mockContentType = 'text/html';

    const mockExtractionParams = (content_type: string, additionalFields: IDataObject): URLSearchParams => {
        const context = {
            getNodeParameter: jest.fn()
                .mockReturnValueOnce(content_type)
                .mockReturnValueOnce(additionalFields)
        } as Partial<IExecuteFunctions>;
    
        return DefineExtractionParams.call(context as IExecuteFunctions, 0);
    };
    
    test('define content_type parameter', () => {
        const additionalFields: IDataObject = {};
    
        const params = mockExtractionParams(mockContentType, additionalFields);
        
        expect(params.get('content_type')).toBe(mockContentType);
    });

    test('define url parameter', () => {
        const additionalFields: IDataObject = {
            url: 'https://web-scraping.dev/products',
        };
    
        const params = mockExtractionParams(mockContentType, additionalFields);
        expect(params.get('url')).toBe('https://web-scraping.dev/products');
    });

    test('define charset parameter', () => {
        const additionalFields: IDataObject = {
            charset: 'auto',
        };
    
        const params = mockExtractionParams(mockContentType, additionalFields);
        expect(params.get('charset')).toBe('auto');
    });

    test('define extraction_template parameter (inline JSON is base64-wrapped)', () => {
        const additionalFields: IDataObject = {
            extraction_template: JSON.stringify({
                "source": "html",
                "selectors": [
                  {
                    "name": "title",
                    "query": "h1::text",
                    "type": "css"
                  }
                ]
              })
        };

        const params = mockExtractionParams(mockContentType, additionalFields);
        expect(params.get('extraction_template')).toBe('ephemeral:eyJzb3VyY2UiOiJodG1sIiwic2VsZWN0b3JzIjpbeyJuYW1lIjoidGl0bGUiLCJxdWVyeSI6ImgxOjp0ZXh0IiwidHlwZSI6ImNzcyJ9XX0');
    });

    test('define extraction_template parameter (saved template slug is forwarded verbatim, no base64)', () => {
        const additionalFields: IDataObject = {
            extraction_template: 'product-card',
        };

        const params = mockExtractionParams(mockContentType, additionalFields);
        // No ephemeral: prefix, no base64 wrapping — the Go API resolves the slug
        // server-side via /internal/extraction-template/resolve.
        expect(params.get('extraction_template')).toBe('product-card');
    });

    test('define extraction_template parameter (slug with hyphens and digits)', () => {
        const additionalFields: IDataObject = {
            extraction_template: 'shopify-product-v2',
        };

        const params = mockExtractionParams(mockContentType, additionalFields);
        expect(params.get('extraction_template')).toBe('shopify-product-v2');
    });

    test('define extraction_template parameter (surrounding whitespace on slug is trimmed)', () => {
        const additionalFields: IDataObject = {
            extraction_template: '  product-card  ',
        };

        const params = mockExtractionParams(mockContentType, additionalFields);
        expect(params.get('extraction_template')).toBe('product-card');
    });

    test('define extraction_template parameter (uppercase string does not match slug shape, falls through to base64)', () => {
        // Slug regex requires lowercase only. An uppercase string is treated as
        // raw template content and base64-wrapped, so the API will surface a
        // JSON parse error rather than silently route to a non-existent slug.
        const additionalFields: IDataObject = {
            extraction_template: 'NotASlug',
        };

        const params = mockExtractionParams(mockContentType, additionalFields);
        expect(params.get('extraction_template')).toMatch(/^ephemeral:/);
    });

    test('define extraction_template parameter (too-short string falls through to base64)', () => {
        // Slug minimum length is 3 characters per the Go API regex. Shorter
        // strings are treated as inline content.
        const additionalFields: IDataObject = {
            extraction_template: 'a',
        };

        const params = mockExtractionParams(mockContentType, additionalFields);
        expect(params.get('extraction_template')).toMatch(/^ephemeral:/);
    });

    test('define extraction_template parameter (string with spaces is inline JSON, base64-wrapped)', () => {
        // A real saved-template slug cannot contain spaces. If the user pastes
        // a sentence by mistake, the handler must NOT silently treat it as a
        // slug — it falls through to the inline path so the API returns a
        // clear "Invalid JSON" error.
        const additionalFields: IDataObject = {
            extraction_template: 'product card extractor',
        };

        const params = mockExtractionParams(mockContentType, additionalFields);
        expect(params.get('extraction_template')).toMatch(/^ephemeral:/);
    });

    test('define extraction_prompt parameter', () => {
        const additionalFields: IDataObject = {
            extraction_prompt: 'what is the product price?',
        };
    
        const params = mockExtractionParams(mockContentType, additionalFields);
        expect(params.get('extraction_prompt')).toBe('what is the product price?');
    });

    test('define extraction_model parameter', () => {
        const additionalFields: IDataObject = {
            extraction_model: 'product',
        };
    
        const params = mockExtractionParams(mockContentType, additionalFields);
        expect(params.get('extraction_model')).toBe('product');
    });

    test('define webhook_name parameter', () => {
        const additionalFields: IDataObject = {
            webhook_name: 'my-extraction-webhook',
        };
    
        const params = mockExtractionParams(mockContentType, additionalFields);
        expect(params.get('webhook_name')).toBe('my-extraction-webhook');
    });
});
