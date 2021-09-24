<!--添加服务地址-->
<template>
  <view class="addAddress">
    <view class="head">
      <WhiteHead :title="title"></WhiteHead>
    </view>
    <map id="container" style="width:100%;height:200px;" :latitude="covers[0].latitude" :longitude="covers[0].longitude"
         :markers="covers"></map>
    <view class="editorInfo">
      <view class="editorInfo_top">
        <view class="first_col">
          <h4> 联 系 人</h4>
          <input type="text" value="" v-model="contacts" placeholder="张三"/>
        </view>
        <view class="first_col">
          <h4>联系电话</h4>
          <input type="text" value="" v-model="contactsPhone" maxlength="11" placeholder="请输入联系电话"/>
        </view>
        <view class="first_col">
          <h4>所在地区</h4>
          <view class="selectionCascade" @click="handelProvince">
            <!-- <p>{{province}}</p>
            <image src="https://admin.dajxyl.com/oss?path=img/xiala@2x.png" mode=""></image> -->
            <SelectionRegion ref="selectionRegion" :array="provinceList" :name="province"
                             @openPicker="openPicker"></SelectionRegion>
          </view>
          <view class="selectionCascade" @click="handelCity">
            <!-- <p>{{city}}</p>
            <image src="https://admin.dajxyl.com/oss?path=img/xiala@2x.png" mode=""></image> -->
            <SelectionRegion ref="selectionRegion" :array="cityList" :name="city"
                             @openPickerCity="openPicker"></SelectionRegion>
          </view>
          <view class="selectionCascade" @click="handelArea">
            <!-- <p>{{area}}</p>
            <image src="https://admin.dajxyl.com/oss?path=img/xiala@2x.png" mode=""></image> -->
            <SelectionRegion ref="selectionRegion" :array="areaList" :name="area"
                             @openPickerArea="openPicker"></SelectionRegion>
          </view>
        </view>
        <view class="first_col">
          <h4 style="margin-top:-2rem;">详细地址</h4>
          <textarea value="" v-model="addressDetail" placeholder="请输入详细街道/楼道/门牌号"/>
        </view>
      </view>
      <view class="editorInfo_bottom">
        <button type="default" @click="submit">确定</button>
      </view>
    </view>
    <!-- <view class="selectionArea">
      <SelectionRegion ref="selectionRegion" :array="array" @openPicker="openPicker"></SelectionRegion>
    </view> -->
  </view>
</template>
<script>
import WhiteHead from '../../components/whiteHead/whiteHead.vue';
import SelectionRegion from '../../components/selectionRegion/selectionRegion.vue'
import {mapState, mapMutations} from 'vuex';
import {citys} from '../../utils/citys.js';

