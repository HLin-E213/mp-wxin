<!--地图选择界面-->
<template>
  <view class="pageMap">
    <uni-nav-bar status-bar :title="title"></uni-nav-bar>
    <!--地图-->
	<view class="serch" style="z-index: 12;">
	  <view class="serchInput">
	    <image class="cover-image" src="https://admin.dajxyl.com/oss?path=img/sousuo_2@2x.png"></image>
	    <view class='text'>{{ inputInfo }}</view>
	    <input class='input' :value='inputModel' focus @input='blurInput'></input>
	  </view>
	</view>
    <map
        id="container"
        style="width:100%;height:90%;position:absolute;bottom:0;"
        :latitude="latitude"
        :longitude="longitude"
        :markers="covers"
        @regionchange="onControltap"
    >
      <cover-image src="https://admin.dajxyl.com/oss?path=img/dingweiditu@2x.png" class="cover-views"></cover-image>
      <cover-view class="addressDetail">
        <cover-view class="addressDetail_content">
          <cover-view class="addressDetail_content_h4">详细地址：</cover-view>
          <cover-view class="addressDetail_content_p">
            <cover-view class="p">{{ description }}</cover-view>
          </cover-view>
        </cover-view>
      </cover-view>

      <cover-view class="poiList" :style="{display: visibal ? '':'none', height: poiList.tips.length > 4 ? '520rpx' : 'auto'}">
        <cover-view class="views">
          <cover-view class="poiList_item" @click="selectItem(k)" v-for="(i,k) in poiList.tips" :key="k">
            <cover-view class="poiList_item--name">{{ i.name }}</cover-view>
            <cover-view class="poiList_item--address">{{ getSearchDetail(i) }}</cover-view>
          </cover-view>
        </cover-view>
      </cover-view>
      <cover-view class="btn" style="z-index: 999999;">
        <button type="primary" @click="submit">保存</button>
      </cover-view>
    </map>
  </view>
</template>
<script>
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import {mapState, mapMutations} from 'vuex';
import amapFile from '../../lib/amap-wx.js';
import {getCityCode} from "../../service";

