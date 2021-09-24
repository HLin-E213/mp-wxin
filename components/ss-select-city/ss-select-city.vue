<template>
  <view class="select-city-wrap">
    <view class="serch_city">
      <!-- <input type="text" value="" /> -->
      <view class="search-block">
       <image class="search-icon" src="https://admin.dajxyl.com/oss?path=img/serch.svg" mode=""></image>
        <input type="text" value="" placeholder-style="color:#999999" placeholder="请输入城市名" @input="onKeyInput"
               class="search-text" maxlength="10" focus/>
      </view>
    </view>
    <view class="select-city">
      <view class="index">
        <view
            class="index-item"
            :class="{'active-index-item': scrollIntoId ===  'current'}"
            @click="scrollTo('#')"
        >热门</view>
        <view class="index-item"
              :class="{'active-index-item': scrollIntoId ===  item.letter}"
              v-for="item in citys"
              :key="item.letter"
              @click="scrollTo(item.letter)">
          {{ item.letter }}
        </view>
      </view>
      <scroll-view :scroll-into-view="scrollIntoId" :scroll-y="true" :scroll-with-animation="true"
                   :style="{height:windowHeight}">
        <view class="content">
          <view class="section current-section" id="current">
            <view class="city-list cur-city-list">
              <view
                  class="city-title current-city-title"
                  @click="handelCity"
              >
                <!--<image src="https://admin.dajxyl.com/oss?path=img/dingwei@2x_origin.png" mode=""></image>-->
                当前城市
              </view>
              <view class="repositioning" @click="getLie">
                <!--<image src="https://admin.dajxyl.com/oss?path=img/new_lie_origin.png" mode=""></image>-->
                <image class="dingwei-img" src="https://admin.dajxyl.com/oss?path=img/dingwei@2x_origin.png" mode=""></image>
                <p class="reLie">{{ current }}</p>
              </view>
            </view>
          </view>
          <view class="section" id="hot" v-if="hot.length">
            <view class="city-title">热门城市</view>
            <view class="city-list">
              <view class="city-item" v-for="(city, i) in hot" :key="i"
                    @click="onSelect(city)">{{ city }}
              </view>
            </view>
          </view>
<!--          <view class="section" id="hot" v-if="hotCitys.length">-->
<!--            <view class="city-title">所有城市</view>-->
<!--            <view class="city-list">-->
<!--              <view class="city-item" :class="{active: current === city}" v-for="(city, i) in hotCitys" :key="i"-->
<!--                    @click="onSelect(city)">{{ city }}-->
<!--              </view>-->
<!--            </view>-->
<!--          </view>-->
          <view class="section-title" v-if="hotCitys.length">所有城市</view>
          <view
              v-if="hotCitys.length"
              class="section section-other"
              :id="item.letter"
              v-for="item in citys"
              :key="item.letter"
          >
            <view class="letter">{{ item.letter }}</view>
            <view class="divider"></view>
            <view class="city-list">
              <view class="city-item" v-for="(city,itemIndex) in item.list"
                    :key="itemIndex" @click="onSelect(city)">{{ city }}
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<script>
import AMapLoader from '../../lib/amap-wx.js';
import {pinyin} from '../../utils/Convert_Pinyin.js';
import {mapState, mapMutations} from 'vuex';
import {getCityCode} from "../../service";

