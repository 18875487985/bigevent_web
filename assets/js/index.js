// 入口函数
$(function() {
    // 1 调用getUserInfo获取用户信息
    console.log(localStorage.getItem('token'));

    getUserInfo();
})

var layer = layui.layer
    // 3 退出功能实现
$('.btnLogout').on('click', function() {
        // 提示用户是否退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 1 清空本地token
            localStorage.removeItem('token')
                // 2 重新跳转到登陆页面
            location.href = '/login.html'
                //  3关闭confirm询问框
            layer.close(index);
        });
        console.log(1);

    })
    // 2 获取用户信息
function getUserInfo() {
    $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            //  设置请求头 这里通过base统一为有权限的接口my设置headers请求头
            // headers: {
            //     // authorization 为请求头的键  ('token') || '' 为请求头的值
            //     authorization: localStorage.getItem('token') || ''
            //         // Authorization: 
            // },
            success: function(res) {

                console.log(res);
                if (res.code !== 0) {
                    return layer.msg('获取用户信息失败！');

                }
                // 3 渲染用户信息
                renderAvatar(res.data);
                

            }
             // 5 身份认证 不论成功与否都会执行complete回调函数
        
            // complete:function(res){
            //     console.log('执行了complete回调函数');
            //     console.log(res.responseJSON.code);
            //     console.log(res.responseJSON.message);
                
            //     // 在comlete回调函数中可以使用res.responseJSON获取服务器返回的json数据
            //     if (res.responseJSON.code === 1 && res.responseJSON.message === '身份认证失败！') {
            //         // 1 清空本地token
            //         localStorage.removeItem('token')
            //         // 2 强制跳转到登录页面 
            //         location.href = '/login.html'
                    
            //     }
                

            // }
        })
    }


       

        //  4 渲染用户信息
    function renderAvatar(user) {
        // 1 获取用户名称这里有两个名称 一个是用户名 一个是用户昵称 优先显示用户昵称
        // 通过三元表达式判断 如果用户昵称存在则显示用户昵称 不存在则显示用户名
        var name = user.nickname || user.username;
        // 2 设置欢迎文本
        // console.log(name);
        $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
        // 3 按需渲染用户头像 如果用户头像存在则渲染用户头像 不存在则渲染一个默认头像
        if (user.user_pic !== null) {
            // 3.1 渲染用户头像
            $('.layui-nav-img').attr('src', user.user_pic).show();
            // 隐藏默认头像
            $('.text-avatar').hide();
        }
        // 3.2 渲染默认头像
        else {
            // 3.2.1 隐藏用户头像
            $('.layui-nav-img').hide();
            //  3.2.2 渲染默认头像 name[0]拿到的是name的第一个字符
            var first = name[0].toUpperCase();
            // 3.2.3 设置默认头像文本
            $('.text-avatar').html(first).show();
        }
    }


