<!--设置跳转修改页-->
<template>
  <view class="modify">
    <uni-nav-bar status-bar :title="title"></uni-nav-bar>
    <view class="text_input">
      <textarea value="" placeholder-style="color:#9A9A9A" v-model="notes" maxlength="10" :placeholder="placeholderValue"/>
      <view class="record">
        <span>{{ textNum }}/10</span>
      </view>
    </view>
    <view class="btn">
      <button type="primary" @click="submit">修改完成</button>
    </view>
  </view>
</template>

<script>
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import {mapState, mapMutations} from 'vuex';
import {updateUserData} from "../../api";

export default {
  components: {
    uniNavBar
  },
  data() {
    return {
      title: '修改',
      notes: '',
      textNum: 0,
      type: null,
      placeholderValue: '请输入新昵称,限制长度10',
    }
  },
  computed: {
    ...mapState('users', {
      'userInfo': 'userInfo',
    }),
    notesText() {
      let val = this.notes;
      this.textNum = val.length;
      return val;
    },
  },
  methods: {
    ...mapMutations('users', {
      'setUserInfoData': 'setUserInfoData',
    }),
    /*备注信息提交*/
    submit: function () {
      this.userInfo.nickname = this.notes;
      this.$store.commit('users/setUserInfoData',this.userInfo);
      let res = updateUserData(null, this.userInfo.nickname, null, null, null);
      res.then(function(e){
        // console.log(e);
      });
      return uni.navigateBack({
        delta: 1
      });
    },
  }
}
</script>

<style lang="less">
@item: {
  display: flex;
  justify-content: center;
  align-items: center;
}


.modify {
  width: 100%;
  height: 100%;
  background: #F8F8F8;

  .text_input {
    width: 94%;
    height: 10.69rem;
    background: rgba(255, 255, 255, 1);
    border-radius: 0.5rem;
    background: #FFFFFF;
    margin-top: 0.75rem;
	margin-left: 3%;

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
