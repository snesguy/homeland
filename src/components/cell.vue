<script>
export default {
    props: {
        playerId: String,
        age: Number,
        pos: Number,
        bgColor: {
            type: String,
            default: "#0099CC"
        },
    },
    computed: {
        cellStyles() {
        return {
            "background-color": this.bgColor,
        };
        }
    }
}
</script>

<template>
    <div :style="cellStyle" :class="'cell'">{{ pos }}</div>
</template>

<style scoped>
    .cell {
        width: 50px;
        height: 50px;
        border: 2px solid black;
        margin: 2px;
        transition: scale 200ms, background-color 600ms, background-image 1s;
    }
    .cell:hover {
        scale: 110%;
        background-image: url(../assets/Trollface_non-free.png);
        background-size: cover;
        background-repeat: none;
    }



</style>