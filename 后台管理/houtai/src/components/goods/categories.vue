<template>
  <div>
  <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
<el-card>
  <!-- 卡片视图区域 -->
  <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
        <!-- 表格 -->
  
</el-card>
  </div>
</template>

<script>
export default {
data(){
  return{
//查询条件
querInfo:{
  type:3,
  pagenum:1,
  pagesize:5
}
  }
},
created(){
this.getCateList()
},
methods:{
//获取商品分类数据
getCateList(){
  this.axios.get('/api/categories',{
    params:this.querInfo
  }).then((res)=>{
    console.log(res);
  })
}
}
}
</script>

<style>

</style>