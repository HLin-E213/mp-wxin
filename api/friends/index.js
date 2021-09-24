/**
 * @Description:
 * @Author: mahui
 * @Date: 2021/1/20 3:48 PM
 */
/*引入封装好的请求方法*/
import { dajxHttp } from '../../utils/request.js';

/**
 * @desc 朋友圈主页/个人主页（文章列表）
 * @param uid
 * @param page
 * @param pageSize
 * @returns {Promise<any>}
 */
export async function getArticle(uid, page, pageSize) {
    return await dajxHttp.post({
        url: '/api/friends/article',
        data: {
            uid,
            page,
            pageSize,
        },
    })
}

/**
 * @desc 获取热词
 * @returns {Promise<any>}
 */
export async function getArticleTags() {
    return await dajxHttp.post({
        url: '/api/friends/article-tags',
        data: {
        },
    })
}

/**
 * @desc 新增文章
 * @param topic
 * @param type
 * @param video_id
 * @param resource
 * @returns {Promise<any>}
 */
export async function articleAdd(topic, type, video_id, resource) {
    return await dajxHttp.post({
        url: '/api/friends/article-add',
        data: {
            topic,
            type,
            video_id,
            resource,
        },
    })
}
/**
 * @desc 我的动态列表
 * @param page
 * @param pageSize
 * @returns {Promise<any>}
 */
export async function myTrend(page, pageSize) {
    return await dajxHttp.post({
        url: '/api/friends/news',
        data: {
            page,
            pageSize,
        },
    })
}
/**
 * @desc 文章搜索
 * @param keywords
 * @param page
 * @param pageSize
 * @returns {Promise<any>}
 */
export async function articleSearch(keywords, page, pageSize) {
    return await dajxHttp.post({
        url: '/api/friends/article-search',
        data: {
            keywords,
            page,
            pageSize,
        },
    })
}
/**
 * @desc 文章删除
 * @param id
 * @returns {Promise<any>}
 */
export async function articleDel(id) {
    return await dajxHttp.post({
        url: '/api/friends/article-del',
        data: {
            id
        },
    })
}
/**
 * @desc 回复删除
 * @param id
 * @returns {Promise<any>}
 */
export async function replyDel(id) {
    return await dajxHttp.post({
        url: '/api/friends/reply-del',
        data: {
            id
        },
    })
}
/**
 * @desc 新增回复
 * @param comment_id
 * @param pid
 * @param content
 * @returns {Promise<any>}
 */
export async function replyAdd(comment_id, pid, content) {
    return await dajxHttp.post({
        url: '/api/friends/reply-add',
        data: {
            comment_id,
            pid,
            content,
        },
    })
}
/**
 * @desc 删除评论
 * @param id
 * @returns {Promise<any>}
 */
export async function commentDel(id) {
    return await dajxHttp.post({
        url: '/api/friends/comment-del',
        data: {
            id,
        },
    })
}
/**
 * @desc 发表评论
 * @param article_id
 * @param content
 * @returns {Promise<any>}
 */
export async function commentAdd(article_id, content) {
    return await dajxHttp.post({
        url: '/api/friends/comment-add',
        data: {
            article_id,
            content,
        },
    })
}
/**
 * @desc 评论点赞、取消点赞
 * @param id
 * @param like 1=点赞 2=取赞
 * @returns {Promise<any>}
 */
export async function commentLike(id, like) {
    return await dajxHttp.post({
        url: '/api/friends/comment-like',
        data: {
            id,
            like,
        },
    })
}
/**
 * @desc 评论列表
 * @param article_id
 * @param page
 * @param pageSize
 * @returns {Promise<any>}
 */
export async function commentList(article_id, page, pageSize) {
    return await dajxHttp.post({
        url: '/api/friends/comment',
        data: {
            article_id,
            page,
            pageSize,
        },
    })
}
/**
 * @desc 文章点赞/取赞
 * @param id
 * @param like 1=点赞 2=取赞
 * @returns {Promise<any>}
 */
export async function articleLike(id, like) {
    return await dajxHttp.post({
        url: '/api/friends/article-like',
        data: {
            id,
            like,
        },
    })
}
/**
 * @desc 获取最新动态条数
 * @returns {Promise<any>}
 */
export async function getNewsCount() {
    return await dajxHttp.post({
        url: '/api/friends/news-count',
        data: {
        },
    })
}
/**
 * @desc 切换背景图
 * @param background_img
 * @returns {Promise<any>}
 */
export async function changeBackground(background_img) {
    return await dajxHttp.post({
        url: '/api/friends/change-background',
        data: {
            background_img,
        },
    })
}
/**
 * @desc 获取视频上传凭证
 * @param file_path
 * @returns {Promise<any>}
 */
export async function uploadVideoauth(file_path) {
    return await dajxHttp.post({
        url: '/api/friends/upload-video-auth',
        data: {
            file_path,
        },
    })
}