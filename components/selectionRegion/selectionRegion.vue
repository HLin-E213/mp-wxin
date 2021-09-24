<!--添加服务地址省、市、区级联选择组件-->
<template>
  <view class="selectionRegion">
    <view class="uni-list">
      <view class="uni-list-cell">
        <view class="uni-list-cell-db">
          <picker @change="bindPickerChange" :value="index" :range="array" v-if="visible">
            <view class="uni-input">
              {{ array[index] }}
              <image src="https://admin.dajxyl.com/oss?path=img/xiala@2x.png" mode=""></image>
            </view>
          </picker>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    array: {
      type: Array,
      default: () => {
        Array
      }
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      index: 0,
      visible: true
    };
  },
  methods: {
    /*选择器点击事件*/
    bindPickerChange: function (e) {
      // console.log('picker发送选择改变，携带值为', e.target.value)
      this.index = e.target.value
      this.toParent(e.target.value)
    },
    /*向父组件传递选择的省级数据*/
    toParent: function (index) {
      let val = {
        name: this.array[index],
        index: index,
        level: this.name
      }
      this.$emit("openPicker", val)
    },
    openChild: function () {
      console.log(111)
    },
  }
}
</script>

<style lang="less" scoped>
// .selectionRegion{
// 	width: 100%;
// 	height: 5rem;
// }
.uni-input {
  font-size: 0.81rem;

  image {
    width: 0.625rem;
    height: 0.625rem;
    // margin-top: 0.4rem;
    margin: 0.4rem 0 0 0.2rem;
  }
}
</style>
