import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import path from 'path'


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
			//elliptic: path.resolve(__dirname, './src/lib/PackageDepends/fixImport.cjs'),
		}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
