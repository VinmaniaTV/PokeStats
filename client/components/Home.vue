<template>
  <div>
    <navbar :connected="connected" @log-out="logOut"></navbar>
    <div id="showcase">
      <div>
        <h1>Bienvenue sur PokéStats</h1>
      </div>
      <div>
        <p>
          PokéStats est une plateforme permettant d'améliorer la gestion des Pokémons.<br />
          Cet outil est développé dans un but éducatif et convient à donner des
          suggestions non exhaustives.<br />
        </p>
      </div>
    </div>

    <section>
      <div id="us">
        <h3>Qui sommes-nous ?</h3>
        <div class="element content">
          <article>
            Nous sommes une équipe de 2 étudiants en cursus ingénieur à EFREI
            Paris.<br />Nous aspirons à proposer PokéStats un site qui vous permet de répertorier tout vos Pokémons.<br />
            Notre devise : "Des outils pour tous, un monde meilleur."
          </article>
          <aside>
            <img src="./img/pokemon.jpg" alt="img" />
          </aside>
        </div>
      </div>
      <div id="about">
        <h3>Ce que propose PokéStats</h3>
        <div class="element">
          <h4>Un suivi de son répertoire de Pokémons</h4>
          <div class="content">
            <aside>
              <img src="./img/pokemon1.jpg" alt="img" />
            </aside>
            <article>
              Un Pokédex est à disposition afin d'avoir toutes les informations nécessaires pour chaque Pokémon. 
              En ajoutant depuis le Pokédex, les Pokémons sont classés par ordre d'ajout avec: Surnom, Type et le nom du Pokémon.

            </article>
          </div>
        </div>
        <div class="element">
          <h4>Des conseils adaptés</h4>
          <div class="content">
            <article>
              Lors de chaque session de jeu, une rentrée de chaque Pokémon dans le Pokédex peut être optimal pour une meilleur gestion de ses créatures !
              N'oubliez pas : " L'organisation induit l'efficacitée ! "

            </article>
            <aside>
              <img src="./img/choix.jpg" alt="img" />
            </aside>
          </div>
        
      </div>
    </section>
  </div>
</template>

<script>
const Navbar = window.httpVueLoader("./components/Navbar.vue");
module.exports = {
  props: {
    connected: { type: Boolean }
  },
  components: {
    Navbar,
  },
  methods: {
    logOut () {
      this.$emit('log-out')
    },
  }
}
</script>


<style scoped>
#showcase {
  background: no-repeat url("../img/bgHome.png");
  background-size: cover;
  height: calc(100vh - 70px);
  color: #fff;
  text-shadow: 0px 0px 10px #000;
  padding: 3em;
  justify-content: center;
  display: flex;
  flex-direction: column;
}

h1 {
  font-size: 80px;
  text-align: center;
  margin-bottom: 80px;
}

#showcase p {
  font-size: 20px;
  text-align: center;
}

h3 {
  text-align: center;
  font-size: 40px;
  margin-bottom: 20px;
}

section .element {
  margin: auto 20%;
}

section .content {
  display: flex;
}

article,
aside {
  font-variant:initial;
  font-size: 18px;
  flex: 1;
}

aside img {
  width: 100%;
  border-radius: 4px;
}

section article,
section aside {
  margin: 20px;
}

section article {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#us {
  /* background-color:oldlace; */
  padding: 50px 0;
}

#about {
  /* background-color:oldlace; */
  background-color: #efefef;
  padding: 50px 0;
}

#about div,
#us div {
  padding: 10px 0;
}

h4 {
  padding-top: 30px;
  font-size: 30px;
}
</style>