<template>
	<view class="uni-navbar">
		<view
				:class="{
				 'uni-navbar--fixed': fixed,
				  'uni-navbar--shadow': shadow,
				   'uni-navbar--border': border,
				    'navbar-background--img': showBackGroundImg,
				      'navbar-background--img2': isIPX,
				     }"
				:style="{ 'background': showBackGroundImg ? '' : backgroundColor, 'background-image': showBackGroundImg && navBarBackgroundImg ? `url(${navBarBackgroundImg})` : ''}"
		 class="uni-navbar__content">
			<uni-status-bar v-if="statusBar" />
			<view :style="{ color: fontColor, backgroundColor: showBackGroundImg ? '' : backgroundColor }" class="uni-navbar__header uni-navbar__content_view">
				<view @tap="backPages()" class="uni-navbar__header-btns uni-navbar__header-btns-left uni-navbar__content_view">
					<view class="uni-navbar__content_view" v-if="showBcakImg">
						<image v-if="!showBackGroundImg" class="uni-icons" src="https://admin.dajxyl.com/oss?path=img/back@2x.png" mode=""></image>
						<image v-else class="uni-icons" src="https://admin.dajxyl.com/oss?path=img/fanhui@2x.png" mode=""></image>
					</view>
					<view :class="{ 'uni-navbar-btn-icon-left': !leftIcon.length }" class="uni-navbar-btn-text uni-navbar__content_view"
					 v-if="leftText.length">
						<text :style="{ color: fontColor, fontSize: '14px' }">{{ leftText }}</text>
					</view>
					<slot name="left" />
				</view>
				<view class="uni-navbar__header-container uni-navbar__content_view">
					<view class="uni-navbar__header-container-inner uni-navbar__content_view" v-if="title.length">
						<text class="uni-nav-bar-text" :style="{color: fontColor }">{{ title }}</text>
					</view>
					<!-- 标题插槽 -->
					<slot name="title" />
				</view>
				<view :class="title.length ? 'uni-navbar__header-btns-right' : ''" @tap="onClickRight" class="uni-navbar__header-btns uni-navbar__content_view">
					<view class="uni-navbar__content_view" v-if="rightIcon.length">
						<uni-icons :color="fontColor" :type="rightIcon" size="24" />
					</view>
					<!-- 优先显示图标 -->
					<view class="uni-navbar-btn-text uni-navbar__content_view" v-if="rightText.length && !rightIcon.length">
						<text class="uni-nav-bar-right-text">{{ rightText }}</text>
					</view>
					<slot name="right" />
				</view>
			</view>
		</view>
		<view class="uni-navbar__placeholder" v-if="fixed">
			<uni-status-bar v-if="statusBar" />
			<view class="uni-navbar__placeholder-view" />
		</view>
	</view>
</template>

<script>
	import uniStatusBar from "../uni-status-bar/uni-status-bar.vue";
	import uniIcons from "../uni-icons/uni-icons.vue";

	export default {
		name: "UniNavBar",
		components: {
			uniStatusBar,
			uniIcons
		},
		props: {
			title: {
				type: String,
				default: ""
			},
			leftText: {
				type: String,
				default: ""
			},
			rightText: {
				type: String,
				default: ""
			},
			leftIcon: {
				type: String,
				default: ""
			},
			showBackGroundImg: {
				type: [Boolean, String],
				default: false
			},
			showBcakImg: {
				type: [Boolean, String],
				default: true
			},
			rightIcon: {
				type: String,
				default: ""
			},
			fixed: {
				type: [Boolean, String],
				default: true
			},
			backColor: {
				type: String,
				default: "black"
			},
			color: {
				type: String,
				default: "#343434"
			},
			backgroundColor: {
				type: String,
				default: "#FFFFFF"
			},
        navBarBackgroundImg: {
				type: String,
				default: ""
			},
			statusBar: {
				type: [Boolean, String],
				default: true
			},
			shadow: {
				type: [String, Boolean],
				default: false
			},
			border: {
				type: [String, Boolean],
				default: false
			},
      isNoLeft: {
        type: [String, Boolean],
        default: true
      }
		},
        mounted() {
          if(uni.report && this.title !== '') {
              uni.report('title', this.title)
          }
        },
    data: function(){
		  return {
        isIPX:this.$isIPX,
      }
    },
		computed:{
			fontColor() {
				return this.showBackGroundImg ? '#FFFFFF' : this.color;
			}
		},
		methods: {
			backPages() {
				if (this.title == '城市选择') {
					uni.switchTab({
						url:'/pages/main/main'
					})
				}else {
				  // 加了一层是否正常返回, 简单切换状态
				  if(this.isNoLeft){
            const pagesStack = getCurrentPages(); // 获取页面栈
            if (pagesStack.length > 1) return uni.navigateBack({
              delta:1
            });
            // 判断与没有tabbar。有tabbar不做处理
            if (!this.showBcakImg && !this.leftText.length) return false;
            uni.switchTab({
              url:'/pages/main/main'
            })
          }
				}
				this.$emit("clickLeft");
			},
			onClickLeft() {
				this.$emit("clickLeft");
			},
			onClickRight() {
				this.$emit("clickRight");
			}
		}
	};
</script>

<style lang="scss" scoped>
	.uni-icons{
		padding-left: 20upx;
		width: 18upx;
		height: 32upx;
	}
	$nav-height: 88upx;
	.uni-nav-bar-text {
		/* #ifdef APP-PLUS */
		font-size: 34rpx;
		/* #endif */
		/* #ifndef APP-PLUS */
		font-size: $uni-font-size-lg;
		/* #endif */
	}
	.uni-nav-bar-right-text {
		font-size: $uni-font-size-base;
	}

	.uni-navbar {
		width: 750rpx;
	}

	.uni-navbar__content {
		position: relative;
		width: 750rpx;
		background-color: $uni-bg-color;
		overflow: hidden;
	}
	.navbar-background--img{
		background-image: url(https://admin.dajxyl.com/oss?path=img/home_titleBg_origin.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}
  .navbar-background--img2{
    background-image: url(https://admin.dajxyl.com/oss?path=img/home_titleBg_origin.png);// 3x 适用于 xs x xr plus
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

	.uni-navbar__content_view {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
		flex-direction: row;
		// background-color: #FFFFFF;
	}

	.uni-navbar__header {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		width: 750rpx;
		height: $nav-height;
		line-height: $nav-height;
		font-size: 16px;
		// background-color: #ffffff;
	}

	.uni-navbar__header-btns {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-wrap: nowrap;
		width: 120rpx;
		padding: 0 6px;
		justify-content: center;
		align-items: center;
	}

	.uni-navbar__header-btns-left {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		width: 150rpx;
		justify-content: flex-start;
		height:100%;
	}

	.uni-navbar__header-btns-right {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		width: 150rpx;
		padding-right: 30rpx;
		justify-content: flex-end;
	}

	.uni-navbar__header-container {
		flex: 1;
	}

	.uni-navbar__header-container-inner {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		align-items: center;
		justify-content: center;
		font-size: $uni-font-size-base;
	}


	.uni-navbar__placeholder-view {
		height: $nav-height;
	}

	.uni-navbar--fixed {
		position: fixed;
		z-index: 998;
	}

	.uni-navbar--shadow {
		/* #ifndef APP-NVUE */
		box-shadow: 0 1px 6px #ccc;
		/* #endif */
	}

	.uni-navbar--border {
		border-bottom-width: 1rpx;
		border-bottom-style: solid;
		border-bottom-color: rgba(153, 153, 153,.2);
	}
</style>
