import { INodeProperties } from 'n8n-workflow';
import { Scrape } from '../../handlers/scrape/operations';

// The rename is what customers see: without this the node could be reverted to
// "Anti-Scraping Protection"/`asp` with every other suite still green, because
// the params layer honours the old key as a fallback and absorbs it.
describe('scrape operations', () => {
    const additionalFieldCollections = (): INodeProperties[] =>
        Scrape.filter((property) => property.name === 'additionalFields');

    // Every entry of an `additionalFields` collection is a property definition.
    const optionsOf = (collection: INodeProperties): INodeProperties[] =>
        (collection.options ?? []) as INodeProperties[];

    test('both operations expose an additional fields collection', () => {
        expect(additionalFieldCollections()).toHaveLength(2);
    });

    test.each([0, 1])('collection %i offers Unblocker and no asp field', (index) => {
        const options = optionsOf(additionalFieldCollections()[index]);

        const unblocker = options.find((option) => option.name === 'unblocker');
        expect(unblocker).toBeDefined();
        expect(unblocker?.displayName).toBe('Unblocker');

        // The retired name stays honoured in params.ts as a stored key; it must
        // never come back as a second visible checkbox.
        expect(options.map((option) => option.name)).not.toContain('asp');
    });
});
