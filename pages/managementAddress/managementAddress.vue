<!--地址管理-->
<template>
  <view class="managementAddress" :class="{'global-page': isIPX }">
    <uni-nav-bar status-bar :title="title"></uni-nav-bar>
    <view class="address_content">
      <view class="address_content_list" v-for="(i,k) in addressList" :key="k">
        <view class="content_list_left" @click="delOneAddress(k)">
          <view class="list_left_top" @click="select(k)">
            <h4 class="address-name">{{ i.name }}</h4>
            <p class="address-phone">{{ i.tel }}</p>
          </view>
          <view class="list_left_bottom" @click="select(k)">
            <h4 class="address-detail-desc">{{ i.desc + i.doorplate }}</h4>
          </view>
        </view>
        <view class="content_list_right">
          <view class="list_right_left" @click="changeSet(k)">
            <radio class="set-default-icon" :checked="i.check" color="#fd7600"/>
            <p class="set-default-text" :class="{'active-set-default-text': i.check}">{{ default_set }}</p>
          </view>
          <view class="list_right_right">
            <view class="editor" @click="editAddress(k)">
              <image class="edit-icon" src="https://admin.dajxyl.com/oss?path=img/write_origin.svg" mode=""></image>
              <p class="edit-text" :class="{'active-edit-text': i.check}">编辑</p>
            </view>
            <view class="delet" @click="deleteAddress(k)">
              <image class="edit-icon" src="https://admin.dajxyl.com/oss?path=img/delet_origin.svg" mode=""></image>
              <p class="edit-text" :class="{'active-edit-text': i.check}">删除</p>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="addAddress">
      <button type="primary" @click="addAddress">添加地址</button>
    </view>
  </view>
</template>

<script>
import {getAddressList, sefDefaultAddress, deleteAddress} from '../../api/index.js';
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import {mapState, mapMutations} from 'vuex';
import { mapArr } from '../../service.js';

