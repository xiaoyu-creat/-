const form = layui.form

// 通过 form.verify() 方法自定义校验规则
form.verify({
    // 校验两次密码是否一致的规则
        nickname: (val) => {
            if (val.length > 6) return "昵称长度必须在 1 ~ 6 个字符之间！";
        },
    //我们既支持上述函数式的方式，也支持下述数组的形式
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
   email: [/@/, '邮箱格式输入错误']
});


// 初始化用户信息
const initUserInfo = () => {
    $.ajax({
      type: "GET",
      url: "/my/userinfo",
      success: (res) => {
        const {status,message,data} = res
        if (status !== 0) return layer.msg(message);

        form.val('formUserInfo',data);
      },
    });
  };
  
  initUserInfo();

// 设置重置按钮功能
  $('#resetBtn').click(function(e){
    e.preventDefault();
    initUserInfo()
  })

// 给表单设置提交事件
$('.layui-form').submit(function(e){
    e.preventDefault()
    $.ajax({
        type:'POST',
        url:'/my/userinfo',
        data: form.val('formUserInfo'),
        success:res =>{
            const {status,message} = res
            if(status !== 0 ) return layer.msg("更新用户信息失败！");
            layer.msg("更新用户信息成功！");
            // 调用父页面渲染函数
            window.parent.getUserInfo();
        }
    })
})
