<template>
  <div>
    <div class="users_top">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: 'sy' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="users_bottom">
      <el-input
        class="search"
        v-model="search"
        size="small"
        placeholder="输入关键字搜索"
      >
        <el-button slot="append" icon="el-icon-search" @click="getuser"></el-button>
      </el-input>

      <!-- 添加用户 -->
      <el-button type="primary" @click="show = true">添加用户</el-button>
      <div class="tianjia" v-if="show">
        <el-form
          ref="form"
          :model="sizeForm"
          label-width="80px"
          size="small"
          :rules="rules"
          class="addform"
        >
          <el-form-item label="用户名" prop="name">
            <el-input v-model="sizeForm.name"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="sizeForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="sizeForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="sizeForm.phone"></el-input>
          </el-form-item>
          <el-form-item size="large">
            <el-button type="primary" @click="onSubmit('form')" >确定</el-button>
            <el-button @click="close">取消</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column label="姓名" prop="username"> </el-table-column>
        <el-table-column label="邮箱" prop="email"> </el-table-column>
        <el-table-column label="电话" prop="mobile"> </el-table-column>
        <el-table-column label="角色" prop="role_name"> </el-table-column>
        <el-table-column label="状态" prop="value">
          <template slot-scope="scope">
            <!-- 开 关 修改状态信息 -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="stateChanged(scope.row.id, scope.row.mg_state)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" prop="sex">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="
                Edit(
                  scope.row.id,
                  scope.row.name,
                  scope.row.phone,
                  scope.row.email
                )
              "
              icon="el-icon-edit"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              @click="Delete(scope.row.id)"
              icon="el-icon-delete"
            ></el-button>
            <el-button
              size="mini"
              type="warning"
              @click="quanxian(scope.row.id)"
              icon="el-icon-setting"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 修改用户信息 -->
    <div class="xiugai" v-if="isShow">
      <el-form
        ref="form"
        :model="sizeForm"
        label-width="80px"
        size="small"
        :rules="rules2"
        class="addform"
      >
        <el-form-item label="用户名" prop="rename">
          <el-input v-model="sizeForm.rename"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="reemail">
          <el-input v-model="sizeForm.reemail"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="rephone">
          <el-input v-model="sizeForm.rephone"></el-input>
        </el-form-item>

        <el-form-item size="large">
          <el-button type="primary" @click="Submit()">修改用户信息</el-button>
          <el-button @click="reclose">取消修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  <div class="newjob" v-if="isNew">
      <el-form
        ref="form"
        :model="newjob"
        label-width="80px"
        size="small"
        :rules="rules2"
        class="addform"
      >
      <el-form-item lable="当前用户" prop="new">
        <span>当前用户</span> 
      </el-form-item>
      <el-form-item lable="当前角色" prop="new">
        <span>当前角色</span>   
      </el-form-item>
        <el-form-item label="分配新角色" prop="new">
          <el-select v-model="newjob.roleid">
            <el-option v-for="item in rolelist" :key="item.id" :label="item.roleName" :value="item.id" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="sub()">确定</el-button>
          <el-button @click="cancel()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[4, 3, 2, 1]"
      :page-size="4"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @prev-click="prev"
      @next-click="next"
    >
    </el-pagination>
  </div>
</template>

