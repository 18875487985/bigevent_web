// 注意 每次调用$.get或$.post方法时
// 都会调用这个ajaxPrefilter方法 
// 在这个函数中可以拦截到所有的ajax请求 相当于拿到了所有的ajax请求的配置对象

$.ajaxPrefilter(function(options) {
    // console.log(options.url); ///api/login
    console.log(options);

    options.url = 'https://big-event-vue-api-t.itheima.net' + options.url;
    console.log(options.url); //http://big-event-vue-api-t.itheima.net/api/login
    // 3 统一为有权限的接口 设置headers请求头
    // 判断indexOf 是否包含
    if (options.url.indexOf('/my/') !== -1) {
        // 
        options.headers = {
            authorization: localStorage.getItem('token') || ''
        }

    }
    // 4 全局统一挂载complete函数
     options.complete = function(res){
        console.log('执行了complete回调函数');
        console.log(res.responseJSON.code);
        console.log(res.responseJSON.message);
        
        // 在comlete回调函数中可以使用res.responseJSON获取服务器返回的json数据
        if (res.responseJSON.code === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1 清空本地token
            localStorage.removeItem('token')
            // 2 强制跳转到登录页面 
            location.href = '/login.html'
            
        }
        

    }

})