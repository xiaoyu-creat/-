
const initArtCateList = () =>{
    $.ajax({
        type:'GET',
        url:'/my/article/cates',
        data:null,
        success:res =>{
            const { status, message,data} = res
            if(status !== 0) return layer.msg(message)

            // 调用 template
            let htmlStr = template('tpl-table',data)

            $('#tb').html(htmlStr)
        }
    })
}
initArtCateList()

// 在按钮的点击事件中，通过 layer.open() 展示弹出层
// const layer = layui.layer;

const form = layui.form

let layerAdd = null

$("#addCateBtn").click(function(){
    layerAdd = layer.open({
        type: 1,
        area: ["500px", "250px"],
        title: "添加文章分类",
        content: $('#dialog-add').html(),
    });
});


$('body').on('submit','#form-add', function(e) {
    e.preventDefault();
    $.ajax({
        type:'POST',
        url:'/my/article/addcates',
        data:form.val('formAdd'),
        success:res =>{
            console.log(res);
            const {status,message} = res
            layer.msg(message)
            if(status !== 0) return
            initArtCateList()
            layer.close(layerAdd)
        }
    })
})


// 通过代理方式，为 btn-edit 按钮绑定点击事件
let layerEdit = null
$('#tb').on('click', '.btn-edit',function() {
    // 弹出修改文章分类的弹窗
    layerEdit = layer.open({
        type: 1,
        area: ["500px", "250px"],
        title: "修改文章分类",
        content: $('#dialog-edit').html(),
    });
    // 获取自定义属性的值
    // 请求的接口文档是： 是一个url参数，直接拼接就行
    let id = $(this).attr('data-id');
    $.ajax({
        type:'GET',
        url:'/my/article/cates/'+id,
        data:null,
        success:res =>{
            const {status,message,data} = res
            if(status !== 0) return layer.msg(message)
            // 给表单赋值
            form.val('formEdit',data)
        }
    })
})

// 更新文章分类
$('body').on('submit','#form-edit',function(e){
    e.preventDefault()
    $.ajax({
        type:'POST',
        url:'/my/article/updatecate',
        data:form.val('formEdit'),
        success:res =>{
            const {status,message,data} = res
            layer.msg(message)
            if(status !== 0) return
            initArtCateList()
            layer.close(layerEdit)
        }
    })
})

// 通过事件委托 动态渲染
$('#tb').on('click','.btn-delete', function (){
    let id = $(this).attr('data-id');
        // 提示用户是否删除
    layer.confirm("确定删除吗？", { icon: 3, title: "提示" },function (index) {
    $.ajax({
        type:'GET',
        url:'/my/article/deletecate/'+id,
        data:null,
        success:res =>{
            const { status, message,data} = res
            layer.msg(message)
            if(status !== 0) return
            initArtCateList()
        }
    })
    })
})
