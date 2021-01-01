<template>
    <div
        class="w-64 shadow-lg rounded my-3 p-3"
        :class="{
            'bg-green-300': active,
            'bg-red-400': !active && verySoon,
            'bg-yellow-200': !active && soon,
        }"
    >
        <p class="text-lg mb-1">{{ timer }}</p>
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
import { formatTime, cropNames, dateTo12Hour, padNumber } from '../utils';
import icons from '../icons';
import { notifsEnabled } from '../notifications';

export default defineComponent({
    name: 'EventCard',
    props: {
        event: {
            type: Object as PropType<JacobEvent>,
            required: true,
        },
        absoluteTime: Boolean,
        twelveHour: Boolean,
    },
    emits: ['event-over'],
    setup(props, ctx) {
        function assetFromCrop(crop: Crop): string {
            return icons[Crop[crop]];
        }
        const diff = ref(props.event.timestamp - Date.now());
        const active = computed(() => diff.value < 0);
        setInterval(() => {
            diff.value = props.event.timestamp - Date.now();
        }, 1000);
        let sentNotification = ref(false);
        watchEffect(() => {
            if (diff.value < -20 * 60 * 1000) {
                ctx.emit('event-over');
            } else if (
                !active.value &&
                diff.value < 3 * 60 * 1000 &&
                notifsEnabled.value &&
                !sentNotification.value
            ) {
                // maybe change to 5 minutes so it matches with the other one idk
                sentNotification.value = true;
                new Notification('A contest is about to start!', {
                    body: `In less than 3 minutes. Crops: ${props.event.crops
                        .map((crop) => cropNames[crop])
                        .join(', ')}`,
                });
            }
        });

        const eventDate = ref(new Date(props.event.timestamp));

        const timer = computed(() => {
            if (!props.absoluteTime || diff.value < 10 * 60 * 1000) {
                const countdown = formatTime(
                    active.value ? 20 * 60 * 1000 + diff.value : diff.value
                );
                return `${active.value ? 'Ends' : 'Starts'} in ${countdown}`;
            } else {
                const now = new Date();
                let time = props.twelveHour
                    ? dateTo12Hour(eventDate.value)
                    : `${padNumber(eventDate.value.getHours(), 2)}:${padNumber(
                          eventDate.value.getMinutes(),
                          2
                      )}`;
                let day;
                let dayDiff = eventDate.value.getDay() - now.getDay();
                if (dayDiff < 0) dayDiff += 7;
                switch (dayDiff) {
                    case 0:
                        day = 'at';
                        break;
                    case 1:
                        day = 'tomorrow at';
                        break;
                    default:
                        day = `in ${dayDiff} days at`;
                }
                return `Starts ${day} ${time}`;
            }
        });
        // in 5 minutes
        const soon = computed(() => !active.value && diff.value < 5 * 60 * 1000 && !verySoon.value);
        // in 1 minute
        const verySoon = computed(() => !active.value && diff.value < 60 * 1000);
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
