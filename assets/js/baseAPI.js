// 注意 每次调用$.get或$.post方法时
// 都会调用这个ajaxPrefilter方法 
// 在这个函数中可以拦截到所有的ajax请求 相当于拿到了所有的ajax请求的配置对象

$.ajaxPrefilter(function(options) {
    // console.log(options.url); ///api/login
    // 
    options.url = 'https://big-event-vue-api-t.itheima.net' + options.url;
    console.log(options.url); //http://big-event-vue-api-t.itheima.net/api/login
})