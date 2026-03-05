import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';

const { searchClient } = instantMeiliSearch(
	import.meta.env.VITE_APP_MEILI_SEARCH_HOST,
	import.meta.env.VITE_APP_MEILI_SEARCH_KEY
);

export default {
	...searchClient,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	search(requests: any) {
		return searchClient.search(requests).catch(() => {
			return {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				results: requests.map((req: any) => ({
					index: req.indexName,
					hits: [],
					nbHits: 0,
					processingTimeMS: 0,
				})),
			};
		});
	},
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;
