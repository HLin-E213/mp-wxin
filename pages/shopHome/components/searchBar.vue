<template>
  <view class="dajx-search-bar">
      <uni-search-bar v-model="keyword"
                      clearButton="auto"
                      cancelButton="none"
                      @confirm="search"
                      @clear="clear"
                      @blur="onBlur"
                      bgColor="#F8F8F8"
                      :radius="18"
                      :list="historySearchList"
                      @hClick="onClick">
        <uni-icons slot="searchIcon" color="#999999" size="18" type="search"></uni-icons>
      </uni-search-bar>
  </view>
</template>

<script>
import uniSearchBar from "@/components/uni-search-bar/uni-search-bar.vue"
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import uniIcons from "@/components/uni-icons/uni-icons.vue"
export default {
  name: "searchBar",
  components: {
    uniSearchBar,
    uniNavBar,
    uniIcons
  },
  data() {
    return {
      keyword: '', // 搜索词
      iconUrl: require('../../../static/search2.png'),
      historySearchList: []
    }
  },
  mounted(){
    this.getHistory()
  },
  methods: {
    async getHistory(){
      let list = await uni.getStorage({
        key: 'searchList'
      });
      if (list[1] && list[1].data) {
        this.historySearchList = JSON.parse(list[1].data)
      }else{
        this.historySearchList = []
      }
    },
    search(){
    },
    clear(){
    },
    onClick(){
        uni.navigateTo({
          url: '/pages/shop/search/index'
        });
    },
    onBlur(){
    }
  }
}
</script>

<style lang="scss" scoped>
.dajx-search-bar{
  /deep/ .uni-searchbar__box{
    border-radius: 36rpx !important;
  }
}
</style>