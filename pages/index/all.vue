<template>
  <view class="contnet">
    <view class="item" v-for="(i, k) in pages" :key="k" @click="handleNaivgate(k)">
      <view class="left" :class="{active : active == i.path}">{{ k + 1 }}</view>
      <view class="content" :class="{active : active == i.path}">
        {{ i.style.navigationBarTitleText }}
      </view>
      <view class="small" :class="{active : active == i.path}">/{{ i.path }}</view>
    </view>
  </view>
</template>

<script>
import pageConfig from "uni-pages?{\"type\":\"style\"}";

export default {
  data() {
    return {
      active: true,
      pages: [],
    }
  },
    onLoad() {
      const pageArr = [];
      const { pages } =  pageConfig;
      Object.keys(pages).forEach((path) => {
          const { navigationBarTitleText } = pages;
          pageArr.push({
              path,
              style: {
                  navigationBarTitleText,
              }
          })
      });
      this.pages = pageArr;
    },
  methods: {
    handleNaivgate: function (k) {
      let path = "/" + this.pages[k].path;
      this.active = this.pages[k].path;
      console.log(path);
      uni.navigateTo({
        url: path,
        fail() {
          uni.switchTab({
            url: path
          });
        }
      });
    }
  }
}
</script>

<style>
.contnet {
  margin-top: 2rem;
  text-align: center;
  width: 100%;
  font-size: 1rem;
  margin-bottom: 2rem;
}

.active {
  background: #fd7522;
  border: 1px solid #fd7522;
  color: #fff;
}

.item {
  background-color: #DDDDDD;
  margin-top: 0.2rem;
  padding: 0.2rem;
}

.small {
  font-size: 0.5rem;
}

.left {
  float: left;
}
</style>