export default {
  components: {
    uniNavBar,
  },
  data() {
    return {
      title: '地址管理',
      addressList: [],
      default_set: '设为默认',
      type: null,
      isIPX:this.$isIPX,
    }
  },
  onShow(){
    if (this.addressType === 'cashier') {
      this.type = 'cashier'
    }
    // 获取地址列表
    if (this.addressType === 'onload') {
      this.getAddressList();
    }
  },
  onLoad(option){
    if (option.type === 'cashier'){
      this.type = 'cashier';
    }
    if (option.type === 'shop') {
      this.type = 'shop';
    }
    if (option.type === 'onload') {
      this.getAddressList();
    }
  },
  mounted() {
    this.getAddressList();
  },
  computed: {
    ...mapState('users', {
      'editorData': 'editorData',
      'addressDataSingle': 'addressDataSingle',
    }),
    ...mapState(['addressType']),
  },
  methods: {
    ...mapMutations('users', {
      'setEditorData': 'setEditorData',
      'setAddressData': 'setAddressData',
    }),
    ...mapMutations('orders', {
      'setShopSelectAddress': 'setShopSelectAddress',
    }),
    /**
     * 获取地址列表
     */
    getAddressList: function (e) {
      let that = this;
      let arr = [];
      let res = getAddressList();
      res.then(function (e) {
        if (e.data.data.info.length > 0) {
          arr = e.data.data.info;
          arr.map((item, index) => {
            if (item.is_default === '1') {
              Object.assign(item, {check: true});
            }
            if (item.is_default === '0') {
              Object.assign(item, {check: false});
            }
          })
          that.addressList = arr;
        } else {
          that.addressList = [];
          uni.showToast({
            title: '暂无地址数据',
            icon: 'none',
            duration: 3000
          })
        }
      });
    },
    /**
     * @description 点击获取地址列表中单条地址数据 点击保存在vuex中供其他页面使用
     * @param {num} k
     * **/
    delOneAddress: function (k) {
      if (this.type === 'cashier') {
        console.log(this.addressList[k]);
        this.setAddressData(this.addressList[k]);
        return uni.navigateBack({
          delta: 1,
          animationType: 'pop-out',
          animationDuration: 200
        });
      }
    },
    /**
     * 点击编辑选择单条地址并保存在vuex中
     * @param {num} k
     * **/
    editAddress: function (k) {
      console.log(this.addressList[k]);
      this.setEditorData(this.addressList[k]);
      return uni.navigateTo({
        url: '/pages/addAddress/addAddress?type=edit'
      })
    },
    /**
     * 点击删除选择单条地址并获取k值
     * @param {num} k
     * **/
    deleteAddress: function (k) {
      console.log(this.addressList[k]);
      let that = this;
      uni.showModal({
        title: '提示',
        content: '是否确认删除',
        success: function (res) {
          if (res.confirm) {
            that.deleteAdd(that.addressList[k].id);
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });

    },
    deleteAdd: async function (val) {
      let that = this;
      let res = deleteAddress(val);
      res.then(function (e) {
        console.log(e);
        that.getAddressList();
      });
    },
    /**
     * 是否设置为默认地址
     * @param {num} k
     * **/
    changeSet: function (k) {
      let that = this;
      mapArr(this.addressList);
      this.addressList[k].check = !this.addressList[k].check;
      // 设置默认地址
      let res = sefDefaultAddress(this.addressList[k].id);
      res.then((e) => {
        return that.getAddressList();
        // console.log(e);
      });
    },
    select(k){
      if (this.type === 'shop') {
        this.$store.commit('orders/setShopSelectAddress', this.addressList[k]);
        return uni.navigateBack({
          delta: 1,
          animationType: 'pop-out',
          animationDuration: 200
        });
      }
    },
    /*点击跳转至添加服务地址页面*/
    addAddress: function () {
      this.$store.commit('users/setEditorData', null);
      uni.navigateTo({
        url: '/pages/addAddress/addAddress?type=add'
      })
    },
  }
}
</script>

<style lang="less" scoped>
@item: {
  display: flex;
  align-items: center;
  justify-content: center;
}

.managementAddress {
  width: 100%;
  min-height: 100%;

  .head {
    width: 100%;
    height: 5rem;
    display: flex;
	position: fixed;
	top: 0;
	z-index: 10;
  }

  .address_content {
    width: 100%;
    height: 100%;
    padding-bottom: 200upx;
    .address_content_list {
      width: 100%;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 24upx;
      background: #FFFFFF;

      .content_list_left {
        width: 710upx;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        border-bottom: 1px solid rgba(154, 154, 154, .2);

        .list_left_top {
          width: 100%;
          display: flex;
          margin-top: 46upx;
		  .address-name{
			  color: #343434;
			  font-size: 30upx;
		  }
		  .address-phone{
			  margin-left: 25upx;
			  font-size: 28upx;
			  color: #666666;
		  }
        }
		.list_left_bottom{
			padding-bottom: 47upx;
			.address-detail-desc{
						  margin-top: 38upx;
						  font-size: 28upx;
						  color: #343434;
			}
		}
      }

      .content_list_right {
        width: 710upx;
        @item();
		height: 90upx;

        .list_right_left {
          width: 50%;
          height: 100%;
          @item();
          justify-content: flex-start;
        }
			.set-default-icon{
				transform:scale(0.7);
			}
			.set-default-text{
				color: #9A9A9A;
				font-size: 26upx;
			}
			.active-set-default-text{
				color: #fd7600;
			}
        .list_right_right {
          width: 50%;
          height: 100%;
          @item();
          justify-content: flex-end;
          .editor {
            width: 50%;
            height: 100%;
            @item();
            justify-content: flex-end;
          }
		  .edit-icon{
			  width: 30upx;
			  height: 30upx;
		  }
		  .edit-text{
			  color: #9A9A9A;
			  font-size: 26upx;
		  }
		  .active-edit-text{
			  color: #fd7600;
		  }

          .delet {
            width: 50%;
            height: 100%;
            @item();
            justify-content: flex-end;
          }
        }

      }
    }
  }

  .addAddress {
    width: 100%;
    height: 92upx;
    position: fixed;
    bottom: 83upx;
    button {
      width: 664upx;
      height: 100%;
      background: #fd7600;
      border-radius: 46upx;
    }
  }
}
</style>
