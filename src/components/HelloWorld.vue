<script>
import cell from './cell.vue'
import ReconnectingWebSocket from 'reconnecting-websocket'
export default {
  data() {
  	return {
      board:[]
  	}
	},
  components: {
    cell
  },
  created: function() {
    let component = this
    console.log("Starting connection to WebSocket Server")
    component.connection = new ReconnectingWebSocket("ws://10.220.228.117/ws")

    component.connection.onmessage = function(event) {
      let msg = JSON.parse(event.data)
      console.log(msg)
      if(msg.type === 'board') {
        component.board = msg.board.cells
      }
      if(msg.type === 'playerList') {
        //set players
        
      }
      if(msg.type === 'yourPlayerInfo') {
        //set player info
      }
    }

    component.connection.onopen = function(event) {
      console.log(event)
      console.log("Successfully connected")
    }
  },
  methods: {
    addCell(index) {
      let col = index % 20
      let row = Math.floor(index / 20)
    }
  }
}
</script>

<template>
  <div class="grid-container">
    <div class="grid-item" v-for="(item, index) in board.flat()" :key="index">
        <cell :playerId="item.playerId" :age="item.age" @click="addCell(index)"/>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

.grid-container {
  display:grid;
  grid-template-columns: repeat(20, 1fr);
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
