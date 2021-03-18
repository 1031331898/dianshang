<template>
  <div>
    <!-- 面包屑导航区域 -->
    <div class="user_top">
        <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/sy' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    </div>
    
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        show-icon
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
      ></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            expand-trigger="hover"
            :options="catelist"
            :props="cateProps"
            v-model="selectedCateKeys"
            @change="handleChange()"
          >
          </el-cascader>
        </el-col>
      </el-row>
    </el-card>
    <div class="daohao">
      <div @click="dong" :class="{ active: isActive }">动态参数</div>
      <div @click="jing" :class="{ active: isActive2 }">静态属性</div>
    </div>
    <div class="dong" v-if="isShow" >
      <el-button type="primary"  @click="dialogFormVisible=true" >添加参数</el-button>
      <el-table :data="manyTableData" style="width: 100%" border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row class="centerRow">
              <!-- 这一列，专门渲染 一级权限 -->
              <el-col :span="5">
                <el-tag closable >{{
                  scope.row.attr_vals
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="5">
                <el-tag closable >{{
                  scope.row.attr_write
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column label="属性名称" prop="attr_name"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row.cat_id, scope.row.attr_id)"
              icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.cat_id, scope.row.attr_id)"
              icon="el-icon-delete"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="static" v-else>
      <el-button type="primary" @click="dialogFormVisible2=true" >添加参数</el-button>
      <el-table :data="onlyTableData" style="width: 100%" border>
        <el-table-column type="expand">
          <template slot-scope="prop">
            <el-row>
              <!-- 这一列，专门渲染 一级权限 -->
              <el-col :span="5">
                <el-tag closable >
                  {{ prop.row.attr_vals }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="5">
                <el-tag closable >
                  {{ prop.row.attr_write }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column label="属性名称" prop="attr_name"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="prop">
            <el-button
              size="mini"
              @click="handleEdit2(prop.row.cat_id, prop.row.attr_id)"
              icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete2(prop.row.cat_id, prop.row.attr_id)"
              icon="el-icon-delete"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="添加动态参数" :visible.sync="dialogFormVisible">
      <el-form :model="d_form">
        <el-form-item label="动态参数" 
        :rules="[{ required: true}]"
        >
          <el-input v-model="d_form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDc()"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog title="添加静态参数" :visible.sync="dialogFormVisible2">
      <el-form :model="d_form">
        <el-form-item label="静态参数" 
        :rules="[{ required: true}]"
        >
          <el-input v-model="d_form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="addJc()"
          >确 定</el-button
        >
      </div>
    </el-dialog>

<!--  ..............................         -->

    <el-dialog title="修改静态参数" :visible.sync="editjcvisible">
      <el-form :model="d_form">
        <el-form-item label="静态参数" 
        :rules="[{ required: true}]"
        >
          <el-input v-model="d_form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editjcvisible= false">取 消</el-button>
        <el-button type="primary" @click="EditJc()"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!--  -->

    <el-dialog title="修改动态参数" :visible.sync="editdcvisible">
      <el-form :model="d_form">
        <el-form-item label="动态参数" 
        :rules="[{ required: true}]"
        >
          <el-input v-model="d_form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editdcvisible= false">取 消</el-button>
        <el-button type="primary" @click="EditDc()"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "../../request/index.js";
export default {
  data() {
    return {
      dialogFormVisible:false,
      dialogFormVisible2:false,
      editjcvisible:false,
      editdcvisible:false,
      d_form:{
        name:''
      },
      isActive: true,
      isActive2: false,
      isShow: true,
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
      // 被激活的页签的名称
      activeName: "many",
      // 动态参数的数据
      manyTableData: [],
      // 静态属性的数据
      onlyTableData: [],
      // 控制添加对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {
        attr_name: "",
      },
      // 添加表单的验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      // 修改的表单数据对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      bjid:"",
      arrid:""
    };
  },
  mounted() {
    this.getCateList();
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
    //动态参数
    many() {
      request({
        url: `categories/${this.selectedCateKeys[this.selectedCateKeys.length - 1]}/attributes`,
        method: "get",
        params: {
          sel: "many",
        },
      }).then((res) => {
        console.log(res);
        this.manyTableData = res.data;
      });
    },
    //静态参数
    only() {
      request({
        url: `categories/${
          this.selectedCateKeys[this.selectedCateKeys.length - 1]
        }/attributes`,
        method: "get",
        params: {
          sel: "only",
        },
      }).then((res) => {
        console.log(res);
        this.onlyTableData = res.data;
      });
    },
    // 级联选择框选中项变化，会触发这个函数
    handleChange() {
      console.log(this.selectedCateKeys);
      this.bjid=this.selectedCateKeys[this.selectedCateKeys.length - 1]
      this.many();
      this.only();
    },
    // tab 页签点击事件的处理函数
    handleTabClick() {
      console.log(this.activeName);
      this.getParamsData();
    },
    getParamsData() {
      console.log(123456);
    },
    dong() {
      this.isShow = true;
      this.isActive = true;
      this.isActive2 = false;
    },
    jing() {
      this.isShow = false;
      this.isActive = false;
      this.isActive2 = true;
    },
    //编辑动态参数属性
    handleEdit(id, arrtid) {
      this.editdcvisible=true
      this.bjid=id
      this.arrid=arrtid
    },

    EditDc(){
      console.log(this.bjid,this.arrid)
      request({
        url:`categories/${this.bjid}/attributes/${this.arrid}`,
        method:"put",
        data:{
          attr_name:this.d_form.name,
          attr_sel:"many"
        }
      }).then(res=>{
        console.log(res)
        if(res.meta.status==200){
          this.$message({
                type: "success",
                message:res.meta.msg,
                duration: 1000,
                onClose: () => {
                  this.getCateList();
                  this.handleChange();
                  this.editdcvisible=false
                },
              });
        }else if(res.meta.status==400){
          this.$message({
                type: "warning",
                message: res.meta.msg,
                duration: 1000,
                onClose: () => {
                  return
                },
            });
        }else{
          this.$message.error("修改失败")
        }
      })
    },
    //删除动态参数
    handleDelete(id, arrtid) {
      console.log(id, arrtid);
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: `categories/${id}/attributes/${arrtid}`,
            method: "delete",
          }).then((res) => {
            if (res.meta.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
                duration: 1000,
                onClose: () => {
                  this.getCateList();
                  this.handleChange();
                },
              });
            } else {
              this.$message.error("删除失败");
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
    //编辑静态参数属性
    handleEdit2(id, arrtid) {
      console.log(id, arrtid);
      this.editjcvisible=true
      this.bjid=id
      this.arrid=arrtid
    },
    EditJc(){
      console.log(this.bjid,this.arrid)
      request({
        url:`categories/${this.bjid}/attributes/${this.arrid}`,
        method:"put",
        data:{
          attr_name:this.d_form.name,
          attr_sel:"only"
        }
      }).then(res=>{
        console.log(res)
        if(res.meta.status==200){
          this.$message({
                type: "success",
                message: res.meta.msg,
                duration: 1000,
                onClose: () => {
                  this.getCateList();
                  this.handleChange();
                  this.editjcvisible=false
                },
              });
        }else if(res.meta.status==400){
          this.$message({
                type: "warning",
                message: res.meta.msg,
                duration: 1000,
                onClose: () => {
                  return
                },
            });
        }else{
          this.$message.error("修改失败")
        }
      })
    },
    //删除静态属性
    handleDelete2(id, arrtid) {
      console.log(id, arrtid);
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: `categories/${id}/attributes/${arrtid}`,
            method: "delete",
          }).then((res) => {
            if (res.meta.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
                duration: 1000,
                onClose: () => {
                  this.getCateList();
                  this.handleChange();
                },
              });
            } else {
              this.$message.error("删除失败");
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
    //添加动态参数
    addDc(){
      console.log(this.bjid)
      request({
        url:`categories/${this.bjid}/attributes`,
        method:"post",
        data:{
          attr_name:this.d_form.name,
          attr_sel:'many'
        }
      }).then(res=>{
        console.log(res)
        if(res.meta.status==201){
          this.$message({
          message:res.meta.msg,
          type: 'success',
          duration:1000,
          onClose:()=>{
            this.getCateList();
            this.handleChange();
            this.dialogFormVisible=false
          }
        });
        }else{
          this.$message.error("创建失败")
        }
      })
    },
    addJc(){
      console.log(this.bjid)
      request({
        url:`categories/${this.bjid}/attributes`,
        method:"post",
        data:{
          attr_name:this.d_form.name,
          attr_sel:'only'
        }
      }).then(res=>{
        console.log(res)
        if(res.meta.status==201){
          this.$message({
          message:res.meta.msg,
          type: 'success',
          duration:1000,
          onClose:()=>{
            this.getCateList();
            this.handleChange();
            this.dialogFormVisible2=false
          }
        });
        }else{
          this.$message.error("创建失败")
        }
      })
    }
  },
};
</script>

<style scoped lang="less">
.el-breadcrumb{
  padding: 10px;
}
.daohao {
  width: 100%;
  height: 50px;
  background: #fff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 3px solid #ccc;
  > div {
    width: 100px;
    height: 50px;
    text-align: center;
    line-height: 50px;
  }
  .active {
    box-sizing: border-box;
    color: rgb(3, 149, 202);
    border-bottom: 3px solid rgb(3, 149, 202);
  }
}
.dong {
  height: 100%;
  background: #fff;
  padding: 20px;
}
.static {
  height: 100%;
  background: #fff;
  padding: 20px;
}
</style>