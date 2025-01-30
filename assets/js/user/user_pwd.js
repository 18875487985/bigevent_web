// 等页面加载完毕 layui.use() 后执行的函数 layui.use(['form']里面的form是表单模块)
layui.use(['form'], function(){
        // 引入表单模块
        var form = layui.form;
        // 引入layer模块
        var layer = layui.layer;
        //1 表单校验规则
        form.verify({
            // 密码验证 /^[a-zA-Z0-9]{6,16}$/ 密码必须6到16位，且只能包含字母、数字
            // /^是正则表达式的开始，[a-zA-Z0-9]是匹配字母和数字，{6,16}是密码长度限制，$是正则表达式的结束
            pwd:[/^[a-zA-Z0-9]{6,16}$/, '密码必须6到16位，且只能包含字母、数字'],
            // 确认密码验证 不能和密码相同
            samePwd:function(value){
                // console.log($('[name=oldpwd]').val());          
                if(value  === $('[name=oldpwd]').val()){
                    
                    return '新密码不能和旧密码相同';
                }
            },
            // 确认密码校验
            rePwd:function(value){
                if(value !== $('[name=newpwd]').val()){
                    // 
                    return '两次输入的密码不一致';

                }

            }
        })
       // 2 监听表单提交事件，当表单（类名为 layui-form 的表单）被提交时触发回调函数
$('.layui-form').on('submit', function(e) {
    // 阻止表单的默认提交事件。默认情况下，表单提交会导致页面刷新，使用该方法可避免页面刷新，以便通过 AJAX 异步提交表单数据
    e.preventDefault();

    // 发起 AJAX 请求，以下是处理表单数据和发送请求的步骤

    // 1 创建 FormData 对象来收集表单数据
    // FormData 是 HTML5 新增的表单数据收集对象，它可以方便地收集表单中的所有数据
    // this 代表当前触发提交事件的表单对象
    var formData = new FormData(this);

    // 2 将 FormData 转换为普通对象
    // Object.fromEntries() 方法是将键值对数组转换为对象
    // formData.entries() 会返回一个迭代器，包含表单数据的键值对
    var data = Object.fromEntries(formData.entries());

    // 打印转换后的普通对象，方便调试查看表单数据
    console.log(data); // 示例输出: {oldpwd: '123123', newpwd: '1231231', repwd: '1231231'}

    // 调整对象属性名以匹配接口要求，这一步很重要，因为接口可能对参数名有特定的要求
    var requestData = {
        // 将 data 对象中的 oldpwd 属性赋值给 requestData 对象的 old_pwd 属性
        old_pwd: data.oldpwd,
        // 将 data 对象中的 newpwd 属性赋值给 requestData 对象的 new_pwd 属性
        new_pwd: data.newpwd,
        // 将 data 对象中的 repwd 属性赋值给 requestData 对象的 re_pwd 属性
        re_pwd: data.repwd
    };

    // 3 发送 AJAX 请求
    $.ajax({
        // 请求的 URL，指定要将数据发送到的服务器端接口地址
        url: '/my/updatepwd',
        // 请求的方法，使用 PATCH 方法通常用于部分更新资源
        method: 'PATCH',
        // 将 requestData 对象转换为 JSON 字符串，以便通过 AJAX 发送
        data: JSON.stringify(requestData),
        // 设置请求头，指定发送的数据格式为 JSON
        contentType: 'application/json',
        // 请求成功后的回调函数，当服务器成功响应时执行
        success: function(res) {
            // 判断服务器返回的状态码是否不等于 0，如果不等于 0 表示请求处理过程中出现错误
            if (res.code !== 0) {
                // 使用 layui 的 layer 组件弹出错误提示框
                // res.message 是服务器返回的错误信息，icon: 2 表示显示错误图标，time: 2000 表示提示框显示 2 秒
                layer.msg(res.message, { icon: 2, time: 2000 });
            }
            // 如果服务器返回的状态码等于 0，表示请求处理成功
            // 使用 layui 的 layer 组件弹出成功提示框
            // res.message 是服务器返回的成功信息，icon: 1 表示显示成功图标，time: 2000 表示提示框显示 2 秒
            layer.msg(res.message, { icon: 1, time: 2000 });
            // 重置表单
            // $('.layui-form') 是一个 jQuery 对象，[0] 是将 jQuery 对象转换为原生 DOM 对象
            // 调用原生 DOM 对象的 reset() 方法来重置表单中的所有输入字段
            $('.layui-form')[0].reset();
        }
    });                
             
})
});
