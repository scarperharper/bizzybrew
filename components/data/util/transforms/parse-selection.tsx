import { TableSelection } from "@/data/models/util";

/**
 *
 * @param selection As returned by tanstack table: https://tanstack.com/table/v8/docs/guide/row-selection
 * @returns The numerical ID of the selected row
 */
export const parseSelection = ( selection: TableSelection ): number => {

	const out = Object.entries( selection )
		.find( ([k,v]) => !!v );

	// const out = Object.entries( selection )
	// 	.filter( ([k,v]) => !!v )
	// 	.map( ([k,v]) => k )
	// 	.pop();
	return out?.[0] ? parseInt(out[0]) : -1;
}