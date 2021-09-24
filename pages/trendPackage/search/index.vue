<!--
* @Description: 
* @Author: mahui
* @Date: 2021/1/20 12:55 PM
-->
<template>
  <layout
      :showFooter="false"
      contentBackgroundColor="#FFFFFF"
  >
    <div slot="title" class="title-wrap">
      <div class="title">
        <image class="title__search" mode="widthFix" src="https://admin.dajxyl.com/oss?path=video/upload/202108/trend-search@2x.png" alt=""/>
        <input
            confirm-type="search"
            @confirm="toSearchResult"
            class="title__input"
            type="text"
            placeholder="请输入搜索内容"
            v-model="content"
        >
      </div>
    </div>
    <div class="search-content">
      <div class="history-wrap">
        <p class="history-wrap__title">
          <span class="history-wrap__title-text">历史搜索</span>
          <img
              @click="deleteHistory"
              class="history-wrap__title-icon"
              src="../../../static/lajitong.png" alt="">
        </p>
        <div class="history-wrap-item-wrap">
          <div
              class="history-wrap-item"
              v-for="history in historySearch"
              :key="history"
              @click="setSearchValue(history)"
          >
            {{ history }}
          </div>
        </div>
      </div>
      <div class="history-wrap hot-wrap">
        <p class="history-wrap__title">
          <span class="history-wrap__title-text">热门话题</span>
        </p>
        <div class="history-wrap-item-wrap">
          <div
              class="history-wrap-item"
              v-for="tag in hotTags"
              :key="tag"
              @click="setSearchValue(tag, 'tag')"
          >
            {{ tag }}
          </div>
        </div>
      </div>
    </div>
    <Modal
        ref="modal"
        title="删除所有搜索历史"
        confirmText="确认"
        cancelText="取消"
        @confirm="confirmDelete"
        @cancel="close"
        :showContent="false"
        :titleStyle="{backgroundColor:'#FFFFFF', color: '#333333'}"
    >
    </Modal>
  </layout>

</template>

<script>
    import layout from '@/components/layout/index.vue';
    import Modal from '@/components/Modal/index.vue';
    import { getArticleTags } from '../../../api/friends';

    export default {
        name: 'index',
        components: {
            layout,
            Modal,
        },
        data() {
            return {
                hotTags: [],
                historySearch: [],
                content: '',
            };
        },
        async onShow() {
            this.getSearchHistory();
            const res = await getArticleTags();
            this.hotTags = res.data.data.info || [];
        },
        methods: {
            deleteHistory() {
              this.open();
            },
            confirmDelete() {
                uni.removeStorageSync('historySearch');
                this.getSearchHistory();
                this.close();
            },
            setSearchValue(val, type) {
                this.content = val;
                if (type !== 'tag') {
                    this.setSearchHistory(val);
                }
                uni.navigateTo({
                    url: `/pages/trendPackage/searchResult/index?keywords=${this.content}`,
                });
            },
            getSearchHistory() {
                // uni.setStorageSync('cityCode', n);
                let history = uni.getStorageSync('historySearch');
                if (history) {
                    this.historySearch = JSON.parse(history);
                } else {
                    this.historySearch = [];
                }
            },
            setSearchHistory(key) {
                let data = [];
                let history = uni.getStorageSync('historySearch');
                if (history) {
                    data = JSON.parse(history);
                    if (!(data.includes(key))) {
                        data.unshift(key);
                    } else {
                        const index = data.indexOf(key);
                        data.splice(index, 1);
                        data.unshift(key);
                    }
                } else {
                    data.push(key);
                }
                if (data.length > 6) {
                    data = data.splice(0, 6);
                }
                this.historySearch = data;
                uni.setStorageSync('historySearch', JSON.stringify(data));
            },
            open() {
                this.$refs.modal.open();
            },
            close() {
                this.$refs.modal.close();
            },
            toSearchResult() {
                const reg = /#\S{1,}#/;
                if (!reg.test(this.content)) {
                    this.setSearchHistory(this.content);
                }
                uni.navigateTo({
                    url: `/pages/trendPackage/searchResult/index?keywords=${this.content}`,
                });
            },
        },
    };
</script>

<style scoped lang="less">
  .search-content{
    .history-wrap{
      margin: 20rpx;
      padding: 25rpx 23rpx;
      background: #F8F8F8;
      border-radius: 10px;
      &__title{
        display: flex;
        align-items: center;
        justify-content: space-between;
        &-text{
          font-size: 26rpx;
          color: #999999;
        }
        &-icon{
          width: 24rpx;
          height: 24rpx;
        }
      }
      &-item-wrap {
        display: flex;
        flex-wrap: wrap;
        .history-wrap-item{
          margin-top: 20rpx;
          width: 332rpx;
          color: #666666;
          font-size: 28rpx;
          overflow: hidden;
          text-overflow:ellipsis; //溢出用省略号显示
          white-space:nowrap; //溢出不换行 （只显示一行）
        }
      }
    }
    .hot-wrap{
      background: rgba(253, 118, 0, .1);
    }

  }
  .title-wrap{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    .title{
      display: flex;
      padding: 0 32rpx;
      width: 492rpx;
      height: 64rpx;
      background: #F8F8F8;
      border-radius: 32rpx;
      align-items: center;
      &__search{
        width: 40rpx;
        height: 40rpx;
      }
      &__input{
        height: 100%;
        width: 492rpx;
        border: none;
        margin-left: 20rpx;
      }
    }
  }

</style>