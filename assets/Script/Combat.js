// 本脚本负责游戏的战斗场景
import player from './PlayerManager'
import {EVENT,GAME_SCENE} from './Enum'
import GameSceneMng from './GameSceneMng'
import Monster from './MonsterFactory'
const et = require('Listener')

cc.Class({
    extends: cc.Component,

    properties: {
      Btn_Combat: cc.Button,
      Btn_RunAway: cc.Button,
      level: {
        default: null,
        type: cc.Label
      },
      Node: {
        default: null,
        type: cc.Node
      },

      Monster: {
        default: null,
        type: cc.Label
      },

      Content: {
        default: null,
        type: cc.Label
      },
    },

    onLoad() {
      this.updateLabel()
      this.Btn_Combat.node.on('click',this.combat, this)
      this.Btn_RunAway.node.on('click',this.runAway, this)
      et.on(EVENT.ENTER_COMBAT, this.enterCombat, this)
      et.on(EVENT.HURT, this.updateMonster, this)      
      et.on(EVENT.WIN, this.win, this)
    },
    
    onDestroy() {
      et.off(EVENT.ENTER_COMBAT)
      et.off(EVENT.HURT)
      et.off(EVENT.WIN)
    },  

    // 进入战斗
    enterCombat() {
      let id = parseInt((player.properties.moveDuration+10)/10)
      let monster = new Monster(id)
      this.monster =  monster
      this.updateMonster()
      this.labelSchedule(this.monster.about)
    },

    // 获胜
    win() {
      player.win(this.monster)
      let content = '恭喜您获得胜利！【经验+' + this.monster.exp + '】'
      this.labelSchedule(content)
      this.updateLabel()
    },

    // 战斗
    combat() {
      this.damage = player.combat(this.monster)
      let content = '你丢出了一张符箓 【僵尸生命-' + this.damage[0] + '】' 
      + this.monster.attackType +'【生命-' + this.damage[1] + '】'
      if(this.monster.life>0) {
        this.labelSchedule(content)
      }
    },

    // 逃跑
    runAway() {
      GameSceneMng.getInstance().setGameScene(GAME_SCENE.GAME)
    },

    // 触发升级
    updateLabel() {
      let lv = parseInt(player.properties.exp/10)
      if(lv != player.properties.level) {
        player.properties.level = lv
        et.emit(EVENT.UPGRADE)
      }
      this.level.string = 'lv:' + player.properties.level
    },

    // 跟新怪物状态
    updateMonster() {
      this.Monster.string = this.monster.name + ' lv ' + this.monster.lv + ' hp ' + this.monster.life
    },

    // 文字提示
    labelSchedule(content) {
      this.unscheduleAllCallbacks()
      this.Btn_Combat.enabled = false
      this.Content.string = ''
      let index = 0
      let i = content.length - 1
      this.schedule(() => {
        this.Content.string = this.Content.string + content[index]
        index++
        if(index>i) {
          this.Btn_Combat.enabled = true
        }
      },0.02,i,0)
    },
});
