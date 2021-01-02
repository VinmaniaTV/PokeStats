<template>
  <div>
    <navbar @log-out="logOut" :connected="connected"></navbar>
    <section>
      <h2>Mes Pokémons</h2>
      <article v-for="pokemon in team.pokemons" :key="pokemon.teamid">
        <div class="pokemon-content" v-if="editingNickname.id !== pokemon.teamid">
          <router-link class="pokemon-essential" :to="'/pokemon/' + pokemon.id">
            <div class="pokemon-nickname">
              <h2 v-if="pokemon.nickname !== null && pokemon.nickname !== ''">{{ pokemon.nickname }}</h2>
              <h2 v-else>{{ pokemon.name }}</h2>
            </div>
            <div
              class="pokemon-img"
              v-if="
                pokemon.image != null &&
                pokemon.image != 'null' &&
                pokemon.image != ''
              "
              :style="{ backgroundImage: 'url(' + pokemon.image + ')' }"
            ></div>
            <div
              class="pokemon-img"
              v-else
              :style="{ backgroundImage: 'url(../img/unknownPokemon.png)' }"
            ></div>
          </router-link>
          <button @click="editNickname(pokemon)">Modifier le surnom</button>
          <h3>Type :</h3>
          <div class="pokemon-title">
              <h2>No.{{ pokemon.no }}</h2>
              <h2>{{ pokemon.name }}</h2>
            </div>
          <div class="pokemon-type">
            <div
              class="type"
              :style="{
                backgroundImage:
                  'url(\'../img/type/' + pokemon.type1 + '.png\')',
              }"
            ></div>
            <div
              class="type"
              v-if="pokemon.type2 !== null"
              :style="{
                backgroundImage:
                  'url(\'../img/type/' + pokemon.type2 + '.png\')',
              }"
            ></div>
          </div>
        </div>
        <div class="pokemon-content" v-else>
          <div class="pokemon-essential">
            <div class="pokemon-nickname">
              <input type="text" v-model="editingNickname.nickname">
            </div>
            <div
              class="pokemon-img"
              v-if="
                pokemon.image != null &&
                pokemon.image != 'null' &&
                pokemon.image != ''
              "
              :style="{ backgroundImage: 'url(' + pokemon.image + ')' }"
            ></div>
            <div
              class="pokemon-img"
              v-else
              :style="{ backgroundImage: 'url(../img/unknownPokemon.png)' }"
            ></div>
          </div>
          <button @click="sendEditNickname()">Valider</button>
          <button @click="abortEditNickname()">Annuler</button>
          <h3>Type :</h3>
          <div class="pokemon-title">
              <h2>No.{{ pokemon.no }}</h2>
              <h2>{{ pokemon.name }}</h2>
            </div>
          <div class="pokemon-type">
            <div
              class="type"
              :style="{
                backgroundImage:
                  'url(\'../img/type/' + pokemon.type1 + '.png\')',
              }"
            ></div>
            <div
              class="type"
              v-if="pokemon.type2 !== null"
              :style="{
                backgroundImage:
                  'url(\'../img/type/' + pokemon.type2 + '.png\')',
              }"
            ></div>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script>
const Navbar = window.httpVueLoader("./components/Navbar.vue");
module.exports = {
  props: {
    team: { type: Object },
    connected: { type: Boolean },
  },
  components: {
    Navbar,
  },
  data() {
    return {
      editingNickname: {
        id: -1,
        nickname: '',
      }
    };
  },
  methods: {
    logOut() {
      this.$emit("log-out");
    },
    editNickname (pokemon) {
      this.editingNickname.id = pokemon.teamid
      this.editingNickname.nickname = pokemon.nickname
    },
    sendEditNickname () {
      this.$emit('update-nickname', this.editingNickname)
      this.abortEditNickname()
    },
    abortEditNickname () {
      this.editingNickname = {
        id: -1,
        nickname: ''
      }
    },
  },
};
</script>

<style scoped>
div#first {
  background-color: rgb(141, 128, 128);
}
div#first div {
  display: inline-block;
  width: 48%;
}
div#first div.gauche {
  background-color: rgb(185, 178, 178);
}
div#first div.droite {
  vertical-align: top;
}
div#first div h6,
h3,
input {
  margin-left: 35px;
  margin-bottom: 10px;
}
</style>