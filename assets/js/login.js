$(function() {
    // 点击去注册账户的连接
    $('#link_reg').on('click', function() {
        // console.log(1);

        $('.logindiv').hide();
        $('.regdiv').show()
    });
    // 点击去登录的连接
    $('#link_login').on('click', function() {
            $('.logindiv').show();
            $('.regdiv').hide()
        })
        // 3 从layui获取form对象
        // console.log(1);

    var form = layui.form;
    console.log(form);
    var layer = layui.layer;
    // console.log(layer);

    // 通过form.verify()自定义校验规则
    form.verify({
        // 自定义了一个pwd的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须为6位，且不能出现空格'],
        // 5 校验密码是否一致规则
        repwd: function(value) {
            //通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败 则return一个提示信息
            // []中括号是属性选择器 通过属性选择器拿到元素的值 通过val()方法拿到元素的值
            var pwd = $('.regdiv input[name=password]').val()
                // console.log(pwd, value);
            if (pwd !== value) {
                return "两次密码不一致"
            }
        }
    })

    // 4 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        console.log(1);
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val(),
            repassword: $('#form_reg [name=repassword]').val()

        };
        // 将 data 对象转换为 JSON 字符串
        var jsonData = JSON.stringify(data);
        // 发起 ajax 请求
        $.ajax({
            url: '/api/reg',
            method: 'POST',
            contentType: 'application/json', // 设置请求头的 Content-Type 为 application/json
            data: jsonData, // 使用转换后的 JSON 字符串作为请求数据
            success: function(res) {
                console.log(res.message);
                // indexof() 方法用于判断字符串中是否包含某个字符
                // res 里面有 message 属性，通过 message 属性判断是否注册成功 
                if (res.message && res.message.indexOf('成功') === -1) {
                    // 如果注册失败，则弹出提示信息
                    return layer.msg('注册失败' + res.message);
                }
                layer.msg('注册成功,请登录');
                // 注册成功后跳转到登录页面
                $('#link_login').click();
            },
            fail: function(jqXHR, textStatus, errorThrown) {
                // 处理请求失败的情况
                console.log('请求失败:', textStatus, errorThrown);
                if (jqXHR.status === 409) {
                    // 处理 409 Conflict 错误
                    var response = JSON.parse(jqXHR.responseText);
                    layer.msg('注册失败: ' + response.message);
                } else {
                    layer.msg('注册失败，请稍后重试');
                }
            }
        });
    });
    // 5 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault();
        var data = {
            username: $('[name=username]').val(),
            password: $('[name=password]').val()
        };
        // 发起ajax请求
        $.ajax({
            url: '/api/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(res) {
                    console.log(res);
                    if (res.message && res.message.indexOf('成功') === -1) {
                        return layer.msg(res.message);
                    }
                    layer.msg('登录成功');
                    localStorage.setItem('token', res.token);
                    location.href = './index.html';
                }
                // 处理请求失败的情况
        }).fail(function(res) {
            layer.msg(res.responseJSON.message);
        });
    });
})