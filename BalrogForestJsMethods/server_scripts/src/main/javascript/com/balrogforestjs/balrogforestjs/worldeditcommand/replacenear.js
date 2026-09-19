
function dtSpecieToDtSpecie(radius, species1, species2) {
    // transforme une essenec vers une autre dans un rayon donnée grace a WE
    species1 = species1.replace("mega:", "mega_")
    species2 = species2.replace("mega:", "mega_")

    messageChat(Utils.server, `-------------------------`)
    messageChat(Utils.server, `Transformation de ${species1} vers ${species2}`)
    messageChat(Utils.server, `-------------------------`)
    messageChat(Utils.server, `${Utils.server.runCommandSilent(`/gmask`)}`)
    messageChat(Utils.server, `--> radius 14 : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=14] ${species2}_branch[radius=14]`)}`)
    messageChat(Utils.server, `--> radius 13 : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=13] ${species2}_branch[radius=13]`)}`)
    messageChat(Utils.server, `--> radius 12 : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=12] ${species2}_branch[radius=12]`)}`)
    messageChat(Utils.server, `--> radius 11 : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=11] ${species2}_branch[radius=11]`)}`)
    messageChat(Utils.server, `--> radius 10 : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=10] ${species2}_branch[radius=10]`)}`)
    messageChat(Utils.server, `--> radius 9: ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=9] ${species2}_branch[radius=9]`)}`)
    messageChat(Utils.server, `--> radius 8 : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=8] ${species2}_branch[radius=8]`)}`)
    messageChat(Utils.server, `--> radius 7 : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=7] ${species2}_branch[radius=7]`)}`)
    messageChat(Utils.server, `--> radius 6 : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=6] ${species2}_branch[radius=6]`)}`)
    messageChat(Utils.server, `--> radius 5 : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=5] ${species2}_branch[radius=5]`)}`)
    messageChat(Utils.server, `--> radius 4 : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=4] ${species2}_branch[radius=4]`)}`)
    messageChat(Utils.server, `--> radius 3 : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=3] ${species2}_branch[radius=3]`)}`)
    messageChat(Utils.server, `--> radius 2 : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=2] ${species2}_branch[radius=2]`)}`)
    messageChat(Utils.server, `--> radius 1 : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_branch[radius=1] ${species2}_branch[radius=1]`)}`)
    messageChat(Utils.server, `--> feuillage : ${Utils.server.runCommandSilent(`/replacenear ${radius} ${species1}_leaves ${species2}_leaves`)}`)
    messageChat(Utils.server, `-------------------------`)
    messageChat(Utils.server, `Transformation terminée !`)
    messageChat(Utils.server, `-------------------------`)
}