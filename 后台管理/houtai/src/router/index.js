import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [

    {
        path: '/home',
        name: 'Home',
        component: Home,
        children: [{
<<<<<<< HEAD
                path: '/',
                redirect: 'sy'
            }, {
=======
                path: "/",
                redirect: "sy"
            },
            {
>>>>>>> 47cac5a12603e41ce3fee710041b1413f8b3067c
                path: 'users',
                component: () =>
                    import ('./../components/users/users.vue')
            },
            {
                path: 'rights',
                component: () =>
                    import ('./../components/rights/rights.vue')
            },
            {
                path: 'roles',
                component: () =>
                    import ('./../components/rights/roles.vue')
            },
            {
                path: 'reports',
                component: () =>
                    import ('./../components/reports/reports.vue')
            },
            {
                path: 'orders',
                component: () =>
                    import ('./../components/orders/orders.vue')
            },
            {
                path: 'goods',
                component: () =>
                    import ('./../components/goods/goods.vue')
            },
            {
                path: 'add',
                component: () =>
                    import ('./../components/goods/add.vue')
            },
            {
                path: 'categories',
                component: () =>
                    import ('./../components/goods/categories.vue')
            },
            {
                path: 'params',
                component: () =>
                    import ('./../components/goods/params.vue')
            },
            {
                path: 'sy',
<<<<<<< HEAD
                component: () =>
                    import ('./../components/sy/sy.vue')
            },
=======
                name: 'sy',
                component: () =>
                    import ("../components/sy/sy.vue")
            }
>>>>>>> 47cac5a12603e41ce3fee710041b1413f8b3067c
        ]
    },
    {
        path: '/',
        component: () =>
            import ('./../views/login.vue')
    },
    {
        path: '/login',

        component: () =>
            import ('./../views/login.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})


router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next();
    // 获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login');
    next();

})

export default router