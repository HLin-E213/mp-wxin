<!--城市选择-->
<template>
	<view class="page-wrap" :class="{'global-page': isIPX }">
		<uni-nav-bar status-bar :title="title"></uni-nav-bar>
		<view class="cityChoice">
		  <view class="city_content">
		    <ss-select-city :hot="hot" :hotCitys="hotCitys" v-model="value" @on-select="handelCity"/>
		  </view>
		</view>
	</view>
</template>

<script>
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import ssSelectCity from '@/components/ss-select-city/ss-select-city.vue';
import {mapState, mapMutations} from 'vuex';
import { getHotCity, getHotCity2 } from '../../api/index';
import {getCityCode} from '../../service'

export default {
  components: {
    ssSelectCity,
	uniNavBar,
  },
  data() {
    return {
      title: '城市选择',
      hotCitys: [],
      hot: [],
      value: '',
        isIPX:this.$isIPX,
    };
  },
  computed: {
    ...mapState('users', {
      'current': 'current',
    })
  },
  created() {
  },
  mounted() {
    this.getHotCity();
    this.getHotCity2();
  },
  methods: {
    ...mapMutations('users', {
      'setCity': 'setCity'
    }),
    /*获取开通的城市*/
    getHotCity: function() {
      let res = getHotCity(),that=this;
      res.then(function(e){
        let cities = e.data.data.info;
        that.hotCitys = [];
        cities.forEach(function(i,k){
          that.hotCitys.push(i.city);
        });
        // console.log(e);
      });
    },
    getHotCity2() {
      getHotCity2().then((res) => {
          this.hot = res.data.data.info.map(({ city }) => city);
          console.log('this.hot', this.hot);
      })
    },
    /*获取选中的城市*/
    handelCity: function (e) {
      console.log(e);
      if (e.indexOf("市") === -1) {
        e = e + '市';
      }
      this.setCity(e);
      getCityCode(e);
      uni.switchTab({
        url: '/pages/main/main'
      })
    },
  }
}
</script>

<style lang="less" scoped>
	@import url('@/common/common.less');
.page-wrap{
	width: 100%;
}
.cityChoice {
	width: 100%;
	background-color: @white;
	.city_content {
		padding-top: 24 upx;
		width: 100%;
		background-color: #FFFFFF;
	}
}
</style>
