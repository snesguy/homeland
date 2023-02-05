<script>
import cell from './cell.vue'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { DateTime, Interval } from 'luxon'
export default {
  data() {
  	return {
      board:[],
      connection:null,
      boardHeight:0,
      boardWidth: 0,
      currFrame: 0,
      currFrameEndTime: DateTime.now(),
      currFrameStartTime: DateTime.now(),
      now: DateTime.now(),
      cooldownEndTime: DateTime.now(),
      playerId:null,
      playerList:null,
      playerNames:{},
  	}
	},
  components: {
    cell
  },
  created: function() {
    let component = this
    console.log("Starting connection to WebSocket Server")
    component.connection = new ReconnectingWebSocket("ws://10.220.228.117/ws")

    setInterval(() => {component.now = DateTime.now()}, 25);

    component.connection.onmessage = function(event) {
      let msg = JSON.parse(event.data)
      if(msg.type === 'board') {
        component.board = msg.board.cells
        component.boardWidth = msg.board.width
        component.boardHeight = msg.board.height
        component.currFrame = msg.board.currFrame
        component.currFrameEndTime = DateTime.fromISO(msg.board.nextRoundTime);
        component.currFrameStartTime = DateTime.now();
      }
      if(msg.type === 'playerList') {
        //set players
        component.playerList = msg.players
        component.playerNames = msg.playerNames
      }
      if(msg.type === 'yourPlayerInfo') {
        //set player info
        component.playerId = msg.playerId
      }
    }

    component.connection.onopen = function(event) {
      console.log("Successfully connected")
    }
  },
  computed: {
    // cellStyle() {
    //   return {
    //       "background-color": getColorForPlayerId(this.playerId)
    //   };
    // },
  },
  methods: {
    cellStyle(id) {
      return {
          "background-color": getColorForPlayerId(id)
      };
    },
    addCell(index) {
      console.log('attempting adding cell')

      if(this.board.flat()[index].playerId === null) {

        let col = index % this.boardWidth
        let row = Math.floor(index / this.boardWidth)
        
        this.connection.send(JSON.stringify({type:'addCell', x:col , y:row}))
      }

    },
    getFrameProgress() {
      let frameLength = Interval.fromDateTimes(this.currFrameStartTime, this.currFrameEndTime).length('seconds');
      let frameOnScreen = Interval.fromDateTimes(this.currFrameStartTime, this.now).length('seconds');
      return frameOnScreen / frameLength;
    },
    getFrameProgressRatioAsPercentString() {
      let ratio = this.getFrameProgress();
      return `${ratio*100}%`
    }
  }
}
</script>

<template>
  <div class="app-container" :style="cellStyle(playerId)">
    <div id="curr-frame" :style="{'background':`linear-gradient(to right, lightgray ${getFrameProgressRatioAsPercentString()}, transparent ${getFrameProgressRatioAsPercentString()})`}">Current Frame: {{ currFrame }}</div>
    <div class="grid-container" :style="{'grid-template-columns':`repeat(${boardWidth}, 1fr)`}">
      <div class="grid-item" v-for="(item, index) in board.flat()" :key="index">
          <cell :playerId="item.playerId" :age="item.age" :pos="{x:index%boardWidth,y:Math.floor(index/boardWidth)}" @click="addCell(index)"/>
      </div>
    </div>
    <div id="players-grid">
      <div class="player-item grid-item" v-for="(item,index) in playerList" :key="index">
        <div :style="cellStyle(item)">{{playerNames[item]}}</div>
      </div>
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

.app-container {
  margin: auto;
  min-width: 100vw;
  min-height: 100vh;
  display: grid;
  place-items: center;
  font-size: 3rem;
  font-weight: normal;
  color: black;
  font-family: serif;
}

#curr-frame {
  color: black;
  min-width: 50vw;
  display: grid;
  place-items: center;
}

#players-grid {
  font-size: 1.5rem;
}

.player-item {
  padding: 0.2em;
}

.grid-container {
  display:grid;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
