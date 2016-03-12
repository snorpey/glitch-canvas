import clamp from '../util/clamp';
import clone from '../util/clone';
import defaultParams from './defaultParams';

export default function ( params ) {
	
	params = clone( params );

	if ( typeof params !== 'object' ) {
		params = { };
	}

	let defaultKeys = Object
		.keys( defaultParams )
		.filter( function ( key ) { return key !== 'iterations'; } );

	defaultKeys.forEach( function ( key ) {
		if ( typeof params[key] !== 'number' || isNaN( params[key] ) ) {
			params[key] = defaultParams[key];
		} else {
			params[key] = clamp( params[key], 0, 100 );
		}
		
		params[key] = Math.round( params[key] );
	} );

	if ( typeof params.iterations !== 'number' || isNaN( params.iterations ) || params.iterations <= 0 ) {
		params.iterations = defaultParams.iterations;	
	}

	params.iterations = Math.round( params.iterations );

	return params;
}