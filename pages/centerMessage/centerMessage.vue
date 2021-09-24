<!--消息中心-->
<template>
  <view class="centerMessage" :class="{'global-page': isIPX }">
    <uni-nav-bar status-bar :title="title"></uni-nav-bar>
    <view class="switch_tab">
      <view class="messages" v-for="(i,k) in menuList" :key="k" @click="handelMenu(k)">
        <view class="messages_content">
          <p :style="i.selectStyle?'color:#fd7600;':''">{{ i.name }}</p>
<!--          <em v-if="i.num > 0">{{ i.num }}</em>-->
<!--          <view class="tabBg" v-if="i.num > 0">-->
<!--            <b :style="i.selectStyle?'background:#fd7600;':''"></b>-->
<!--          </view>-->
        </view>
      </view>
    </view>
    <view class="content_list" v-if="flag">
      <view class="content_list_item" v-for="(i,k) in messagesList" :key="k" @click="selectMessage(k)">
        <view class="content_list_left">
          <image :src="i.rec_user.pic" mode=""><em v-if="i.readStatus"></em></image>
          <view class="center_content">
            <p>{{ i.desc }}</p>
            <span>{{i.time}}</span>
          </view>
        </view>
        <view class="content_list_right">
          <image src="https://admin.dajxyl.com/oss?path=img/next_page.png" mode=""></image>
        </view>
      </view>
    </view>
    <view class="content_list" v-else="flag">
      <view class="content_list_item" v-for="(i,k) in notifyList" :key="k" @click="selectNotify(k)">
        <view class="content_list_left">
          <image src="https://admin.dajxyl.com/oss?path=img/notify.png" mode=""><em v-if="i.readStatus"></em></image>
          <view class="center_content">
            <p>{{ i.desc }}</p>
            <span>{{i.time}}</span>
          </view>
        </view>
        <view class="content_list_right">
          <image src="https://admin.dajxyl.com/oss?path=img/next_page.png" mode=""></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import {mapState, mapMutations} from 'vuex';
import { getMessagesData,getNotifyData,messageRead } from '../../api/index.js';

export default {
  components: {
    uniNavBar,
  },
  data() {
    return {
      title: '消息中心',
      menuList: [{name: '消息',num: 0,selectStyle: true}, {name: '通知',num: 0,selectStyle: false}],
      flag: true,
      messagesList: [],
	  count:0,
	  page:1,
	  pageSize:20,
	  totalPage:1,
	  notifyList:[],
	  count1:0,
	  page1:1,
	  pageSize1:20,
	  totalPage1:1,
        isIPX:this.$isIPX,
    }
  },
  computed: {},
  mounted() {
  	this.initMessagesData();
	  this.initNotifyData();
  },
  //监听下拉刷新
  onPullDownRefresh(){
	let that = this;
	if(this.flag){
		this.page = 1;
		this.pageSize = 20;
		this.count = 0;
    this.messagesList = [];
		this.initMessagesData();
		setTimeout(function () {
		    uni.stopPullDownRefresh();
		}, 1000);
	}

	if(!this.flag){
		this.page1 = 1;
		this.pageSize1 = 20;
		this.count1 = 0;
    this.notifyList = [];
		this.initNotifyData();
		setTimeout(function () {
		    uni.stopPullDownRefresh();
		}, 1000);
	}
  },
  methods: {
    /**
     * 顶部tab栏切换局部刷新
     * @param {num}  k
     * **/
    handelMenu: function (k) {
      console.log(k)
      this.menuList.map((item) => {
        if (item.selectStyle == true) {
          item.selectStyle = false
        }
        return this.menuList
      })
      this.menuList[k].selectStyle = !this.menuList[k].selectStyle;
      if (k == 0) {
        this.flag = true;
      } else {
        this.flag = false;
      }
    },

    /**
     * 获取消息初始化数据列表
     * **/
    initMessagesData: function () {
    let that = this;
    let arr = [];
    let ret = getMessagesData(this.page, this.pageSize);
    ret.then(function (res) {
      if (res.data) {
        arr = res.data.data.info;
        that.totalPage = res.data.data.totalPage;
        if (arr.length > 0) {
          arr.map((item, index) => {
            if (item.status == 1) {
              that.count++
              Object.assign(item, {readStatus: true});
            }
            if (item.status == 2) {
              Object.assign(item, {readStatus: false});
            }
            if (item.desc.length > 13) {
              item.desc = item.desc.slice(0, 13) + '...';
            }
            return arr
          })
        }
        if (arr.length === 0) {
          uni.showToast({title: '暂无数据', icon: 'none', duration: 1000})
        }
        that.menuList[0].num = that.count;
        that.messagesList = that.messagesList.concat(arr);
      }
    });
  },
	 /**
	  * 获取通知初始化数据列表
	  * @param {type}
	  * **/
	  initNotifyData: function(){
	 	 let that = this;
	 	 let arr = null;
	 	 let ret = getNotifyData(this.page1,this.pageSize1);
	 	 ret.then(function(res){
	 	   if (res.data) {
         arr = res.data.data.info;
         that.totalPage1 = res.data.data.totalPage;
         if(arr.length>0){
           arr.map((item,index)=>{
             if(item.status == 1){
               that.count1 ++
               Object.assign(item,{readStatus:true});
             }
             if(item.status == 2){
               Object.assign(item,{readStatus:false});
             }
             if(item.desc.length>13){
               item.desc = item.desc.slice(0,13) + '...';
             }
             return arr
           })
         }
         if(arr.length == 0){ uni.showToast({ title:'暂无数据', icon:'none', duration:1000 }) }
         that.menuList[1].num = that.count1;
         that.notifyList = that.notifyList.concat(arr);
       }
     });
	  },
	  //点击消息列表获取k值
	  selectMessage:function(k){
		  let that = this;
		  this.messagesList[k].status = 2;
		  this.messagesList[k].readStatus = false;
		  this.changeMessageStatus(this.messagesList[k].id);
		  // uni.navigateTo({
		  // 	url:'/pages/detailsOrder/detailsOrder?orderId=' + this.messagesList[k].payload.id
		  // })
	  },
	  //点击通知列表触发事件获取k值
	  selectNotify:function(k){
		  let that = this;
		  this.notifyList[k].status = 2;
		  this.notifyList[k].readStatus = false;
		  this.changeMessageStatus(this.notifyList[k].id);
		  uni.navigateTo({
		  	url:'/pages/detailsOrder/detailsOrder?orderID=' + this.notifyList[k].payload.id
		  })
	  },
	  //更新消息的状态，未读改变成已读
	  changeMessageStatus:async function(val){
		  let that = this;
		  let res = await messageRead(val);
		  console.log(res)
		  if(res.data.code == 1){
			  //即使调用接口更新数据更新
			  // if(that.flag){
				 //  that.initMessagesData();
			  // }
			  // if(!that.flag){
				 //  that.initNotifyData();
			  // }
		  }else{
			  uni.showToast({
			  	title:'操作失败',
				icon:'none',
				duration:1000
			  })
		  }
	  },
  },
  //uniapp 监听下拉加载生命周期
  onReachBottom(){
	  let that = this;
	if(this.flag){
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
		that.initMessagesData();
	}

	if(!this.flag){
		if (that.page1 >= that.totalPage1) {
			uni.showToast({
				title:'没有下一页了',
				icon:'none',
				duration:3000
			})
			return
		}
		that.page1++;
		that.initNotifyData();
	}
  },
}
</script>

