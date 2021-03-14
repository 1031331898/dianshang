<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/sy' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
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
              @click="showBox(scope.row.goods_name)"
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
        width="50%"
      >
      <el-form
       :model="fenlei"
          :rules="fenleiFormRules"
          ref="fenleiFormRef"
          label-width="100px"
      >
        <el-form-item label="分类名称" prop="fname">
            <el-input v-model="fenlei.fname"></el-input>
          </el-form-item>
        </el-form>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >确 定</el-button
          >
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
//调用过滤器
import { fmtDate } from "@/components/filter/Data.js";
export default {
  data() {
    return {
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
        fname:"",
        father:[
        
        ],

      },
      fenleiFormRules:{
        fname:[
  {required: true, message: "请输入商品名称", trigger: "blur"},
        ],
        father:[],
      }
    };
  },

  created() {
    this.getGoodsList();
  },
  // 自定义属性
  filters: {
    filtedate: function (date) {
      let t = new Date(date);
      return fmtDate(t, "yyyy-MM-dd hh:mm:ss");
    },
  },
  methods: {
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
    showBox(){
      this.dialogVisible=true
    }
  },
};
</script>

<style scoped lang="less">
.el-breadcrumb {
  padding: 10px;
}
</style>