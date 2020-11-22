import { UserConfig } from 'vite';

export default {
    plugins: [],
    proxy: {
        '/api': 'http://localhost:5000/',
    },
} as UserConfig;
