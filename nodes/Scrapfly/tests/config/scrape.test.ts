import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { DefineScrapeParams } from '../../handlers/scrape/params';

describe('scrape params', () => {
    const mockUrl = 'https://web-scraping.dev/products';

    const mockScrapeParams = (url: string, additionalFields: IDataObject): URLSearchParams => {
        const context = {
            getNodeParameter: jest.fn()
                .mockReturnValueOnce(url)
                .mockReturnValueOnce(additionalFields)
        } as Partial<IExecuteFunctions>;
    
        return DefineScrapeParams.call(context as IExecuteFunctions, 0);
    };
    
    test('define url parameter', () => {
        const additionalFields: IDataObject = {};
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        
        expect(params.get('url')).toBe(mockUrl);
    });

    test('define body parameter', () => {
        const additionalFields: IDataObject = {
            body: 'test body',
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('body')).toBe('test body');
    });

    test('define headers parameter', () => {
        const additionalFields: IDataObject = {
            headers: {
                headers: [
                    { name: 'content-type', value: 'application/json' },
                    { name: 'user-agent', value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
                ]
            }
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);

        expect(params.get('headers[content-type]')).toBe('application/json');
        expect(params.get('headers[user-agent]')).toBe('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    });

    test('define retry parameter', () => {
        const additionalFields: IDataObject = {
            retry: true,
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('retry')).toBe('true');
    });

    test('define timeout parameter', () => {
        const additionalFields: IDataObject = {
            timeout: '75000',
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('timeout')).toBe('75000');
    });

    test('define proxy_pool parameter', () => {
        const additionalFields: IDataObject = {
            proxy_pool: 'public_residential_pool',
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('proxy_pool')).toBe('public_residential_pool');
    });

    test('define country parameter', () => {
        const additionalFields: IDataObject = {
            country: 'us',
        };
        
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('country')).toBe('us');
    });

    test('define asp parameter', () => {
        const additionalFields: IDataObject = {
            asp: true,
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('asp')).toBe('true');
    });

    test('define cost_budget parameter', () => {
        const additionalFields: IDataObject = {
            cost_budget: '100',
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('cost_budget')).toBe('100');
    });

    test('define render_js parameter', () => {
        const additionalFields: IDataObject = {
            render_js: true,
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('render_js')).toBe('true');
    });

    test('define auto_scroll parameter', () => {
        const additionalFields: IDataObject = {
            render_js: true,
            auto_scroll: true,
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('auto_scroll')).toBe('true');
    });

    test('define rendering_wait parameter', () => {
        const additionalFields: IDataObject = {
            render_js: true,
            rendering_wait: '5000',
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('rendering_wait')).toBe('5000');
    });

    test('define rendering_stage parameter', () => {
        const additionalFields: IDataObject = {
            render_js: true,
            rendering_stage: 'complete',
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('rendering_stage')).toBe('complete');
    });

    test('define wait_for_selector parameter', () => {
        const additionalFields: IDataObject = {
            render_js: true,
            wait_for_selector: '.product-list',
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('wait_for_selector')).toBe('.product-list');
    });

    test('define js parameter', () => {
        const additionalFields: IDataObject = {
            render_js: true,
            js: 'console.log("test");',
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('js')).toBe('Y29uc29sZS5sb2coInRlc3QiKTs');
    });

    test('define js_scenario parameter', () => {
        const additionalFields: IDataObject = {
            render_js: true,
            js_scenario: JSON.stringify([
                {"fill": {"selector": "#username", "value":"demo"}},
                {"fill": {"selector": "#password", "value":"demo"}},
                {"click": {"selector": "form input[type='submit']"}},
                {"wait_for_navigation": {"timeout": 5000}}
            ]),
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('js_scenario')).toBe('W3siZmlsbCI6eyJzZWxlY3RvciI6IiN1c2VybmFtZSIsInZhbHVlIjoiZGVtbyJ9fSx7ImZpbGwiOnsic2VsZWN0b3IiOiIjcGFzc3dvcmQiLCJ2YWx1ZSI6ImRlbW8ifX0seyJjbGljayI6eyJzZWxlY3RvciI6ImZvcm0gaW5wdXRbdHlwZT0nc3VibWl0J10ifX0seyJ3YWl0X2Zvcl9uYXZpZ2F0aW9uIjp7InRpbWVvdXQiOjUwMDB9fV0');
    });

    test('define screenshots parameter', () => {
        const additionalFields: IDataObject = {
            screenshots: {
                screenshots: [
                    { name: 'fullpage-sccreenshot', selector: 'fullpage' }
                ]
            }
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('screenshots[fullpage-sccreenshot]')).toBe('fullpage');
    });

    test('define screenshot_flags parameter', () => {
        const additionalFields: IDataObject = {
            screenshots: {
                screenshots: [
                    { name: 'screenshot', selector: 'fullpage' }
                ]
            },
            screenshot_flags: ['block_banners', 'dark_mode', 'high_quality', 'load_images', 'print_media_format']
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('screenshot_flags')).toBe('block_banners,dark_mode,high_quality,load_images,print_media_format');
    });

    test('define format parameter', () => {
        const additionalFields: IDataObject = {
            format: 'markdown',
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('format')).toBe('markdown');
    });

    test('define format_options parameter', () => {
        const additionalFields: IDataObject = {
            format: 'markdown',
            format_options: ['no_links', 'no_images', 'only_content'],
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('format')).toBe('markdown:no_links,no_images,only_content');
    });

    test('define extraction_template parameter', () => {
        const additionalFields: IDataObject = {
            extraction_template: JSON.stringify({
                "source": "html",
                "selectors": [
                  {
                    "name": "title",
                    "query": "h3.product-title::text",
                    "type": "css",
                    "formatters": [
                      {
                        "name": "uppercase"
                      }
                    ]
                  }
                ]
              })
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('extraction_template')).toBe('ephemeral:eyJzb3VyY2UiOiJodG1sIiwic2VsZWN0b3JzIjpbeyJuYW1lIjoidGl0bGUiLCJxdWVyeSI6ImgzLnByb2R1Y3QtdGl0bGU6OnRleHQiLCJ0eXBlIjoiY3NzIiwiZm9ybWF0dGVycyI6W3sibmFtZSI6InVwcGVyY2FzZSJ9XX1dfQ');
    });

    test('define extraction_prompt parameter', () => {
        const additionalFields: IDataObject = {
            extraction_prompt: 'what is the product price?',
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('extraction_prompt')).toBe('what is the product price?');
    });

    test('define extraction_model parameter', () => {
        const additionalFields: IDataObject = {
            extraction_model: 'product',
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('extraction_model')).toBe('product');
    });

    test('define session parameter', () => {
        const additionalFields: IDataObject = {
            session: 'session-123',
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('session')).toBe('session-123');
    });

    test('define session_sticky_proxy parameter', () => {
        const additionalFields: IDataObject = {
            session_sticky_proxy: false,
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('session_sticky_proxy')).toBe('false');
    });

    test('define cache parameter', () => {
        const additionalFields: IDataObject = {
            cache: true,
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('cache')).toBe('true');
    });

    test('define cache_ttl parameter', () => {
        const additionalFields: IDataObject = {
            cache: true,
            cache_ttl: '3600',
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('cache_ttl')).toBe('3600');
    });

    test('define cache_clear parameter', () => {
        const additionalFields: IDataObject = {
            cache: true,
            cache_clear: true,
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('cache_clear')).toBe('true');
    });

    test('define proxified_response parameter', () => {
        const additionalFields: IDataObject = {
            proxified_response: true,
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('proxified_response')).toBe('true');
    });

    test('define debug parameter', () => {
        const additionalFields: IDataObject = {
            debug: true,
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('debug')).toBe('true');
    });

    test('define tags parameter', () => {
        const additionalFields: IDataObject = {
            tags: {
                tags: [
                    { Tag: 'ecommerce' },
                    { Tag: 'products' }
                ]
            }
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('tags')).toBe('ecommerce,products');
    });

    test('define os parameter', () => {
        const additionalFields: IDataObject = {
            os: 'mac',
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('os')).toBe('mac');
    });

    test('define lang parameter', () => {
        const additionalFields: IDataObject = {
            lang: 'en',
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('lang')).toBe('en');
    });

    test('define geolocation parameter', () => {
        const additionalFields: IDataObject = {
            geolocation: '48.856614,2.3522219',
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('geolocation')).toBe('48.856614,2.3522219');
    });

    test('define dns parameter', () => {
        const additionalFields: IDataObject = {
            dns: true,
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('dns')).toBe('true');
    });

    test('define ssl parameter', () => {
        const additionalFields: IDataObject = {
            ssl: true,
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('ssl')).toBe('true');
    });

    test('define correlation_id parameter', () => {
        const additionalFields: IDataObject = {
            correlation_id: 'corr-123-456',
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('correlation_id')).toBe('corr-123-456');
    });

    test('define webhook_name parameter', () => {
        const additionalFields: IDataObject = {
            webhook_name: 'my-webhook',
        };
    
        const params = mockScrapeParams(mockUrl, additionalFields);
        expect(params.get('webhook_name')).toBe('my-webhook');
    });
});