<script>
import request from "../../request/index.js"
//自定义表单验证规则
const phoneyz = (rule, value, cb) => {
  let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
  if (reg.test(value)) {
    cb();
  } else {
    cb(new Error("手机号码格式不正确"));
  }
};
export default {
  data() {
    return {
      isNew:false,
      nowname:'',
      nowjob:'',
      newjob:{
        name:"",
        roleid:""
      },
      rolelist:[]
      ,
      userid: null,
      show: false,
      isShow: false,
      queryInfo: {
        pagenum: 1,
        pagesize: 4,
      },
      tableData: null,
      search: "",
      total: null,
      sizeForm: {
        name: "",
        password: "",
        email: "",
        phone: "",
        rename: "",
        reemail: "",
        rephone: "",
      },
      rules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: phoneyz, trigger: "blur" },
          //validator 验证器
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      rules2: {
        rename: [{ message: "请输入用户名", trigger: "blur" }],
        reemail: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        rephone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: phoneyz, trigger: "blur" },
          //validator 验证器
        ],
      },
    };
  },
  methods: {
    //添加用户
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios
        .post("/api/users", {
          username: this.sizeForm.name,
          password: this.sizeForm.password,
          email: this.sizeForm.email,
          mobile: this.sizeForm.phone,
        })
        .then((res) => {
          console.log(res);
          if (res.meta.status == 201) {
            this.$message({
              message: res.meta.msg,
              type: "success",
              onClose: () => {
                this.show = false;
                this.fn();
              },
            });
            // (this.sizeForm.name = ""),
            //   (this.sizeForm.password = ""),
            //   (this.sizeForm.email = ""),
            //   (this.sizeForm.phone = "");
          } else {
            this.$message({
              message: "创建失败",
              type: "warning",
            });
          }
        });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      
    },
    //修改用户信息
    Edit(id) {
      console.log(id);
      this.userid = id;
      this.isShow = !this.isShow;
    },
    Submit() {
      let uid = this.userid;
      console.log(uid);
      console.log(this.sizeForm.reemail);
      console.log(this.sizeForm.rephone);
      request({
        url:`/users/${uid}`,
        method:'put',
        data:{
          email: this.sizeForm.reemail,
          mobile: this.sizeForm.rephone,
        }
      })
        .then((res) => {
          console.log(res);
          if (res.meta.status == 200) {
            this.$message({
              message: res.meta.msg,
              type: "success",
              onClose: () => {
                this.isShow = false;
                this.fn();
              },
            });
          } else {
            this.$message.error("删除失败，请检查重试");
          }
        });
    },

    //删除用户
    Delete(id) {
      console.log(id);
      this.$confirm("确定要删除此用户吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios.delete(`/api/users/${id}`).then((res) => {
            if (res.meta.status == 200) {
              this.$message({
                message: res.meta.msg,
                type: "success",
                onClose: () => {
                  this.fn();
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

    //getuser查询用户
    getuser(){
      console.log(
        this.search
      )
      request({
        url:`/users/${this.search}`
      }).then(res=>{
        console.log(res)
        if (res.meta.status == 200) {
            this.$message({
              message: res.meta.msg,
              type: "success",
              onClose: () => {
                this.tableData.splice(0, this.tableData.length, res.data);
              },
            });
          }else{
            this.$message.error("查无此人");
          }
      })
    },
    //权限分配
    quanxian(id) {
      request({
        url:"roles",
      }).then(res=>{
        console.log(res)
        this.rolelist=res.data
        this.newjob.id=this.rolelist.id
        })
      console.log(id)
      console.log(this.tableData)
      this.userid=id
      
      this.isNew=true
    },
    sub(){
      console.log(this.newjob.roleid)
      console.log(this.rolelist)
      request({
        url:`users/${this.userid}/role`,
        method:"put",
        data:{
          rid:this.newjob.roleid-0
        },
      }).then(res=>{
        console.log(res)
        this.isNew=false
        if(res.meta.status==200){
          this.$message({
              message: res.meta.msg,
              type: "success",
              duration:1000,
              onClose: () => {
                this.fn()
              },
            });
          }else{
            this.$message.error("修改失败");
          }
      })
    },
    cancel(){
      this.isNew=false
    }
    ,
    //分液器
    //改变每页条数
    handleSizeChange(e) {
      this.queryInfo.pagesize = e;
      this.fn();
    },
    //改变当前页
    handleCurrentChange(e) {
      this.queryInfo.pagenum = e;
      this.fn();
    },
    prev() {
      this.queryInfo.pagenum--;
      this.fn();
    },
    next() {
      this.queryInfo.pagenum++;
      this.fn();
    },
    //封装获取列表数据函数
    fn() {
      this.axios
        .get("/api/users", {
          params: this.queryInfo,
        })
        .then((res) => {
          // console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.error("查询用户列表失败！");
          } else {
            this.total = res.data.total;
            this.tableData = res.data.users;
          }
        });
    },
    //关闭添加窗口
    close() {
      this.show = false;
    },
    //关闭修改窗口
    reclose() {
      this.isShow = false;
    },
    //修改用户状态
    stateChanged(id, state) {
      console.log(id, state);
      this.axios.put(`/api/users/${id}/state/${state}`).then((res) => {
        if (res.meta.status == 200) {
          this.$message({
            message: res.meta.msg,
            type: "success",
            onClose: () => {
              this.fn();
            },
          });
        } else {
          this.$message.error("状态修改失败");
        }
      });
    },
  },
  mounted() {
    this.fn();
  },
};
</script>
<style lang="less" scoped>
.users_top {
  padding: 10px;
}


.users_bottom {
  margin: 10px;
  background: white;
  .search {
    width: 400px;
    height: 50px;
    padding: 20px 10px;
    box-sizing: border-box;
    
  }
  .el-input--mini {
    height: 60px;
  }
}
.tianjia {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100vh;
  z-index: 999;
  background: rgba(0, 0, 0, 0.3);
  .addform {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40%;
    padding: 50px;
    border-radius: 30px;
    background: #fff;
    .el-input__inner {
      height: 50px;
    }
  }
}

.xiugai {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100vh;
  z-index: 999;
  background: rgba(0, 0, 0, 0.3);
  .addform {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40%;
    border-radius: 30px;
    padding: 50px;
    background: #fff;
    .el-input__inner {
      height: 50px;
    }
  }
}

.newjob {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100vh;
  z-index: 999;
  background: rgba(0, 0, 0, 0.3);
  .addform {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40%;
    border-radius: 30px;
    padding: 50px;
    background: #fff;
    .el-input__inner {
      height: 50px;
    }
  }
}
</style>