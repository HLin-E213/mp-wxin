<!--添加服务地址-->
<template>
  <view class="addAddress" :class="{'global-page': isIPX }">
    <uni-nav-bar status-bar :title="title"></uni-nav-bar>
    <!--地址内容-->
    <view class="addAddress_content">
      <view class="first_col">
        <view class="first_col_left">
          <h4>姓</h4>
          <h4>名</h4>
        </view>
        <view class="first_col_right">
          <input type="text" value="" placeholder-style="color:#9A9A9A" v-model="name" placeholder="请输入用户姓名"/>
        </view>
      </view>
      <view class="first_col">
        <view class="first_col_left">
          <h4>手机号码</h4>
        </view>
        <view class="first_col_right">
          <input type="number" maxlength="11" placeholder-style="color:#9A9A9A" value="" v-model="phone" placeholder="请填写手机号码"/>
        </view>
      </view>
      <view class="first_col">
        <view class="first_col_left">
          <h4>地址</h4>
        </view>
        <view class="first_col_right" @click="choiceRegion">
          <p :style="regionStyle">{{ addressDetail }}</p>
          <view class="img">
            <image src="https://admin.dajxyl.com/oss?path=img/fanhui_yuyue3@2x(1).png" mode=""></image>
          </view>
        </view>
      </view>
      <view class="first_col">
        <view class="first_col_left">
          <h4>详细地址</h4>
        </view>
        <view class="first_col_right">
          <input class="view-text"
                 type="text"
                 value=""
                 maxlength="50"
                 placeholder-style="color:#9A9A9A"
                 v-model="doorplate"
                 placeholder="街道、楼牌号等">
        </view>
      </view>
      <view class="five_col">
        <view class="five_col_left">
          <h4>设置为默认地址</h4>
          <span>提醒：每次下单会默认推荐使用该地址</span>
        </view>
        <view class="five_col_right">
          <switch color="#fd7600" @change="switch1Change"/>
        </view>
      </view>
    </view>
    <!--确认提交按钮-->
    <view class="addAddress_btn" :style="isIPX? 'padding-bottom: 38rpx;': ''">
      <button type="primary" :style="btnStyle" @click="saveData">保存</button>
    </view>
  </view>
</template>
<script>
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import {mapState, mapMutations} from 'vuex';
import {addAddress, sefDefaultAddress, editAddress} from '../../api/index.js';

