// 该脚本负责制造场景的逻辑
const player = require('PlayerManager') 
import {GAME_SCENE} from './Enum'
import GameSceneMng from './GameSceneMng'
import {Weaponry,Backpack} from './GoodsManager'

cc.Class({
    extends: cc.Component,

    properties: {
      pageView: cc.PageView,
      Btn_back: cc.Button,
      Btn_Meat: cc.Button,
      Btn_Drug: cc.Button,
      title: {
        default: null,
        type: cc.Label
      },
      label1: {
        default: null,
        type: cc.Label
      },
      label2: {
        default: null,
        type: cc.Label
      },
      label3: {
        default: null,
        type: cc.Label
      },
      label4: {
        default: null,
        type: cc.Label
      },
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
      this.updateData()
      this.Btn_back.node.on('click', this.back, this)

      this.Btn_Meat.node.on('click', this.makeGood, this)
      this.Btn_Drug.node.on('click', this.makeGood, this)

      this.arr = [this.Btn_Meat,this.Btn_Drug]

      // 绑定按钮和特定物品
      this.Btn_Meat.good = player.goods.cooked_meat
      this.Btn_Drug.good = player.goods.drug

      this.btnState()
    },

    createNode() {
      for(let i=0; i<3; i++) {

      }
    },

    callback(arg1) {
      console.log(arg1.getCurrentPageIndex())
    },
    // 判断按钮是否为可用状态
    btnState() {
      for(let i=0; i<this.arr.length; i++) {
        // 验证是否满足制造需求
        let result = player.validate(this.arr[i].good)
        
        if(result) {
          this.arr[i].getComponent(cc.Button).enabled = true
          this.arr[i].node.getChildByName('Label').color = cc.color(20,240,36)
        } else {
          this.arr[i].getComponent(cc.Button).enabled = false
          this.arr[i].node.getChildByName('Label').color = cc.color(105,105,105)
        }
      }
    },

    back() {
      GameSceneMng.getInstance().setGameScene(GAME_SCENE.GAME)
    },

    // 物品制造事件
    makeGood(button) {
      // 角色执行制造行为
      player.make(button.good)

      // 更新title提示
      this.unscheduleAllCallbacks()
      this.labelSchedule(button.good.name)
      // 更新物品数量显示
      this.updateData()
      // 按钮状态判断
      this.btnState()
    },

    // 文字出现效果
    labelSchedule(name) {
      this.title.string = ''
      let content = '获得【' + name + '】*1' 
      let index = 0
      let i = content.length - 1
      this.schedule(() => {
        this.title.string = this.title.string + content[index]
        index++
      },0.08,i,0)
    },

    updateData() {
      this.label1.string = '#需【生肉】' + player.materials.raw_meat.num+'/1'+'【木材】' 
      + player.materials.wood.num + '/1'
      this.label2.string = '#获得【熟肉】' + '(拥有'+player.goods.cooked_meat.num+')'
      this.label3.string = '#需【草药】' + player.materials.herb.num+'/2'
      this.label4.string = '#获得【药品】' + '(拥有'+player.goods.drug.num+')'
    },

    start () {
      
    },

    // update (dt) {},
});
