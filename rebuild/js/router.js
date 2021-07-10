const Note = {template: '<div>Note</div>'}
const View = {template: '<div>View</div>'}
const Write = {template: '<div>Write</div>'}
const Login = {template: '<div>Login</div>'}

const routes = [
    {
        path: '/',
        redirect: '/note',
        name: '首页'
    },
    {
        path: '/note',
        component: Note,
        name: '记事本',
        icon: {
            linener: ['#ed5816', '#d34100'],
            light: '#ffa882',
            deep: '#d34100'
        },
        showHome:true
    },
    {
        path: '/write',
        component: Write,
        name: '写日志',
        icon: {
            linener: ['#359dfc', '#0946ae'],
            light: '#3085e9',
            deep: '#0049ac'
        },
        showHome:true
    },
    {
        path: '/view',
        component: View,
        name: '看日志',
        icon: {
            linener: ['#32cd7c', '#14984b'],
            light: '#32cd7c',
            deep: '#14984b'
        },
        showHome:true
    },
    {
        path: '/login',
        component: Login,
        name: '登录',
        icon: {
            linener: ['#32cd7c', '#14984b'],
            light: '#32cd7c',
            deep: '#14984b'
        }
    },
    { path: '/:pathMatch(.*)*', name: '404', redirect: '/note', },
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes
})