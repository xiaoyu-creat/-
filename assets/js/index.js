const getUserInfo = () =>{
    $.ajax({
        type:'GET',
        url:'/my/userinfo',
        data:null,
        // headers :{
        //     Authorization:localStorage.getItem('token'),
        //   },
        success:res =>{
            const {status,message} = res
            if(status!== 0) return layui.layer.msg("数据请求失败！");
            // const {user_pic,username,nickname} = res
            renderAvatar(res.data)
        }
    })
}

// 渲染用户头像
const renderAvatar = data =>{
    // 获取用户名
    let name = data.nickname || data.username 
    // 设置欢迎文本
    $('#welcome').html('欢迎' + name)
    // 按需渲染用户头像
    if(data.user_pic !== null){
        // 渲染图片头像
        $('.layui-nav-img').attr('src',data.user_pic)
        $('.text-avatar').hide()
    }
    else {
        // 渲染文本头像
        $('.layui-nav-img').hide()
        let firstName = name[0].toUpperCase()
        $('.text-avatar').html(firstName)
    }
}

getUserInfo()

// 退出登录
$('#exitBtn').click(function(){
    layer.confirm('确定退出?',{icon:3,title:'提示'},function(index){
        // 重新跳转到登录界面
        location.href = '/login.html'
        // 清空本地存储里面的 token
        localStorage.removeItem('token')
        layer.close(index)
    
    })
})