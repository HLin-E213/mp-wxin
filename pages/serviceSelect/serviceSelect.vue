<!--选择服务人员-->
<template>
  <view class="serviceSelect" :style="isIPX? 'padding-bottom: 38rpx': ''">
    <uni-nav-bar status-bar :title="title"></uni-nav-bar>
    <view class="serviceSelect_tab">
      <view class="serviceSelect_tab_left" v-for="(i,k) in tabList" :key="k" @click="selectTab(k)">
        <h4>{{ i.name }}</h4>
        <b :style="i.check?'':'background:#ffffff' "></b>
      </view>
    </view>
    <view class="serviceSelect_content">
      <view class="serviceSelect_content_list" :style="tabFlag === 0 ?'':'display:none' "
            v-for="(i,k) in providerService" :key="k">
        <view class="serviceSelect_content_list_left">
          <!-- <image src="https://admin.dajxyl.com/oss?path=img/yunyanlao@2x.png" mode=""></image> -->
          <image :src="i.pic" mode="" @click="checkServerStaff(i.staff_id)"></image>
        </view>
        <view class="serviceSelect_content_list_right">
          <view class="first_col">
            <h4>{{i.nick}}</h4>
            <h4>{{i.hometown_name}}</h4>
            <h4>{{i.age}}</h4>
          </view>
          <view class="second_col">
            <span>{{i.tag.length>=3?i.tag[0]+' | '+i.tag[1]+' | '+i.tag[2]:''}}{{i.tag.length==2?i.tag[0]+' | '+i.tag[1]:''}}{{i.tag.length==1?i.tag[0]:''}}</span>
          </view>
          <view class="third_col">
            <view class="appoint-hes" :style="i.check?'color: #ffffff;background:#fd7600':''"
                    :plain="i.check" @click="appointment(k)">{{ i.check ? '已预约' : '预约Ta' }}
            </view>
            <p>在{{i.time_arrive}}服务过</p>
          </view>
        </view>
      </view>
      <view class="serviceSelect_content_list" :style="tabFlag === 1 ?'':'display:none' "
            v-for="(i,k) in providerServiceOther" :key="k">
        <view class="serviceSelect_content_list_left">
          <image :src="i.pic" mode="" @click="checkServerStaff(i.staff_id)"></image>
        </view>
        <view class="serviceSelect_content_list_right">
          <view class="first_col">
            <h4>{{i.nick}}</h4>
            <h4>{{i.hometown_name}}</h4>
            <h4>{{i.age}}</h4>
          </view>
          <view class="second_col">
            <span>{{i.tag.length>=3?i.tag[0]+' | '+i.tag[1]+' | '+i.tag[2]:''}}{{i.tag.length==2?i.tag[0]+' | '+i.tag[1]:''}}{{i.tag.length==1?i.tag[0]:''}}</span>
          </view>
          <view class="third_col">
            <view class="appoint-hes" :style="i.check?'color: #ffffff;background:#fd7600':''"
                    :plain="i.check" @click="appointment(k)">{{ i.check ? '已预约' : '预约Ta' }}
            </view>
            <p style="display: flex; justify-content: center;">
              <image src="https://admin.dajxyl.com/oss?path=img/ditu@2x.png" mode=""></image>
              距我{{i.dist/1000}}公里
            </p>
          </view>
        </view>
      </view>
      <view class="noneData" :style="noneStyle">
        <image src="https://admin.dajxyl.com/oss?path=img/notRecord@2x.png" mode=""></image>
        <p>您还没有预约过，快去预约吧～</p>
      </view>
    </view>
    <view class="detailsOrder_bottom" :style="isIPX? 'padding-bottom: 38rpx': ''">
      <view class="btn_left">
        <view class="customerContact">
          <view class="customerContact_bottom">
            <p>选择预约{{ countPerson }}人</p>
          </view>
        </view>
      </view>
      <view class="btn_right">
        <view class="select-well" :style="bgStyle" @click="selectOK">选好了</view>
      </view>
    </view>
  </view>
