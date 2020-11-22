import { reactive } from 'vue';
import type { Note } from './types';

export const notes = reactive([
    {
        title: 'hello',
        content: 'welcome to my blog',
    },
] as Note[]);
