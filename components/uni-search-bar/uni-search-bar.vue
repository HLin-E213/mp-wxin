<template>
	<view class="uni-searchbar">
		<view :style="{borderRadius:radius+'px',backgroundColor: bgColor}" class="uni-searchbar__box" @click="searchClick">
			<view class="uni-searchbar__box-icon-search">
				<slot name="searchIcon">
          <text class="iconfont icon-sousuo"></text>
				</slot>
			</view>
      <swiper class="swiper"
              :interval="3000"
              style="width: 100%" :style="{height: '62rpx'}"
              :autoplay="true" vertical circular
              @click="handleClick"
              v-if="!show && !searchVal">
        <swiper-item v-for="(item, index) in historySearchList" :key="index" style="display: flex;align-items: center;">
          <text class="uni-searchbar__text-placeholder">{{ item }}</text>
        </swiper-item>
      </swiper>
			<input v-if="show || searchVal" :focus="showSync" :placeholder="placeholderText" :maxlength="maxlength" class="uni-searchbar__box-search-input"
			 confirm-type="search" type="text" v-model="searchVal" @confirm="confirm" @blur="blur" @focus="emitFocus" @click="handleClick" />
			<view v-if="show && (clearButton==='always'||clearButton==='auto'&&searchVal!=='')" class="uni-searchbar__box-icon-clear"
			 @click="clear">
				<slot name="clearIcon">
					<text class="iconfont icon-guanbi"></text>
				</slot>
			</view>
		</view>
		<text @click="cancel" class="uni-searchbar__cancel" v-if="cancelButton ==='always' || show && cancelButton ==='auto'">{{cancelTextI18n}}</text>
	</view>
</template>

<script>
	/**
	 * SearchBar 搜索栏
	 * @description 评分组件
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=866
	 * @property {Number} radius 搜索栏圆角
	 * @property {Number} maxlength 输入最大长度
	 * @property {String} placeholder 搜索栏Placeholder
	 * @property {String} clearButton = [always|auto|none] 是否显示清除按钮
	 * 	@value always 一直显示
	 * 	@value auto 输入框不为空时显示
	 * 	@value none 一直不显示
	 * @property {String} cancelButton = [always|auto|none] 是否显示取消按钮
	 * 	@value always 一直显示
	 * 	@value auto 输入框不为空时显示
	 * 	@value none 一直不显示
	 * @property {String} cancelText 取消按钮的文字
	 * @property {String} bgColor 输入框背景颜色
	 * @property {Boolean} focus 是否自动聚焦
	 * @event {Function} confirm uniSearchBar 的输入框 confirm 事件，返回参数为uniSearchBar的value，e={value:Number}
	 * @event {Function} input uniSearchBar 的 value 改变时触发事件，返回参数为uniSearchBar的value，e=value
	 * @event {Function} cancel 点击取消按钮时触发事件，返回参数为uniSearchBar的value，e={value:Number}
	 * @event {Function} clear 点击清除按钮时触发事件，返回参数为uniSearchBar的value，e={value:Number}
	 * @event {Function} blur input失去焦点时触发事件，返回参数为uniSearchBar的value，e={value:Number}
	 */

	export default {
		name: "UniSearchBar",
		emits:['input','update:modelValue','clear','cancel','confirm','blur','focus'],
		props: {
			placeholder: {
				type: String,
				default: ""
			},
			radius: {
				type: [Number, String],
				default: 5
			},
			clearButton: {
				type: String,
				default: "auto"
			},
			cancelButton: {
				type: String,
				default: "auto"
			},
			cancelText: {
				type: String,
				default: '取消'
			},
			bgColor: {
				type: String,
				default: "#F8F8F8"
			},
			maxlength: {
				type: [Number, String],
				default: 100
			},
			value: {
				type: [Number, String],
				default: ""
			},
			modelValue: {
				type: [Number, String],
				default: ""
			},
			focus: {
				type: Boolean,
				default: false
			},
      list: {
        type: Array,
        default: () => []
      }
		},
		data() {
			return {
				show: false,
				showSync: false,
				searchVal: '',
        isShowText: true,
        historySearchList: []
			}
		},
		computed:{
			cancelTextI18n() {
				return this.cancelText || t("uni-search-bar.cancel")
			},
			placeholderText() {
				return this.placeholder
			}
		},
		watch: {
			// #ifndef VUE3
			value: {
				immediate: true,
				handler(newVal) {
					this.searchVal = newVal
					if (newVal) {
						this.show = true
					} else{
					  this.show = false
          }
				}
			},
			// #endif
			// #ifdef VUE3
			modelValue: {
				immediate: true,
				handler(newVal) {
					this.searchVal = newVal
					if (newVal) {
						this.show = true
					}
				}
			},
			// #endif
			focus: {
				immediate: true,
				handler(newVal) {
					if (newVal) {
						this.show = true
            this.showSync = false
            this.$nextTick(() => {
              this.showSync = true
            })
					}
				},
			},
			searchVal(newVal, oldVal) {
				// #ifndef VUE3
				this.$emit("input", newVal)
				// #endif
				// #ifdef VUE3
				this.$emit("update:modelValue", newVal)
				// #endif
			},
      list: {
        handler(data) {
          this.historySearchList = data || []
        },
        immediate: true
      },
		},
		methods: {
			searchClick() {
				if (this.show) {
					return
				}
        let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
        let curRoute = routes[routes.length - 1].route //获取当前页面路
        if(curRoute == 'pages/shopHome/index'){
          return
        }
        this.show = true
				this.$nextTick(() => {
					this.showSync = true
				})
			},
			clear() {
				this.$emit("clear", {
					value: this.searchVal
				})
				this.searchVal = ""
			},
			cancel() {
				this.$emit("cancel", {
					value: this.searchVal
				});
				this.searchVal = ""
				this.show = false
				this.showSync = false
				// #ifndef APP-PLUS
				uni.hideKeyboard()
				// #endif
				// #ifdef APP-PLUS
				plus.key.hideSoftKeybord()
				// #endif
			},
			confirm() {
				// #ifndef APP-PLUS
				uni.hideKeyboard();
				// #endif
				// #ifdef APP-PLUS
				plus.key.hideSoftKeybord()
				// #endif
				this.$emit("confirm", {
					value: this.searchVal
				})
			},
			blur() {
				// #ifndef APP-PLUS
				uni.hideKeyboard();
				// #endif
				// #ifdef APP-PLUS
				plus.key.hideSoftKeybord()
				// #endif
				this.$emit("blur", {
					value: this.searchVal
				})
        // if(!this.searchVal){
        //   this.show = false;
        //   this.$nextTick(() => {
        //     this.showSync = false
        //   })
        // }
        // this.getHistory()
			},
			emitFocus(e) {
				this.$emit("focus", e.detail)
			},
      handleClick(e) {
				this.$emit("hClick", e.detail)
			},
		},
    mounted() {
    }
	};
