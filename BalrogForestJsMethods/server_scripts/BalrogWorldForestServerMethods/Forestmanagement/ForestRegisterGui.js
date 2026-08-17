/**
 * Ouvre l'interface graphique "Faux Coffre" du Registre Forestier.
 * @param {object} player - Le joueur qui ouvre l'UI
 * @param {object} pos_data - Données de la parcelle actuelle
 */
function openForestRegisterGUI(player, pos_data) {

    let fakeCart = player.level.createEntity('minecraft:chest_minecart');
    let virtualChest = fakeCart.asContainer(); // ton conteneur 27 slots

    // --- Remplissage du fond ---
    for (let slotNum = 0; slotNum < 27; slotNum++) {
        let item = Item.of('minecraft:gray_stained_glass_pane').withName(Text.literal(" "));
        virtualChest.setStackInSlot(slotNum, item.itemStack);
    }

    // --- Création d’un vrai MenuProvider ---
    let provider = Java.loadClass("net.minecraft.world.MenuProvider");
    let SimpleMenuProvider = Java.loadClass("net.minecraft.world.SimpleMenuProvider");
    let ChestMenu = Java.loadClass("net.minecraft.world.inventory.ChestMenu");
    let Component = Java.loadClass("net.minecraft.network.chat.Component");

    let menuProvider = new SimpleMenuProvider(
        (id, inv, p) => ChestMenu.threeRows(id, inv, virtualChest),
        Component.literal("📘 Registre Forestier")
    );

    // --- Ouverture de la GUI ---
    player.openMenu(menuProvider);
}




//     // --- SLOT 10 : STATS DE LA FORÊT SUR PIED ---
//     let lore10 = [
//         Text.gray("Arbres inventoriés : ").append(Text.white(`${total_trees}`)),
//         Text.gray("Volume Bois d'Œuvre : ").append(Text.yellow(`${total_vol1.toFixed(2)} m³`)),
//         Text.gray("Volume Bois Énergie : ").append(Text.yellow(`${total_vol2.toFixed(2)} m³`)),
//         Text.gray("Essences uniques : ").append(Text.gold(`${unique_species}`))
//     ];
//     setGuiItem(10, 'minecraft:oak_sapling', Text.green("🌲 État de la Forêt sur Pied"), lore10);

//     // --- SLOT 13 : PROPRIÉTAIRE ET CADASTRE ---
//     let lore13 = [
//         Text.gray("Forêt : ").append(Text.white(forest_name.replace(/_/g, ' '))),
//         Text.gray("Parcelle : ").append(Text.white(`#${pos_data.parcel}`)),
//         Text.gray("Exploitant : ").append(Text.aqua(pos_data.owner || "Aucun"))
//     ];
//     setGuiItem(13, 'minecraft:writable_book', Text.gold("📜 Informations Cadastrales"), lore13);

//     // --- SLOT 16 : INFOS SUR LE LOT MARTELÉ ---
//     let lore16 = [];
//     if (lot_trees_count > 0) {
//         let valeur_estimee = (lot_vol1 * 15) + (lot_vol2 * 3);
//         lore16 = [
//             Text.gray("Arbres martelés : ").append(Text.white(`${lot_trees_count}`)),
//             Text.gray("Volume BO mobilisable : ").append(Text.aqua(`${lot_vol1.toFixed(2)} m³`)),
//             Text.gray("Volume BE mobilisable : ").append(Text.aqua(`${lot_vol2.toFixed(2)} m³`)),
//             Text.gray(""),
//             Text.gray("Valeur estimée : ").append(Text.gold(`${valeur_estimee.toFixed(0)} Émeraudes`))
//         ];
//     } else {
//         lore16 = [Text.red("Aucun arbre martelé dans ce lot.")];
//     }
//     setGuiItem(16, 'minecraft:iron_axe', Text.darkAqua(`🔨 Lot Commercial (#${current_lot_id})`), lore16);

//     // --- SLOT 22 : BOUTON FERMER ---
//     setGuiItem(22, 'minecraft:barrier', Text.red("Fermer le Registre"), []);

//     // --- OUVERTURE FINALE DU MENU ---
//     // On utilise l'API de base de KubeJS pour ouvrir l'inventaire du wagon factice
//     
// }