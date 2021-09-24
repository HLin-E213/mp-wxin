<template>
  <scroll-view
      scroll-y
      class="view-page-content"
      :refresher-enabled="refresher"
      :refresher-threshold="threshold"
      :refresher-triggered="triggered"
      @refresherrefresh="refreshing"
      :scroll-anchoring="anchoring"
      @scrolltolower="infinite"
  >
    <slot></slot>
    <load-more :status="loadMoreStatus" iconType="snow" v-if="infiniting && !isRefreshing"></load-more>
  </scroll-view>
</template>

<script>
import LoadMore from '@/components/uni-load-more/uni-load-more';
export default {
  name: "PageContent",
  components: {
    LoadMore
  },
  props: {
    refresher: {
      type: Boolean,
      default: false,
    },
    threshold: {
      type: Number,
      default: 100,
    },
    anchoring: {
      type: Boolean,
      default: true,
    },
    infiniting: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isRefreshing: false, // 是否在刷新中
      isInfiniting: this.infiniting, // 是否在加载中
      infiniteDisabled: false, // 是否禁用上拉加载
      triggered: true,
      loadMoreStatus: 'more', // 上拉加载的状态样式
    };
  },
  methods: {
    refreshing() {
      if (this.isRefreshing) return;
      this.isRefreshing = true
      this.triggered = true;
      this.isInfiniting = false;
      this.$emit('onRefresh', { complete: this.refresherComplete, setStatus: function(status, disabled) {
          this.loadMoreStatus = status;
          this.infiniteDisabled = disabled;
        }.bind(this)});
    },
    refresherComplete() {
      this.triggered = false;
      this.isRefreshing = false;
      this.isInfiniting = true;
      this.infiniteDisabled = false;
    },
    infinite() {
      if (this.infiniteDisabled) return false;
      if(this.isInfiniting) {
        this.loadMoreStatus = this.infiniteDisabled  ? 'noMore' : 'loading';
        this.$emit('onInfinite', { setStatus: function(status, disabled) {
            this.loadMoreStatus = status;
            this.infiniteDisabled = disabled;
          }.bind(this)});
      }
    },
    setStatus(status, disabled) {
      this.loadMoreStatus = status;
      this.infiniteDisabled = disabled;
    },
  }
}
</script>

<style lang="less">
.view-page-content {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
