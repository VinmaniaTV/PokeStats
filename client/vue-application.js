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
        async addUser(newUser) {
            if (await axios.post('/api/register/', newUser)
                .catch(function(error) {
                    if (error.response.status === 400) {
                        document.getElementById('errorMessage').innerHTML = "Le pseudo est déjà pris.";
                    } else if (error.response.status === 401) {
                        document.getElementById('errorMessage').innerHTML = "L'adresse email est déjà prise.";
                    }
                })) {
                router.push('/')
            }
        },
        async logIn(user) {
            const res = await axios.post('/api/login/', user)
                .catch(function(error) {
                    if (error.response.status === 401) {
                        console.log(error)
                    }
                })
            this.connected = (res.data > 0 || res.data !== null);
        }
    }
})