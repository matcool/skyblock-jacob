import './main.css';
import { createApp } from 'vue';
import App from './App.vue';
import Darkmode from 'darkmode-js'; //this madness because there is no @types/ of this :(

const app = createApp(App);

app.mount('#app');

const options = {
    bottom: '64px', // default: '32px'
    right: 'unset', // default: '32px'
    left: '32px', // default: 'unset'
    time: '0.5s', // default: '0.3s'
    mixColor: '#e5e5e5', // default: '#fff'
    backgroundColor: '#fff', // default: '#fff'
    buttonColorDark: '#272727', // default: '#100f2c'
    buttonColorLight: '#fff', // default: '#fff'
    saveInCookies: true, // default: true,
    label: '🌓', // default: ''
    autoMatchOsTheme: true, // default: true
};

const darkmode = new Darkmode(options);
darkmode.showWidget();
