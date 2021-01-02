<template>
  <div>
    <navbar @log-out="logOut" :connected="connected"></navbar>
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
          :style="{
            backgroundImage:
              'url(' +
              pokedex[pokedex.findIndex((i) => i.id == $route.params.id)]
                .image +
              ')',
          }"
        ></div>
      </article>
      <aside>
        <div class="pokemon-no">
          <h4>No. Pokédex</h4>
          <h4>
            {{ pokedex[pokedex.findIndex((i) => i.id == $route.params.id)].no }}
          </h4>
        </div>
        <div class="pokemon-type">
          <h4>Type</h4>
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
        <div class="pokemon-stats">
          <div class="pokemon-hp">
            <h4>HP</h4>
            <h4>
              {{
                pokedex[pokedex.findIndex((i) => i.id == $route.params.id)].hp
              }}
            </h4>
          </div>
          <div class="pokemon-attack">
            <h4>Attaque</h4>
            <h4>
              {{
                pokedex[pokedex.findIndex((i) => i.id == $route.params.id)]
                  .attack
              }}
            </h4>
          </div>
          <div class="pokemon-defense">
            <h4>Défense</h4>
            <h4>
              {{
                pokedex[pokedex.findIndex((i) => i.id == $route.params.id)]
                  .defense
              }}
            </h4>
          </div>
          <div class="pokemon-spatk">
            <h4>Atk.Spé</h4>
            <h4>
              {{
                pokedex[pokedex.findIndex((i) => i.id == $route.params.id)]
                  .spatk
              }}
            </h4>
          </div>
          <div class="pokemon-spdef">
            <h4>Déf.spé</h4>
            <h4>
              {{
                pokedex[pokedex.findIndex((i) => i.id == $route.params.id)]
                  .spdef
              }}
            </h4>
          </div>
          <div class="pokemon-speed">
            <h4>Vitesse</h4>
            <h4>
              {{
                pokedex[pokedex.findIndex((i) => i.id == $route.params.id)]
                  .speed
              }}
            </h4>
          </div>
          <div class="pokemon-generation">
            <h4>Génération</h4>
            <h4>
              {{
                pokedex[pokedex.findIndex((i) => i.id == $route.params.id)]
                  .generation
              }}
            </h4>
          </div>
          <div class="pokemon-legendary">
            <h4>Légendaire</h4>
            <h4>
              {{
                pokedex[pokedex.findIndex((i) => i.id == $route.params.id)]
                  .legendary
                  ? "Oui"
                  : " Non"
              }}
            </h4>
          </div>
        </div>
        <div class="pokemon-description">
          <h4>Description</h4>
          <p>
            {{
              pokedex[pokedex.findIndex((i) => i.id == $route.params.id)]
                .description
            }}
          </p>
        </div>
      </aside>
      <button @click="editPokemon(pokedex[pokedex.findIndex((i) => i.id == $route.params.id)])">Modifier les informations</button>
    </section>
    <section v-else>
      <article>
        <div class="pokemon-name">
          <input type="text" v-model="editingPokemon.name" placeholder="Nom" />
        </div>
        <div
          class="pokemon-image"
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
      </article>
      <aside>
        <div class="pokemon-no">
          <h4>No. Pokédex</h4>
          <input type="number" min="1" v-model="editingPokemon.no" />
        </div>
        <div class="pokemon-type">
          <h4>Type</h4>
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
            <input type="checkbox" id="legendary-checkbox" v-model="editingPokemon.legendary" />
          </div>
        </div>
        <div class="pokemon-description">
          <h4>Description</h4>
          <textarea v-model="editingPokemon.description">
          </textarea>
        </div>
      </aside>
      <button @click="sendEditPokemon()">Valider</button>
      <button @click="abortEditPokemon()">Annuler</button>
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