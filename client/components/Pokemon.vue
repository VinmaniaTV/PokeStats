<template>
  <div class="main">
    <navbar :connected="connected" @log-out="logOut"></navbar>
    <div class="pokemon-info-banner">
      <h2>Informations</h2>
    </div>
    <section v-if="!modifying">
      <article>
        <div class="pokemon-name">
          <h3>
            {{
              pokedex[pokedex.findIndex((i) => i.id == $route.params.id)].name
            }}
          </h3>
        </div>
        <div
          class="pokemon-image"
          v-if="
            pokedex[pokedex.findIndex((i) => i.id == $route.params.id)].image !=
              null &&
            pokedex[pokedex.findIndex((i) => i.id == $route.params.id)].image !=
              'null' &&
            pokedex[pokedex.findIndex((i) => i.id == $route.params.id)].image !=
              ''
          "
          :style="{
            backgroundImage:
              'url(' +
              pokedex[pokedex.findIndex((i) => i.id == $route.params.id)]
                .image +
              ')',
          }"
        ></div>
        <div
          class="pokemon-image"
          v-else
          :style="{ backgroundImage: 'url(../img/unknownPokemon.png)' }"
        ></div>
        <button
          @click="
            editPokemon(
              pokedex[pokedex.findIndex((i) => i.id == $route.params.id)]
            )
          "
        >
          Modifier les informations
        </button>
      </article>
      <aside>
        <div class="pokemon-no">
          <h4>No. Pokédex</h4>
          <h5>
            {{ pokedex[pokedex.findIndex((i) => i.id == $route.params.id)].no }}
          </h5>
        </div>
        <div class="pokemon-type">
          <h4>Type</h4>
          <div class="pokemon-type-img">
            <div
              class="type"
              :style="{
                backgroundImage:
                  'url(\'../img/type/' +
                  pokedex[pokedex.findIndex((i) => i.id == $route.params.id)]
                    .type1 +
                  '.png\')',
              }"
            ></div>
            <div
              class="type"
              v-if="
                pokedex[pokedex.findIndex((i) => i.id == $route.params.id)]
                  .type2 !== null
              "
              :style="{
                backgroundImage:
                  'url(\'../img/type/' +
                  pokedex[pokedex.findIndex((i) => i.id == $route.params.id)]
                    .type2 +
                  '.png\')',
              }"
            ></div>
          </div>
        </div>
        <div class="pokemon-stats">
          <div class="pokemon-hp">
            <h4>HP</h4>
            <h5>
              {{
                pokedex[pokedex.findIndex((i) => i.id == $route.params.id)].hp
              }}
            </h5>
          </div>
          <div class="pokemon-attack">
            <h4>Attaque</h4>
            <h5>
              {{
                pokedex[pokedex.findIndex((i) => i.id == $route.params.id)]
                  .attack
              }}
            </h5>
          </div>
          <div class="pokemon-defense">
            <h4>Défense</h4>
            <h5>
              {{
                pokedex[pokedex.findIndex((i) => i.id == $route.params.id)]
                  .defense
              }}
            </h5>
          </div>
          <div class="pokemon-spatk">
            <h4>Atk.Spé</h4>
            <h5>
              {{
                pokedex[pokedex.findIndex((i) => i.id == $route.params.id)]
                  .spatk
              }}
            </h5>
          </div>
          <div class="pokemon-spdef">
            <h4>Déf.spé</h4>
            <h5>
              {{
                pokedex[pokedex.findIndex((i) => i.id == $route.params.id)]
                  .spdef
              }}
            </h5>
          </div>
          <div class="pokemon-speed">
            <h4>Vitesse</h4>
            <h5>
              {{
                pokedex[pokedex.findIndex((i) => i.id == $route.params.id)]
                  .speed
              }}
            </h5>
          </div>
          <div class="pokemon-generation">
            <h4>Génération</h4>
            <h5>
              {{
                pokedex[pokedex.findIndex((i) => i.id == $route.params.id)]
                  .generation
              }}
            </h5>
          </div>
          <div class="pokemon-legendary">
            <h4>Légendaire</h4>
            <h5>
              {{
                pokedex[pokedex.findIndex((i) => i.id == $route.params.id)]
                  .legendary
                  ? "Oui"
                  : " Non"
              }}
            </h5>
          </div>
        </div>
        <div class="pokemon-description">
          <h4>Description</h4>
          <p
            v-if="
              pokedex[pokedex.findIndex((i) => i.id == $route.params.id)]
                .description !== null &&
              pokedex[pokedex.findIndex((i) => i.id == $route.params.id)]
                .description !== ''
            "
          >
            {{
              pokedex[pokedex.findIndex((i) => i.id == $route.params.id)]
                .description
            }}
          </p>
        </div>
      </aside>
    </section>
    <section v-else>
      <article>
        <div class="pokemon-name">
          <input type="text" v-model="editingPokemon.name" placeholder="Nom" />
        </div>
        <div
          class="pokemon-image"
          v-if="
            pokedex[pokedex.findIndex((i) => i.id == $route.params.id)].image !=
              null &&
            pokedex[pokedex.findIndex((i) => i.id == $route.params.id)].image !=
              'null' &&
            pokedex[pokedex.findIndex((i) => i.id == $route.params.id)].image !=
              ''
          "
          :style="{
            backgroundImage:
              'url(' +
              pokedex[pokedex.findIndex((i) => i.id == $route.params.id)]
                .image +
              ')',
          }"
        >
          <input
            type="text"
            v-model="editingPokemon.image"
            placeholder="Lien vers l'image"
          />
        </div>
        <div
          class="pokemon-image"
          v-else
          :style="{ backgroundImage: 'url(../img/unknownPokemon.png)' }"
        >
          <input
            type="text"
            v-model="editingPokemon.image"
            placeholder="Lien vers l'image"
          />
        </div>
        <button @click="sendEditPokemon()">Valider</button>
        <button @click="abortEditPokemon()">Annuler</button>
      </article>
      <aside>
        <div class="pokemon-no">
          <h4>No. Pokédex</h4>
          <input type="number" min="1" v-model="editingPokemon.no" />
        </div>
        <div class="pokemon-type">
          <h4>Type</h4>
          <div class="pokemon-type-select">
            <select
              name="type1"
              id="type1-select"
              v-model="editingPokemon.type1"
            >
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
            <select
              name="type2"
              id="type2-select"
              v-model="editingPokemon.type2"
            >
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
          </div>
        </div>
        <div class="pokemon-stats">
          <div class="pokemon-hp">
            <h4>HP</h4>
            <input type="number" min="0" v-model="editingPokemon.hp" />
          </div>
          <div class="pokemon-attack">
            <h4>Attaque</h4>
            <input type="number" min="0" v-model="editingPokemon.attack" />
          </div>
          <div class="pokemon-defense">
            <h4>Défense</h4>
            <input type="number" min="0" v-model="editingPokemon.defense" />
          </div>
          <div class="pokemon-spatk">
            <h4>Atk.Spé</h4>
            <input type="number" min="0" v-model="editingPokemon.spatk" />
          </div>
          <div class="pokemon-spdef">
            <h4>Déf.spé</h4>
            <input type="number" min="0" v-model="editingPokemon.spdef" />
          </div>
          <div class="pokemon-speed">
            <h4>Vitesse</h4>
            <input type="number" min="0" v-model="editingPokemon.speed" />
          </div>
          <div class="pokemon-generation">
            <h4>Génération</h4>
            <input type="number" min="1" v-model="editingPokemon.generation" />
          </div>
          <div class="pokemon-legendary">
            <h4>Légendaire</h4>
            <input
              type="checkbox"
              id="legendary-checkbox"
              v-model="editingPokemon.legendary"
            />
          </div>
        </div>
        <div class="pokemon-description">
          <h4>Description</h4>
          <textarea v-model="editingPokemon.description"> </textarea>
        </div>
      </aside>
    </section>
  </div>
