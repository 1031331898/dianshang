<template>
  <div>
    <div class="users_top">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
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
      />
      <el-table
        :data="
          tableData.filter(
            (data) =>
              !search || data.name.toLowerCase().includes(search.toLowerCase())
          )
        "
        style="width: 100%"
      >
        <el-table-column label="#" prop="date"> </el-table-column>

        <el-table-column label="姓名" prop="name"> </el-table-column>
        <el-table-column label="邮箱" prop="emila"> </el-table-column>
        <el-table-column label="电话" prop="sex"> </el-table-column>
        <el-table-column label="角色" prop="sex"> </el-table-column>

        <el-table-column label="状态" prop="value">
          <template slot-scope="scope">
            <!-- 开 关 -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="stateChanged(scope.row.id, scope.row.mg_state)"
            >
            </el-switch> 
            </template>
        </el-table-column>

        <el-table-column label="操作" prop="sex">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >Edit</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >Delete</el-button
            >
          </template>
        </el-table-column>

      



      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        pagenum: 5,
        pagesize: 4,
      },

      tableData: [
        {
          date: "2016-05-02",
          name: "1",
          sex: "man",
          value: true,
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "2",
          sex: "man",
          value: true,

          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "3",
          sex: "man",
          value: true,

          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "4",
          sex: "man",
          value: false,

          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
      search: "",
    };
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
  },
  mounted() {
    this.axios
      .get("/api/users", {
        params: this.queryInfo,
      })
      .then((res) => {
        console.log(res);

        if (res.data.meta.status !== 200) {
          return this.$message.error("查询用户列表失败！");
        }
        console.log(res.data.data.total);
        console.log(res.data.data.users);

        // this.total = res.data.total this.userlist =
      });
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
    width: 200px;
    padding: 20px 10px;
  }
  .el-input--mini {
    height: 40px;
  }
}
</style>