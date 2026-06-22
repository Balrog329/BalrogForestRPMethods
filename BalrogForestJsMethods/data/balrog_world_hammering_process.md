

### Procesus de martelage sur les peuplements


## 1 : global

Cet outil de martelage utilise des scoreboard pour la saisie des données ne pouvant être trouvé de manière automatique, ces scoreboard, se créées simplement, lors du chargement du monde, si la carte est une carte forestière, le pack va automatiquement créer 3 `scoreboard` : 

- `lot` : pour le numéro du lot,

- `htr` : pour définir une hauteur bois d'oeuvre,

- `qlt` : pour définir la qualité des bois, 

## 2 : Création du lot 

la définition du lot se fait de cette manière :

autorisation de la création du lot : 

```
/scoreboard players enable balrog329 lot
```

création du lot (ex):

```
/trigger lot set 11520141
```

explication : 

*`1` : numéro de propriété : ici, 1 = Palissonais*

*`15` : numéro de la parcelle forestière*

*`2014` : année de vente du lot*

*`1` : id du lot sur cette parcelle, utile pour diférencier feuillus et résineux par exemple*

## 3 : définir une hauteur 

La hauteur de découpe est obligatoire, cette dernière peut être renseignée à chaque fois, surtout sur les feuillus ou peut être définit constament (par défaut) utile pour les résineux homogène notamment, 

l'attribution des autorisation ne se fait qu'une fois : 

```
/scoreboard players enable balrog329 htr
```

puis : 

```
/trigger htr set 8 
```

selon la hauteur de bois d'oeuvre mesuré. 

## 4 : définir une qualité

la qualité des bois, est défini de cette manière : 

*`1` : bois sain, droit sans branche morte ou si résineux inférieur à radius 3 sur la majeur partie de la grume*

*`2` : bois déclassé, tordu avec branche morte ou branche supérieur à radius 3 sur la majeur partie de la grume*

*`3` : bois de chauffage, trop tortueux, trop court ou avec défaut important*

Par exemple, la qualité des bois peut ainsi être définit ainsi : 

```
/trigger qlt set 1 
```

par défaut, cette qualité est égal à 1

## 5 : Mise en réserve des bois : 

Pour mettre en reserve un bois, et de fait changer un paramètre après une erreur, rien de plus simple, il suffit de de `sift click` sur la grume et retirer les marques :)

### Bon martelage, faite du cube mais pas trop ! 