export default {
  components: {
    uniNavBar
  },
  data() {
    return {
      id: 0, // 使用 marker点击事件 需要填写id
      title: '选择地址',
      latitude: 30.570533752441,
      longitude: 104.06456756592,
      //地图上选点的经纬度
      lie: {
        latitude: 30.570533752441,
        longitude: 104.06456756592,
      },
      inputInfo: '',
      inputModel: '',
      inputFocus: false,
      description: '',
      //省
      province: '',
      city: '',
      township: '',
      //列表循环
      poiList: {tips:[]},
      //列表控制
      visibal: false,
      type: 'add',
    }
  },
  computed: {
    ...mapState('users', {
      'editorData': 'editorData',
      'covers': 'covers',
    }),
    getSearchDetail() {
        return function({ district, address }) {
            return address.length ? `${district}-${address}` : district;
        }
    }
  },
  onLoad(option) {
    if (option.type === 'edit') {
      this.type = 'edit';
    }

    if (option.type === 'add') {
      this.type = 'add';
    }

  },
  mounted() {
    console.log(this.editorData.lat,this.editorData.lng);
    if (this.editorData.lat && this.editorData.lng) {
      this.latitude = this.editorData.lat;
      this.longitude = this.editorData.lng;
    } else {
      let userLocation = uni.getStorageSync('userLocation');
      let userLocationArr = userLocation.split(",");
      this.latitude = userLocationArr[1];
      this.longitude = userLocationArr[0];
    }
    this.initLocation();
  },
  methods: {
    /*获取用户当前定位*/
    initLocation: function () {
      let that = this;
      uni.getLocation({
        type: 'gcj02',
        success: function (res) {
          if (that.editorData.lat && that.editorData.lng) {
            that.latitude = that.editorData.lat;
            that.longitude = that.editorData.lng;
            that.lie.latitude = that.editorData.lat;
            that.lie.longitude = that.editorData.lng;
            // that.covers[0].latitude = res.latitude;
            // that.covers[0].longitude = res.longitude;
            that.getLieData({longitude:that.editorData.lng,latitude:that.editorData.lat});
          } else {
            that.latitude = res.latitude;
            that.longitude = res.longitude;
            that.lie.latitude = res.latitude;
            that.lie.longitude = res.longitude;
            // that.covers[0].latitude = res.latitude;
            // that.covers[0].longitude = res.longitude;
            that.getLieData(res);
          }
          // console.log(res,that.latitude,that.longitude);
        }
      });
    },
    /*移动地图中心点位置改变点击获取当前中心点位置经纬度*/
    onControltap(control) {
      if (control.type === "end") {
        let that = this;
        uni.createMapContext("container", this).getCenterLocation({
          success: (res) => {
            // console.log(res)
            that.lie.latitude = res.latitude;
            that.lie.longitude = res.longitude;
            that.getLieData(res);
          }
        });
      }
    },
    //经纬度转物理地址
    getLieData: function (val) {
      let that = this;
      let myAmapFun = new amapFile.AMapWX({key: '928d7ec62845e85801e2ebea80a36194'});
      let longitude = val.longitude;
      let latitude = val.latitude;
      myAmapFun.getRegeo({
        location: `${longitude},${latitude}`,
        success: function (data) {
          // console.log(data)
          that.description = data[0].name + "，" + data[0].desc.substring(0, data[0].desc.length - 2);
          that.province = data[0].regeocodeData.addressComponent.province;
          that.city = data[0].regeocodeData.addressComponent.city;
          that.township = data[0].regeocodeData.addressComponent.district;
          getCityCode(that.city);
        },
        fail: function (info) {
          console.log(info)
          uni.showToast({
            title: '获取定位失败',
            icon: 'none',
            duration: 3000
          })
        }
      })
    },
    /**
     * input 失去焦点后将 input 的输入内容给到cover-view
     */
    blurInput(e) {
      let that = this;
      this.inputModel = e.detail.value;
      if (this.inputModel !== '') {
        that.inputFocus = true;
        if (!that.inputFocus) {
          return
        }
        that.inputFocus = false;
        setTimeout(() => {
          let myAmapFun = new amapFile.AMapWX({key: '928d7ec62845e85801e2ebea80a36194'});
          let longitude = that.lie.longitude;
          let latitude = that.lie.latitude;
          myAmapFun.getInputtips({
              keywords: that.inputModel,
            // querytypes: types,
            // location:`${longitude},${latitude}`,
            success: function (data) {
              //成功回调
              console.log(data)
              that.poiList = data;
              that.visibal = true;
              if (that.inputModel === '') {
                that.visibal = false;
              }
            },
            fail: function (info) {
              //失败回调
              console.log(info)
              uni.showToast({
                title: '获取定位失败',
                icon: 'none',
                duration: 3000
              })
            }
          })
          that.inputFocus = true;
        }, 1000)
      } else {
        this.inputFocus = false;
        that.visibal = false;
      }
    },
    selectItem: function (k) {
      let params = this.poiList.tips[k];
        console.log('selectItem', params);
      params.longitude = this.poiList.tips[k].location.split(',')[0];
      params.latitude = this.poiList.tips[k].location.split(',')[1];
      this.lie.longitude = params.longitude;
      this.lie.latitude = params.latitude;
      this.longitude = params.longitude;
      this.latitude = params.latitude;
      this.getLieData(params);
      this.visibal = false;
    },
    submit: function () {
      let obj = {
        desc: this.description,
        province: this.province,
        city: this.city,
        area: this.township,
        lie: this.lie
      }

      if (this.type === 'edit') {
        this.editorData.desc = this.description;
        this.editorData.province = this.province;
        this.editorData.city = this.city;
        this.editorData.area = this.township;
        this.$store.commit('users/setEditorData',this.editorData);
      }

      if (this.province !== '' && this.city !== '' && this.township !== '') {
        uni.redirectTo({
          url: '/pages/addAddress/addAddress?type='+ this.type +'&obj=' + JSON.stringify(obj)
        })
      }
    },
  }
}
</script>

