<template>
  <view class="dajx-search-bar">
    <uni-search-bar
        v-model="keyword"
        clearButton="auto"
        cancelButton="none"
        @confirm="search"
        @clear="clear"
        @blur="onBlur"
        bgColor="#F8F8F8"
        :radius="18"
        :focus="isFocus"
        :list="historySearchList"
        @hClick="onClick"
    >
    </uni-search-bar>
  </view>
</template>

<script>
import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue';
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
import uniIcons from '@/components/uni-icons/uni-icons.vue';
export default {
  name: 'searchBar',
  props:{
    isCreate: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isCreate: {
      immediate: true,
      handler(newVal) {
        if(newVal){
          this.getHistory();
        }
      }
    }
  },
  components: {
    uniSearchBar,
    uniNavBar,
    uniIcons
  },
  data() {
    return {
      keyword: '', // 搜索词
      isFocus: false,
      iconUrl: require('../../../static/search2.png'),
      historySearchList: []
    };
  },
  onShow() {
    this.isFocus = false;
  },
  mounted() {

  },
  methods: {
    // 获取历史搜索
    async getHistory() {
      console.log('dddd')
      let list = await uni.getStorage({
        key: 'searchList'
      });
      if (list[1] && list[1].data) {
        this.historySearchList = JSON.parse(list[1].data);
      } else {
        this.historySearchList = [];
      }
    },
    search() {},
    clear() {},
    onClick() {
      uni.navigateTo({
        url: '/pages/shop/search/index'
      });
    },
    onBlur() {}
  }
};
</script>

<style lang="scss" scoped>
.dajx-search-bar {
  padding: 0 45rpx;
  /deep/ .uni-searchbar__box {
    border-radius: 36rpx !important;
  }
}
</style>
