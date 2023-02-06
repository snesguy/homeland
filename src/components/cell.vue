<script>
export default {
    props: {
        playerId: String,
        age: Number,
        hp: Number,
        pos: {x:0,y:0},
        bgColor: {
            type: String,
            default: "#0099CC"
        },
        isMe: Boolean,
    },
    data() {
      return {
        newBorn: "../src/assets/images/index.jpg",
        tuturu: "../src/assets/images/tuturu.jpg",
        troll: "../src/assets/images/Trollface_non-free.png",
      }
    },
    computed: {
        cellStyle() {
            return {
                "background-color": getColorForPlayerId(this.playerId),
                //'transition-delay': ((this.pos.x + this.pos.y)*30)+"ms",
                'background-image': this.hp==0&&this.playerId!=null?'url('+this.newBorn+')':'',
                "animation-delay": ((this.pos.x + this.pos.y) * 30) + "ms",
            };
        }
    },
    methods: {
        randAudio() {
           if (this.playerId == null) {
                let randMod = getPsuedoRandomMod();

                var randNum = Math.floor(Math.random() * randMod);

                if (randNum <= 1) {
                    new Audio("../src/assets/audio/nani.mp3").play();
                    resetPsuedoRandomMod()
                } else if (randNum >= 2 && randNum <= 14) {
                    new Audio("../src/assets/audio/tuturu1.mp3").play();
                    resetPsuedoRandomMod()
                } else if (randNum >= 15 && randNum <= 50) {
                    new Audio("../src/assets/audio/babyCry.mp3").play();
                    resetPsuedoRandomMod()
                }
            }
        }
    }
}
</script>

<template>
    <div class="asdf">
        <div :style="cellStyle" class="cell" @click="randAudio()">{{ ((isMe)?'⭐':'') }}{{ age }}
            <div class="manualBirthing" @click="randAudio()" :style="{display:((hp===0)&&(playerId !== null))?'block':'none'}"></div>
        </div>
    </div>
</template>

<style scoped>
    .asdf {
        font-size: 15px;
        width: 2em;
        height: 2em;
        border: 0.1em solid black;
        margin: 0.1em;
        position: relative;
        display: grid;
        place-items: center;
    }

    .manualBirthing {
        background-size: cover;
        background-repeat: none;
        background-blend-mode: multiply;
        opacity: 0.3;
        background-image: url(../assets/images/index.jpg);
        position: absolute;
        top: 0; bottom: 0; left: 0; right: 0;
    }

    .cell {
        color: grey;
        background-size: cover;
        background-repeat: none;
        background-blend-mode: multiply;
        transition: scale 200ms, background-color 100ms, background-image 1s, transform 0.8s;
        user-select: none;
        position: absolute;
        top: 0; bottom: 0; left: 0; right: 0;
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
        background-image: url(../assets/images/Trollface_non-free.png) !important;
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
            z-index: 0;
        }

        50% {
            transform: translate(-30%, -30%) rotateY(180deg) skew(30deg, 20deg);
            z-index: 1000;
            scale: 150%;
        }
        

        100% {
            scale: 110%;
            
            z-index: 0;
            transform: translate(0%, 0%) rotateY(360deg) skew(0deg, 0deg);
        }
    }
</style>