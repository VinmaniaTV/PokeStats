const Home = window.httpVueLoader('./components/Home.vue')
const LogIn = window.httpVueLoader('./components/LogIn.vue')
const SignUp = window.httpVueLoader('./components/SignUp.vue')
const Pokedex = window.httpVueLoader('./components/Pokedex.vue')
const Profile = window.httpVueLoader('./components/Profile.vue')

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: LogIn },
    { path: '/signup', component: SignUp },
    { path: '/pokedex', component: Pokedex },
    { path: '/me', component: Profile },
]

const router = new VueRouter({
    routes
})

var app = new Vue({
    router,
    el: '#app',
    data: {

    },
    async mounted() {

    },
    methods: {

    }
})