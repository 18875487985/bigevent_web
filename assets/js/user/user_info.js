   // 1 使用 layui.use 确保 form 模块加载并初始化完成 这里的layui.use 里面的form是模块名 需要和 layui.define('form', function(form){}) 里面的form对应
   layui.use('form', function(){
    var form = layui.form;
    var layer = layui.layer;
    // 表单验证
    form.verify({
        nickname: function(value){
            if(value.length < 2){
                return '昵称至少得2个字符啊';
            }
        }
    });
    initUserInfoForm();
    //2 初始化用户信息表单
    function initUserInfoForm(){
      $.ajax({
        method: 'GET',
        url:'/my/userinfo',
        success: function(res){
          if (res.code !== 0) {
            // 出错提示
           return   layer.msg(res.message+"基本资料");
          }
          // console.log(res + "基本资料");
          // 调用form.val方法，将服务器返回的用户信息填充到表单中
          console.log(res.data);
          
          form.val('formUser',res.data)
          
        }
      })
    }

    // 3 重置表单的数据
    $('#btnReset').on('click',function(e){
      // 只要是按钮都要阻止默认事件 因为点击按钮默认会提交表单
      e.preventDefault();
      initUserInfoForm();

    })

    //4 监听表单提交 .on 是监听器
    $('.layui-form').on('submit',function(e){
      // 阻止默认表单提交
      e.preventDefault();
   
       // 创建 FormData 对象来收集表单数据 FormData是HTML5新增的 表单数据收集对象
       const formData = new FormData(this);
       // 将 FormData 转换为普通对象 Object.fromEntries() 方法是将键值对数组转换为对象 
       // 这里的 formData.entries() 方法是将 FormData 转换为键值对数组  
       const jsonData = Object.fromEntries(formData.entries());
      // 发起ajax请求
      $.ajax({
        method: 'PUT',
        url:'/my/userinfo',
        // serialize() 方法序列化表单数据，以键值对的形式返回
        // 序列化的数据可以直接作为ajax请求的参数
        // data:$(this).serialize(),
        contentType: 'application/json',
        // 将 jsonData 转换为 JSON 字符串
        data: JSON.stringify(jsonData),
        // 成功回调
        success:function(res){
          // console.log(res);
          layer.msg('修改成功');
          
          if (res.code !== 0) {
              // 出错提示
              return   layer.msg(res.message);
          
          }
          //方法1 直接刷新页面 { time: 2000 }, function () 是时间 回调函数
        //   layer.msg('修改成功', { time: 2000 }, function () {
        //     // 延迟 2 秒后刷新页面
        //     location.reload();
        // });
        // 方法2 调用父页面的方法 重新渲染用户信息 window代表当前页面 window.parent代表父页面
        window.parent.getUserInfo();
        }

      })
    })

});