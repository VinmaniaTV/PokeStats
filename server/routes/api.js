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

class Team {
    constructor() {
        this.createdAt = new Date()
        this.updatedAt = new Date()
        this.pokemons = []
    }
}

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
    await client.query({ // notez le "await" car la fonction est asynchrone
        text: addUserSql,
        values: [username, email, hash]
    })

    const userData = await client.query({ // notez le "await" car la fonction est asynchrone
        text: sqlUsername,
        values: [username]
    })
    req.session.userId = userData.rows[0].id
        // on envoie le user ajouté à l'utilisateur
    res.json(userData.rows[0].id)
})

/**
 * Cette route permet de se connecter.
 */
router.post('/login', async(req, res) => {
    const username = req.body.username.toLowerCase();
    const password = req.body.password

    const sqlUser = "SELECT * FROM users WHERE email=$1 OR username =$1"
    const checkExists = await client.query({ // notez le "await" car la fonction est asynchrone
        text: sqlUser,
        values: [username]
    })

    if (checkExists.rowCount === 0) {
        res.status(400).json({ message: 'user doesn\'t exists' });
        return
    }

    if (await bcrypt.compare(password, checkExists.rows[0].password)) {
        req.session.userId = checkExists.rows[0].id
        req.session.team = new Team()
        const sqlTeam = "SELECT pc.id AS teamid, * FROM pc INNER JOIN pokedex ON pc.pokemonid = pokedex.id WHERE userid=$1"
        const team = await client.query({ // notez le "await" car la fonction est asynchrone
            text: sqlTeam,
            values: [req.session.userId]
        })
        team.rows.forEach(row => {
            const pokemon = {
                id: row.pokemonid,
                teamid: row.teamid,
                no: row.no,
                name: row.name,
                type1: row.type1,
                type2: row.type2,
                total: row.total,
                hp: row.hp,
                attack: row.attack,
                defense: row.defense,
                spatk: row.spatk,
                spdef: row.spdef,
                speed: row.speed,
                generation: row.generation,
                legendary: row.legendary,
                description: row.description,
                image: row.image,
                nickname: row.nickname
            }
            req.session.team.pokemons.push(pokemon)
        });
        // on envoie la team de pokémons du user au client.
        return res.json(req.session.team)
    } else {
        return res.status(401).json({ message: 'wrong password' })

    }
})

router.post('/logout', (req, res) => {
    if (typeof req.session.userId === 'undefined' || req.session.userId === -1) {
        res.status(401).json({ message: 'user not connected' })
        return (res.json(req.session.userId))
    } else {
        req.session.destroy();
        return res.status(200).json({ message: 'user disconnected' })
    }


})

/**
 * Cette route ajoute un pokemon dans le pc en l'associant à l'utilisateur.
 */
router.post('/pc', async(req, res) => {
    console.log(req.body)
    const pokemonId = parseInt(req.body.id)
    const userId = req.session.userId

    const sqlInsert = "INSERT INTO pc (userid, pokemonid) VALUES ($1, $2)"
    await client.query({ // notez le "await" car la fonction est asynchrone
        text: sqlInsert,
        values: [userId, pokemonId]
    })

    const sqlTeam = "SELECT pc.id AS teamid, * FROM pc INNER JOIN pokedex ON pc.pokemonid = pokedex.id WHERE userid = $1 AND pokemonid = $2 ORDER BY pc.id DESC"
    const team = await client.query({ // notez le "await" car la fonction est asynchrone
        text: sqlTeam,
        values: [req.session.userId, pokemonId]
    })

    const pokemon = {
        id: team.rows[0].pokemonid,
        teamid: team.rows[0].teamid,
        no: team.rows[0].no,
        name: team.rows[0].name,
        type1: team.rows[0].type1,
        type2: team.rows[0].type2,
        total: team.rows[0].total,
        hp: team.rows[0].hp,
        attack: team.rows[0].attack,
        defense: team.rows[0].defense,
        spatk: team.rows[0].spatk,
        spdef: team.rows[0].spdef,
        speed: team.rows[0].speed,
        generation: team.rows[0].generation,
        legendary: team.rows[0].legendary,
        description: team.rows[0].description,
        image: team.rows[0].image,
        nickname: team.rows[0].nickname
    }
    req.session.team.pokemons.push(pokemon)
    console.log(req.session.team)
        // on envoie la team de pokémons du user au client.
    res.json(pokemon)
    return
})

/**
 * Cette fonction fait en sorte de valider que le pokémon stocké dans le pc demandé par l'utilisateur
 * est valide. Elle est appliquée aux routes:
 * - GET /pc/:pcId
 * - PUT /pc/:pcId
 * - DELETE /pc/:pcId
 * Comme ces trois routes ont un comportement similaire, on regroupe leurs fonctionnalités communes dans un middleware
 */
