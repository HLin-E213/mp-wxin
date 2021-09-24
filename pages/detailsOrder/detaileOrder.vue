<!--组件b标签+名称类组件-->
<template>
  <view class="ItemsService_top">
    <b></b>
    <h4>{{ name }}</h4>
  </view>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="less">
@item: {
  display: flex;
  justify-content: center;
  align-items: center;
}

@contentItem: {
  width: 96%;
  height: 5.56rem;
  background: rgba(255, 255, 255, 1);
  box-shadow: 1px 1px 1px 1px rgba(169, 169, 169, 0.2);
  border-radius: 0.3rem;
}

.ItemsService_top {
  width: 94%;
  height: 100%;
  @item();
  justify-content: flex-start;
  flex-wrap: wrap;

  b {
    width: 0.19rem;
    height: 1rem;
    background: #fd7600;
    border-radius: 0.5rem;
  }

  h4 {
    width: 30%;
    font-size: 1.125rem;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    margin-left: 0.5rem;
  }
}
</style>
