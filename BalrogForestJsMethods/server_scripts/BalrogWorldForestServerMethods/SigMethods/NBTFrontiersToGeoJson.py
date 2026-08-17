import json
from pathlib import Path
import nbtlib

# ---------------------------------------------------------
# Conversion NBT → GEOJSON Note consigne :

# Garder le format GeoJSON à tout prix !!

# Pour les découpages, faire un export des entitées pf, découper les sspf puis fusionner les geojson avec backup
# Ne pas ajouter de nouveaux champs dans la sortie BASE
# pour créer une table de coupe et travaux, voir le MD associé a la création d'un PDC
# Sauf ajout entités ne pas modifier le geojson de base

# ---------------------------------------------------------

from server_scripts.BalrogWorldForestServerMethods.utils.ReadConfig import loadConfigData

FOREST_NAME = input("Clé de la forêt : ")

FOREST_MANAGEMENT = loadConfigData("forest_management")["forestManagement"]

MINECRAFT_FOLDER = Path(__file__).parents[4]

SAVE_DIR = Path(MINECRAFT_FOLDER) / "saves" / FOREST_MANAGEMENT[FOREST_NAME]["world_dir"]
FRONTIER_PATH = Path(SAVE_DIR) / "mapfrontiers" / "frontiers.dat"

KUBEJS_EXPORT_DIR = Path(__file__).parents[3] / "data" / "frontiers"
GEOJSON_PATH = Path(KUBEJS_EXPORT_DIR) / f"{FOREST_MANAGEMENT[FOREST_NAME]["normalized_world_name"]}_ug.geojson"


PDC_EXPORT_NAME = f"{FOREST_NAME}_ug.geojson"


if not FRONTIER_PATH.exists():
    raise ValueError("Le nom du dossier de monde est invalide ou aucune frontière n'est présente")


def nbt_to_json(tag):
    if hasattr(tag, "items"):
        return {k: nbt_to_json(v) for k, v in tag.items()}
    elif isinstance(tag, list):
        return [nbt_to_json(i) for i in tag]
    else:
        return tag


def frontier_dat_to_json(dat_path: Path) -> dict:
    nbt_data = nbtlib.load(dat_path)
    return nbt_to_json(nbt_data)


def is_clockwise(points):
    total = 0
    for i in range(len(points) - 1):
        x1, y1 = points[i]
        x2, y2 = points[i+1]
        total += (x2 - x1) * (y2 + y1)
    return total > 0


def convert_frontiers_to_geojson():

    data = frontier_dat_to_json(Path(FRONTIER_PATH))

    regions = data.get("frontiers", [])

    geojson = {
        "type": "FeatureCollection",
        "crs": {
            "type": "name",
            "properties": {
                "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
            }
        },
        "features": []
    }

    for region in regions:

        coords = []
        for v in region.get("vertices", []):
            coords.append([float(v["X"]), -float(v["Z"])])

        if coords and coords[0] != coords[-1]:
            coords.append(coords[0])

        if is_clockwise(coords):
            coords.reverse()

        properties = {}

        for key, value in region.items():
            if key == "vertices":
                continue
            properties[key] = value

        feature = {
            "type": "Feature",
            "properties": properties,
            "geometry": {
                "type": "Polygon",
                "coordinates": [coords]
            }
        }

        geojson["features"].append(feature)
    
    files = [PDC_EXPORT_NAME]
    export(geojson, files)

    print(f"✔ Fusion réussie ! GeoJSON générés")

def export(geojson, files):
    for file in files:
        with open(Path(KUBEJS_EXPORT_DIR) / file, "w", encoding="utf-8") as f:
            json.dump(geojson, f, indent=2, ensure_ascii=False)



if __name__ == "__main__":
    convert_frontiers_to_geojson()
