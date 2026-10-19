import { INodeProperties } from 'n8n-workflow';
import { Scrape } from '../../handlers/scrape/operations';
import { Screenshot } from '../../handlers/screenshot/operations';

const POOLS = ['basic', 'unblocker', 'unblocker_ultra', 'auto'];

// The legacy toggles are declared for version 1 nodes only: n8n drops a stored key the
// node does not declare when it loads a workflow, and the params layer would absorb
// that silently, every other suite still green.
describe('scrape operations', () => {
    const additionalFieldCollections = (): INodeProperties[] =>
        Scrape.filter((property) => property.name === 'additionalFields');

    // Every entry of an `additionalFields` collection is a property definition.
    const optionsOf = (collection: INodeProperties): INodeProperties[] =>
        (collection.options ?? []) as INodeProperties[];

    test('both operations expose an additional fields collection', () => {
        expect(additionalFieldCollections()).toHaveLength(2);
    });

    // Both stored names of the deprecated Unblocker toggle, `unblocker` and `asp` (before
    // 0.1.10), stay declared for typeVersion 1 nodes, whose saved value n8n would
    // otherwise drop on load, and are never offered to a version 2 node.
    test.each([0, 1])('collection %i keeps both legacy toggles for version 1 nodes only', (index) => {
        const options = optionsOf(additionalFieldCollections()[index]);
        for (const name of ['unblocker', 'asp']) {
            const toggle = options.find((option) => option.name === name);
            expect(toggle?.type).toBe('boolean');
            expect(toggle?.displayOptions).toEqual({ show: { '@version': [1] } });
        }
    });

    test.each([0, 1])('collection %i offers the four pools first and keeps the legacy pools', (index) => {
        const proxyPool = optionsOf(additionalFieldCollections()[index]).find(
            (option) => option.name === 'proxy_pool',
        );
        expect(proxyPool).toBeDefined();
        expect(proxyPool?.default).toBe('basic');

        const values = ((proxyPool?.options ?? []) as Array<{ value: string }>).map((option) => option.value);
        expect(values.slice(0, 4)).toEqual(POOLS);
        // Saved workflows store these; an options value missing from the list flags the node.
        expect(values).toContain('public_datacenter_pool');
        expect(values).toContain('public_residential_pool');
    });
});

describe('screenshot operations', () => {
    test('the proxy pool offers the four pools', () => {
        const collection = Screenshot.find((property) => property.name === 'additionalFields');
        const proxyPool = ((collection?.options ?? []) as INodeProperties[]).find(
            (option) => option.name === 'proxy_pool',
        );
        expect(proxyPool?.default).toBe('basic');

        const values = ((proxyPool?.options ?? []) as Array<{ value: string }>).map((option) => option.value);
        expect(values).toEqual(POOLS);
    });
});
