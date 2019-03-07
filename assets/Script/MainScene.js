// 本脚本为游戏的主要逻辑脚本
import player from './PlayerManager'
const gameEvent = require("Event")
const et = require('Listener')
import {TALENT,EVENT} from 'Enum'
const Command = require('Command')

cc.Class({
    extends: cc.Component,
    properties: {
      content: {
        default: null,
        type: cc.Label
      },
      life: {
        default: null,
        type: cc.Label
      },
      attack: {
        default: null,
        type: cc.Label
      },
      defence: {
        default: null,
        type: cc.Label
      },
      knowledge: {
        default: null,
        type: cc.Label
      },
      sport: {
        default: null,
        type: cc.Label
      },
      charm: {
        default: null,
        type: cc.Label
      },
      health: {
        default: null,
        type: cc.Label
      },
      attackSpeed: {
        default: null,
        type: cc.Label
      },
      moveSpeed: {
        default: null,
        type: cc.Label
      },
      level: {
        default: null,
        type: cc.Label
      },
      hunger: {
        default: null,
        type: cc.Label
      },
      time: {
        default: null,
        type: cc.Label
      },
      duraction: {
        default: null,
        type: cc.Label
      },
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
      this.initTalent()
      this.updateLabel()
      //当前前面主要按钮
      this.node1 = this.node.getChildByName('Node1')
      this.Btn_Forward = this.node1.getChildByName('Btn_Forward')
      this.Btn_Search = this.node1.getChildByName('Btn_Search')
      this.Btn_Make = this.node1.getChildByName('Btn_Make')
      this.Btn_Rest = this.node1.getChildByName('Btn_Rest')
      this.Btn_Eat = this.node1.getChildByName('Btn_Eat')
      this.arrBtn = [this.Btn_Forward,this.Btn_Search,this.Btn_Make,this.Btn_Rest,this.Btn_Eat]

      //按钮监听
      this.Btn_Forward.on('click', this.forward, this)
      this.Btn_Make.on('click', this.make, this)
      this.Btn_Search.on('click', this.search, this)
      this.Btn_Rest.on('click', this.rest, this)
      this.Btn_Eat.on('click', this.eat, this)

      //注册监听事件
      et.on(EVENT.NO_HUNGER,this.hungry)

      et.off(EVENT.COMBAT)
      et.on(EVENT.COMBAT,() => { 
        this.node1.active = false
      })
    },

    start () {

    },

    hungry() {
      console.log('I am hungry!')
    },

    // 探索事件
    search() {
      if(player.properties.currentHunger > 0) {
        let command = new Command(gameEvent.getSearchEvent())
        command.execute(player)
        var event = command.getEvent()
      }else {
        var event = gameEvent.noEnergy()
      }
      const content = event.content
      this.labelSchedule(content)
      this.updateLabel()
    },

    // 人物休息
    rest() {
      player.properties.currentHunger += 20
      this.updateLabel()
    },

    // 打开制造页
    make() {
      cc.director.loadScene('make')
    }, 

    eat() {
      cc.director.loadScene('food_list')
    },

    // 前进按钮事件回调
    forward() {
      if(player.properties.currentHunger > 0) {
        var command = new Command(gameEvent.getRandomEvent())
        var event = command.getEvent()
        command.execute(player)
      }else {
        var event = gameEvent.noEnergy()
      }
      const content = event.content
      this.labelSchedule(content)
      this.updateLabel()
      if(event.type == 'combat') {
        et.emit(EVENT.COMBAT)
      }
    },

    // 文字出现效果
    labelSchedule(content) {
      this.content.string = ''
      let index = 0
      let i = content.length - 1
      this.changeBtnState(this.arrBtn, i*0.08)
      this.schedule(() => {
        this.content.string = this.content.string + content[index]
        index++
        if(index>i) {
          this.changeBtnState(this.arrBtn, 1.0)
        }
      },0.08,i,0)
    },

    // 按钮状态改变
    changeBtnState(arr,dt) {
      for(let i=0; i<arr.length; i++) {
        arr[i].getComponent(cc.Button).enabled = 
        arr[i].getComponent(cc.Button).enabled ? false: true
        if(arr[i].getComponent(cc.Button).enabled == false) {
          let action1 = cc.fadeOut(dt)
          arr[i].runAction(action1)
        }else {
          let action2 = cc.fadeIn(dt)
          let action1 = cc.delayTime(0.2)
          let seq = cc.sequence(action1,action2)
          arr[i].runAction(seq)
        }
      }
    },

    // 人物天赋初始化
    initTalent() {
      switch(player.talent) {
        case TALENT.学霸:
          player.properties.knowledge = 2
          break
        case TALENT.强壮:
          player.properties.sport = 2
          break
        case TALENT.多才:
          player.properties.charm = 2
          break
      }
    },

    // 更新人物属性面板
    updateLabel() {
      this.life.string = player.properties.life
      this.attack.string = player.properties.attack
      this.defence.string = player.properties.defence
      this.knowledge.string = player.properties.knowledge
      this.sport.string = player.properties.sport
      this.charm.string = player.properties.charm
      this.health.string = player.properties.health
      this.attackSpeed.string = player.properties.attackSpeed
      this.moveSpeed.string = player.properties.moveSpeed
      this.hunger.string = '饥饿 ' + player.properties.currentHunger + '/' + player.properties.hunger
      this.time.string = player.time + '分钟'
      this.duraction.string = player.duraction
    },

    // update (dt) {},
});