</template>

<script>
import {mapState, mapMutations} from 'vuex';
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";
import {mapArr} from '../../service.js';
import {getLatelyProviderService, getStaffInfo, providersServiceOther} from '../../api/index.js';

export default {
  components: {
    uniNavBar,
  },
  data() {
    const {isIPX} = getApp().globalData;
    return {
      isIPX,
      title: '选择服务人员',
      //选择服务人员的菜单切换
      tabList: [{name: '最近帮我服务的', check: true}, {name: '选择其他人预约', check: false},],
      providerService: [],
      providerServiceOther: [],
      tabFlag: 0,
      countPerson: 0,
      latelyArr: [],
      otherArr: [],
      page: 1,
      pageSize: 10,
      totalPage: 1,
      page1: 1,
      pageSize1: 10,
      totalPage1: 1,
    }
  },
  computed: {
    ...mapState('server', {
      'providerServiceList': 'providerServiceList',
    }),
    ...mapState('serviceinfo', {
      'orderInfo': 'orderInfo'
    }),
    bgStyle() {
      return this.countPerson > 0 ? 'background:#fd7600;color:#ffffff' : ''
    },
    noneStyle() {
      if (this.tabFlag === 0) {
        return this.providerService.length > 0 ? 'display:none' : ''
      }
      return this.providerServiceOther.length > 0 ? 'display:none' : ''
    }
    // btnStyle(k){
    // 	return this.providerService[k].check?'color: #ffffff;background:#408CFF':''
    // }
  },
  created() {
  	let that = this;
  	this.initProviderService();
  	this.initOtherproviders();
  	if(this.providerServiceList){
  		this.countPerson = this.providerServiceList.length;
  	}
  },
  mounted() {
    console.log(this.tabFlag);
  },
  //监听下拉刷新
  onPullDownRefresh(){
  	let that = this;

  	if(this.tabFlag === 0){
  		this.page = 1;
  		this.pageSize = 10;
  		this.count = 0;
  		that.providerService = [];
  		this.initProviderService();
  		setTimeout(function () {
  		    uni.stopPullDownRefresh();
  		}, 1000);
  	}

  	if(this.tabFlag === 1){
  		this.page1 = 1;
  		this.pageSize1 = 10;
  		this.count1 = 0;
      that.providerServiceOther = [];
  		this.initOtherproviders();
  		setTimeout(function () {
  		    uni.stopPullDownRefresh();
  		}, 1000);
  	}

  },
  methods: {
	...mapMutations('server',{
		'setProviderService':'setProviderService',
    'setStaffID':'setStaffID',
    'setStaffInfo':'setStaffInfo',
	}),
    selectOK(){
      return uni.navigateBack({
        delta:1
      });
    },
	// 查看服务人员
    checkServerStaff(staffID) {
      let res = getStaffInfo(staffID), that = this;
      res.then(function (e) {
        // console.log(e);
        that.$store.commit('server/setStaffID', staffID);
        that.$store.commit('server/setStaffInfo', e.data.data.info);
        return uni.navigateTo({
          url: '/pages/checkServicer/index'
        });
      });
    },
    /**
     * 顶部菜单切换
     * @param {number} k
     * **/
    selectTab: function (k) {
      this.tabFlag = k;
      mapArr(this.tabList);
      this.tabList[k].check = !this.tabList[k].check;
      console.log(this.tabFlag);
    },
	//获取最近帮我服务人员的列表
	initProviderService: function(){
		let that = this;
		let arr = [];
		let res = getLatelyProviderService(
		    this.page,
        this.pageSize,
        this.orderInfo.hours,
        this.orderInfo.appointmentTime
    );
		res.then(function(res){
      that.totalPage = res.data.data.info.totalPage;
      let arrData = res.data.data.info.info;
      arrData.map((item,index)=>{
        if(!item.is_busying){
          arr.push(item)
        }
        return arrData;
      })
      arr.map((item,index)=>{
        if(item.hometown_name.length>=5){
          item.hometown_name = item.hometown_name.slice(0,5) + '...';
        }
        if(item.nick.length>=5){
          item.nick = item.nick.slice(0,5) + '...';
        }
        Object.assign(item,{check:false});
        return arr
      })
      that.providerService = that.providerService.concat(arr);
      //利用providerServiceList可以做服务者选择回显
      if(that.providerServiceList){
        for(let i=0;i<that.providerService.length;i++){
          for(let j=0;j<that.providerServiceList.length;j++){
            if(that.providerService[i].staff_id == that.providerServiceList[j].staff_id){
              that.providerService[i].check = true;
            }
          }
        }
      }
    });
	},
	//获取其他服务人员列表数据
	initOtherproviders: function(){
		let that = this;
		let arr = [];
		let res = providersServiceOther(this.page1, this.pageSize1, this.orderInfo.hours, this.orderInfo.appointmentTime, this.orderInfo.address_id);
		res.then(function(res){
      that.totalPage1 = res.data.data.info.totalPage;
      let arrData = res.data.data.info.info;
      arrData.map((item,index)=>{
        if(!item.is_busying){
          arr.push(item)
        }
        return arrData;
      })
      arr.map((item,index)=>{
        if(item.hometown_name.length>=5){
          item.hometown_name = item.hometown_name.slice(0,5) + '...';
        }
        if(item.nick.length>=5){
          item.nick = item.nick.slice(0,5) + '...';
        }
        Object.assign(item,{check:false});
        return arr
      })
      that.providerServiceOther = that.providerServiceOther.concat(arr);
      //利用providerServiceList可以做服务者选择回显
      if(that.providerServiceList){
        for(let i=0;i<that.providerServiceOther.length;i++){
          for(let j=0;j<that.providerServiceList.length;j++){
            if(that.providerServiceOther[i].staff_id === that.providerServiceList[j].staff_id){
              that.providerServiceOther[i].check = true;
            }
          }
        }
      }
    });
	},
    /**
     * 预约按钮
     * @param {number} k
     * **/
    appointment: function (k) {
      let that = this;
	  console.log(k)
      // mapArr(this.providerService);
      if (this.tabFlag == 0) {
        this.latelyArr = [];
		this.providerService[k].check = !this.providerService[k].check;
        //将最后确认的最近帮我服务的数据存在该数组中
        this.providerService.map((item, index) => {
          if (item.check) {
            that.latelyArr.push(item)
          }
		  return that.providerService
        })
      }
      if (this.tabFlag == 1) {
        this.otherArr = [];
		this.providerServiceOther[k].check = !this.providerServiceOther[k].check;
        //将最后确认的其他服务预约的数据存在该数组中
        this.providerServiceOther.map((item, index) => {
          if (item.check) {
            that.otherArr.push(item)
          }
		  return that.providerServiceOther
        })
      }
      let arr = [];
      arr = that.latelyArr.concat(that.otherArr);
	  this.setProviderService(arr);
      this.countPerson = arr.length;
    },
  },
  //uniapp 监听下拉加载生命周期
  onReachBottom(){
  	  let that = this;
  	if(this.tabFlag == 0){
  		if (that.page >= that.totalPage) {
  			uni.showToast({
  				title:'没有下一页了',
  				icon:'none',
  				duration:3000
  			})
  			return
  		}
  		// 加载更多数据
  		that.page++;
  		that.initProviderService();
  	}

  	if(this.tabFlag == 1){
  		if (that.page1 >= that.totalPage1) {
  			uni.showToast({
  				title:'没有下一页了',
  				icon:'none',
  				duration:3000
  			})
  			return
  		}
  		that.page1++;
  		that.initOtherproviders();
  	}
  },
  onShow() {
  	// this.tabFlag = 0;
  },
}
</script>

