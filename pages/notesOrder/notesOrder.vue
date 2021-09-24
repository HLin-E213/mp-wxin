<!--订单备注信息-->
<template>
  <view class="notesOrder">
    <uni-nav-bar status-bar :title="title"></uni-nav-bar>
    <view class="text_input">
      <textarea value="" placeholder-style="color:#9A9A9A" v-model="notes" maxlength="50" placeholder="有什么特殊交代,快来告诉我～"/>
      <view class="record">
        <span>{{ textNum }}/50</span>
      </view>
    </view>
    <view class="btn">
      <button type="primary" @click="submit">完成备注</button>
    </view>
  </view>
</template>

<script>
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import {mapState, mapMutations} from 'vuex';

export default {
  components: {
    uniNavBar,
  },
  data() {
    return {
      title: '备注信息',
      notes: '',
      textNum: 0,
    }
  },
  computed: {
    ...mapState('serviceinfo', {
      'order': 'orderInfo'
    }),
    notesText() {
      let val = this.notes;
      this.textNum = val.length;
      return val
    },
  },
  mounted() {
    if (this.order.remarks) {
      this.notes = this.order.remarks;
    }
  },
  methods: {
    ...mapMutations('serviceinfo', {
      'setOrderRemarks': 'setOrderRemarks',
    }),
    /*备注信息提交*/
    submit: function () {
      this.setOrderRemarks(this.notes);
      return uni.navigateBack({
        delta: 1
      });
    },
  }
}
</script>

<style lang="less" scoped>
@item: {
  display: flex;
  justify-content: center;
  align-items: center;
}

.notesOrder {
  width: 100%;
  height: 100%;

  .text_input {
    width: 94%;
    height: 10.69rem;
    background: rgba(255, 255, 255, 1);
    border-radius: 0.5rem;
    background: #FFFFFF;
    margin-left: 3%;
	margin-top: 25rpx;
    textarea {
      width: 95%;
      height: 75%;
      padding: 10px 10px;
	  font-size: 28upx;
	  color: #666666;
    }

    .record {
      width: 95%;
      height: 8%;
      @item();
      justify-content: flex-end;

      span {
        width: 2.095rem;
        height: 0.905rem;
        font-size: 0.94rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 1.125rem;
      }
    }

  }

  .btn {
    width: 100%;
    height: 3.815rem;
    margin-top: 2.815rem;
    @item();

    button {
      width: 88%;
      height: 2.875rem;
      border-radius: 1.5rem;
      background: #fd7600;
    }
  }
}
</style>
