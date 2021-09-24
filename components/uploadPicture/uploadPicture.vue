<!--头像上传-->
<template>
	<view class="uploadPicture">
		<ImageCropper class="upSet_content_list_right"
		        id="image-cropper"
		        :zoom="1"
		        :angle="0"
		        :src="imgUrl"
				:width="'100%'"
				:height="'500rpx'"
		        canvasBackground="red"
		        @cropped="cropped"
		        @afterDraw="afterDraw"
		        @beforeDraw="beforeDraw"
		      />
			  <view class="btn">
			  	<button type="primary" plain="true" @click="submit">确定</button>
				<button type="primary" plain="true" @click="cancel">取消</button>
			  </view>
	</view>
</template>

<script>
	import ImageCropper from '../uniapp-nice-cropper/uniapp-nice-cropper.vue';
  import {updateUserData, updateUserImg} from '../../api/index.js';
	import {mapState, mapMutations} from 'vuex';

	export default {
		components:{
			ImageCropper
		},
		data() {
			return {
				imgUrl:'',
				comfigImg:'',
			}
		},
		computed:{
			...mapState('users',{
				'userInfo':'userInfo',
			}),
		},
		mounted() {
			let that = this;
			uni.chooseImage({
			    count: 1, //默认9
			    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			    sourceType: ['album','camera'], //相机或者相册
			    success: function (res) {
			        console.log(JSON.stringify(res.tempFilePaths));
			        console.log('uni.chooseImage', res);
					// 预览图片
					// console.log(res.tempFilePaths[0])
					that.imgUrl = res.tempFilePaths[0];
			    },
          fail: function(res){
			      console.log(res);
			      return uni.navigateBack({
              delta:1
            })
          }
			});
		},
		methods:{
			...mapMutations('users',{
				'setUserInfoData':'setUserInfoData',
			}),
			beforeDraw:function(context, transform) {
			  context.setFillStyle('blue')
			  transform.zoom = 2
			},
			afterDraw:function(ctx, info) {
				// console.log(ctx,info)
				// ctx.fillText('我是一行文字水印', 20, 20)
				console.log(`当前画布大小：${info.width}*${info.height}`)
			},
			cropped(imagePath, imageInfo) {
			  console.log('cropped', imagePath, imageInfo)
			  this.comfigImg = imagePath;
			},
			//点击提交时上传剪切好的头像图片
			submit:function(){
				let that = this;
				// console.log(this.comfigImg)
				const tempFilePaths = this.comfigImg;

                // #ifdef MP-WEIXIN
                    uni.showLoading({
                      title: '上传中。。。',
                      mask: true,
                    });
                    uni.getFileSystemManager().readFile({
                        filePath: tempFilePaths, //选择图片返回的相对路径
                        encoding: 'base64', //编码格式
                        success: res => { //成功的回调
                        console.log(res);
                            let base64 = 'data:image/jpeg;base64,' + res.data //不加上这串字符，在页面无法显示的哦
							that.updateUser(base64);
                        },fail: (e) => {
                            console.log("图片转换失败");
                        }
                    })
                // #endif

				//图片上传接口调用成功后返回oss的图片路径
				// uni.uploadFile({
				// 	url: 'https://www.example.com/upload', //仅为示例，非真实的接口地址
				// 	filePath: tempFilePaths,
				// 	name: 'file',
				// 	formData: {
				// 		'user': 'test'
				// 	},
				// 	success: (uploadFileRes) => {
				// 		console.log(uploadFileRes.data);
				// 		uni.redirectTo({
				// 			url:'/pages/upSet/upSet?imgurl=' + JSON.stringify(uploadFileRes.data)
				// 		})
				// 	}
				// });
			},
			//点击取消退回上一页面
			cancel:function(){
        return uni.navigateBack({
          delta: 1
        });
			},
			updateUser: async function(val){
				let res = await updateUserImg(val),that = this;
        that.userInfo.pic = res.data.data.info[0].url;
        that.$store.commit('users/setUserInfoData',that.userInfo);
        await updateUserData(null, null, null, null, that.userInfo.pic);
        uni.hideLoading();
        return uni.navigateBack({
          delta: 1
        });
			},
		}
	}
</script>

<style lang="less" scoped>
	@item:{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.uploadPicture{
		width: 100%;
		min-height: 20rem;
		.upSet_content_list_right{
			width: 100%;
			height: 100%;
			margin-top: 300rpx;
			@item();
			justify-content: flex-end;
			image{
				width: 2.89375rem;
				height: 2.89375rem;
				border-radius: 50%;
			}
		}
		.btn{
			width: 100%;
			height: 3rem;
			@item();
			position: fixed;
			bottom: 1rem;
			z-index: 10;
			button{
				width: 40%;
				height: 3rem;
				border-radius: 1.5rem;
			}
		}
	}
</style>
