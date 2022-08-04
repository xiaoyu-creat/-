const form = layui.form

// 通过 form.verify() 方法自定义校验规则
form.verify({
    // 校验两次密码是否一致的规则
    rePwd: value => {
        // value：表单的值 item：表单的dom对象
        // [:jQuery的属性选择器，用来判断两次输入的密码是否一致
        const pwd = $('.layui-form [name=newPwd').val()
        if (pwd !== value) return "两次密码不一致"
    },
    SamePwd: value => {
        // value：表单的值 item：表单的dom对象
        // [:jQuery的属性选择器，用来判断两次输入的密码是否一致
        const pwd = $('.layui-form [name=oldPwd').val()
        if (pwd === value) return "新旧密码不能相同"
    },
    //我们既支持上述函数式的方式，也支持下述数组的形式
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格']
});

// 发送请求，重置密码
$('.layui-form').submit(function(e) {
    e.preventDefault();
    $.ajax({
        type:'POST',
        url:'/my/updatepwd',
        data:form.val('formPassword'),
        success:res =>{
            const { status, message} = res
            layer.msg(message)
            if(status !== 0) return 
            // $('#resetBtn').click()
            // 重置表单
            $('.layui-form')[0].reset()
        }
    })
})



