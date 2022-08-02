$('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
})

$('#link_login').on('click', function () {
    $('.login-box').show()
    $('.reg-box').hide()
})

// 从 LayUI 中获取 form 对象
const form = layui.form



const layer = layui.layer

// 通过 form.verify() 方法自定义校验规则
form.verify({
    // 校验两次密码是否一致的规则
    repass: value => {
        // value：表单的值 item：表单的dom对象
        // [:jQuery的属性选择器，用来判断两次输入的密码是否一致
        const pwd = $('.reg-box [name=password').val()
        if (pwd != value) return "两次密码不一致"
    },
    //我们既支持上述函数式的方式，也支持下述数组的形式
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    pass: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格']
});

$('#form_reg').on('submit', function (e) {
    // 阻止默认提交行为
    e.preventDefault();
    // 获取表单全部属性
    let data = $(this).serialize()
    // 发送请求
    $.ajax({
        type: 'POST',
        url: '/api/reguser',
        data,
        success: res => {
            const { status, message } = res
            if (status !== 0) return layer.msg(message)
            $('#link_login').click()
        }
    })
})


$('#form_login').on('submit', function (e) {
    // 阻止默认提交行为
    e.preventDefault();
    // 获取表单全部属性
    const data = $(this).serialize()
    // 发送请求
    $.ajax({
        type: 'POST',
        url: '/api/login',
        data,
        success: res => {
            const { status, message,token } = res

            if (status !== 0) return layer.msg(message)
            // 将登录成功得到的 token 字符串，保存到 localStorage 中
            localStorage.setItem('token',token)
            // 跳转到主页
            location.href = '/index.html'
        }
    })
})