export default {
  props: {
    hotCitys: {
      type: Array,
      default() {
        return []
      }
    },
    hot: {
      type: Array,
      default() {
        return []
      }
    },
    value: {
      type: String,
      default: '未设置'
    }
  },
  computed: {
    citys() {
      const cityPin = this.hotCitys.map((city) => {
        let str = pinyin.getFullChars(city);
        let letter = str.slice(0, 1);
        return {
          letter,
          city,
        }
      });
      let result = [];
      let recordLetter = [];
      for (let i = 0; i < cityPin.length; i++) {
        const cur = cityPin[i];
        const { city, letter } = cur;
        if (!recordLetter.includes(letter)) {
          result = [
              ...result,
            {
              letter,
              list: [city]
            }
          ];
          recordLetter.push(letter);
        } else {
          result = result.map((item) => {
            const temp = { ...item };
            if (temp.letter === letter) {
              if (!temp.list.includes(city)) {
                temp.list = [...temp.list, city]
              }
            }
            return temp;
          })
        }
      }
      console.log('result', result);
      return result;
    },
  },
  data() {
    return {
      windowHeight: '',
      scrollIntoId: 'current',
      current: this.value
    }
  },
  mounted() {
    this.getSystemInfo();
    this.getLie();
  },
  methods: {
    getSystemInfo() {
      uni.getSystemInfo().then(res => {
        let [error, data] = res;
        this.windowHeight = `${data.windowHeight - uni.upx2px(82)}px`
      })
    },
    scrollTo(letter) {
      this.scrollIntoId = letter === '#' ? 'current' : letter
    },
    onSelect(city) {
      this.current = city
      this.$emit('input', city)
      this.$emit('on-select', city)
    },
    /*获取当前城市定位*/
    getLie: function () {
      let that = this;
      let myLocaltion = new AMapLoader.AMapWX({key: '928d7ec62845e85801e2ebea80a36194'});
      myLocaltion.getRegeo({
        // location: res.longitude + ',' + res.latitude,//location的格式为'经度,纬度'
        success: function (data) {
          // console.log(data)
          that.current = data[0].regeocodeData.addressComponent.city;
          that.setCity(that.city);
          getCityCode(that.current);
        },
        fail: function (info) {
          console.log(info)
          uni.showToast({
            title: '定位失败,请从设置开启定位。',
            icon: 'none',
            duration: 3000
          })
        }
      })
    },
    onKeyInput: function (event) {
      if (event.target.value !== '') {
        // console.log(pinyin.getFullChars(event.target.value));
        let str = pinyin.getFullChars(event.target.value);
        let letter = str.slice(0, 1)
        console.log(letter)
        this.scrollTo(letter);
      }
    },
    ...mapMutations('users', {
      'setCity': 'setCity'
    }),
    /*获取选中的城市*/
    handelCity: function () {
      this.setCity(this.current);
      uni.switchTab({
        url: '/pages/main/main'
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.select-city-wrap {
  position: relative;
  padding: 0 19rpx;
  background-color: #f8f8f8;
}
.serch_city {
  width: 100%;
  height: 82upx;
  display: flex;
  justify-content: center;
  align-items: center;

  .search-ico, .search-ico-1 {
    width: 2.065rem;
    height: 2.03rem;
  }

  .search-text {
    font-size: 14px;
    background-color: #FFFFFF;
    // height: 60upx;
    height: 100%;
    // width: 480upx;
    width: 280upx;
    display: flex;
    align-items: center;
    font-size: 0.815rem;
    font-family: PingFang SC;
    font-weight: 400;
    color: #999999;
  }

  .search-block {
    margin-top: 32rpx;
    width: 660upx;
    height: 100%;
	display: flex;
	align-items: center;
    background: #ffffff;
    border-radius: 41upx;
	.search-icon{
		width: 36rpx;
		height: 36rpx;
		padding-left: 49upx;
	}
	.search-text{
		flex: 1;
		padding-left: 16upx;
		border-radius: 0 41upx 41upx 0;
	}

  }
  .search-ico-wapper1 {
    background-color: #FFFFFF;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0upx 40upx 0upx 0upx;
    border-bottom-right-radius: 18px;
    border-top-right-radius: 18px;
  }
}

.select-city {
  .index {
    position: absolute;
    right: 0;
    top: 350upx;
    z-index: 999;
    color: #999999;
    font-size: 24upx;
    .active-index-item{
      color: #FD7C09;
    }
    .index-item {
      text-align: center;
    }
  }

  .section-title {
    padding-top: 66upx;
    font-size: 0.815rem;
    font-family: PingFang SC;
    font-weight: 400;
    color: #999999;
    margin-bottom: 0.5rem;
  }

  .section {
	  padding-top: 66upx;
    .city-title {
      color: #999999;
      font-size: 28upx;
      margin-bottom: 28rpx;
    }

    .letter {
      color: #333333;
      font-size: 32upx;
      line-height: 44upx;
      margin-bottom: 20upx;
      text-align: left;
    }
    .divider {
        height:1rpx;
      width: 670rpx;
        opacity: 0.3;
        background-color: #999999;
      margin-bottom: 23rpx;
    }

    .city-list {
      display: flex;
      flex-wrap: wrap;

      .city-item {
        padding: 24rpx 62rpx;
        margin-right: 26upx;
        margin-bottom: 25upx;
        color: #333333;
        font-size: 28upx;
        background-color: #FFFFFF;
        border-radius: 38rpx;

        image {
          width: 0.685rem;
          height: 0.905rem;
          margin-right: 0.3rem;
        }

        &.active {
          background-color: rgba(253, 118, 0, 0.2);
          border-color: #fd7600;
          color: #fd7600;
        }
      }
	  .current-city-title{
		  margin-bottom: 0;
	  }

      .repositioning {
        // width: 3.5rem;
        width: 55%;
        // height: 0.78rem;
        height: 1.56rem;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        align-items: center;

        image {
          width: 0.84rem;
          height: 0.875rem;
          margin-top: 0.25rem;
        }
        .dingwei-img{
          height: 29rpx;
          width: 22rpx;
        }
        .reLie {
          // width:3.185rem;
          // height:0.78rem;
          height: 0.9rem;
          font-size: 0.815rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: #fd7600;
          margin-left: 0.22rem;
        }
      }
    }
    .cur-city-list{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .current-section{
    padding-top: 66rpx;
    .city-title{
      margin-bottom: 0;
    }
  }
  .section-other{
    padding-top: 10rpx;
  }
}
scroll-view ::-webkit-scrollbar {
  width: 0;
  height: 0;
  background-color: transparent;
}
</style>
