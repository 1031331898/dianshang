import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import axios from 'axios'
import VueAxios from 'vue-axios'
//vue-table-with-tree-grid 树形结构
import ZkTable from 'vue-table-with-tree-grid'

Vue.use(ZkTable)

//富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)
    //echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
    // 添加请求拦截器
axios.interceptors.request.use(function(config) {
    // 在发送请求之前做些什么
    let token = sessionStorage.getItem('token')
    if (token) {
        config.headers.Authorization = token
    }
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});


// 添加响应拦截器
axios.interceptors.response.use(function(response) {
    // 对响应数据做点什么
    //如果token失效时跳转到登录页
    if (response.data.status === 400) {
        router.replace('/')
    }

    return response.data;
}, function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next()
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

Vue.use(VueAxios, axios)
Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')