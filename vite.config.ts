import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';


export default defineConfig({
	plugins: [sveltekit()],
        
	resolve: {
		alias: {
			/*"stream": "vite-compatible-readable-stream",*/
			stream: 'stream-browserify',
			process: 'process/browser',
			zlib: 'browserify-zlib',
			util: 'util',
			path: 'path-browserify',
		}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
