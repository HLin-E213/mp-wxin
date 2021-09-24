<template>
  <view class="container">
    <!-- tab栏 -->
    <scroll-view class="scroll-view_H b-t b-b" scroll-x>
      <block v-for="(item,index) in dateArr" :key="index">
        <div class="flex-box" @click="selectDateEvent(index,item)">
          <view class="date-box" >
            <text class="days" :style="{color:index==dateActive?selectedTabColor:'#343434'}">{{ item.week }}</text>
            <text class="date" :style="{color:index==dateActive?selectedTabColor:'#666666'}">{{ item.date }}</text>
            <text :class="{'active-line': index==dateActive}"></text>
          </view>
        </div>
      </block>
    </scroll-view>
    <!-- 时间选项 -->
    <view class="time-box" :class="{'edit-time-box': type === 'edit'}">
      <block v-for="(item,_index) in timeArr" :key="_index">
        <view class="item">
          <view
              class="item-box"
              :class="{'disable':item.disable || item.futureDisable,'active':_index===timeActive, 'edit-item-box':type === 'edit'}"
              :style="{background:_index===timeActive?selectedItemColor:'#FFFFFF',border:_index===timeActive? 'none': '',border:item.disable ? '': 'none'}"
                @click="selectTimeEvent(_index,item)">
            <text>{{ item.time }}</text>
            <text class="all" v-if="item.disable">{{ disableText }}</text>
          </view>
        </view>
      </block>
    </view>
    <Modal
        ref="addAmount"
        title="温馨提示"
        @confirm="ok"
        confirmText="确定加价"
        @cancel="cancel"
    >
      <p class="modal-tip-desc">
        该时间点位特殊时间点</br>
        需要加价<span class="amount">{{ tempSelect.item.amount / 100 }}</span>元才能预约
      </p>
    </Modal>
  </view>
</template>

<script>
import {dateData, timeData, timeStamp} from './date.js';
import { getAppointmentTimeConfig } from '@/api/index.js';
import Modal from '@/components/Modal';

export default {
  props: {
    //开始时间选项
    startTime: {
      type: String,
      default: '08:00'
    },
    //结束时间选项
    endTime: {
      type: String,
      default: '18:00'
    },
    timeSlot: {
      type: Number,
      default: 2
    },
    //时间间隔
    timeInterval: {
      type: [Number, String],
      default: 0.5 //半小时
    },
    //选中的tab颜色
    selectedTabColor: {
      type: String,
      default: '#0092D5'
    },
    //选中的时间颜色
    selectedItemColor: {
      type: String,
      default: '#0094D7'
    },
    //禁用显示的文本
    disableText: {
      type: String,
      default: ''
    },
    //选择面板背景颜色
    type: {
      type: String,
      default: 'add'
    }

  },
  components: {
    Modal
  },
  data() {
    return {
      dateArr: [],//日期数据
      timeArr: [],//时间数据
      dateActive: 0,//选中的日期索引
      timeActive: 0,//选中的时间索引
      oldTimeActive: 0,
      selectDate: '',//选择的日期数据
      selectTime: [],//选择的时间
      oldSelectTime: '',
      currentTimeStamp: '',
      currentTime: '',
      tempSelect: {}, // 临时存储的选择时间
    }
  },
  async created() {
    //获取日期tab数据
    this.dateArr = dateData()
    const timeConfig = await this.getTimeConfig();
    //获取时间数据
    this.timeArr = timeData(this.startTime, this.endTime, this.timeInterval)
    //当前时间戳
    this.currentTimeStamp = Date.now()
    this.currentTime = timeStamp(this.currentTimeStamp + (7200 * 1000)).hour
    this.timeArr.map(item => {
      if (item.time > this.currentTime) {
        return item.disable = 0  //判断当前时间大于时间选项则禁用
      } else {
        return item.disable = 1
      }
    })
    //默认选中的日期
    this.selectDate = `${this.dateArr[0]['date']} `;
    this.timeArr = this.timeArr.map((item) => {
      const hasTimeObj = timeConfig.find((innerItem) => (innerItem.time === item.time));
      return {
        ...item,
        ...hasTimeObj,
        futureDisable: item.time > this.currentTime && hasTimeObj.status === '1',
      };
    });
   console.log('this.timeArr', this.timeArr);

    this.timeArr.some((item, index) => {
      this.selectTime = this.timeArr[index]['time'] //默认选中的时间
      this.oldSelectTime = this.timeArr[index]['time'] //存储选中的时间
      // this.timeActive = index  //选中的时间索引
      this.oldTimeActive = index
      return !item.disable
    })
  },
  methods: {
    selectDateEvent(index, item) {
      if (this.currentTimeStamp < item.timeStamp) {
        this.timeActive = 0
        this.selectTime = this.timeArr[0]['time']
        this.timeArr.map(item => {
          return item.disable = 0
        })
      } else {
        this.timeActive = this.oldTimeActive
        this.selectTime = this.oldSelectTime
        this.timeArr.map(item => {
          if (item.time > this.currentTime) {
            return item.disable = 0
          } else {
            return item.disable = 1
          }
        })
      }
      this.dateActive = index
      this.selectDate = `${this.dateArr[index]['date']} `;
      this.$emit('selectTime', {
        time: `${this.selectDate}${this.selectTime}`
      });
    },
    cancel() {
      this.$refs.addAmount.close();
    },
    ok() {
      const { index, item } = this.tempSelect;
      const { amount } = item;
      this.doSelectTime(index, amount);
      this.tempSelect = {};
      this.$refs.addAmount.close();
    },
    async getTimeConfig() {
      try {
        const res = await getAppointmentTimeConfig();
        return res.data.data.info || [];
      } catch (e) {
        return [];
      }
    },
    selectTimeEvent(index, item) {
      if (item.disable) return;
      if (item.futureDisable && this.type === 'add') { // 在修改时间的时候，程序不支持用户选择加价的时间
        this.tempSelect = {
          index,
          item,
        };
        return this.$refs.addAmount.open();
      }
      this.doSelectTime(index);
    },

    doSelectTime (index, addMount) {
      this.timeActive = index;
      this.selectTime = this.timeArr[index]['time'];
      this.$emit('selectTime', {
        time: `${this.selectDate}${this.selectTime}`,
        addMount,
      });
      if (this.type === 'add') {
        return uni.navigateBack({
          delta: 1
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import './index.scss';
.modal-tip-desc{
  color: #666666;
  font-size: 28rpx;
  .amount{
    font-size: 42rpx;
    color:#FD7600;
    font-weight: bold;
  }
}
</style>