</template>

<script>
const Navbar = window.httpVueLoader("./components/Navbar.vue");
module.exports = {
  components: {
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
      modifying: false,
    };
  },
  methods: {
    logOut() {
      this.$emit("log-out");
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
      this.modifying = !this.modifying;
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
      this.modifying = !this.modifying;
    },
  },
};
</script>

<style scoped>
.main {
  background-color: #bfbfbf;
}

.pokemon-info-banner {
  background-color: #64a4d8;
  border-bottom: 2px solid #4888c0;
}

.pokemon-info-banner h2 {
  color: white;
  text-shadow: 1px 1px black;
  padding: 5px 3px 3px 3px;
  margin-left: 5px;
}

section {
  display: flex;
  height: calc(100% - 124px);
}

article {
  width: 40%;
  display: flex;
  flex-direction: column;
  align-content: space-between;
}

article .pokemon-name {
  background-color: #dcb880;
  margin: 2em 5px 0 5px;
  border-radius: 20px;
}

article h3 {
  color: white;
  text-shadow: 1px 1px black;
  padding: 10px;
  margin-left: 15px;
  margin-bottom: 5px;
}

article .pokemon-image {
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
}

aside {
  width: 60%;
  height: 100%;
}

aside div:nth-child(odd) {
  background-color: #94c49c;
}

aside div:nth-child(even) {
  background-color: #84ac88;
}

.pokemon-no,
.pokemon-type,
.pokemon-hp,
.pokemon-attack,
.pokemon-defense,
.pokemon-spatk,
.pokemon-spdef,
.pokemon-speed,
.pokemon-generation,
.pokemon-legendary {
  display: flex;
  justify-content: space-between;
}

.type {
  width: 70px;
  height: 15px;
  align-self: center;
}

section .pokemon-type-img {
  display: flex;
  width: 140px;
  margin-right: 15px;
}

section h4 {
  color: white;
  text-shadow: 1px 1px black;
  padding: 2px;
  margin-left: 15px;
}

.pokemon-description h4 {
  margin: 0;
  padding-bottom: 8px;
  margin-left: 15px;
}

p {
  margin: 0;
  padding-bottom: 8px;
  color: white;
  text-shadow: 1px 1px black;
  margin-left: 15px;
  margin-right: 15px;
}

section h5 {
  color: white;
  text-shadow: 1px 1px black;
  padding: 2px;
  margin-top: 5px;
  margin-left: 15px;
  margin-right: 15px;
}

.pokemon-name input {
  padding: 10px;
  margin-left: 15px;
  margin-bottom: 5px;
  margin-top: 5px;
}

.pokemon-image input {
  padding: 0 10px;
  margin-left: 20px;
  margin-bottom: 5px;
  margin-top: 5px;
}

.pokemon-no input,
.pokemon-type input,
.pokemon-hp input,
.pokemon-attack input,
.pokemon-defense input,
.pokemon-spatk input,
.pokemon-spdef input,
.pokemon-speed input,
.pokemon-generation input,
.pokemon-legendary input {
  margin-right: 15px;
  text-align: end;
  width: 50px;
  align-items: center;
}

.pokemon-type-select {
  align-items: center;
  margin-right: 15px;
}

.pokemon-description textarea {
  width: 90%;
  margin-left: 15px;
}
</style>