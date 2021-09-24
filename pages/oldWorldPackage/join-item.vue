<template>
  <div class="join-item-wrap">
    <div class="join-item">
      <span class="join-item_label">{{label}}</span>
      <span class="join-item_text":style="{color: valueColor}" v-if="type === 'text'">{{innerValue}}
      <span class="join-item_text_unit" v-if="unit">/{{ unit }}</span></span>
      <div class="join-item_input-wrap" v-else-if="type === 'input'">
        <input
            class="join-item_input"
            :placeholder="placeholder"
            :type="inputType || 'text'"
            v-model="innerValue"
            @change="handleChange"
            @blur="handleBlur"
            :maxlength="maxlength || 140"

        >
        <img v-if="showEditIcon" src="http://admin.dajxyl.com/oss?path=video/upload/202108/edit@2x.png" alt="">
      </div>
      <div class="pay-wrap" v-else-if="type === 'pay'">
        <img class="checked" src="https://admin.dajxyl.com/oss?path=video/upload/202108/checked-dot@2x.png" alt="">
        <img class="weixin" src="../../static/weixin@2x.png" alt="">
      </div>
    </div>
    <slot></slot>
  </div>

</template>

<script>
export default {
  name: "join-item",
  data() {
    return {
      innerValue: this.val
    }
  },
  watch: {
    val(newVal) {
      this.innerValue = newVal;
    },
    innerValue() {
      this.handleBlur(false);
    },
  },
  props:{
    info: {
      type: Object,
      default: () => ({}),
    },
    label: {
      type: String,
      default: '',
    },
    labelStyle: {
      type: Object,
      default: () => ({}),
    },
    val: {
      type: String | Number,
      default: '',
    },
    maxlength: {
      type: String | Number,
      default: '',
    },
    valKey: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    inputType: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: '',
    },
    valueColor: {
      type: String,
      default: '#FD7C09',
    },
    unit: {
      type: String,
      default: '',
    },
    showEditIcon: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleChange() {
      this.$emit('onChange', this.valKey, this.innerValue);
    },
    handleBlur(needToast = true) {
      console.log('this.valKey', this.valKey, this.innerValue);
      switch (this.valKey) {
        case 'phone': {
          const reg = new RegExp("^1\\d{10}$");
          if (this.innerValue && !reg.test(this.innerValue) || this.innerValue.length !== 11) {
            this.$emit('onVerify', this.valKey, false);
            if (needToast) {
              uni.showToast({
                title: '请输入正确的手机号',
                duration: 2000,
                icon: 'none',
                mask: true,
              });
            }
          } else {
            this.$emit('onVerify', this.valKey, true);
          }
          break;
        }
        case 'participants': {
          const max = this.info.NumberLimitPeople  - this.info.enlist;
          if (!this.innerValue || this.innerValue == 0 ) {
            uni.showToast({
              title: '报名人数必须大于等于1，请重新输入报名人数',
              duration: 2000,
              icon: 'none',
              mask: true,
            });
            return this.$emit('onVerify', this.valKey, false);
          }
          if (this.innerValue && this.innerValue > max ) {
            this.$emit('onVerify', this.valKey, false);
            if (needToast) {
              uni.showToast({
                title: '报名人数超过了最大剩余人数，请重新输入报名人数',
                duration: 2000,
                icon: 'none',
                mask: true,
              });
            }
          } else {
            this.$emit('onVerify', this.valKey, true);
          }
          break;
        }
        case 'name': {
          const reg = new RegExp("^[A-Za-z\u4e00-\u9fa5]+$");
          if (!this.innerValue || !this.innerValue.trim()) {
            return this.$emit('onVerify', this.valKey, false);
          }
          if (this.innerValue && !reg.test(this.innerValue)) {
            this.$emit('onVerify', this.valKey, false);
            if (needToast) {
              uni.showToast({
                title: '请输入正确的姓名',
                duration: 2000,
                icon: 'none',
                mask: true,
              });
            }
          } else {
            this.$emit('onVerify', this.valKey, true);
          }
          break;
        }
        default: {
          break;
        }
      }
      this.$emit('onChange', this.valKey, this.innerValue);
    },
  }
}
</script>

<style scoped lang="less">
.join-item-wrap {
  box-sizing: border-box;
  padding: 15rpx 31rpx 15rpx 33rpx;
  background-color: #FFFFFF;
  width: 710rpx;
  margin: 0 auto 20rpx auto;
  box-shadow: -6rpx 0 11rpx 1rpx rgba(204, 204, 204, 0.25);
  border-radius: 10px;
  .join-item{
    padding: 13rpx 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &_label{
      font-size: 30rpx;
      line-height: 29rpx;
      color: #333333;
    }
    &_text{
      flex: 1;
      font-size: 32rpx;
      color: #FD7C09;
      text-align: right;
      &_unit{
        font-size: 26rpx;
        color: #333333;
      }
    }
    .join-item_input-wrap{
      flex: 1;
      display: flex;
      align-items: center;
      text-align: right;
      img {
        margin-left: 5rpx;
        width: 40rpx;
        height: 40rpx;
      }
    }
    .join-item_input{
      text-align: right;
      flex: 1;
      font-size: 26rpx;
      color: #333333;
    }
  }
}
.pay-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .checked{ width: 36rpx;height: 36rpx}
  .weixin{width: 56rpx;height: 56rpx;}
}

</style>
