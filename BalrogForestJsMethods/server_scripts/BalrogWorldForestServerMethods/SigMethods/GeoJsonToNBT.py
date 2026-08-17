import json
import uuid
from pathlib import Path
import nbtlib
import time

from server_scripts.BalrogWorldForestServerMethods.utils.ReadConfig import loadConfigData

now = int(time.time() * 1000)

FOREST_NAME = input("Clé de la forêt : ")

FOREST_MANAGEMENT = loadConfigData("forest_management")["forestManagement"]

MINECRAFT_FOLDER = Path(__file__).parents[4]

SAVE_DIR = Path(MINECRAFT_FOLDER) / "saves" / FOREST_MANAGEMENT[FOREST_NAME]["world_dir"]
FRONTIER_PATH = Path(SAVE_DIR) / "mapfrontiers" / "frontiers.dat"

KUBEJS_EXPORT_DIR = Path(__file__).parents[3] / "data" / "frontiers"
GEOJSON_PATH = Path(KUBEJS_EXPORT_DIR) / f"{FOREST_MANAGEMENT[FOREST_NAME]["normalized_world_name"]}_ug.geojson"

# ⚠ IMPORTANT : FRONTIER_PATH est déjà un fichier, pas un dossier
OUTPUT_PATH = FRONTIER_PATH

def geojson_to_dat(path: Path) -> nbtlib.File:
    with open(path, encoding="utf-8") as f:
        data = json.load(f)

    features = data["features"]
    nbt_frontiers = []

    for feat in features:
        props = feat["properties"]
        geom = feat["geometry"]

        # --- Gestion Polygon / MultiPolygon ---
        if geom["type"] == "Polygon":
            coords = geom["coordinates"]
            if not coords:
                print("⚠ Polygon vide, ignoré")
                continue
            ring = coords[0]

        elif geom["type"] == "MultiPolygon":
            coords = geom["coordinates"]
            if not coords or not coords[0]:
                print("⚠ MultiPolygon vide, ignoré")
                continue

            # ⚠ MultiPolygon QGIS peut contenir plusieurs anneaux (trous)
            # MapFrontiers NE SUPPORTE PAS les trous → on prend seulement l’anneau externe
            ring = coords[0][0]

        else:
            print("⚠ Type de géométrie non supporté :", geom["type"])
            continue

        # --- FERMETURE DU POLYGONE (OBLIGATOIRE) ---
        if ring[0] != ring[-1]:
            ring.append(ring[0])

        # --- Reconstruction des vertices ---
        vertices = []
        for x, y in ring:
            vertices.append(
                nbtlib.Compound({
                    "X": nbtlib.Int(int(x)),      # Int accepté nativement
                    "Y": nbtlib.Int(0),
                    "Z": nbtlib.Int(int(-y))
                })
            )

        # --- Reconstruction des propriétés MapFrontiers ---
        frontier = nbtlib.Compound({
            "owner": nbtlib.Compound({
                "UUID": nbtlib.String(props.get("UUID", "71882b98-712c-4bbf-86ea-858112fa6c6f")),
                "username": nbtlib.String(props.get("username", "balrog329"))
            }),

            "visible": nbtlib.Byte(props.get("visible", 1)),
            "color": nbtlib.Int(props.get("color", -32768)),
            "chunks": nbtlib.List[nbtlib.Compound]([]),
            "created": nbtlib.Long(props.get("created", now)),
            "minimapNameVisible": nbtlib.Byte(props.get("minimapNameVisible", 1)),
            "personal": nbtlib.Byte(props.get("personal", 1)),
            "announceInChat": nbtlib.Byte(props.get("announceInChat", 0)),
            "mode": nbtlib.String("Vertex"),
            "fullscreenVisible": nbtlib.Byte(props.get("fullscreenVisible", 1)),
            "announceInTitle": nbtlib.Byte(props.get("announceInTitle", 0)),
            "modified": nbtlib.Long(props.get("modified", now)),
            "id": nbtlib.String(props.get("id", str(uuid.uuid4()))),
            "name2": nbtlib.String(props.get("name2", "")),
            "dimension": nbtlib.String(props.get("dimension", "minecraft:overworld")),
            "name1": nbtlib.String(props.get("name1", "")),
            "minimapVisible": nbtlib.Byte(props.get("minimapVisible", 1)),
            "fullscreenNameVisible": nbtlib.Byte(props.get("fullscreenNameVisible", 1)),
            "fullscreenOwnerVisible": nbtlib.Byte(props.get("fullscreenOwnerVisible", 0)),
            "minimapOwnerVisible": nbtlib.Byte(props.get("minimapOwnerVisible", 0)),
            "vertices": nbtlib.List[nbtlib.Compound](vertices)
        })

        nbt_frontiers.append(frontier)

    root = nbtlib.Compound({
        "frontiers": nbtlib.List[nbtlib.Compound](nbt_frontiers),
        "Version": nbtlib.Int(10)
    })

    return nbtlib.File(root)


if __name__ == "__main__":
    nbt_file = geojson_to_dat(GEOJSON_PATH)
    nbt_file.save(OUTPUT_PATH, gzipped=True)
    print("✔ Conversion GeoJSON → DAT réussie !")