export default {
  components: {
    WhiteHead,
    SelectionRegion,
  },
  data() {
    return {
      id: 0, // 使用 marker点击事件 需要填写id
      title: '添加服务地址',
      contacts: '',		//联系人
      contactsPhone: '',
      province: '省',
      city: '市',
      area: '区',
      addressDetail: '',
      provinceList: ['四川省', '河北省', '福建省', '海南省'],
      cityList: ['暂无'],
      areaList: ['暂无'],
      level: '',		//子组件传递的省市区级别
    }
  },
  computed: {
    ...mapState('users', {
      'editorData': 'editorData',
      'covers': 'covers',
    })
  },
  created() {
    console.log(this.editorData)
  },
  mounted() {
    this.initLocation();
    if (this.editorData !== null) {
      this.contacts = this.editorData.name;
      this.contactsPhone = this.editorData.phone;
      this.provinceList = this.editorData.province;
      this.cityList = this.editorData.city;
      this.areaList = this.editorData.area;
      this.addressDetail = this.editorData.add;
    }
    this.provinceAll();
  },
  onLoad() {

  },
  methods: {
    ...mapMutations('users', {
      'setEditorData': 'setEditorData',
    }),
    /*提交新地址*/
    // submit:function(){
    // 	this.setEditorData()
    // },
    /*获取用户当前定位*/
    initLocation: function () {
      let that = this;
      uni.getLocation({
        type: 'gcj02',
        success: function (res) {
          // console.log(res)
          that.latitude = res.latitude;
          that.longitude = res.longitude;
          that.covers[0].latitude = res.latitude;
          that.covers[0].longitude = res.longitude;
        }
      });
    },
    /*省级选择事件*/
    handelProvince: function () {
      console.log('provice')
      this.$refs.selectionRegion.openChild();
    },
    /*市级选择事件*/
    handelCity: function () {
      console.log('city')
      this.citysAll();
    },
    /*区县选择事件*/
    handelArea: function () {
      console.log('area')
    },
    /*接收子组件传递的省级数据*/
    openPicker: function (val) {
      console.log(val)
      this.level = val.level;
      this.province = val.name;
    },
    /*点击确认按钮获取地址信息*/
    submit: function () {
      if (this.contacts == '' || this.contactsPhone == '' || this.province == '' || this.city == '' || this.area == '' || this.addressDetail == '') {
        uni.showToast({
          title: '信息不完整',
          icon: 'none',
          duration: 3000
        })
      }
      console.log(this.contacts, this.contactsPhone, this.province, this.city, this.area, this.addressDetail)
    },
    /*生成全国省级数据*/
    provinceAll: function () {
      let that = this;
      let provices = [];
      citys.forEach((item, index) => {
        provices.push(item.name)
      })
      this.provinceList = provices;
    },
    /*生成全国市级数据*/
    citysAll: function () {
      let that = this;
      let city = [];
      console.log(this.province)
      // citys.forEach((item,index)=>{
      // 	city.push(item.name)
      // })
      // this.cityList = citys;
    },
    /*生成全国区级数据*/
    citysAll: function () {
      let that = this;
      let areas = [];
      citys.forEach((item, index) => {
        areas.push(item.name)
      })
      this.areaList = areas;
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

.addAddress {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  .head {
    width: 100%;
    height: 4rem;
    display: flex;
  }

  #container {
    width: 100%;
    min-height: 11.25rem;
  }

  .editorInfo {
    width: 100%;
    height: 20.78rem;
    background: rgba(255, 255, 255, 1);
    border-radius: 0.5rem;
    display: flex;
    justify-content: center;

    .editorInfo_top {
      width: 88.5%;
      height: 5rem;

      .first_col {
        width: 100%;
        height: 2.25rem;
        @item();
        // flex-wrap: wrap;
        margin-top: 1rem;
        justify-content: space-around;

        h4 {
          // width:3.59rem;
          width: 25%;
          height: 0.905rem;
          font-size: 0.905rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
        }

        input {
          // width:15rem;
          width: 70%;
          height: 2.25rem;
          border: 1px solid rgba(153, 153, 153, 1);
          opacity: 0.2;
          border-radius: 0rem;
          padding: 0 0 0 0.5rem;
        }

        textarea {
          width: 70%;
          height: 3.81rem;
          border: 1px solid rgba(153, 153, 153, 1);
          opacity: 0.2;
          border-radius: 0rem;
          padding: 0 0 0 0.5rem;
          margin-top: 0.5rem;
        }

        .selectionCascade {
          // width:4.625rem;
          width: 23%;
          height: 2.25rem;
          border: 1px solid rgba(153, 153, 153, 1);
          opacity: 0.2;
          border-radius: 0rem;
          @item();
          justify-content: space-around;

          p {
            width: 0.75rem;
            height: 0.78rem;
            font-size: 0.81rem;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
          }

          image {
            width: 0.625rem;
            height: 0.625rem;
            margin-top: 0.4rem;
          }
        }
      }
    }

    .editorInfo_bottom {
      width: 100%;
      height: 5.15rem;
      position: fixed;
      // bottom: 1.34rem;
      bottom: 0rem;
      @item();

      button {
        width: 88.5%;
        height: 2.875rem;
        background: #fd7600;
        border-radius: 1.4375rem;
        color: rgba(255, 255, 255, 1);
      }
    }
  }

  .selectionArea {
    width: 100%;
    height: 5rem;
    z-index: 10;
  }
}
</style>
