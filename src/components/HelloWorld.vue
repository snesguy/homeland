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
      playerList:[],
      playerNames:{},
      childrenLimit: 15,
      childrenLimitReset: 15,
      audioNani: new Audio("../src/assets/audio/nani.mp3"),
      audioTuturu: new Audio("../src/assets/audio/tuturu1.mp3"),
      audioCrying: new Audio("../src/assets/audio/babyCry.mp3"),
      lastBoard: true
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
        component.childrenLimit += 0.1
      }
      if(msg.type === 'playerList') {
        //set players
        component.playerList = msg.players
        component.playerNames = msg.playerNames
        //place your player at top
      }
      if (msg.type === 'boardReset') {
        this.childrenLimit = this.childrenLimitReset
      }
      if(msg.type === 'yourPlayerInfo') {
        //set player info
        component.playerId = msg.playerId
        component.playerList.unshift(component.playerList.splice(component.playerList.indexOf(component.playerId), 1)[0])
      }
    }

    component.connection.onopen = function(event) {
      console.log("Successfully connected")
    }
  },
  computed: {
    getColorForPlayerId() {
      return getColorForPlayerId(this.playerId)
    },
    createPieChart() {

    }
    // cellStyle() {
    //   return {
    //       "background-color": getColorForPlayerId(this.playerId)
    //   };
    // },
  },
  methods: {

    cellStyle(id) {
      return {
          "background-color": getColorForPlayerId(id),
      };
    },
    bgStyle(playerId) {
      return {
        "filter": `hue-rotate(${getHueForPlayerId(playerId)+10}deg) brightness(0.5)`
      }
    },
    addCell(index) {
      console.log('attempting adding cell')

      if(this.board[index%this.boardWidth][Math.floor(index/this.boardWidth)].playerId === null && this.childrenLimit > 0) {

        let col = index % this.boardWidth
        let row = Math.floor(index / this.boardWidth)
        
        this.connection.send(JSON.stringify({type:'addCell', x:col , y:row}))

        this.childrenLimit--;
      } else if (this.childrenLimit <= 0) {
        console.log ("you've run out of children!")
        this.audioNani.play();
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
    <div id="persianBg" :style="bgStyle(playerId)"></div>
    <!-- <div id="children-count">{{this.childrenLimit}}</div> -->
    <div id="curr-frame" :style="{'background':`linear-gradient(to right, ${getColorForPlayerId} ${getFrameProgressRatioAsPercentString()}, lightgray ${getFrameProgressRatioAsPercentString()})`}">Current Frame: {{ currFrame }}</div>
    <div class="grid-container" :style="{'grid-template-columns':`repeat(${boardWidth}, 1fr)`}">
      <div class="grid-item" v-for="(item, index) in board.flat()" :key="index">
        <!-- board.flat() is flattening the wrong way around. only index is trustworthy -->
          <cell :isMe="(playerId===board[index%boardWidth][Math.floor(index/boardWidth)].playerId)" :playerId="board[index%boardWidth][Math.floor(index/boardWidth)].playerId" :age="board[index%boardWidth][Math.floor(index/boardWidth)].hp" :hp="board[index%boardWidth][Math.floor(index/boardWidth)].age" :pos="{x:index%boardWidth,y:Math.floor(index/boardWidth)}" @click="addCell(index)"/>
      </div>
    </div>
    <div id="players-list">
      <div class="player-item grid-item" v-for="(currPlayerId,index) in playerList" :key="index">
        <div :style="cellStyle(currPlayerId)">{{(currPlayerId === playerId)?'⭐':''}}{{playerNames[currPlayerId]}}{{ currPlayerId===playerId ? ' : ' + childrenLimit.toFixed(2) : ''}}</div>
      </div>
    </div>
    <div id="elections-panel">

    </div>
  </div>
</template>

<style scoped>

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

#persianBg {
  z-index: 0;
  background-image: url(../assets/images/paisleyRGBnoiseLevel3.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: fixed;
  top:0;bottom:0;left:0;right:0;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

.app-container {
  position: absolute;
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
  color: white;
  min-width: 50vw;
  display: grid;
  place-items: center;
}

#players-list {
  font-size: 1.5rem;
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
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
