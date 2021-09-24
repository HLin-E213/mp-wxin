<!--白地头部组件-->
<template>
	<view class="whiteHead">
		<view class="coutom-status-bar"><!-- 这里是状态栏 --></view>
		<view class="head">
			<view class="order_head_left">
				<image @click="backPages()" src="https://admin.dajxyl.com/oss?path=img/back@2x.png" mode=""></image>
			</view>
			<view class="order_head_center">
				<p>{{title}}</p>
			</view>
			<view class="head_right">
				<image :src="rightImgUrl" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			title:{
				type:String,
				default:''
			},
			rightImgs:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return{
				rightImg:[
					{
						imgUrl:'https://admin.dajxyl.com/oss?path=img/message@2x.png',
					},
				]
			}
		},
		computed:{
			rightImgUrl(){
				return this.rightImgs?this.rightImg[0].imgUrl:''
			}
		},
		created() {
			uni.getSystemInfo().then(data => {
			  console.log(data);
			})
		},
		onLoad() {
			
		},
		methods:{
			/*左上角返回按钮事件*/
			backPages:function(){
				if (this.title == '城市选择') {
					uni.switchTab({
						url:'/pages/main/main'
					})
				} else {
					uni.navigateBack({
						delta:1
					})
				}
			},
		}
	}
</script>

<style lang="less">
	@import url('@/common/common.less');
	.coutom-status-bar {
	      height: var(--status-bar-height);
	      width: 100%;
	}
	.whiteHead{
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		z-index: 9999;
		background-color: @white;
		height: calc(88upx + var(--status-bar-height));
		.head{
			width:100%;
			height: 88upx;
			display: flex;
			align-items: center;
			background-color: @white;
			.order_head_left{
				@flex-hor-center();
				image{
					padding-left: 18upx;
					width: 18upx;
					height: 32upx;
				}
			}
			.order_head_center{
				flex: 1;
				@flex-hor-center();
				justify-content: center;
				p {
					font-size: 34upx;
					font-family: PingFang SC;
					color: @main-text-color;
				}
			}
			.head_right{
				@flex-hor-center();
				image{
					width: 34upx;
					height: 34upx;
				}
			}
		}
	}
</style>
