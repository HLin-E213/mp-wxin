<template>
  <view>
    <img :src="imgSrc" mode="widthFix"  alt="空数据.png">
  </view>
</template>

<script>
import imgSrc from '@/static/empty.png'
export default {
  name: "empty-data",
  data() {
    return {
      imgSrc: imgSrc
    }
  }
}
</script>

<style lang="scss" scoped>
img {
  width: 100%;
  height:auto;
}
</style>