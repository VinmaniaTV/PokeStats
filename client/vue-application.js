const Home = window.httpVueLoader('./components/Home.vue')
const LogIn = window.httpVueLoader('./components/LogIn.vue')
const SignUp = window.httpVueLoader('./components/SignUp.vue')
const Pokedex = window.httpVueLoader('./components/Pokedex.vue')
const Profile = window.httpVueLoader('./components/Profile.vue')
const Pokemon = window.httpVueLoader('./components/Pokemon.vue')

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: LogIn },
    { path: '/signup', component: SignUp },
    { path: '/pokedex', component: Pokedex },
    { path: '/me', component: Profile },
    { path: '/pokemon/:id', component: Pokemon },
]

const router = new VueRouter({
    routes
})

var app = new Vue({
    router,
    el: '#app',
    data: {
        pokedex: [],
        team: [],
        connected: false
    },
    async mounted() {
        const pokedex = await axios.get('api/pokedex')
        this.pokedex = pokedex.data
    },
    methods: {
        async addPokemon(pokemon) {
            const res = await axios.post('/api/pokemon', pokemon)
            this.pokedex.push(res.data)
        },
        async deletePokemon(pokemonId) {
            await axios.delete('/api/pokemon/' + pokemonId)
            const index = this.pokedex.findIndex(p => p.id === pokemonId)
            this.pokedex.splice(index, 1)
        },
        async updatePokemon(newPokemon) {
            await axios.put('/api/pokemon/' + newPokemon.id, newPokemon)
            const pokemon = this.pokedex.find(p => p.id === newPokemon.id)
            pokemon.id = newPokemon.id;
            pokemon.no = newPokemon.no;
            pokemon.name = newPokemon.name;
            pokemon.type1 = newPokemon.type1;
            pokemon.type2 = newPokemon.type2;
            pokemon.total = newPokemon.total;
            pokemon.hp = newPokemon.hp;
            pokemon.attack = newPokemon.attack;
            pokemon.defense = newPokemon.defense;
            pokemon.spatk = newPokemon.spatk;
            pokemon.spdef = newPokemon.spdef;
            pokemon.speed = newPokemon.speed;
            pokemon.generation = newPokemon.generation;
            pokemon.legendary = newPokemon.legendary;
            pokemon.description = newPokemon.description;
            pokemon.image = newPokemon.image;
        },
        async updateNickname(newPokemon) {
            console.log(newPokemon)
            await axios.put('/api/pc/' + newPokemon.id, newPokemon)
            const pokemon = this.team.pokemons.find(p => p.teamid === newPokemon.id)
            pokemon.nickname = newPokemon.nickname;
        },
        async removeFromPc(pokemonId) {
            await axios.delete('/api/pc/' + pokemonId)
            const index = this.team.pokemons.findIndex(p => p.teamid === pokemonId)
            console.log(index)
            this.team.pokemons.splice(index, 1)
        },
        async addToPc(pokemonId) {
            var pokemon = {
                id: pokemonId
            }
            const res = await axios.post('/api/pc', pokemon)
            this.team.pokemons.push(res.data)
            router.push('/me')
        },
        async addUser(newUser) {
            if (await axios.post('/api/register/', newUser)
                .catch(function(error) {
                    if (error.response.status === 400) {
                        document.getElementById('errorSignUpMessage').innerHTML = "Le pseudo est déjà pris.";
                    } else if (error.response.status === 401) {
                        document.getElementById('errorSignUpMessage').innerHTML = "L'adresse email est déjà prise.";
                    }
                })) {
                this.connected = true;
                router.push('/')
            }
        },
        async logIn(user) {
            const userTeam = await axios.post('/api/login/', user)
                .catch(function(error) {
                    if (error.response.status === 400 || error.response.status === 401) {
                        document.getElementById('errorLogInMessage').innerHTML = "La combinaison est incorrecte.";
                        return error.response;
                    }
                })
            if (userTeam.status === 200) {
                this.team = userTeam.data;
                this.connected = true;
                router.push('/')
            }
        },
        async logOut() {
            if (await axios.post('/api/logout/')
                .catch(function(error) {
                    if (error.response.status === 400 || error.response.status === 401) {
                        console.log(error)
                    }
                })) {
                this.connected = false;
                router.push('/')
            }
        }
    }
})