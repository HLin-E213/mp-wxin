<!--查看大图-->
<template>
  <view class="pictureBig">
    <view class="head">
      <image @click="backService" src="https://admin.dajxyl.com/oss?path=img/fanhui@2x.png" mode=""></image>
    </view>
    <!-- <view class="img">
      <image :src="imgUrl" mode=""></image>
    </view> -->
    <movable-area class="img">
      <movable-view direction="all" @scale="onScale" scale="true" scale-min="1" scale-max="4" :scale-value="scale">
        <image :src="imgUrl" mode="widthFix"></image>
      </movable-view>
    </movable-area>
    <view class="bg"></view>
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
    return {}
  },
  computed: {
    ...mapState('server', {
      'imgUrl': 'imgUrl',
    })
  },
  mounted() {
  },
  methods: {
    backService: function () {
      uni.navigateBack({
        delta: 1
      })
    }
  }
}
</script>

<style lang="less" scoped>
@item: {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pictureBig {
  width: 100%;
  height: 100%;
  @item();
  flex-wrap: wrap;

  .head {
    width: 100%;
    height: 5rem;
    @item();
    background: #000000;
    justify-content: flex-start;
    position: fixed;
    top: 0;
    z-index: 10;

    image {
      width: 0.565rem;
      height: 1rem;
      margin-left: 0.3rem;
    }
  }

  .img {
    width: 100%;
    // min-height:31.25rem;
    min-height: 26.25rem;
    @item();
    margin-top: 5rem;

    movable-view {
      width: 100%;
      height: 100%;
      @item();

      image {
        width: 100%;
        // height: 100%;
        // min-height:15.25rem;
        min-height: 26.25rem;
      }
    }
  }

  .bg {
    width: 100%;
    height: 5rem;
    background: #000000;
    position: fixed;
    bottom: 0;
  }
}
</style>
