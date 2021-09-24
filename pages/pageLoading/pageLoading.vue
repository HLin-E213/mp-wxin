<!--正在加载-->
<template>
  <view class="pageLoading">
    <view class="head">
      <WhiteHead :title="title"></WhiteHead>
    </view>
    <!--缺省页图片-->
    <view class="pageLoading_img">
      <image class="firstImg" src="https://admin.dajxyl.com/oss?path=img/loadborder@2x.png" mode=""></image>
      <image class="secondImg" src="https://admin.dajxyl.com/oss?path=img/loading@2x.png" mode=""></image>
    </view>
    <!--信息描述-->
    <view class="description">
      <p>{{ description }}</p>
    </view>
  </view>
</template>

<script>
import WhiteHead from '../../components/whiteHead/whiteHead.vue';
import {mapState, mapMutations} from 'vuex';

export default {
  components: {
    WhiteHead,
  },
  data() {
    return {
      title: '正在加载',
      description: '正在加载中',
    }
  },
}
</script>

<style lang="less" scoped>
@item: {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pageLoading {
  width: 100%;
  height: 100%;
  @item();
  flex-wrap: wrap;

  .head {
    width: 100%;
    height: 5rem;
    display: flex;
	position: fixed;
	top: 0;
	z-index: 10;
  }

  .pageLoading_img {
    width: 100%;
    height: 12.19rem;
    @item();
    margin-top: 15rem;

    .firstImg {
      width: 100%;
      height: 12.19rem;
    }

    .secondImg {
      width: 2.875rem;
      height: 3.065rem;
      position: absolute;
      margin-top: -1rem;
    }
  }

  .description {
    width: 100%;
    @item();

    p {
      // width:10.69rem;
      height: 1rem;
      font-size: 1.065rem;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      line-height: 1.055rem;
    }
  }
}
</style>
