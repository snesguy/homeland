<script>
export default {
    props: {
        playerId: String,
        age: Number,
        pos: {x:0,y:0},
        bgColor: {
            type: String,
            default: "#0099CC"
        },
    },
    data() {
      return {
        audioNani: new Audio("../src/assets/audio/nani.mp3"),
        audioTuturu: new Audio("../src/assets/audio/tuturu1.mp3"),
        audioCrying: new Audio("../src/assets/audio/babyCry.mp3"),
        newBorn: new String("../src/assets/images/index.jpg"),
        tuturu: new String("../src/assets/images/tuturu.jpg"),
        troll: new String("../src/assets/images/Trollface_non-free.png"),
      }
    },
    computed: {
        cellStyle() {
            return {
                "background-color": getColorForPlayerId(this.playerId),
                'transition-delay': ((this.pos.x + this.pos.y)*30)+"ms",
                'background-image': this.age==0&&this.playerId!=null?'url('+this.newBorn+')':'',
                "animation-delay": ((this.pos.x + this.pos.y) * 30) + "ms",
            };
        }
    },
    methods: {
        randAudio() {
           if (this.playerId == null) {
                let randMod = getPsuedoRandomMod();

                var randNum = Math.floor(Math.random() * randMod);

                console.log(randMod);

                if (randNum <= 1) {
                    this.audioCrying.play();
                    resetPsuedoRandomMod()
                } else if (randNum >= 2 && randNum <= 14) {
                    this.audioTuturu.play();
                    resetPsuedoRandomMod()
                } else if (randNum >= 15 && randNum <= 50) {
                    this.audioNani.play();
                    resetPsuedoRandomMod()
                } else {
                    return
                }
            }
        }
    }
}
</script>

<template>
    <div :style="cellStyle" :class="'cell'" @click="randAudio()">{{ pos.y }}</div>
</template>

<style scoped>
    .cell {
        width: 2em;
        height: 2em;
        border: 0.1em solid black;
        margin: 0.1em;
        background-size: cover;
        background-repeat: none;
        transition: scale 200ms, background-color 600ms, background-image 1s, transform 0.8s;
        background-blend-mode: multiply;
        font-size: 15px;
        user-select: none;
        /*animation: wiggle 1000ms;
        animation-iteration-count: infinite;*/
    }
    
    .cell:hover {
        scale: 110%;
        z-index: 199999999;
    }
    .cell:active {
        scale: 150%;
        perspective: 1000px;
        transform-style: preserve-3d;
        transform: rotateY(180deg);
        background-image: url(../assets/images/Trollface_non-free.png);
        background-blend-mode: multiply;
        animation: shake 0.5s;
        animation-iteration-count: infinite;
    }

    @keyframes shake {
        0% { transform: translate(1px, 1px) rotate(0deg); }
        10% { transform: translate(-1px, -2px) rotate(-1deg); }
        20% { transform: translate(-3px, 0px) rotate(1deg); }
        30% { transform: translate(3px, 2px) rotate(0deg); }
        40% { transform: translate(1px, -1px) rotate(1deg); }
        50% { transform: translate(-1px, 2px) rotate(-1deg); }
        60% { transform: translate(-3px, 1px) rotate(0deg); }
        70% { transform: translate(3px, 1px) rotate(-1deg); }
        80% { transform: translate(-1px, -1px) rotate(1deg); }
        90% { transform: translate(1px, 2px) rotate(0deg); }
        100% { transform: translate(1px, -2px) rotate(-1deg); }
    }

    @keyframes wiggle {
        0% {
            transform: translate(0%, 0%);
        }

        50% {
            transform: translate(-30%, -30%) rotateY(180deg) skew(30deg, 20deg);
            scale: 150%;
        }
        

        100% {
            scale: 110%;
            transform: translate(0%, 0%) rotateY(360deg) skew(0deg, 0deg);
        }
    }
</style>