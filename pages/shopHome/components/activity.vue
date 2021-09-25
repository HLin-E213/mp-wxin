<template>
	<view class="activity">
		<view class="act-content">
			<swiper
				class="swiper"
				circular
				:autoplay="autoplay"
				:interval="interval"
				:duration="duration"
				:previous-margin="previous_margin"
				:next-margin="next_margin"
				:style="{ height: height }"
			>
				<swiper-item v-for="(item, k) in lists" :key="k">
					<view style="display: flex;">
						<view class="category-box" :class="{boc: promotionList.length > 1}" v-for="(e, i) in item" :key="i">
							<view class="act-title" >
								<view class="tit-left" v-if="promotionList.length > 1">限时抢购</view>
								<view class="tit-right"
								 :style="{'justify-content': promotionList.length>1?'flex-end':'flex-start'}">
									<view>{{ e.name }}-{{promotionList.length}}</view>
									<view class="price-intro">{{ e.subtitle }}</view>
								</view>
							</view>
						
							
								<view class="preview-img">
									<image
										class="preview-img"
										:src="e && e.product_promotion_category_image"
										mode=""
										@click="gotoInfo(e)"
										v-if="e && e.product_promotion_category_image"
									></image>
								</view>
							
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
export default {
	name: 'activity',
	props: {
		promotionList: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			height: '340rpx',
			indicatorDots: true,
			autoplay: true,
			interval: 500000,
			duration: 1000,
			previous_margin: '0',
			next_margin: '0'
		};
	},
	computed: {
		lists() {
			let arr = [];
			// 赋值给另一个数组
			let newarr = arr.concat(this.promotionList);
			// 处理新数组，原数组不变
			// 打印结果
			let len = newarr.length;
			let n = 2;
			let num = len % 2 === 0 ? len / 2 : Math.ceil(len / 2);
			let arr2 = [];
			for (let i = 0; i < num; i++) {
				let temp = newarr.slice(i * n, i * n + n);
				arr2.push(temp);
			}
			console.log('arr2arr2arr2arr2arr2z', arr2);
			return arr2;
		}
	},
	methods: {
		gotoInfo(obj) {
			this.$emit('toCategoty', obj);
		}
	}
};
</script>

<style lang="scss" scoped>
.activity {
	margin: 16rpx;
	padding: 26rpx;
	background-color: #ffecec;
	border-radius: 10rpx;

	.act-content {
		width: 100%;
		height: 100%;
	}
}
.category-box {
	// display: flex;
	// justify-content: space-around;
	width: 100%;
	height: 100%;
	.act-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 34rpx;
		padding-bottom: 20rpx;
		width: 100%;
		.tit-left{
			flex: 1;
		}
		.tit-right {
			flex: 2;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			.price-intro {
				max-width: 270rpx;
				min-width: 100rpx;
				color: #ffffff;
				text-align: center;
				padding: 10rpx;
				background: #fd7c09;
				font-size: 24rpx;
				border-top-left-radius: 30rpx;
				border-bottom-right-radius: 30rpx;
				margin-left: 10rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;				
			}
		}
	}
	
}
.boc {
		width: calc(50% - 13rpx);
	}
.preview-img {
	width: 100%;
	height: 220rpx;
	border-radius: 10rpx;
}
</style>
