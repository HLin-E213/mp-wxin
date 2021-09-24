<!--查看服务人员-->
<template>
  <view class="servicesView">
    <view class="head">
      <WhiteHead :title="title"></WhiteHead>
    </view>
    <view class="servicesView_picture" @click="seePicture">
      <image :src="img_server" mode=""></image>
      <view class="description">
        <view class="left">
          <view class="top">
            <h4>王建国</h4>
            <p>41岁</p>
          </view>
          <view class="bottom">
            <p>成都市家美家政有限公司</p>
          </view>
        </view>
        <view class="right">
          <view class="right_top">
            <h4>30</h4>
          </view>
          <view class="right_bottom">
            <p>完成单量</p>
          </view>
        </view>
      </view>
    </view>
    <view class="servicesView_tag">
      <view class="servicesView_tag_title">
        <b></b>
        <p>个人标签</p>
      </view>
      <view class="servicesView_tag_content">
        <view class="servicesView_tag_content_list" v-for="(i,k) in tagList" :key="k">
          <p>擅长推拿</p>
        </view>
      </view>
    </view>
    <view class="servicesView_comment">
      <view class="servicesView_comment_title">
        <b></b>
        <p>用户评论</p>
      </view>
      <view class="servicesView_comment_content">
        <view class="servicesView_comment_content_list" v-for="(i,k) in commentList" :key="k">
          <view class="first_col">
            <view class="first_col_left">
              <h4>家政保洁1小时</h4>
            </view>
            <view class="first_col_right">
              <span>2020-08-08</span>
            </view>
          </view>
          <view class="second_col">
            <p>这个阿姨来的有点晚，晚了半个小时，没有提前给我打电话，不是太满意。</p>
          </view>
          <view class="third_col" :style="imgList.length == 0?'display:none':''">
            <view class="imgList" :style="imgStyle" v-for="(i,k) in imgList" :key="k">
              <image src="https://admin.dajxyl.com/oss?path=img/shape2.png" mode=""></image>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="moreData">
      <p>点击加载更多数据</p>
      <image src="https://admin.dajxyl.com/oss?path=img/fanhuipinglun3@2x.png" mode=""></image>
    </view>
  </view>
</template>

<script>
import WhiteHead from '../../components/whiteHead/whiteHead.vue';
import {mapState, mapMutations} from 'vuex';

