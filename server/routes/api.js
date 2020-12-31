const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const { Client } = require('pg')

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    password: 'admin',
    database: 'PokeStats'
})

client.connect()

/**
 * Cette route inscrit un utilisateur.
 */
router.post('/register', async(req, res) => {
    const username = req.body.username.toLowerCase();
    const email = req.body.email.toLowerCase();
    const password = req.body.password

    const sqlUsername = "SELECT * FROM users WHERE username=$1"
    const checkUsername = await client.query({ // notez le "await" car la fonction est asynchrone
        text: sqlUsername,
        values: [username]
    })

    if (checkUsername.rowCount !== 0) {
        res.status(400).json({ message: 'username already taken.' })
        return
    }

    const sqlEmail = "SELECT * FROM users WHERE email=$1"
    const checkEmail = await client.query({ // notez le "await" car la fonction est asynchrone
        text: sqlEmail,
        values: [email]
    })

    if (checkEmail.rowCount !== 0) {
        res.status(401).json({ message: 'email already taken.' })
        return
    }

    const hash = await bcrypt.hash(password, 10)
    const addUserSql = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)'
    const addedUser = await client.query({ // notez le "await" car la fonction est asynchrone
        text: addUserSql,
        values: [username, email, hash]
    })

    const userData = await client.query({ // notez le "await" car la fonction est asynchrone
        text: sqlUsername,
        values: [username]
    })
    req.session.userId = userData.rows[0].id
        // on envoie le user ajouté à l'utilisateur
    res.json(addedUser)
})

/**
 * Cette route permet de se connecter.
 */
router.post('/login', async(req, res) => {
    const username = req.body.username.toLowerCase();
    const password = req.body.password

    const sql = "SELECT * FROM users WHERE email=$1 OR username =$1"
    const checkExists = await client.query({ // notez le "await" car la fonction est asynchrone
        text: sql,
        values: [username]
    })

    if (checkExists.rowCount === 0) {
        res.status(400).json({ message: 'user doesn\'t exists' })
        return
    }

    if (await bcrypt.compare(password, checkExists.rows[0].password)) {
        req.session.userId = checkExists.rows[0].id
            // on envoie le user ajouté à l'utilisateur
        res.json(req.session.userId)
        return
    } else {
        res.status(401).json({ message: 'wrong password' })
        return
    }
})

/**
 * Cette route permet de retourner l'utilisateur connecté.
 */
router.get('/me', async(req, res) => {
    if (typeof req.session.userId === 'undefined' || req.session.userId === -1) {
        res.status(401).json({ message: 'user is not connected' })
    }

    const sql = "SELECT * FROM users WHERE id=$1"
    const userSQL = await client.query({ // notez le "await" car la fonction est asynchrone
        text: sql,
        values: [req.session.userId]
    })

    if (userSQL.rowCount === 0) {
        res.status(400).json({ message: 'user doesn\'t exists' })
        return
    }

    // on envoie le user connecté à l'utilisateur
    const user = {
        id: userSQL.rows[0].id,
        email: userSQL.rows[0].email
    }
    res.json(user)
    return
})

/**
 * Cette route envoie l'intégralité du pokédex du site
 */
router.get('/pokedex', async(req, res) => {
    const sql = "SELECT * FROM pokedex ORDER BY no"
    const pokedexSQL = await client.query({ // notez le "await" car la fonction est asynchrone
        text: sql,
        values: []
    })
    res.json(pokedexSQL.rows)
    return
})

/**
 * Cette fonction fait en sorte de valider que l'article demandé par l'utilisateur
 * est valide. Elle est appliquée aux routes:
 * - GET /article/:articleId
 * - PUT /article/:articleId
 * - DELETE /article/:articleId
 * Comme ces trois routes ont un comportement similaire, on regroupe leurs fonctionnalités communes dans un middleware
 */
async function parsePokemon(req, res, next) {
    const pokemonId = parseInt(req.params.pokemonId)

    // si articleId n'est pas un nombre (NaN = Not A Number), alors on s'arrête
    if (isNaN(pokemonId)) {
        res.status(400).json({ message: 'pokemonId should be a number' })
        return
    }
    // on affecte req.articleId pour l'exploiter dans toutes les routes qui en ont besoin
    req.pokemonId = pokemonId

    const sql = "SELECT * FROM pokedex WHERE id = $1"
    const pokemonSQL = await client.query({ // notez le "await" car la fonction est asynchrone
        text: sql,
        values: [pokemonId]
    })

    const pokemon = pokemonSQL.rows[0]

    if (!pokemonSQL.rowCount === 0) {
        res.status(404).json({ message: 'pokemon ' + pokemonId + ' does not exist' })
        return
    }
    // on affecte req.article pour l'exploiter dans toutes les routes qui en ont besoin
    req.pokemon = pokemon
    next()
}

router.route('/pokemon/:pokemonId')
    /**
     * Cette route envoie un pokémon particulier
     */
    .get(parsePokemon, (req, res) => {
        // req.pokemon existe grâce au middleware parsePokemon
        res.json(req.pokemon)
    })

/**
 * Cette route modifie un pokémon dans le pokédex.
 * WARNING: dans un vrai site, elle devrait être authentifiée et valider que l'utilisateur est bien autorisé
 */
.put(parsePokemon, async(req, res) => {
    const id = parseInt(req.body.id)
    const no = parseInt(req.body.no)
    const name = req.body.name
    const type1 = req.body.type1
    const type2 = (req.body.type2 == ("" || null) ? null : req.body.type2)
    const total = parseInt(req.body.total)
    const hp = parseInt(req.body.hp)
    const attack = parseInt(req.body.attack)
    const defense = parseInt(req.body.defense)
    const spatk = parseInt(req.body.spatk)
    const spdef = parseInt(req.body.spdef)
    const speed = parseInt(req.body.speed)
    const generation = parseInt(req.body.generation)
    const legendary = req.body.legendary
    const description = req.body.description
    const image = req.body.image

    const sql = "UPDATE pokedex SET no =$2, name = $3, type1 = $4, type2 = $5, total = $6, hp = $7, attack = $8, defense = $9, spatk = $10, spdef =$11, speed = $12, generation = $13, legendary = $14, description = $15, image = $16 WHERE id = $1"
    await client.query({ // notez le "await" car la fonction est asynchrone
        text: sql,
        values: [id, no, name, type1, type2, total, hp, attack, defense, spatk, spdef, speed, generation, legendary, description, image]
    })

    req.pokemon.id = id
    req.pokemon.no = no
    req.pokemon.name = name
    req.pokemon.type1 = type1
    req.pokemon.type2 = type2
    req.pokemon.total = total
    req.pokemon.hp = hp
    req.pokemon.attack = attack
    req.pokemon.defense = defense
    req.pokemon.spatk = spatk
    req.pokemon.spdef = spdef
    req.pokemon.speed = speed
    req.pokemon.generation = generation
    req.pokemon.legendary = legendary
    req.pokemon.description = description
    req.pokemon.image = image
    res.send()
})

.delete(parsePokemon, (req, res) => {
    const index = pokedex.findIndex(p => p.id === req.pokemonId)

    pokedex.splice(index, 1) // remove the article from the array
    res.send()
})

module.exports = router