<style lang="less" scoped>
@item: {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pageMap {
  width: 100%;
  height: 100%;
  position: relative;

  .head {
    width: 100%;
    height: 5rem;
    display: flex;
	position: fixed;
	top: 0;
	z-index: 10;
  }
.serch {
	  position: absolute;
      width: 100%;
      height: 88upx;
      @item();
      top: 15%;
	  left:0;

      .serchInput {
        width: 710upx;
        height: 100%;
        background: #FFFFFF;
        box-shadow: 1upx 6upx 12upx 1upx rgba(155, 155, 155, 0.12);
        border-radius: 44upx;
        @item();
        justify-content: flex-start;

        .cover-image {
          width: 70upx;
          height: 56upx;
          margin-left: 44upx;
        }
		.input{
			padding-left: 32upx;
			color: #343434;
			font-size: 28upx;
      width: 100%;
		}
      }
    }
  #container {
    width: 100%;
    .cover-views {
      width: 70upx;
      height: 70upx;
      background-image: url("https://admin.dajxyl.com/oss?path=img/dingweiditu@2x.png");
      background-size: 100% 100%;
      background-position: center center;
      position: absolute;
      bottom: 50%;
      left: 50%;
	  z-index: 999;
    }

    .addressDetail {
      width: 100%;
      height: 214upx;
      @item();
      position: fixed;
      bottom: 7.3875rem;

      .addressDetail_content {
        width: 710upx;
        height: 214upx;
        background: #FFFFFF;
        box-shadow: 0.5rem 0.5rem 0.5rem 0.5rem rgba(155, 155, 155, 0.12);
        border-radius: 0.5rem;
        display: flex;
		align-items: center;
        flex-wrap: wrap;

        .addressDetail_content_h4 {
		  margin-top: 31upx;
		  margin-left: 20px;
          width: 670upx;
          font-size: 26upx;
          font-family: PingFang SC;
          color: #666666;
          @item();
          align-items: flex-end;
          justify-content: flex-start;
        }

        .addressDetail_content_p {
			margin-top: 17upx;
			margin-bottom: 31upx;
			margin-left: 20upx;
          width: 670upx;
          height: 110upx;
          background: rgba(253, 118, 0, 0.1);
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          flex-wrap: wrap;

          .p {
			width: 100%;
            font-size: 28upx;
            font-family: PingFang SC;
            font-weight: 400;
            color: #343434;
            //cover-view标签内容换行
            word-break: break-all;
            word-wrap: break-word;
            white-space: pre-line;
            padding: 21upx 12upx;
          }
        }
      }
    }

    .poiList {
      width: 100%;
      max-height: 520upx;
      position: absolute;
      top: 15%;
      border-radius: 10upx;
      @item();
      // flex-wrap: wrap;
      .views {
        width: 710upx;
		height: 100%;
        @item();
        flex-wrap: wrap;
        overflow-y: scroll;
		background: rgba(255, 255, 255, .9);
		z-index: 99999;
        .poiList_item {
          width: 670upx;
          height: 128upx;
		  border-bottom: 1upx solid rgba(154, 154, 154, 0.2);
		  .poiList_item--name{
			  margin-top: 29rpx;
			  color: #343434;
			  font-size: 28upx;
		  }
		  .poiList_item--address{
			  margin-top: 17rpx;
			  color: #666666;
			  font-size: 26upx;
		  }
        }
      }

    }

    .btn {
      width: 100%;
      height: 4.44rem;
      background: #FFFFFF;
      box-shadow: 0.5rem 0.5rem 0rem 0rem rgba(154, 154, 154, 0.2);
      @item();
      position: absolute;
      bottom: 0;

      button {
        width: 94%;
        height: 2.875rem;
        background: #fd7600;
        border-radius: 1.5rem;
        font-size: 1.065rem;
        color: #FFFFFF;
      }
    }
  }
}
</style>
