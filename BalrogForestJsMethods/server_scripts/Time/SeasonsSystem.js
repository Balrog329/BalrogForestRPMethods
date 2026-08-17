
var seasons = {
    1:"mid_winter",
    2:"late_winter",
    3:"early_spring",
    4:"mid_spring",
    5:"late_spring",
    6:"early_summer",
    7:"mid_summer",
    8:"late_summer",
    9:"early_autumn",
    10:"mid_autumn",
    11:"late_autumn",
    12:"early_winter"
}


function seasonChange() {
    if (!global.server_date){
        return
    }
    Utils.server.runCommand(`season set ${seasons[global.server_date.month]}`)

}