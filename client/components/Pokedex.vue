<template>
  <div>
    <navbar :connected="connected" @log-out="logOut"></navbar>
    <section>
      <nav>
        <h2>Pokédex</h2>
      </nav>
      <add-pokemon
        @add-pokemon="addPokemon"
        :show="showNewPokemon"
      ></add-pokemon>
      <button id="ajouter-pokemon" @click="showNewPokemon = !showNewPokemon" v-if="!showNewPokemon">
        Ajouter un nouveau Pokémon
      </button>
      <button @click="showNewPokemon = !showNewPokemon" v-else>Annuler</button>
      <article v-for="pokemon in pokedex" :key="pokemon.id">
        <div class="pokemon-content" v-if="editingPokemon.id !== pokemon.id">
          <router-link class="pokemon-essential" :to="'/pokemon/' + pokemon.id">
            <div class="pokemon-title">
              <h2>{{ pokemon.name }}</h2>
              <h2>No.{{ pokemon.no }}</h2>
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
          <div class="pokemon-type">
            <h3>Type:</h3>
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
            <button @click="deletePokemon(pokemon.id)">Supprimer</button>
            <button @click="editPokemon(pokemon)">Modifier</button>
            <button @click="addToPc(pokemon.id)" v-if="connected">
              Ajouter au PC
            </button>
          </div>
        </div>
        <div class="pokemon-content" v-else>
          <div class="pokemon-title">
            <h2>
              No. <input type="number" v-model="editingPokemon.no" min="1" /> -
              <input type="text" v-model="editingPokemon.name" />
            </h2>
          </div>
          <select name="type1" id="type1-select" v-model="editingPokemon.type1">
            <option value="Bug">Insecte</option>
            <option value="Dark">Ténèbres</option>
            <option value="Dragon">Dragon</option>
            <option value="Electric">Electrik</option>
            <option value="Fairy">Fée</option>
            <option value="Fighting">Combat</option>
            <option value="Fire">Feu</option>
            <option value="Flying">Vol</option>
            <option value="Ghost">Spectre</option>
            <option value="Grass">Plante</option>
            <option value="Ground">Sol</option>
            <option value="Ice">Glace</option>
            <option value="Normal">Normal</option>
            <option value="Poison">Poison</option>
            <option value="Psychic">Psy</option>
            <option value="Rock">Roche</option>
            <option value="Steel">Acier</option>
            <option value="Water">Eau</option>
          </select>
          <select name="type2" id="type2-select" v-model="editingPokemon.type2">
            <option value="">Aucun</option>
            <option value="Bug">Insecte</option>
            <option value="Dark">Ténèbres</option>
            <option value="Dragon">Dragon</option>
            <option value="Electric">Electrik</option>
            <option value="Fairy">Fée</option>
            <option value="Fighting">Combat</option>
            <option value="Fire">Feu</option>
            <option value="Flying">Vol</option>
            <option value="Ghost">Spectre</option>
            <option value="Grass">Plante</option>
            <option value="Ground">Sol</option>
            <option value="Ice">Glace</option>
            <option value="Normal">Normal</option>
            <option value="Poison">Poison</option>
            <option value="Psychic">Psy</option>
            <option value="Rock">Roche</option>
            <option value="Steel">Acier</option>
            <option value="Water">Eau</option>
          </select>
          <input
            type="text"
            v-model="editingPokemon.image"
            placeholder="Lien vers l'image"
          />
          <div>
            <button @click="sendEditPokemon()">Valider</button>
            <button @click="abortEditPokemon()">Annuler</button>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script>
