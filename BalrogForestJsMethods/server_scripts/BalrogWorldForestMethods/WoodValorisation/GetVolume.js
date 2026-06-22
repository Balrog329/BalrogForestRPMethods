// Calcul le volume BO et BE d'un arbre en fonction du paramètre hammerable et renvoi son volume BO et BE pour la base de données arbre

// NOTA ajouter le test de dimaètre minimum avant de lancer getVolume

function getVolume(player, tree_data){
    if (!testIfHammerableTree(player, tree_data.species, tree_data.diameter, tree_data.height)) {

        return {
            energy_volume: getEnergyVolume(tree_data)
        }
    }

    else {
        return {
            timber_volume: getTimberVolume(tree_data),
            energy_volume: getEnergyVolume(tree_data)
        }
    }

}

// Trouve un volume BO selon le diamètre et la hauteur

function getTimberVolume(tree_data) {
    
}

// Trouve le volume de bois energy selon le trees node

function getEnergyVolume(tree_data) {

}