export default {
  components: {
    WhiteHead,
  },
  data() {
    return {
      title: '查看服务人员',
      img_server: 'https://admin.dajxyl.com/oss?path=img/shape.png',
      tagList: [{}, {}, {}, {}],
      commentList: [{}, {}],
      imgList: [{}, {}, {}, {}],
    }
  },
  computed: {
    ...mapState('server', {
      'imgUrl': 'imgUrl',
    }),
    imgStyle() {
      if (this.imgList.length == 1) {
        return this.imgList.length == 1 ? 'width:80%;height: 10rem;margin-left:10%' : '';
      }
      return this.imgList.length >= 3 ? 'margin:0.315rem 0 0 0.75rem;' : 'width:45%;height: 6.565rem;margin-left:0.75rem'
    }
  },
  methods: {
    ...mapMutations('server', {
      'setImgurl': 'setImgurl',
    }),
    /**
     * 点击服务人员头像跳转到查看大图界面
     * @param { string } imgurl
     * **/
    seePicture: function () {
      // console.log(this.img_server)
      this.setImgurl(this.img_server)
      uni.navigateTo({
        url: '/pages/pictureBig/pictureBig'
      });
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

@titleItem: {
  width: 94%;
  height: 3.065rem;
  display: flex;
  align-items: center;
  justify-content: center;
  justify-content: flex-start;
  b {
    width: 0.19rem;
    height: 1rem;
    background: #fd7600;
    border-radius: 0.5rem;
  }
  p {
    // width:4.44rem;
    // height:1.065rem;
    font-size: 1.125rem;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(52, 52, 52, 1);
    // margin-left: 0.035rem;
    margin-left: 0.3rem;
  }
}

.servicesView {
  width: 100%;
  height: 100%;
  @item();
  flex-wrap: wrap;
  background: #FFFFFF;

  .head {
    width: 100%;
    height: 5rem;
    display: flex;
	position: fixed;
	top: 0;
	z-index: 10;
  }

  .servicesView_picture {
    width: 100%;
    height: 15.97rem;
    border-radius: 0rem 0rem 2rem 2rem;
    @item();
    flex-wrap: wrap;
    align-items: flex-end;
	margin-top: 5rem;
    image {
      width: 100%;
      height: 100%;
    }

    .description {
      width: 100%;
      height: 3.75rem;
      border-radius: 1.875rem;
      position: absolute;
      @item();
      flex-wrap: wrap;
      // background: #999999;
      // opacity: 0.2;
      background: rgba(153, 153, 153, 0.2);

      .left {
        width: 70%;
        height: 100%;
        @item();
        flex-wrap: wrap;

        .top {
          width: 100%;
          height: 50%;
          @item();

          h4 {
            // width:2.69rem;
            height: 0.91rem;
            font-size: 0.94rem;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(52, 52, 52, 1);
          }

          p {
            // width:1.75rem;
            height: 0.91rem;
            font-size: 0.94rem;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(52, 52, 52, 1);
          }
        }

        .bottom {
          width: 100%;
          height: 50%;
          @item();

          p {
            // width:8.815rem;
            height: 0.785rem;
            font-size: 0.815rem;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(52, 52, 52, 1);
          }
        }
      }

      .right {
        width: 30%;
        height: 100%;
        @item();
        flex-wrap: wrap;
        border-radius: 0 1.875rem 1.875rem 0;
        // background: #fd7600;
        background: rgba(64, 140, 255, 0.2);

        .right_top {
          width: 100%;
          // height: 50%;
          @item();
          align-items: flex-end;

          h4 {
            // width:1.22rem;
            height: 0.94rem;
            font-size: 1.315rem;
            font-family: DIN Alternate;
            font-weight: bold;
            color: rgba(255, 255, 255, 1);
          }
        }

        .right_bottom {
          width: 100%;
          // height: 50%;
          @item();
          align-items: flex-start;

          p {
            // width:3.44rem;
            height: 0.845rem;
            font-size: 0.875rem;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
          }
        }
      }
    }
  }

  .servicesView_tag {
    width: 100%;
    // height: 12rem;
    height: 10rem;
    @item();
    flex-wrap: wrap;
    // margin-top: 1.75rem;
    .servicesView_tag_title {
      @titleItem();
    }

    .servicesView_tag_content {
      width: 94%;
      height: 5.565rem;
      @item();
      flex-wrap: wrap;
      justify-content: space-between;

      .servicesView_tag_content_list {
        min-width: 6rem;
        height: 1.75rem;
        background: rgba(64, 140, 255, 0.2);
        border-radius: 0.5rem;
        @item();

        p {
          // width:3.19rem;
          // height:0.785rem;
          font-size: 0.815rem;
          font-family: PingFang SC;
          font-weight: 300;
          color: rgba(52, 52, 52, 1);
        }
      }
    }
  }

  .servicesView_comment {
    width: 100%;
    height: 80%;
    @item();
    flex-wrap: wrap;

    .servicesView_comment_title {
      @titleItem();
    }

    .servicesView_comment_content {
      width: 100%;
      height: 100%;
      @item();
      flex-wrap: wrap;
      margin-top: 0.625rem;

      .servicesView_comment_content_list {
        width: 94%;
        @item();
        min-height: 5.94rem;
        flex-wrap: wrap;
        margin-top: 0.75rem;
        background: rgba(242, 242, 242, 1);

        .first_col {
          width: 94%;
          height: 2.44rem;
          @item();
          flex-wrap: wrap;
          border-bottom: 1px dashed rgba(154, 154, 154, 0.2);

          .first_col_left {
            width: 50%;
            height: 100%;
            @item();
            justify-content: flex-start;

            h4 {
              // width:6.095rem;
              // height:0.91rem;
              font-size: 0.945rem;
              font-family: PingFang SC;
              font-weight: 400;
              color: rgba(52, 52, 52, 1);
            }
          }

          .first_col_right {
            width: 50%;
            height: 100%;
            @item();
            justify-content: flex-end;

            span {
              // width:4.47rem;
              // height:0.595rem;
              font-size: 0.76rem;
              font-family: PingFang SC;
              font-weight: 400;
              color: rgba(154, 154, 154, 1);
            }
          }
        }

        .second_col {
          width: 94%;
          height: 3.47rem;
          @item();

          p {
            height: 1.845rem;
            font-size: 0.815rem;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
          }
        }

        .third_col {
          width: 100%;
          height: 6.565rem;
          height: 100%;
          @item();
          justify-content: flex-start;
          flex-wrap: wrap;
          margin-top: 0.75rem;
          margin-bottom: 1rem;

          .imgList {
            width: 28%;
            height: 6.565rem;
            @item();
            // margin-left: 0.75rem;
            image {
              max-width: 100%;
              height: 100%;
              margin-top: 0.315rem;
            }
          }
        }
      }
    }
  }

  .moreData {
    width: 100%;
    height: 3rem;
    @item();

    p {
      // width:5.94rem;
      // height:0.72rem;
      font-size: 0.745rem;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(154, 154, 154, 1);
    }

    image {
      width: 0.625rem;
      height: 0.625rem;
      margin-left: 0.285rem;
    }
  }
}
</style>
