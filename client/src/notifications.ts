import { ref, watchEffect } from 'vue';

export const notifsEnabled = ref(localStorage.getItem('notifsEnabled') == 'true');

watchEffect(() => {
    if (notifsEnabled.value) {
        Notification.requestPermission().then((value) => {
            if (value === 'granted') {
                notifsEnabled.value = true;
                localStorage.setItem('notifsEnabled', 'true');
            } else {
                notifsEnabled.value = false;
            }
        });
    } else {
        localStorage.setItem('notifsEnabled', 'false');
    }
});