async function parsePc(req, res, next) {
    const pcId = parseInt(req.params.pcId)
    console.log(pcId)

    // si pcId n'est pas un nombre (NaN = Not A Number), alors on s'arrête
    if (isNaN(pcId)) {
        res.status(400).json({ message: 'pcId should be a number' })
        return
    }
    // on affecte req.pcId pour l'exploiter dans toutes les routes qui en ont besoin
    req.pcId = pcId

    const sql = "SELECT * FROM pokedex INNER JOIN pc ON pokedex.id = pc.pokemonid WHERE pc.id = $1"
    const pokemonSQL = await client.query({ // notez le "await" car la fonction est asynchrone
        text: sql,
        values: [pcId]
    })

    const pc = pokemonSQL.rows[0]

    if (!pokemonSQL.rowCount === 0) {
        res.status(404).json({ message: 'pokemon in pc ' + pcId + ' does not exist' })
        return
    }
    // on affecte req.pc pour l'exploiter dans toutes les routes qui en ont besoin
    req.pc = pc
    next()
}

router.route('/pc/:pcId')
    /**
     * Cette route envoie un pokémon stocké dans le pc particulier
     */
    .get(parsePc, (req, res) => {
        // req.pc existe grâce au middleware parsePokemon
        res.json(req.pc)
    })

/**
 * Cette route modifie un pokémon dans le pc.
 */
.put(parsePc, async(req, res) => {
    const id = req.body.id;
    const nickname = req.body.nickname;

    const sql = "UPDATE pc SET nickname = $2 WHERE id = $1"
    await client.query({ // notez le "await" car la fonction est asynchrone
        text: sql,
        values: [id, nickname]
    })

    req.pc.nickname = nickname
    res.send()
})

.delete(parsePc, async(req, res) => {
    const id = parseInt(req.params.pcId)

    const sql = "DELETE FROM pc WHERE id = $1"
    await client.query({ // notez le "await" car la fonction est asynchrone
        text: sql,
        values: [id]
    })

    res.send()
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
 * Cette route crée un pokémon.
 * WARNING: dans un vrai site, elle devrait être authentifiée et valider que l'utilisateur est bien autorisé
 */
router.post('/pokemon', async(req, res) => {
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

    // vérification de la validité des données d'entrée
    if (isNaN(no) || no < 1 ||
        typeof name !== 'string' || name === '' ||
        typeof type1 !== 'string' || type1 === '' ||
        typeof image !== 'string') {
        res.status(400).json({ message: 'bad request' })
        return
    }

    const sqlInsert = "INSERT INTO pokedex (no, name, type1, type2, total, hp, attack, defense, spatk, spdef, speed, generation, legendary, description, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)"
    await client.query({ // notez le "await" car la fonction est asynchrone
        text: sqlInsert,
        values: [no, name, type1, type2, total, hp, attack, defense, spatk, spdef, speed, generation, legendary, description, image]
    })

    const sqlSelect = "SELECT * FROM pokedex WHERE id = (SELECT MAX(id) FROM pokedex)"
    const pokemonSQL = await client.query({ // notez le "await" car la fonction est asynchrone
        text: sqlSelect,
        values: []
    })

    // on envoie le pokémon ajouté à l'utilisateur
    res.json(pokemonSQL.rows[0])
})

/**
 * Cette fonction fait en sorte de valider que le pokémon demandé par l'utilisateur
 * est valide. Elle est appliquée aux routes:
 * - GET /pokemon/:pokemonId
 * - PUT /pokemon/:pokemonId
 * - DELETE /pokemon/:pokemonId
 * Comme ces trois routes ont un comportement similaire, on regroupe leurs fonctionnalités communes dans un middleware
 */
async function parsePokemon(req, res, next) {
    const pokemonId = parseInt(req.params.pokemonId)

    // si pokemonId n'est pas un nombre (NaN = Not A Number), alors on s'arrête
    if (isNaN(pokemonId)) {
        res.status(400).json({ message: 'pokemonId should be a number' })
        return
    }
    // on affecte req.pokemonId pour l'exploiter dans toutes les routes qui en ont besoin
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
    // on affecte req.pokemon pour l'exploiter dans toutes les routes qui en ont besoin
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

    const sql = "UPDATE pokedex SET no = $2, name = $3, type1 = $4, type2 = $5, total = $6, hp = $7, attack = $8, defense = $9, spatk = $10, spdef =$11, speed = $12, generation = $13, legendary = $14, description = $15, image = $16 WHERE id = $1"
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

.delete(parsePokemon, async(req, res) => {
    const id = parseInt(req.params.pokemonId)

    const sqlPokedex = "DELETE FROM pokedex WHERE id = $1"
    await client.query({ // notez le "await" car la fonction est asynchrone
        text: sqlPokedex,
        values: [id]
    })

    const sqlPc = "DELETE FROM pc WHERE pokemonid = $1"
    await client.query({ // notez le "await" car la fonction est asynchrone
        text: sqlPc,
        values: [id]
    })

    res.send()
})

module.exports = router