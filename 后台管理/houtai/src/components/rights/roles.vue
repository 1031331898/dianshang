<template>
  <div>
    <div class="users_top">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home/sy' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="tianjia">
      <el-button type="primary" @click="addM()">添加角色</el-button>
    </div>

    <el-table :data="tableData" border stripe>
      <el-table-column label="" prop="" type="expand">
        <template slot-scope="scope">
          <el-row
            v-for="item1 in scope.row.children"
            :key="item1.id"
            class="centerRow"
          >
            <!-- 这一列，专门渲染 一级权限 -->
            <el-col :span="5">
              <el-tag closable @click="remove(scope.row.id, item1.id)">{{
                item1.authName
              }}</el-tag>
              <i class="el-icon-caret-right" ></i>
            </el-col>
            <!-- 还剩余 19 列，分配给二三级权限 -->
            <el-col :span="19">
              <!-- 这里显示二三级权限 -->
              <el-row
                v-for="item2 in item1.children"
                :key="item2.id"
                class="centerRow"
              >
                <el-col :span="6">
                  <el-tag closable type="success" @click="remove2(scope.row.id, item2.id)">{{ item2.authName }}</el-tag>
                  <i class="el-icon-caret-right" ></i>
                </el-col>
                <el-col :span="18">
                  <el-tag
                    closable
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    type="warning"
                    @click="remove3(scope.row.id, item3.id)"
                    >{{ item3.authName }}</el-tag
                  >
                  <i class="el-icon-caret-right"></i>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="#" type="index"> </el-table-column>
      <el-table-column label="角色名称" prop="roleName"> </el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
      <el-table-column align="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row.id)"
            icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)"
            icon="el-icon-delete"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="quanxian(scope.row)"
            icon="el-icon-setting"
            >权限分配</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加角色 -->
    <div class="tianjia2" v-if="isShow">
      <el-form
        ref="form"
        :model="peolist"
        label-width="80px"
        size="small"
        class="tjf"
      >
        <el-form-item
          label="角色名称"
          prop="rename"
          :rules="[{ required: true, message: '请输入角色名称' }]"
        >
          <el-input v-model="peolist.rename"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="remiaoshu">
          <el-input v-model="peolist.remiaoshu"></el-input>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="Submit()">提交</el-button>
          <el-button @click="reclose">取消修改</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 编辑角色 -->
    <div class="bianji" v-if="isBianji">
      <el-form
        ref="form"
        :model="bjlist"
        label-width="80px"
        size="small"
        class="bjf"
      >
        <el-form-item
          label="角色名称"
          prop="bjname"
          :rules="[{ required: true, message: '请输入要修改的角色名称' }]"
        >
          <el-input v-model="bjlist.bjname"></el-input>
        </el-form-item>

        <el-form-item size="large">
          <el-button type="primary" @click="Sub()">提交</el-button>
          <el-button @click="reclose">取消修改</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 权限分配 -->
    <div class="bianji" v-if="isBianji">
      <el-form
        ref="form"
        :model="bjlist"
        label-width="80px"
        size="small"
        class="bjf"
      >
        <el-form-item
          label="角色名称"
          prop="bjname"
          :rules="[{ required: true, message: '请输入要修改的角色名称' }]"
        >
          <el-input v-model="bjlist.bjname"></el-input>
        </el-form-item>

        <el-form-item size="large">
          <el-button type="primary" @click="Sub()">提交</el-button>
          <el-button @click="reclose">取消修改</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 权限菜单树 -->
    <el-dialog class="menu_tree" :visible.sync="isTree" title="分配权限">
      <!-- 分配权限的对话框 --> 
      <!-- 权限菜单 --> 
    <el-tree 
    ref="tree" 
    :data="tree" 
    show-checkbox 
    node-key="id" 
    default-expand-all
    class="tree_c"
    :props="treeprops"
    ></el-tree>
      <span 
      slot="footer" 
      class="dialog-footer"> 
      <el-button 
      @click="cancel2"
      >取 消</el-button> 
      <el-button 
      type="primary" 
      @click="sure">
      确 定</el-button> 
      </span> 
    </el-dialog>

  </div>
</template>

