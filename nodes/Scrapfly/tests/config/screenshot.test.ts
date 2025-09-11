import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { DefineScreenshotParams } from '../../handlers/screenshot/params';

describe('screenshot params', () => {
    const mockUrl = 'https://web-scraping.dev/products';

    const mockScreenshotParams = (url: string, additionalFields: IDataObject): URLSearchParams => {
        const context = {
            getNodeParameter: jest.fn()
                .mockReturnValueOnce(url)
                .mockReturnValueOnce(additionalFields)
        } as Partial<IExecuteFunctions>;
    
        return DefineScreenshotParams.call(context as IExecuteFunctions, 0);
    };
    
    test('define url parameter', () => {
        const additionalFields: IDataObject = {};
    
        const params = mockScreenshotParams(mockUrl, additionalFields);
        
        expect(params.get('url')).toBe(mockUrl);
    });

    test('define fileName parameter', () => {
        const additionalFields: IDataObject = {
            fileName: 'product-screenshot',
        };
    
        const params = mockScreenshotParams(mockUrl, additionalFields);
        expect(params.get('fileName')).toBe('product-screenshot');
    });

    test('define format parameter', () => {
        const additionalFields: IDataObject = {
            format: 'png',
        };
    
        const params = mockScreenshotParams(mockUrl, additionalFields);
        expect(params.get('format')).toBe('png');
    });

    test('define capture parameter', () => {
        const additionalFields: IDataObject = {
            capture: 'fullpage',
        };
    
        const params = mockScreenshotParams(mockUrl, additionalFields);
        expect(params.get('capture')).toBe('fullpage');
    });

    test('define resolution parameter', () => {
        const additionalFields: IDataObject = {
            resolution: '1920x1080',
        };
    
        const params = mockScreenshotParams(mockUrl, additionalFields);
        expect(params.get('resolution')).toBe('1920x1080');
    });

    test('define country parameter', () => {
        const additionalFields: IDataObject = {
            country: 'us',
        };
    
        const params = mockScreenshotParams(mockUrl, additionalFields);
        expect(params.get('country')).toBe('us');
    });

    test('define timeout parameter', () => {
        const additionalFields: IDataObject = {
            timeout: '75000',
        };
    
        const params = mockScreenshotParams(mockUrl, additionalFields);
        expect(params.get('timeout')).toBe('75000');
    });

    test('define rendering_wait parameter', () => {
        const additionalFields: IDataObject = {
            rendering_wait: '5000',
        };
    
        const params = mockScreenshotParams(mockUrl, additionalFields);
        expect(params.get('rendering_wait')).toBe('5000');
    });

    test('define wait_for_selector parameter', () => {
        const additionalFields: IDataObject = {
            wait_for_selector: '.product-list',
        };
    
        const params = mockScreenshotParams(mockUrl, additionalFields);
        expect(params.get('wait_for_selector')).toBe('.product-list');
    });

    test('define options parameter', () => {
        const additionalFields: IDataObject = {
            options: ['dark_mode', 'block_banners', 'print_media_format'],
        };
    
        const params = mockScreenshotParams(mockUrl, additionalFields);
        expect(params.get('options')).toBe('dark_mode,block_banners,print_media_format');
    });

    test('define auto_scroll parameter', () => {
        const additionalFields: IDataObject = {
            auto_scroll: true,
        };
    
        const params = mockScreenshotParams(mockUrl, additionalFields);
        expect(params.get('auto_scroll')).toBe('true');
    });

    test('define js parameter', () => {
        const additionalFields: IDataObject = {
            js: 'console.log("test");',
        };
    
        const params = mockScreenshotParams(mockUrl, additionalFields);
        expect(params.get('js')).toBe('Y29uc29sZS5sb2coInRlc3QiKTs');
    });

    test('define cache parameter', () => {
        const additionalFields: IDataObject = {
            cache: true,
        };
    
        const params = mockScreenshotParams(mockUrl, additionalFields);
        expect(params.get('cache')).toBe('true');
    });

    test('define cache_ttl parameter', () => {
        const additionalFields: IDataObject = {
            cache: true,
            cache_ttl: '3600',
        };
    
        const params = mockScreenshotParams(mockUrl, additionalFields);
        expect(params.get('cache_ttl')).toBe('3600');
    });

    test('define cache_clear parameter', () => {
        const additionalFields: IDataObject = {
            cache: true,
            cache_clear: true,
        };
    
        const params = mockScreenshotParams(mockUrl, additionalFields);
        expect(params.get('cache_clear')).toBe('true');
    });
});
