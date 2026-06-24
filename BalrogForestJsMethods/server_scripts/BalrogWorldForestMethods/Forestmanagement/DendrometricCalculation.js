
function getTreeBaseRadius(tree_data) {
    return getBranchDataBy(tree_data, 'height', 2).radius
}

/**
 * Récupère la liste des segments de tronc et de surbilles exploitables en excluant les charpentières
 * et en ignorant les sections si le total est inférieur à deux mètres.
 * @param {object} tree_data données issues du scanneur
 * @param {object} config Configuration propre à l'arbre
 * @returns {array} Une liste d'objets segments, ou un tableau vide si inférieur à 2m
 */
function getTreeLogSegments(tree_data, config) {
    let branch_list = tree_data.branch
    let valid_segments = []

    // On garde une trace de la position du dernier morceau de tronc validé
    let last_trunk_x = Number(tree_data.x)
    let last_trunk_z = Number(tree_data.z)

    for (let i = 0; i < branch_list.size(); i++) {
        let b = branch_list.get(i)
        
        let current_x = Number(b.x)
        let current_y = Number(b.y)
        let current_z = Number(b.z)
        let current_radius = Number(b.radius)
        let current_volume = Number(b.volume)

        // Ignorer la racine elle-même
        if (current_y <= Number(tree_data.y)) continue

        // Vérifier le rayon minimum
        if (current_radius >= config.min_log_radius) {
            
            // Détecter si le segment est aligné ou s'il s'agit d'un coude acceptable
            let delta_x = Math.abs(current_x - last_trunk_x);
            let delta_z = Math.abs(current_z - last_trunk_z);

            // Si le bloc ne s'est pas éloigné de plus de 1 bloc horizontalement
            if (delta_x <= 1 && delta_z <= 1) {
                
                // On ajoute l'objet complet converti en JS dans notre liste
                valid_segments.push({
                    index: i + 1,
                    x: current_x,
                    y: current_y,
                    z: current_z,
                    radius: current_radius,
                    volume: current_volume
                })
                
                // On met à jour la position du tronc pour suivre le coude
                last_trunk_x = current_x
                last_trunk_z = current_z
            }
        }
    }

    // Si le tableau contient moins de 2 segments, toute la section est jugée invalide
    if (valid_segments.length < 2) {
        return [] // On renvoie un tableau vide
    }

    return valid_segments
}


function getTreePositionStr(tree_data) {
    return `${tree_data.x}_${tree_data.z}` 
}

function getTreePositionRaw(block) {
    return {
        x: block.x,
        y: block.y,
        z: block.z
    }
}


function findTreePosMark(player, block, mark_config) {

    for (let key in mark_config.marks) {

        let mark = mark_config.marks[key]

        let dx = mark.offset[0]
        let dy = mark.offset[1]
        let dz = mark.offset[2]

        addTreeMark(player, `${block.x + dx} ${block.y + dy} ${block.z + dz}`,mark.block)
    }
}

function addTreeMark(player, pos, blockId) {
    player.runCommandSilent(`setblock ${pos} ${blockId} replace`)
}



/**
 * Récupère les données d'une branche selon un critère spécifique.
 * @param {object} treeData - L'objet complet retourné par le TreeScanner
 * @param {string} criterion - Le critère de recherche ('height', 'radius', 'volume')
 * @param {number} targetValue - La valeur recherchée
 * @returns {object|null} Un objet JS propre avec les données de la branche, ou null si introuvable.
 */

function getBranchDataBy(tree_data, criterion, targetValue) {

    for (let i = 0; i < tree_data.branch.size(); i++) {
        let b = tree_data.branch.get(i)
        let match = false

        switch (criterion) {
            case 'height':
                if ((Number(b.y) - Number(tree_data.y)) === Number(targetValue)) match = true;
                break;
                
            case 'radius':
                if (Number(b.radius) === Number(targetValue)) match = true;
                break
                
            case 'volume':
                if (Math.abs(Number(b.volume) - Number(targetValue)) < 0.001) match = true;
                break
        }

        if (match) {
            return {
                index: i + 1,
                x: Number(b.x),
                y: Number(b.y),
                z: Number(b.z),
                radius: Number(b.radius),
                volume: Number(b.volume)
            }
        }
    }

    return null;
}



function getLogVolume(tree_logs_segments) {

    let volume_total = 0
    tree_logs_segments.forEach(tree_logs_segments => {
        volume_total += tree_logs_segments.volume
    })

    return volume_total
  
}


function getEnergyVolume(branch_list, tree_logs_segments, min_count_radius) {
    let volume_energy = 0

    let css_indices_oeuvre = new Set(tree_logs_segments.map(seg => seg.index))

    for (let i = 0; i < branch_list.size(); i++) {
        let b = branch_list.get(i)
        let current_index = i + 1

        if (css_indices_oeuvre.has(current_index)) continue

        if (Number(b.radius) >= min_count_radius) {
            volume_energy += Number(b.volume)
        }
    }

    return Number(volume_energy)
}
