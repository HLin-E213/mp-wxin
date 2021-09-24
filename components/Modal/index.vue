<!--
* @Description: 统一对话框
* @Author: mahui
* @Date: 2020/11/12 11:09 AM
-->
<template>
  <uni-popup ref="popup" :maskClick="mask" type="center">
    <view class="dialog">
      <view class="title" :style="titleStyle" v-if="showTitle">{{ title }}</view>
      <view v-if="showContent">
        <view class="content" v-if="content.length">{{ content }}</view>
        <view class="content" v-else><slot></slot></view>
      </view>
      <view v-if="showFooter">
        <view v-if="customFooter"><slot name="footer"></slot></view>
        <view v-else class="footer-btn-wrap">
          <view @click="$emit('confirm')" class="btn btn-active">{{ confirmText }}</view>
          <view  @click="$emit('cancel')" class="btn">{{ cancelText }}</view>
        </view>
      </view>
    </view>
  </uni-popup>

</template>

<script>
    import uniPopup from '@/components/uni-popup/uni-popup.vue';
    export default {

        name: 'Modal',
        components: {
            uniPopup,
        },
        props: {
            showTitle: { // 是否展示标题
                type: Boolean,
                default: true
            },
            showFooter: { // 是否展示底部
                type: Boolean,
                default: true
            },
            showContent: { // 是否展示底部
                type: Boolean,
                default: true
            },
            confirmText: { // 确认文字
                type: String,
                default: '确认'
            },
            title: {   // 标题文字
                type: String,
                default: '提示'
            },
            cancelText: { // 取消文字
                type: String,
                default: '取消'
            },
            content: { // 取消文字
                type: String,
                default: ''
            },
            customFooter: { // 是否自定义底部
                type: Boolean,
                default: false,
            },
            mask: { //点击蒙层自动关闭
                type: Boolean,
                default: true,
            },
            titleStyle: { //点击蒙层自动关闭
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {};
        },
        methods: {
            open() {
                this.$refs.popup.open();
            },
            close() {
                this.$refs.popup.close();
            }
        },
    };
</script>

<style scoped lang="less">
  .dialog{
    width: 620upx;
    background-color: #FFFFFF;
    border-radius: 10upx;
    overflow: hidden;
    .title{
      background: #fd7600;
      color: #ffffff;
      height: 120upx;
      line-height: 120upx;
      text-align: center;
    }
    .content{
      padding: 65upx;
      text-align: center;
      color: #666666;
      font-size: 32upx;
    }
    .footer-btn-wrap{
      display: flex;
      border-top: 1upx solid rgba(153, 153, 153, .2);
      margin:0 70upx;
      padding: 25upx 0;
      justify-content: space-between;
      .btn{
        width: 200upx;
        height: 70upx;
        border-radius: 35upx;
        border: 1px solid #fd7600;
        color: #fd7600;
        text-align: center;
        line-height: 70upx;
        font-size: 30upx;
      }
      .btn-active{
        background-color: #fd7600;
        color: #FFFFFF;
      }
    }
  }
</style>