<style lang="less" scoped>
@item: {
  display: flex;
  justify-content: center;
  align-items: center;
}

@timeTab: {
  p {
    // width:1.815rem;
    height: 0.875rem;
    font-size: 0.95rem;
    font-family: PingFang SC;
    font-weight: 400;
  }
  em {
    // width:0.91rem;
    // height:0.75rem;
    min-width: 1rem;
    height: 1rem;
    font-size: 0.75rem;
    background: rgba(239, 64, 62, 1);
    border-radius: 0.5rem;
    line-height: 1rem;
    margin-top: 0.3rem;
    color: #FFFFFF;
	@item();
  }

}

@list_item: {
  width: 80%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

.centerMessage {
  width: 100%;
  min-height: 100%;

  .switch_tab {
    width: 100%;
    height: 2.625rem;
	border-top: 1upx solid rgba(153, 153, 153, .3);
	background-color: #ffffff;
    @item();
    .messages {
      width: 50%;
      height: 100%;
      @item();

      .messages_content {
        width: 40%;
        height: 100%;
        @item();
        @timeTab();
        flex-wrap: wrap;

        .tabBg {
          width: 50%;
          @item();
          justify-content: flex-start;

          b {
            width: 1.125rem;
            height: 0.16rem;
            border-radius: 0.5rem;
          }
        }
      }
    }
  }

  .content_list {
    width: 100%;
    @item();
    margin-top: 0.75rem;
    flex-wrap: wrap;
    align-items: flex-start;
	background-color: #ffffff;

    .content_list_item {
      width: 100%;
      height: 110upx;
      border-bottom: 1upx solid rgba(153, 153, 153, .3);
      @item();

      .content_list_left {
        @list_item();
        image {
          width: 68upx;
          height: 68upx;
          border-radius: 50%;
		  background: #999999;
        }

        p {
          font-size: 0.94rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
        }

        span {
          // width:6.625rem;
          height: 0.595rem;
          font-size: 0.75rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(154, 154, 154, 1);
        }

        b {
          width: 0.94rem;
          height: 0.94rem;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 0.375rem;
          color: #FFFFFF;
          background: rgba(227, 47, 45, 1);
          border-radius: 50%;
        }

        em {
          width: 0.315rem;
          height: 0.315rem;
          background: rgba(239, 64, 62, 1);
          border-radius: 50%;
          position: absolute;
          margin: -0.7rem 0 0 1.75rem;
        }
		.center_content{
			margin-left: 15rpx;
			display: flex;
			flex-direction: column;
			height: 100%;
			p{
				font-size: 26upx;
				color: #333333;
				margin-top: 16upx;
			}
			span{
				font-size: 24upx;
				color: #999999;
				margin-top: 8upx;
			}
		}
      }

      .content_list_right {
        @list_item();
        width: 14%;
        justify-content: flex-end;

        image {
          width: 14upx;
          height: 24upx;
        }
      }
    }
  }
}
</style>
