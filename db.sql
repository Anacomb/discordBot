CREATE TABLE clan(
	id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	name VARCHAR NOT NULL,
	score INT NOT NULL
);

CREATE TABLE user(
	id VARCHAR NOT NULL,
	clan INTEGER,
	nb_objectif INTEGER NOT NULL,
	nb_valide INTEGER NOT NULL,
	nb_message INTEGER NOT NULL,
	expiration_date_message INTEGER, #UNIX TIME
	expiration_date_objectif INTEGER #UNIX TIME
);

INSERT INTO clan(name, score) VALUES("Les bg", 0);
INSERT INTO clan(name, score) VALUES("Les gagnants", 0);
INSERT INTO user(id, clan, nb_objectif, nb_valide, nb_message) VALUES("143287609374932992", 1, 0, 0, 0);