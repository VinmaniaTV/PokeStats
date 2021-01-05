# PokeStats

# Install

`npm install`

# DataBase Creation :

```
CREATE DATABASE "PokeStats"
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;
    
CREATE TABLE public.users
(
    id serial NOT NULL,
    email text NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE public.users
    OWNER to postgres;
    
CREATE TABLE public.pc
(
    id serial NOT NULL,
    userid integer NOT NULL,
    pokemonid integer NOT NULL,
    nickname text,
    PRIMARY KEY (id)
);

ALTER TABLE public.pc
    OWNER to postgres;
    
CREATE TABLE public.pokedex
(
    id serial NOT NULL,
    no integer NOT NULL,
    name text NOT NULL,
    type1 text,
    type2 text,
    total integer,
    hp integer,
    attack integer,
    defense integer,
    spatk integer,
    spdef integer,
    speed integer,
    generation integer,
    legendary boolean,
    description text,
    image text,
    PRIMARY KEY (id)
);
```

Importer le pokédex :

(Ne pas oublier de remplacer [PATH] par le chemin du fichier `pokedexcomplete.csv`)

```
copy public.pokedex (no, name, type1, type2, total, hp, attack, defense, spatk, spdef, speed, generation, legendary) FROM '[PATH]/pokedexcomplete.CSV' DELIMITER ',' CSV HEADER QUOTE '\"' ESCAPE '''';
```

# Run

`npm start`
