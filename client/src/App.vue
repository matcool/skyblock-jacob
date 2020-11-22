<template>
    <div class="flex justify-center">
        <div class="flex flex-col items-center">
            <h1 class="mt-2 text-4xl font-semibold">
                Jacob's Farming Contests
            </h1>
            <p class="text-xl">A list of upcoming farming contests.</p>
            <div class="text-gray-700">
                Data is manually collected.
                <a href="https://github.com/matcool" class="italic"
                    >Source code</a
                >
            </div>
            <div class="bg-gray-200 flex p-2 gap-2 rounded-lg mt-2 select-none">
                <div
                    v-for="(name, i) in cropNames"
                    :key="i"
                    @click="selected[i] = !selected[i]"
                    class="px-2 py-1 rounded-lg cursor-pointer"
                    :class="{
                        'bg-white': !selected[i],
                        'bg-indigo-200': selected[i],
                    }"
                >
                    {{ name }}
                </div>
            </div>
            <event-card
                v-for="(event, i) in filteredEvents"
                :event="event"
                :key="i"
                @event-over="events.splice(i, 1)"
            ></event-card>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, ref } from 'vue';
import EventCard from './components/EventCard.vue';
import { JacobEvent, Crop } from './types';
import axios from 'axios';
import { enumNames } from './utils';

export default defineComponent({
    components: {
        EventCard,
    },
    setup() {
        const events = reactive([] as JacobEvent[]);
        axios.get('/api/upcomingEvents').then((response) => {
            events.push(...response.data);
        });
        const cropNames = reactive([
            'Cactus',
            'Carrot',
            'Cocoa beans',
            'Melon',
            'Mushroom',
            'Nether wart',
            'Potato',
            'Pumpkin',
            'Sugar cane',
            'Wheat',
        ]);
        const selected = reactive(Array(cropNames.length).fill(false));
        const filteredEvents = computed(() => {
            // if nothing is selected, then ignore
            if (!selected.some((i) => i)) {
                return events;
            }
            return events.filter((event) => {
                return event.crops.some((value) => selected[value]);
            });
        });
        return {
            events,
            filteredEvents,
            cropNames,
            selected,
        };
    },
});
</script>
