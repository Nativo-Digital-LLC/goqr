import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';

const { searchClient } = instantMeiliSearch(
	import.meta.env.VITE_APP_MEILI_SEARCH_HOST,
	import.meta.env.VITE_APP_MEILI_SEARCH_KEY
);

export default searchClient;
