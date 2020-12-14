<template>
    <div class="flex justify-center">
        <div class="flex flex-col items-center">
            <h1 class="mt-2 text-4xl font-semibold">Jacob's Farming Contests</h1>
            <p class="text-xl">A list of upcoming farming contests.</p>
            <div class="text-gray-700">
                Contest data is manually collected.
                <a href="https://github.com/matcool/skyblock-jacob" class="italic hover:underline"
                    >Source code</a
                >
            </div>
            <div class="flex items-center text-lg mt-2 mb-1">
                <input type="checkbox" class="w-4 h-4" v-model="notifsEnabled" />
                <span class="ml-1">Enable notifications</span>
            </div>
            <div class="flex items-center text-lg mt-1 mb-2">
                <input type="checkbox" class="w-4 h-4" v-model="absoluteTime" />
                <span class="ml-1">Absolute time</span>
                <input
                    type="checkbox"
                    class="ml-2 w-4 h-4"
                    v-model="twelveHour"
                    :disabled="!absoluteTime"
                />
                <span class="ml-1" :class="{ 'opacity-50': !absoluteTime }">12 hour</span>
            </div>
            <div class="bg-gray-200 flex flex-wrap p-2 rounded-lg mt-2 select-none">
                <div
                    v-for="(name, i) in cropNames"
                    :key="i"
                    @click="selected[i] = !selected[i]"
                    class="px-2 py-1 rounded-lg cursor-pointer mx-1 my-1 md:my-0"
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
                :absoluteTime="absoluteTime"
                :twelveHour="twelveHour"
                :key="event.timestamp"
                @event-over="events.splice(i, 1)"
            ></event-card>
            <div v-if="events.length === 0" class="mt-5 text-xl text-gray-700 italic">
                Uh oh, the API returned no events. If this persists, go complain in the
                <a
                    class="hover:underline text-gray-900"
                    href="https://hypixel.net/threads/website-jacobs-farming-contests-tracker.3562658/"
                    >forum thread</a
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, ref, watchEffect, watch } from 'vue';
import EventCard from './components/EventCard.vue';
import { JacobEvent, Crop } from './types';
import axios from 'axios';
import { cropNames } from './utils';
import { notifsEnabled } from './notifications';

export default defineComponent({
    components: {
        EventCard,
    },
    setup() {
        const events = reactive([] as JacobEvent[]);
        axios.get('/api/upcomingEvents').then((response) => {
            events.push(...response.data);
        });
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

        const absoluteTime = ref(localStorage.getItem('absoluteTime') === 'true');
        const twelveHour = ref(localStorage.getItem('twelveHour') === 'true');
        watchEffect(() => {
            localStorage.setItem('absoluteTime', absoluteTime.value.toString());
            localStorage.setItem('twelveHour', twelveHour.value.toString());
        });
        return {
            events,
            filteredEvents,
            cropNames,
            selected,
            notifsEnabled,
            absoluteTime,
            twelveHour,
        };
    },
});
</script>
