<!--暂无网络-->
<template>
  <view class="networkNo">
    <view class="head">
      <WhiteHead :title="title"></WhiteHead>
    </view>
    <!--缺省页图片-->
    <view class="pageLoading_img">
      <image class="firstImg" src="https://admin.dajxyl.com/oss?path=img/noWifi@2x.png" mode=""></image>
    </view>
    <!--信息描述-->
    <view class="description">
      <p>{{ description }}</p>
    </view>
    <!--重新加载按钮-->
    <view class="btn">
      <button type="primary">重新加载</button>
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
      title: '暂无网络',
      description: '网络无连接，请检查网络设置',
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

.networkNo {
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

  .btn {
    width: 100%;
    height: 2.565rem;
    @item();
    margin-top: 1.155rem;

    button {
      width: 40%;
      height: 2.565rem;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(219, 217, 217, 1);
      border-radius: 1.5rem;
      @item();
      font-size: 1rem;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      // line-height:3.75rem;
    }
  }
}
</style>
