import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import chroma from "chroma-js";
import Chance from "chance";
import './assets/main.css'

function hashCode(s) {
    if (s === null) {
        return null;
    }

    for(var i = 0, h = 0; i < s.length; i++)
        h = Math.imul(31, h) + s.charCodeAt(i) | 0;
    return h;
}

window.getColorForPlayerId = function(playerId) {
    if (playerId === null) {
        return chroma('white').css();
    }
    let chance = Chance(hashCode(playerId));
    return chroma.hsv(chance.integer({ min: 0, max: 359 }), 1, 0.8).css();
}
window['PsuedoRandomMod'] = 1500
window.getPsuedoRandomMod = function() {
    window['PsuedoRandomMod'] -= 10
    return window['PsuedoRandomMod']
}
window.resetPsuedoRandomMod = function() {
    window['PsuedoRandomMod'] = 1500
}

const app = createApp(App)

app.use(router)

app.mount('#app')


// ---



