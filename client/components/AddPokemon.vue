<template>
  <form @submit.prevent="addPokemon" v-show="show">
    <h2>Nouveau Pokémon</h2>
    <input
      type="number"
      v-model="newPokemon.no"
      placeholder="No.#"
      min="1"
      required
    />
    <input
      type="text"
      v-model="newPokemon.name"
      placeholder="Nom"
      required
    />
    <select name="type1" id="type1-select" v-model="newPokemon.type1" required>
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
        <select name="type2" id="type2-select" v-model="newPokemon.type2">
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
      v-model="newPokemon.image"
      placeholder="Lien vers l'image"
    />
    <button type="submit">Ajouter</button>
  </form>
</template>

<script>
module.exports = {
  props: {
    show: Boolean,
  },
  data() {
    return {
      newPokemon: {
        no: null,
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
    };
  },
  methods: {
    addPokemon() {
      this.$emit("add-pokemon", this.newPokemon);
      this.newPokemon = {
        no: null,
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
        image: ""
      }
    }
  },
};
</script>