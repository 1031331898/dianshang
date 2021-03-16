<template>
  <div>
  <div class="users_top">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/sy' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
  </div>
  <el-table
    :data="tableData"
    >
    <el-table-column
      label="#"
      type="index">
    </el-table-column>
    <el-table-column
      label="权限名称"
      prop="authName">
    </el-table-column>
    <el-table-column
      label="路径"
      prop="path">
    </el-table-column>
    <el-table-column
      label="权限等级"
      prop="level">
      <template slot-scope="scope">
          <el-tag 
          size="small" 
          v-if="scope.row.level == 0">
          一级</el-tag> 
          <el-tag type="success" 
          size="small" 
          v-else-if="scope.row.level == 1">
          二级</el-tag> 
          <el-tag type="warning" 
          size="small" 
          v-else>三级</el-tag>
      </template>
    </el-table-column>
      
  </el-table>
  </div>
</template>

<script>
import request from "./../../request/index.js"
  export default {
    data() {
      return {
        tableData:[],
        search: ''
      }
    },
    methods: {
      
      //封装获取列表请求
      req(){
        request({
          url:"rights/list",
          method:"get"
        }).then(res=>{
          if(res.meta.status==200){
            this.tableData=res.data
          }
        })
      },
    },
    mounted(){
      this.req();
      
    }
  }
</script>