<script>
import request from "./../../request/index.js";
export default {
  data() {
    return {
      defaultCheckedKeys:"",
      treeConfig:"",
      tableData: [],
      search: "",
      isShow: false,
      isBianji: false,
      isTree:false,
      sizeForm: "",
      peolist: {
        rename: "",
        remiaoshu: "",
      },
      tree:[],
      diguitree:[]
      ,
      treeprops:{
        label:'authName',
        children:'children'
      },
      bjid: "",
      bjlist: {
        bjname: "",
      },
    };
  },
  methods: {
    //删除指定角色的权限和其对应的子权限
    remove(jid, zid) {
      console.log(jid, zid);
      this.$confirm("确定删除吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: `roles/${jid}/rights/${zid}`,
            method:"delete"
          }).then((res) => {
            console.log(res);
            if (res.meta.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
                duration: 1000,
                onClose: () => {
                  this.req()
                },
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            duration: 1000,
          });
        });
    },
    remove3(jid3, zid3) {
      console.log(jid3, zid3);
      this.$confirm("确定删除吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: `roles/${jid3}/rights/${zid3}`,
            method:"delete"
          }).then((res) => {
            console.log(res);
            if (res.meta.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
                duration: 1000,
                onClose: () => {
                  this.req()
                },
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            duration: 1000,
          });
        });
    },
    remove2(jid2, zid2) {
      console.log(jid2, zid2);
      this.$confirm("确定删除吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: `roles/${jid2}/rights/${zid2}`,
            method:"delete"
          }).then((res) => {
            console.log(res);
            if (res.meta.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
                duration: 1000,
                onClose: () => {
                  this.req()
                },
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            duration: 1000,
          });
        });
    },
    //添加角色
    addM() {
      this.isShow = !this.isShow;
    },
    Submit() {
      request({
        url: "roles",
        method: "post",
        data: {
          roleName: this.peolist.rename,
          roleDesc: this.peolist.remiaoshu,
        },
      }).then((res) => {
        if (res.meta.status == 201) {
          this.$message({
            message: res.meta.msg,
            type: "success",
            onClose: () => {
              this.isShow = false;
              this.req();
            },
          });
        } else {
          this.$message.error(res.meta.msg);
        }
      });
    },

    handleEdit(id) {
      this.bjid = id;
      this.isBianji = !this.isBianji;
    },

    Sub() {
      request({
        url: `roles/${this.bjid}`,
        method: "put",
        data: {
          roleName: this.bjlist.bjname,
        },
      }).then((res) => {
        console.log(res);
        if (res.meta.status == 200) {
          this.$message({
            message: res.meta.msg,
            type: "success",
            duration: 1000,
            onClose: () => {
              this.isBianji = false;
              this.req();
            },
          });
        } else {
          this.$message.error(res.meta.msg);
        }
      });
    },
    handleDelete(id) {
      console.log(id);
      this.$confirm("确定删除吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request({
            url: `roles/${id}`,
            method: "delete",
          }).then((res) => {
            console.log(res);
            if (res.meta.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
                duration: 1000,
                onClose: () => {
                  this.req();
                },
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            duration: 1000,
          });
        });
    },
    //权限分配
    quanxian(row) {
      console.log(row.id)
      this.bjid = row.id;
      this.isTree=true
      request({
        url: "rights/tree",
        method: "get",
      }).then((res) => {
        console.log(res);
        this.tree=res.data
        this.digui(row,this.diguitree)
      });
    },
    cancel2(){
      this.tree=false
      return
    },
    sure(){
      console.log(this.$refs.tree.getCheckedKeys(),
      this.$refs.tree.getHalfCheckedKeys())
      request({
        url:`roles/${this.bjid}/rights`,
        method:"post",
        data:{
          rids:[this.$refs.tree.getCheckedKeys(),this.$refs.tree.getHalfCheckedKeys()].join('')
        }
      }).then(res=>{
        console.log(res)
        if(res.meta.status==200){
          this.$message({
                type: "success",
                message: "更新成功!",
                duration: 1000,
                onClose: () => {
                  this.req();
                  this.isTree=false
                },
              });
        }else{
          this.$message.error("更新失败")
        }
      })
    }
    ,

    //递归遍历所有不含children的对象id
    digui(node,arr){
      if(!node.children){
        arr.push(node.id)
      }else{
        node.children.forEach(item => {
          this.digui(item,arr)
        });
      }
    },

    //封装的列表获取数据
    req() {
      request({
        url: "roles",
        method: "get"
      }).then((res) => {
        if (res.meta.status == 200) {
          console.log(res);
          this.tableData = res.data;
        }
      });
    },
    reclose() {
      this.isShow = false;
      this.isBianji = false;
    },
  },
  mounted() {
    this.req();
  },
};
</script>
<style lang="less" scoped>
.users_top{
  padding: 10px;
}
.tianjia {
  width: 100px;
  height: 30px;
  margin: 20px 0 20px 20px;
  button {
    width: 100px;
  }
}

.tianjia2 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100vh;
  z-index: 999;
  background: rgba(0, 0, 0, 0.3);
  .tjf {
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
.bianji {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100vh;
  z-index: 999;
  background: rgba(0, 0, 0, 0.3);
  .bjf {
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
.centerRow {
  .el-tag {
    margin: 10px;
  }
}
.menu_tree{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  z-index: 1;
  background: rgba(0, 0, 0, 0.3);
  
}
</style>>
