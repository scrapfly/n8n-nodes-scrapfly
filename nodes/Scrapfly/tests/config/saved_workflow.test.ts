import { IDataObject, IExecuteFunctions, INode, INodeTypes, Workflow } from 'n8n-workflow';
import { Scrapfly } from '../../Scrapfly.node';
import { DefineScrapeParams } from '../../handlers/scrape/params';
import { DefineScreenshotParams } from '../../handlers/screenshot/params';

// n8n normalizes a saved node's parameters against the node description when it loads
// the workflow (new Workflow), dropping every collection key the description does not
// declare for that node's typeVersion. Mocking getNodeParameter with the raw stored
// collection skips that step, so these cases load the node the way n8n does first.
describe('a saved workflow, loaded the way n8n loads it', () => {
	const POOLS = ['basic', 'unblocker', 'unblocker_ultra', 'auto'];
	const nodeType = new Scrapfly();
	const nodeTypes = {
		getByName: () => nodeType,
		getByNameAndVersion: () => nodeType,
		getKnownTypes: () => ({}),
	} as unknown as INodeTypes;

	const load = (typeVersion: number, parameters: IDataObject): IDataObject => {
		const node: INode = {
			id: '1',
			name: 'Scrapfly',
			type: 'n8n-nodes-scrapfly.Scrapfly',
			typeVersion,
			position: [0, 0],
			parameters,
		} as INode;
		const workflow = new Workflow({ nodes: [node], connections: {}, active: false, nodeTypes });
		return workflow.nodes['Scrapfly'].parameters as IDataObject;
	};

	const contextOf = (parameters: IDataObject) =>
		({ getNodeParameter: (name: string) => parameters[name] }) as unknown as IExecuteFunctions;

	const scrapeParams = (typeVersion: number, operation: string, additionalFields: IDataObject) => {
		const parameters = load(typeVersion, {
			resource: 'Scrape',
			operation,
			url: 'https://web-scraping.dev/products',
			additionalFields,
		});
		return DefineScrapeParams.call(contextOf(parameters), 0);
	};

	test('new nodes are created on version 2', () => {
		expect(nodeType.description.version).toEqual([1, 2]);
		expect(nodeType.description.defaultVersion).toBe(2);
	});

	test.each(['ScrapeWebPage', 'ScrapeAPIRequest'])(
		'%s: a version 1 node saved with the Unblocker checked keeps it',
		(operation) => {
			const params = scrapeParams(1, operation, { unblocker: true, proxy_pool: 'public_residential_pool' });
			expect(params.get('proxy_pool')).toBe('public_residential_pool');
			expect(params.getAll('asp')).toEqual(['true']);
		},
	);

	test('a version 1 node saved with the Unblocker unchecked sends it off', () => {
		const params = scrapeParams(1, 'ScrapeWebPage', { unblocker: false });
		expect(params.get('proxy_pool')).toBe('public_datacenter_pool');
		expect(params.getAll('asp')).toEqual(['false']);
	});

	// Saved before 0.1.10, when the checkbox was stored as `asp`; 0.1.10 dropped the key
	// on load and ran these nodes with the bypass off.
	test.each(['ScrapeWebPage', 'ScrapeAPIRequest'])(
		'%s: a version 1 node saved with asp keeps it',
		(operation) => {
			const params = scrapeParams(1, operation, { asp: true });
			expect(params.get('proxy_pool')).toBe('public_datacenter_pool');
			expect(params.getAll('asp')).toEqual(['true']);
		},
	);

	test('a stored asp wins over the Unblocker checkbox', () => {
		const asp = (fields: IDataObject) => scrapeParams(1, 'ScrapeWebPage', fields).getAll('asp');
		expect(asp({ asp: false, unblocker: true })).toEqual(['false']);
		expect(asp({ asp: true, unblocker: false })).toEqual(['true']);
	});

	test.each(POOLS)('a version 1 node given the %s pool sends the pool alone', (pool) => {
		const params = scrapeParams(1, 'ScrapeWebPage', { unblocker: true, proxy_pool: pool });
		expect(params.get('proxy_pool')).toBe(pool);
		expect(params.has('asp')).toBe(false);
	});

	test('a version 2 node does not offer the legacy toggles', () => {
		const parameters = load(2, {
			resource: 'Scrape',
			operation: 'ScrapeWebPage',
			url: 'https://web-scraping.dev/products',
			additionalFields: { unblocker: true, asp: true, proxy_pool: 'basic' },
		});
		expect(parameters.additionalFields).toEqual({ proxy_pool: 'basic' });
	});

	test.each(POOLS)('a version 2 node sends the %s pool alone', (pool) => {
		const params = scrapeParams(2, 'ScrapeAPIRequest', { proxy_pool: pool });
		expect(params.get('proxy_pool')).toBe(pool);
		expect(params.has('asp')).toBe(false);
	});

	test.each(POOLS)('a screenshot keeps the %s pool through the load', (pool) => {
		const parameters = load(2, {
			resource: 'Screenshot',
			operation: 'WebPageScreenshot',
			url: 'https://web-scraping.dev/products',
			additionalFields: { proxy_pool: pool },
		});
		const params = DefineScreenshotParams.call(contextOf(parameters), 0);
		expect(params.get('proxy_pool')).toBe(pool);
	});
});
