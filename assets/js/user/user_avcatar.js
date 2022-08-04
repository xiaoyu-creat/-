// 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')
// 1.2 配置选项
const options = {
  // 纵横比
  aspectRatio: 1,
  // 指定预览区域
  preview: '.img-preview'
}

// 1.3 创建裁剪区域
$image.cropper(options)

// 下面定义一个按钮，文本是 上传，一旦用户点击按钮，我们手动触发 文件选择框的点击事件
$('#uploadBtn').click(function () {
    $('#file').click()
})

// 为文件上传框绑定 change 事件
$('#file').change(function (e) {
    let files = e.target.files;
    if(files.length === 0) return layer.msg('请选择上传的文件')

    // 1. 拿到用户选择的文件
    let file = files[0]

    // 2. 将文件，转化为路径
    let imgUrl = URL.createObjectURL(file)

    // 3. 重新初始化裁剪区域
    $image
    .cropper("destroy") // 销毁旧的裁剪区域
    .attr("src", imgUrl) // 重新设置图片路径
    .cropper(options); // 重新初始化裁剪区域
})

$('#sendBtn').click(function () {
    // 1、拿到用户裁切之后的头像
    // 直接复制代码即可
    const dataURL = $image.cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
    })
    .toDataURL("image/png");

    $.ajax({
        type:'POST',
        url:'/my/update/avatar',
        data:{
            avatar: dataURL,
        },
        success:res =>{
            const {status, message} = res
            layer.msg(message)
            if(status !== 0) return 

            window.parent.getUserInfo()
        }
    })
})