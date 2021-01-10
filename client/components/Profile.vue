<template>
  <div>
    <navbar :connected="connected" @log-out="logOut"></navbar>
    <section>
      <h2 id="mespokémons">Mes Pokémons</h2>
      <article v-for="pokemon in team.pokemons" :key="pokemon.teamid">
        <div
          class="pokemon-content"
          v-if="editingNickname.id !== pokemon.teamid"
        >
          <div class="pokemon-title">
            <h2>No.{{ pokemon.no }} {{ pokemon.name }}</h2>
          </div>

          <router-link class="pokemon-essential" :to="'/pokemon/' + pokemon.id">
            <div class="pokemon-nickname">
              <h2 v-if="pokemon.nickname !== null && pokemon.nickname !== ''">
                {{ pokemon.nickname }}
              </h2>
              <h2 v-else>{{pokemon.name }}</h2>
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

          <div class="pokemon-button">
            <button @click="editNickname(pokemon)">Modifier le surnom</button>
          </div>

          <div class="pokemon-type">
            <h3 id="type">Type:</h3>
            <div class="pokemon-type-img">
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
          <div class="pokemon-button">
            <button @click="removeFromPc(pokemon.teamid)">Retirer du PC</button>
          </div>
        </div>
        <div class="pokemon-content" v-else>
          <div class="pokemon-essential">
            <div class="pokemon-nickname">
              <input type="text" v-model="editingNickname.nickname" />
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
          <div class="pokemon-button">
            <button @click="sendEditNickname()">Valider</button>
            <button @click="abortEditNickname()">Annuler</button>
          </div>
          <h3>Type :</h3>

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
        nickname: "",
      },
    };
  },
  methods: {
    logOut() {
      this.$emit("log-out");
    },
    editNickname(pokemon) {
      this.editingNickname.id = pokemon.teamid;
      this.editingNickname.nickname = pokemon.nickname;
    },
    sendEditNickname() {
      this.$emit("update-nickname", this.editingNickname);
      this.abortEditNickname();
    },
    abortEditNickname() {
      this.editingNickname = {
        id: -1,
        nickname: "",
      };
    },
    removeFromPc(pokemonId) {
      this.$emit("remove-from-pc", pokemonId);
    },
  },
};
</script>

<style scoped>

  
  section article {
  color: rgba(2, 1, 0, 0.726);
  margin: 0 10%;
  background-color: #eeeeee;
  border-radius: 40px;
}

  #mespokémons {
  color: black;
  font-family: "Montserrat", sans-serif;
  font-size: 35px;
  margin: 0;
  font-weight: 600;
  position: relative;
  left: 3em;
}
  
  button  {
  border-color: black;
  background-color: gold;
  font-weight: 600;
  font-variant: small-caps;
  border-radius: 10px;
}

  div#first {
  background-color: rgb(187, 170, 170);
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

  .pokemon-content {
  display: flex;
  
}

  section .pokemon-img {
  width: 80px;
  height: 80px;
  background-size: cover;
}

  section .type {
  height: 15px;
  width: 70px;
}

  section .pokemon-type {
  display: flex;
  align-items: center;
  margin: 0 20px;
}

  section .pokemon-type-img {
  display: flex;
  width: 140px;
}

  section .pokemon-button  {
  border-radius: 10px;
  display: flex;
  align-items: center;
  margin: 0 10px;
  border: 10px;
}

  article h2 {
  font-size: 20px;
}

  article h3 {
  font-size: 18px;

}

</style>