<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/sy' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="search">
            <el-button slot="append" icon="el-icon-search" @click="search_"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区域 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="95px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="70px"
        ></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template slot-scope="scope">
            {{ scope.row.add_time | filtedate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showBox(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
      <!-- 编辑商品 -->
      <el-dialog
        title="添加分类"
        :visible.sync="dialogVisible"
        width="60%"
      >
      <el-form
      :model="fenlei"
          ref="fenleiFormRef"
          label-width="150px"
      >
        <!-- <div>原商品信息：{{fenlei.defalut_name}}</div> -->
        <el-form-item label="修改商品信息" required>
            <el-input v-model="fenlei.goods_name" :placeholder="fenlei.defalut_name"></el-input>
        </el-form-item>
        <!-- <div>原商品信息：{{fenlei.defalut_price}}</div> -->
        <el-form-item label="修改商品价格" required>
          <el-input v-model="fenlei.goods_price" :placeholder="fenlei.defalut_price"></el-input>
        </el-form-item>
        <!-- <div>原商品信息：{{fenlei.defalut_number}}</div> -->
        <el-form-item label="修改商品数量" required>
            <el-input v-model="fenlei.goods_number" :placeholder="fenlei.defalut_number"></el-input>
        </el-form-item>
        <!-- <div>原商品信息：{{fenlei.defalut_weight}}</div> -->
        <el-form-item label="修改商品重量"  required>
            <el-input v-model="fenlei.goods_weight" :placeholder="fenlei.defalut_weight"></el-input>
        </el-form-item>
        <el-form-item label="选择商品分类 "  required>
            <el-cascader
            expand-trigger="hover"
            :options="catelist"
            :props="cateProps"
            v-model="selectedCateKeys"
            @change="handleChange()"
          >
          </el-cascader>
        </el-form-item>
        </el-form>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editSub"
            >确 定</el-button
          >
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import request from "../../request/index.js"
//调用过滤器
import { fmtDate } from "@/components/filter/Data.js";
export default {
  data() {
    return {
      search:null,
      // 查询参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      // 商品列表
      goodslist: [],
      // 总数据条数
      total: 0,
      dialogVisible:false,
      fenlei:{
        goods_name:"",
        goods_price:"",
        goods_number:"",
        goods_weight:"",
        defalut_name:"",
        defalut_price:"",
        defalut_number:"",
        defalut_weight:"",
        goods_id:null
      },
       // 商品分类列表
      catelist: [],
      // 级联选择框的配置对象
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 级联选择框双向绑定到的数组
      selectedCateKeys: [],
      //分类id
      flid:""
    };
  },

  created() {
    this.getGoodsList();
    this.getCateList();
  },
  // 自定义属性
  filters: {
    filtedate: function (date) {
      let t = new Date(date);
      return fmtDate(t, "yyyy-MM-dd hh:mm:ss");
    },
  },
  methods: {
    getCateList() {
      request({
        url: "/categories",
      }).then((res) => {
        console.log(res);
        this.catelist = res.data;
        console.log(this.selectedCateKeys);
      });
    },
    //选择级联后自动触发handleChange
    handleChange(){
      this.flid=this.selectedCateKeys
      console.log(this.flid);
    },
    //查询商品
    search_(){
      console.log(this.search)
      request({
        url:`goods/${this.search}`
      }).then(res=>{
        console.log(res)
        if(res.meta.status==200){
          this.$message({
          message: res.meta.msg,
          type: 'success',
          duration:1000,
          onClose:()=>{
            this.goodslist.splice(0, this.goodslist.length, res.data)
          }
        });
        }else if(res.meta.status==400){
          this.$message.error(res.meta.msg)
        }else{
          this.$message.error("查无此人")
        }
      })
    },
    // 根据分页获取对应的商品列表
    getGoodsList() {
      this.axios.get("/api/goods", { params: this.queryInfo }).then((res) => {
        console.log(res);
        if (res.meta.status !== 200) {
          this.$message.error("获取商品列表失败");
        }
        this.goodslist = res.data.goods;
        this.total = res.data.total;
      });
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    removeById(id) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios.delete(`/api/goods/${id}`).then((res) => {
            console.log(res);
            if (res.meta.status == 200) {
              this.$message({
                message: res.meta.msg,
                type: "success",
                duration: 1000,
                onClose: () => {
                  this.getGoodsList();
                },
              });
            } else {
              this.$message.error("删除失败，请检查重试");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    goAddpage() {
      this.$router.push("/home/add");
    },
    //修改商品信息
    showBox(e){
      this.dialogVisible=true
      console.log(e)
        this.fenlei.defalut_name=e.goods_name
        this.fenlei.defalut_price=e.goods_price
        this.fenlei.defalut_number=e.goods_number
        this.fenlei.defalut_weight=e.goods_weight
        this.fenlei.goods_id=e.goods_id
    },
    editSub(){
      console.log(this.fenlei.goods_name)
      request({
        url:`goods/${this.fenlei.goods_id}`,
        method:"put",
        data:{
          goods_name:this.fenlei.goods_name,
          goods_price:this.fenlei.goods_price,
          goods_number:this.fenlei.goods_number,
          goods_weight:this.fenlei.goods_weight,
          goods_cat:this.flid.join("")
        }
      }).then(res=>{
        console.log(res)
        if(res.meta.status==200){
          this.$message({
                message: res.meta.msg,
                type: "success",
                duration: 1000,
                onClose: () => {
                  this.getGoodsList();
                  this.dialogVisible=false
                },
              });
        }else{
          this.$message.error("修改失败")
        }
      })
    }
  },
};
</script>

<style scoped lang="less">
.el-breadcrumb {
  padding: 10px;
}
</style>