<style lang="less" scoped>
@item: {
  display: flex;
  align-items: center;
  justify-content: center;
}

@colItem: {
  width: 96%;
  height: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.serviceSelect {
  width: 100%;
  min-height: 100%;
  background: #FAFAFA;
  .head {
    width: 100%;
    height: 5rem;
    display: flex;
	position: fixed;
	top: 0;
	z-index: 10;
  }

  .serviceSelect_tab {
    width: 100%;
    height: 98upx;
    background: rgba(255, 255, 255, 1);
    @item();

    .serviceSelect_tab_left {
      width: 50%;
      height: 100%;
      @item();
      flex-wrap: wrap;

      h4 {
        font-size: 0.945rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(52, 52, 52, 1);
        width: 100%;
        height: 70%;
        @item();
        align-items: flex-end;
      }

      b {
        width: 1.315rem;
        height: 0.19rem;
        background: #fd7600;
        border-radius: 0.5rem;
      }
    }
  }

  .serviceSelect_content {
    width: 100%;
    @item();
    flex-wrap: wrap;
	padding-bottom: 200upx;
    .serviceSelect_content_list {
      width: 710upx;
      height: 224upx;
      background: rgba(255, 255, 255, 1);
      border-radius: 20upx;
      @item();
      margin-top: 24upx;

      .serviceSelect_content_list_left {
        // width: 43%;
        height: 100%;
        @item();

        image {
          width: 228upx;
          height: 182upx;
          border-radius: 10upx;
          margin-left: 20upx;
        }
      }

      .serviceSelect_content_list_right {
        flex:1;
        @item();
        flex-wrap: wrap;
		margin-left: 23upx;

        .first_col {
          @colItem();
		  padding-bottom: 21rpx;

          h4 {
            font-size: 1rem;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(52, 52, 52, 1);
            margin-right: 0.3rem;
          }
        }

        .second_col {
            @colItem();
			padding-bottom: 21rpx;
          span {
            font-size: 0.875rem;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
            margin-left: 0.2rem;
          }
        }

        .third_col {
          @colItem();

          .appoint-hes {
            // width:4.315rem;
            width: 138upx;
            height: 48upx;
            // font-size:0.815rem;
            font-size: 0.6rem;
            border: 1px solid #fd7600;
            border-radius:24upx;
            background: #FFFFFF;
            color: #fd7600;
            @item();
          }

          image {
            width: 0.785rem;
            height: 0.785rem;
            margin: 0.15rem 0.2rem 0 0;
          }

          p {
            flex: 1;
            // font-size:0.815rem;
            font-size: 0.7rem;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(154, 154, 154, 1);
            margin-left: 2%;
          }
        }
      }
    }

    .noneData {
      width: 100%;
      margin-top: 204upx;
      @item();
      flex-wrap: wrap;

      image {
        width: 240upx;
        height: 157upx;
      }

      p {
        width: 100%;
        font-size: 30upx;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        @item();
		margin-top: 54upx;
      }
    }
  }

  .detailsOrder_bottom {
    width: 100%;
    height: 98upx;
    background: rgba(255, 255, 255, 1);
    @item();
    position: fixed;
    bottom: 0;
	z-index: 10;
    .btn_left {
      width: 47%;
      height: 100%;
      @item();
      justify-content: flex-start;

      .customerContact {
        @item();
        flex-wrap: wrap;

        .customerContact_bottom {
          width: 100%;
          height: 40%;
          @item();

          p {
            // width:2.94rem;
            height: 0.72rem;
            font-size: 0.75rem;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
          }
        }
      }
    }

    .btn_right {
      width: 47%;
      height: 100%;
      @item();

      .select-well {
        // width:16.25rem;
        width: 266upx;
        height: 74upx;
        background: #e0e0e0;
        color: #fd7600;
        border-radius: 37upx;
        @item();
        color: rgba(153, 153, 153, 1);
		    font-size: 32upx;
      }
    }
  }
}
</style>
