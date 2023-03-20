drop table if exists Entree cascade;
drop table if exists Boisson cascade;
drop table if exists Pizza cascade;
drop table if exists Ingredient cascade;
drop table if exists Sauce cascade;
drop table if exists Composition cascade;
drop table if exists Menu cascade;
drop table if exists commande cascade;

create table Menu (nom text primary key, prix integer, nb_pizza integer, nb_boisson integer, max_boisson integer, nb_entree integer);
create table Entree (nom text primary key, prix integer, photo text);
create table Sauce (nom text primary key, prix int, photo text);
create table Boisson (nom text primary key, taille int, prix int, photo text);
create table Pizza (nom text primary key, prix integer, photo text);
create table Ingredient (nom text primary key, prix int, photo text);
create table Composition (nomPizza text, nomIngredient text,
                          FOREIGN KEY (nomPizza) REFERENCES Pizza(nom),
                          FOREIGN KEY (nomIngredient) REFERENCES Ingredient(nom));
create table commande (id serial primary key , nom text, prenom text, adresse text, code_postale varchar(5), ville text, supp text, tel text, email text, heure time);

drop user if exists useradmin;
create user useradmin with password 'mypass';
grant all privileges on all tables in schema public to useradmin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO useradmin;


insert into menu values
  ('Extra', 20, 2, 2, 2, 2),
  ('Mega', 40, 3, 2, 2, 2),
  ('Giga', 60, 4, 3, 2, 2);

insert into pizza values
  ('Végétarienne', 7, 'vegetarienne.jpg'),
  ('Texane Barbecue', 10, 'texanebarbecue.jpg'),
  ('Nordique', 12, 'nordique.jpg'),
  ('Margherita', 8, 'margherita.jpg'),
  ('Orientale', 12, 'orientale.jpg'),
  ('Chicken Barbecue', 11, 'chickenbarbecue.jpg'),
  ('Chèvre Miel', 9, 'chevremiel.jpg'),
  ('Raclette', 15, 'raclette.jpg'),
  ('Suprême', 16, 'supreme.jpg'),
  ('Montagnarde', 15, 'montagnarde.jpg'),
  ('Queen', 15, 'queen.jpg'),
  ('Pepperoni', 11, 'pepperoni.jpg'),
  ('BPM', 16, 'bpm.jpg'),
  ('4 fromages', 15, '4fromages.jpg');

insert into entree values
  ('Salade de pâte', 6, 'saladepate.jpg'),
  ('Salade Grecque', 7, 'saladegrecque'),
  ('Salade César', 6, 'saladecesar'),
  ('Salade de fruits', 5, 'saladefruit.jpg');

insert into boisson values
  ('Sprite 1.25L', 3, 3, 'sprite'),
  ('Ice tea 1.5L', 3, 3, 'icetea'),
  ('Coca-Cola 2L', 3, 4, 'coca'),
  ('Fanta 1.5L', 2, 2, 'fanta'),
  ('Sprite 0.5L', 2, 2, 'sprite50.jpg'),
  ('Ice tea 0.5L', 2, 2, 'icetea50.jpg'),
  ('Coca-Cola 0.5L', 2, 2, 'coca50'),
  ('Fanta 0.50L', 2, 1, 'fanta50.jpg'),
  ('Sprite 0.33L', 1, 1, 'sprite33.jpg'),
  ('Ice tea 0.33L', 1, 1, 'icetea33.jpg'),
  ('Coca-Cola 0.33L', 1, 1, 'coca33.jpg'),
  ('Fanta 0.33L', 1, 1, 'fanta33.jpg');
