<template>
    <div
        class="w-64 shadow-lg rounded my-3 p-3"
        :class="{
            'bg-green-300': active,
            'bg-red-400': !active && verySoon,
            'bg-yellow-200': !active && soon,
        }"
    >
        <p class="text-lg mb-1">
            {{ active ? 'Ends' : 'Starts' }} in: {{ timer }}
        </p>
        <div class="flex justify-around">
            <img
                v-for="(crop, i) in event.crops"
                :src="assetFromCrop(crop)"
                :alt="Crop[crop]"
                :key="i"
                class="img-icon"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed, watchEffect } from 'vue';
import { JacobEvent, Crop } from '../types';
import { formatTime } from '../utils';
import icons from '../icons';

export default defineComponent({
    name: 'EventCard',
    props: {
        event: {
            type: Object as PropType<JacobEvent>,
            required: true,
        },
    },
    emits: ['event-over'],
    setup(props, ctx) {
        function assetFromCrop(crop: Crop): string {
            return icons[Crop[crop]];
        }
        const diff = ref(props.event.timestamp - Date.now());
        const active = computed(() => diff.value < 0);
        setInterval(
            () => (diff.value = props.event.timestamp - Date.now()),
            1000
        );
        watchEffect(() => {
            if (diff.value < -20 * 60 * 1000) {
                ctx.emit('event-over');
            }
        });

        const timer = computed(() => {
            return formatTime(
                active.value ? 20 * 60 * 1000 + diff.value : diff.value
            );
        });
        // in 5 minutes
        const soon = computed(
            () => !active.value && diff.value < 5 * 60 * 1000 && !verySoon.value
        );
        // in 1 minute
        const verySoon = computed(
            () => !active.value && diff.value < 60 * 1000
        );
        return {
            Crop,
            assetFromCrop,
            active,
            timer,
            soon,
            verySoon,
        };
    },
});
</script>