export default {
  components: {
    uniNavBar
  },
  data() {
    return {
      title: '添加服务地址',
      name: '',
      phone: '',
      addressDetail: '',
      doorplate: '',
      region: '请选择区域',
      defaultValue: false,
      addressSelected: null,
      type: 'add',
        isIPX:this.$isIPX,
    }
  },
  computed: {
    ...mapState('users', {
      'editorData': 'editorData',
    }),
    regionStyle() {
      return this.editorData == null ? 'color:#9A9A9A;' : ''
    },
    btnStyle() {
      return this.editorData == null && this.addressSelected == null ? 'color:#9A9A9A;background:#EEEEEE;' : ''
    }
  },
  mounted() {
    if (this.editorData !== null) {
      this.name = this.editorData.name;
      this.phone = this.editorData.tel;
      this.addressDetail = this.editorData.desc;
      this.doorplate = this.editorData.doorplate;
      if (this.editorData.area) {
        this.region = this.editorData.province + this.editorData.city + this.editorData.area;
      } else if (this.editorData.province && this.editorData.city) {
        this.region = this.editorData.province + this.editorData.city;
      }
      if (this.editorData.is_default == 1) {
        this.defaultValue = true;
      }
    }
  },
  onLoad(option) {
    if (option.obj) {
      console.log(JSON.parse(option.obj))
      if (JSON.parse(option.obj)) {
        this.addressSelected = JSON.parse(option.obj);
        this.region = this.addressSelected.province + this.addressSelected.city + this.addressSelected.area;
        this.addressDetail = this.addressSelected.desc;
        console.log(this.region);
      }
    }

    if (option.type === 'edit') {
      this.type = 'edit';
      this.title = '编辑服务地址';
    }

    if (option.type === 'add') {
      this.type = 'add';
      this.title = '添加服务地址';
    }

  },
  methods: {
    /*checked 改变时触发 change 事件，event.detail={ value:checked}*/
    switch1Change: function (e) {
      console.log(e.detail.value)
      this.defaultValue = e.detail.value;
    },
    /*点击跳转到地图页*/
    choiceRegion: function () {
      if (this.type === 'add') {
        this.$store.commit('users/setEditorData',{name: this.name,tel: this.phone});
      }

      return uni.redirectTo({
        url: '/pages/pageMap/pageMap?type=' + this.type
      })
    },
    //保存点击事件
    saveData: async function () {
      let that = this;
      let cityCode = uni.getStorageSync('cityCode');
      if (this.name === '' ||
          this.phone === '' ||
          this.addressDetail === '' ||
          this.region === ''
      ) {
        return uni.showToast({
          title: '信息不完整',
          icon: 'none',
          duration: 3000
        })
      }
      if (this.phone.slice(0, 1) !== '1') {
        uni.showToast({
          title: '电话号码不正确',
          icon: 'none',
          duration: 3000
        })
      }
      if (this.type === 'add') {
        if (this.addressSelected.city.length === 0) {
          this.addressSelected.city = this.addressSelected.province;
        }
        let res = await addAddress(
            this.name,
            cityCode.key,
            this.addressSelected.desc,
            this.doorplate,
            this.phone,
            this.addressSelected.province,
            this.addressSelected.city,
            this.addressSelected.area,
            this.addressSelected.lie.longitude,
            this.addressSelected.lie.latitude,
        );
        let addressId = res.data.data.info;
        if (that.defaultValue) {
          let result = await sefDefaultAddress(addressId);
          // console.log(result);
          uni.showToast({
            title: '操作成功',
            icon: 'loading',
            duration: 3000
          })
        }
      }
      if (this.type === 'edit') {
        let res = await editAddress(
            this.editorData.id,
            this.name,
            cityCode.key,
            this.addressSelected ? this.addressSelected.desc : this.addressDetail,
            this.doorplate,
            this.phone,
            this.addressSelected ? this.addressSelected.province : this.editorData.province,
            this.addressSelected ? this.addressSelected.city : this.editorData.city,
            this.addressSelected ? this.addressSelected.area : this.editorData.area,
            this.addressSelected ? this.addressSelected.lie.longitude : this.editorData.lng,
            this.addressSelected ? this.addressSelected.lie.latitude : this.editorData.lat,
            this.defaultValue ? '1' : '0'
        );
        console.log(res);
        uni.showToast({
          title: '操作成功',
          icon: 'loading',
        })
      }
      this.$store.commit('setAddressType','onload');
      return uni.navigateBack({
        delta: 1
      })
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

.view-text{
  display: inline-block;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow:ellipsis;
}

.addAddress {
  width: 100%;
  height: 100%;

  .head {
    width: 100%;
    height: 5rem;
    display: flex;
	position: fixed;
	top: 0;
	z-index: 10;
  }

  .addAddress_content {
    width: 100%;
    height: 20.345rem;
    background: #FFFFFF;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .first_col {
      width: 94%;
      height: 3.72rem;
      display: flex;
      border-bottom: 1px solid rgba(154, 154, 154,.2);

      .first_col_left {
        width: 30%;
        height: 100%;
        display: flex;

        h4 {
          width: 100%;
          height: 100%;
          justify-content: ;
          font-size: 0.94rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: #343434;
          @item();
          justify-content: space-between;
        }
      }

      .first_col_right {
        width: 70%;
        height: 100%;
        @item();
        justify-content: flex-start;
        flex-wrap: wrap;
		input{
			font-size: 28upx;
		}
        p {
          width: 80%;
          // height: 0.815rem;
          font-size: 0.875rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: #343434;
          @item();
          justify-content: flex-start;
          flex-wrap: wrap;
        }

        .img {
          width: 20%;
          height: 100%;
          @item();
          justify-content: flex-end;

          image {
            width: 0.5rem;
            height: 0.815rem;
          }
        }
      }
    }

    .five_col {
      width: 94%;
      height: 3.72rem;
      display: flex;

      .five_col_left {
        width: 70%;
        height: 100%;
        @item();
        justify-content: flex-start;
        flex-wrap: wrap;

        h4 {
          width: 100%;
          height: 0.91rem;
          font-size: 0.94rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: #343434;
        }

        span {
          width: 100%;
          height: 0.72rem;
          font-size: 0.75rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: #9A9A9A;
        }
      }

      .five_col_right {
        width: 30%;
        height: 100%;
        @item();
        justify-content: flex-end;

        switch {
          color: #408CFF;
        }
      }
    }
  }

  .addAddress_btn {
    width: 100%;
    height: 4.44rem;
    background: #FFFFFF;
    box-shadow: 1rem 1rem 0rem 0rem rgba(154, 154, 154, 0.2);
    @item();
    position: fixed;
    bottom: 0;

    button {
      width: 88%;
      height: 2.875rem;
      background: #fd7600;
      border-radius: 1.5rem;
      @item();
      font-size: 1.065rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
    }
  }
}
</style>
