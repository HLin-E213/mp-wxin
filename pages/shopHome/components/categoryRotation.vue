<template>
	<view>
		<view class="uni-padding-wrap">
			<view class="page-section swiper">
				<view class="page-section-spacing">
					<swiper
						class="swiper"
						circular
						@animationfinish="swiperChange"
						:autoplay="autoplay"
						:interval="interval"
						:duration="duration"
						:previous-margin="previous_margin"
						:next-margin="next_margin"
						:style="{ height: height }"
					>
						<swiper-item v-for="(item, k) in category_lists" :key="k">
							<view class="category-box">
								<view v-for="(e, i) in item" class="boc" :key="i">
									<view class="icon"><image class="preview-img" :src="e && e.product_category_image" mode="" @click.stop="gotoInfo(e)"></image></view>
									<view class="am-text-eill">{{ e.name }}</view>
								</view>
							</view>
						</swiper-item>
					</swiper>
					<view class="dots-wrap" v-if="indicatorDots">
						<block v-for="(item, index) in category_lists" :key="index"><view class="dot" :class="{ 'dot-active': index === currentSwiper }"></view></block>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'categoryRotation',
	props: {
		ids: {
			type: Number,
			default: 0
		},
		height: '',
		list: {
			type: Array,
			default: () => {
				[];
			}
		}
	},
	data() {
		return {
			indicatorDots: true,
			autoplay: false,
			interval: 3000,
			duration: 100,
			previous_margin: '0',
			next_margin: '0',
			currentSwiper: 0
		};
	},
	watch: {
		ids: {
			handler() {
				console.log(this.ids);
			},
			immediate: true
		},
		list: {
			handler(arr) {
				this.list = arr;
			},
			immediate: true
		}
	},
	computed: {
		category_lists() {
			let arr = [];
			// 赋值给另一个数组
			let newarr = arr.concat(this.list);
			// 处理新数组，原数组不变
			// 打印结果
			let len = newarr.length;
			let n = 8;
			let num = len % 8 === 0 ? len / 8 : Math.ceil(len / 8);
			let arr2 = [];
			for (let i = 0; i < num; i++) {
				let temp = newarr.slice(i * n, i * n + n);
				arr2.push(temp);
			}
			console.log('arrrrrrr', arr2);
			return arr2;
		}
	},
	created() {},
	onLoad() {},
	methods: {
		changeIndicatorDots(e) {
			this.indicatorDots = !this.indicatorDots;
		},
		swiperChange(e) {
			this.currentSwiper = e.detail.current;
		},
		gotoInfo(obj) {
			this.$emit('categoryClick', obj);
		}
	}
};
</script>

<style>
.swiper image {
	width: 100%;
	/* position: absolute; */
	height: 100%;
	border-radius: 20rpx;
}
swiper-item {
	border-radius: 20rpx;
}
</style>
<style lang="less" scoped>
.swiper {
	height: 430rpx;
	width: 100%;
	overflow: hidden;
	transform: translateY(0);
	//.preview-img{
	//  overflow: hidden;
	//}
}
.page-section-spacing {
	position: relative;
	overflow: hidden;

	border-radius: 20rpx;
}
.dots-wrap {
	position: absolute;
	z-index: 9999;
	left: 332rpx;
	bottom: 0;
	display: flex;
	.dot {
		width: 16rpx;
		height: 6rpx;
		border-radius: 50%;
		background-color: rgba(253, 124, 9, 0.1);
		//margin-left: 5rpx;
	}
	.dot-active {
		width: 30rpx;
		height: 6rpx;
		border-radius: 3rpx;
		background: #fd7600;
	}
	.dot:nth-of-type(1) {
		margin-left: 0;
	}
}
.category-box {
	display: flex;
	flex-wrap: wrap;
	padding: 0 10rpx;
	.boc {
		width: 25%;
		background: #ffffff;
		text-align: center;
		margin: 20rpx 0;
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 500;
		color: #333333;
		.icon {
			width: 120rpx;
			height: 120rpx;
			margin: 0 auto;
			border-radius: 50%;
			margin-bottom: 10rpx;
			background-color: #eeeeee;
			image {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
	}
}
.am-text-eill {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: 24rpx;
	padding: 0 20rpx;
}
</style>