</script>

<style lang="scss" scoped>
	$uni-searchbar-height: 72rpx;
  $uni-font-size-base: 26rpx;

	.uni-searchbar {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		position: relative;
    padding: 20rpx 0;
		// background-color: $uni-bg-color;
	}

	.uni-searchbar__box {
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		overflow: hidden;
		position: relative;
		flex: 1;
		//justify-content: center;
		flex-direction: row;
		align-items: center;
		height: $uni-searchbar-height;
		padding: 5px 8px 5px 0px;
	}

	.uni-searchbar__box-icon-search {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		// width: 32px;
		padding: 0 8px 2rpx 42rpx;
		justify-content: center;
		align-items: center;
		color: $uni-text-color-placeholder;
	}

	.uni-searchbar__box-search-input {
		flex: 1;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
	}

	.uni-searchbar__box-icon-clear {
		align-items: center;
		line-height: $uni-searchbar-height;
		padding-left: 8px;
    padding-right: 28rpx;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.uni-searchbar__text-placeholder {
		font-size: $uni-font-size-base;
		color: $uni-text-color-placeholder;
		margin-left: 5px;;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
	}

	.uni-searchbar__cancel {
		padding-left: 10px;
		line-height: $uni-searchbar-height;
		font-size: 14px;
		color: $uni-text-color;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}
  @font-face {
    font-family: 'iconfont';  /* Project id 2787414 */
    src: url('//at.alicdn.com/t/font_2787414_fx7qwcsbcve.woff2?t=1632470449916') format('woff2'),
    url('//at.alicdn.com/t/font_2787414_fx7qwcsbcve.woff?t=1632470449916') format('woff'),
    url('//at.alicdn.com/t/font_2787414_fx7qwcsbcve.ttf?t=1632470449916') format('truetype');
  }
  .iconfont {
    font-family: 'iconfont' !important;
    font-size: 16px;
    font-style: normal;
    fill: currentColor;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .icon-sousuo:before {
    content: '\e617';
    font-size: 33rpx;
    color: #999999;
  }
  .icon-guanbi:before {
    content: '\e610';
    font-size: 21rpx;
    color: #333;
  }
</style>