const AddPokemon = window.httpVueLoader("./components/AddPokemon.vue");
const Navbar = window.httpVueLoader("./components/Navbar.vue");
module.exports = {
  components: {
    AddPokemon,
    Navbar,
  },
  props: {
    pokedex: { type: Array, default: [] },
    connected: { type: Boolean },
  },
  data() {
    return {
      editingPokemon: {
        id: -1,
        no: -1,
        name: "",
        type1: "",
        type2: null,
        total: -1,
        hp: -1,
        attack: -1,
        defense: -1,
        spatk: -1,
        spdef: -1,
        speed: -1,
        generation: -1,
        legendary: false,
        description: "",
        image: "",
      },
      showNewPokemon: false,
    };
  },
  methods: {
    addPokemon(newPokemon) {
      this.$emit("add-pokemon", newPokemon);
      this.showNewPokemon = !this.showNewPokemon;
    },
    deletePokemon(pokemonId) {
      this.$emit("delete-pokemon", pokemonId);
    },
    editPokemon(pokemon) {
      this.editingPokemon.id = pokemon.id;
      this.editingPokemon.no = pokemon.no;
      this.editingPokemon.name = pokemon.name;
      this.editingPokemon.type1 = pokemon.type1;
      this.editingPokemon.type2 = pokemon.type2;
      this.editingPokemon.total = pokemon.total;
      this.editingPokemon.hp = pokemon.hp;
      this.editingPokemon.attack = pokemon.attack;
      this.editingPokemon.defense = pokemon.defense;
      this.editingPokemon.spatk = pokemon.spatk;
      this.editingPokemon.spdef = pokemon.spdef;
      this.editingPokemon.speed = pokemon.speed;
      this.editingPokemon.generation = pokemon.generation;
      this.editingPokemon.legendary = pokemon.legendary;
      this.editingPokemon.description = pokemon.description;
      this.editingPokemon.image = pokemon.image;
    },
    sendEditPokemon() {
      this.$emit("update-pokemon", this.editingPokemon);
      this.abortEditPokemon();
    },
    abortEditPokemon() {
      this.editingPokemon = {
        id: -1,
        no: -1,
        name: "",
        type1: "",
        type2: null,
        total: -1,
        hp: -1,
        attack: -1,
        defense: -1,
        spatk: -1,
        spdef: -1,
        speed: -1,
        generation: -1,
        legendary: false,
        description: "",
        image: "",
      };
    },
    addToPc(pokemonId) {
      this.$emit("add-to-pc", pokemonId);
    },
    logOut() {
      this.$emit("log-out");
    },
  },
};
</script>

<style scoped>


button {
  border-color: black;
  background-color: gold;
  font-weight: 600;
  font-variant: small-caps;
  border-radius: 10px;
  margin-left: 50em;
}

section {
  background-color: oldlace;
  left: 10%;
}

section nav {
  background: url("../img/bgPokedex.png");
  background-size: cover;
  height: 15em;
}

section nav h2 {
  color: black;
  font-family: "Montserrat", sans-serif;
  font-size: 60px;
  margin: 0;
  font-weight: 900;
  letter-spacing: 0.966667px;
  line-height: 16.8px;
  position: relative;
  left: 9em;
  top: calc(100% - 70px);
  max-width: 100em;
}

section article {
  color: rgba(2, 1, 0, 0.726);
  margin: 0 10%;
  background-color: #eeeeee;
  border-radius: 40px;
}

section div h3 {
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0.966667px;
  line-height: 16.8px;
  position: relative;
  right: 20px;
}

section h1 {
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}
section ul li {
  list-style-type: none;
  color: green;
  background-color: rgb(216, 210, 210);
  font-size: 30px;
  border-radius: 1em;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}

section ul li:hover {
  background-color: rgb(65, 221, 65);
  transition: 0 2s all;
}

section a.nav {
  text-decoration: none;
}

section .type {
  height: 15px;
  width: 70px;
}

section .pokemon-content {
  display: flex;
}

section .pokemon-title {
  display: flex;
}

section .pokemon-title h2 {
  margin: 10px;
  font-size: 20px;
}

section .pokemon-img {
  width: 80px;
  height: 80px;
  background-size: cover;
}

section .pokemon-essential {
  color: black;
  width: 100%;
  margin: 30px;
}

section .pokemon-essential:hover {
  color: #f93d32;
  text-decoration: none;
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

section .pokemon-button {
  border-radius: 10px;
  display: flex;
  align-items: center;
  margin: 0 10px;
  border: 10px;
}

section .pokemon-button button {
  border-color: black;
  background-color: gold;
  font-weight: 600;
  font-variant: small-caps;
  margin: 0 5px;
  border-radius: 10px;
  max-width: 60%;
}


</style>