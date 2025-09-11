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

    test('define extraction_template parameter', () => {
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
