// 定义一个查询的参数对象，将来请求数据的时候，
// 需要将请求参数对象提交到服务器
const query = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize:10, // 每页显示几条数据，默认每页显示2条
    cate_id: "", // 文章分类的 Id
    state: "", // 文章的发布状态
};

// 获取文章列表数据
const initTable = () =>{
    $.ajax({
        type:'GET',
        url:'/my/article/list',
        data:query,
        success:res =>{
            const {status, message,data,total} = res
            if(status !== 0) return layer.msg(message)
            let htmlStr = template('tpl-table',data)
            $('#tb').html(htmlStr)
            renderPage(total)
        }
    })
}

initTable()

const laypage = layui.laypage

// 定义渲染分页方法
const renderPage= total=> {
     // 调用 laypage.render() 方法来渲染分页的结构
     laypage.render({
        elem: 'pageBox', // 分页容器的 Id
        count: total, // 总数据条数
        limit: query.pagesize, // 每页显示几条数据
        curr: query.pagenum,// 设置默认被选中的分页
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        limits: [2, 3, 5, 10],// 每页展示多少条
         // 分页发生切换的时候，触发 jump 回调
        jump: function(obj,first) {
            // 首次不执行
            // 把最新的页码值，赋值到 q 这个查询参数对象中
            query.pagenum = obj.curr
            // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
            query.pagesize = obj.limit
            // 根据最新的 q 获取对应的数据列表，并渲染表格
            if(!first){
                initTable()
            }
        },
    })
  }

// 定义美化时间的过滤器
template.defaults.imports.dataFormat = function(date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
}

// 定义补零的函数
function padZero(n) {
    return n > 9 ? n : '0' + n
}

const form = layui.form;

const initCate = () =>{
    $.ajax({
        type:'GET',
        url:'/my/article/cates',
        success:res =>{
            const {status,message,data} = res
            if(status !== 0) return layer.msg(message)
            // 调用模板引擎渲染分类的可选项
            var htmlStr = template("tpl-cate", data);
            $("[name=cate_id]").html(htmlStr);
            // 通过 layui 重新渲染表单区域的UI结构
            form.render()
        },
    })
}

initCate()

$('#form-search').submit(function(e) {
    e.preventDefault()
    // 获取表单中选中项的值
    query.cate_id = $('[name=cate_id]').val()
    query.state = $('[name=state]').val()
    // 根据最新的筛选条件，重新渲染表格的数据
    initTable()
})

$('#tb').on('click','.delete-Btn', function() {
    // 获取删除按钮的个数
    let len = $('.delete-btn').length
    // 获取到文章的 id
    let id = $(this).attr('data-id');
    // 询问用户是否要删除数据
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
    $.ajax({
        type:'GET',
        url:'/my/article/delete/' + id,
        success:res =>{
            const {status,message} = res
            layer.msg(message)
            if(len == 1) {
                // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                // 页码值最小必须是 1
                query.pagenum = q.pagenum === 1 ?1:query.pagenum-1
            }
            initTable()
        },
    })
    layer.close(index)
    })
})