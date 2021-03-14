<template>
  <div>
    <div class="home_top">
      <div class="box1">
        <span>电商后台管理系统</span>
      
      </div>
      <div class="box2">
        <button @click="logout" type="info">退出</button>
      </div>
    </div>
    <div class="home_center">
      <div class="home_left">
        <div class="home_left_top">
          <img src="../assets/图层1@2x.png" alt="">
        </div>
        <el-menu 
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#333744"
          text-color="#fff"
          :router=true
            :unique-opened=true
        >
          <el-submenu :index="item.id+'-1'+''" v-for="item in list" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group>
              <router-link :to="'/home/'+ite.path" :index="ite.id+'-6'+''"  v-for="ite in item.children" :key="ite.id" tag="el-menu-item">{{ite.authName}}</router-link>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </div>

      <div class="home_right">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
// import Request from '../request/index.js'
export default {
  data(){
    return{
      list:null,
      icon_list:[
        "el-icon-user",
        "el-icon-location",
        "el-icon-document",
        "el-icon-goods",
        "el-icon-data-line"
      ]
    }
  },
  methods: {
    logout(){
      window.sessionStorage.clear();
      // this.$router.push('/login')
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
  created () {
    this.axios.get('/api/menus').then(res=>{
      console.log(res)
      this.list = res.data
    })
    }
  } 
</script>

<style lang="less" scoped>
* {
  padding: 0;
  margin: 0;
}
html,
body {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}

.home_top {
  width: 100%;
  height: 60px;
  background: #373d41;
  display: flex;
  justify-content: space-between;
  .box1 {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 20px;
    margin-left: 10px;
    color: #ccc;
  }
  .box2 {
    width: 100px;
    display: flex;
    align-items: center;
    button {
      padding: 10px 20px;
    }
  }
}
.home_center {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: space-between;
  .home_left {
    height: 127%;
    background: #333744;
    width: 200px;
  }
  .home_right {
    flex: 1;
    background: #EAEDF1;
  }
}
</style>