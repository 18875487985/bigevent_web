layui.use(['layer'], function () {
  var layer = layui.layer

  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }
  // console.log(11111);
  

  // 1.3 创建裁剪区域
  $image.cropper(options)

  // // 为上传按钮绑定点击事件
  $('#btnChooseImage').on('click', function() {
    // 模拟点击文件选择框
    $('#file').click()
  })

  // // 为文件选择框绑定 change 事件
  $('#file').on('change', function(e) {
    // console.log(e.target.files);
    // 获取用户选择的文件
    var filelist = e.target.files.length
    console.log(filelist);
    if (filelist === 0){
      return layer.msg('请选择照片！')
    console.log(e.target.files[0]);
    }

    // 1. 拿到用户选择的文件
    var file = e.target.files[0]
    // 2. 将文件，转化为路径
    var imgURL = URL.createObjectURL(file)
    // 3. 重新初始化裁剪区域 新增
    $image
   .cropper('destroy')      // 销毁旧的裁剪区域
   .attr('src', imgURL)  // 重新设置图片路径
   .cropper(options)        // 重新初始化裁剪区域
  })
  // // 1 为确定按钮，绑定点击事件
  $('#btnUpload').on('click', function() {
    // 1. 要拿到用户裁剪之后的头像
    var dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
      // console.log(dataURL);
      
      // 2. 调用接口，把头像上传到服务器
      $.ajax({
            method: 'PATCH',
            url: '/my/update/avatar',
            contentType: 'application/json',
            // 转为json字符串 stringify
      
              // 你已经把 dataURL 用 JSON.stringify 转换了一次，不过 data 整体还是一个 JavaScript 对象，你需要把整个 data 对象转换为 JSON 字符串后再发送给服务器
              // avatar:  JSON.stringify(dataURL)
                    // 把整个 data 对象转换为 JSON 字符串
                    data:JSON.stringify({avatar:dataURL})

            ,
            success: function(res) {
              
              if (res.code === 0) {
                 layer.msg('头像上传成功！')
              } else {
                layer.msg('头像上传失败！')
            }
            window.parent.getUserInfo()
          }
      })
  })
})
