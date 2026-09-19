import json
from pathlib import Path
import time
import uuid
import nbtlib

from src.utils.ReadConfig import (
    loadConfigData,
)


class GeojsonToNbt:

    def __init__(self, serveur_key: str | None = None):
        self.now = int(time.time() * 1000)
        self.serveur = (
            serveur_key if serveur_key else input("Clé du serveur : ")
        )

        # Chargement de la configuration
        servers_config = loadConfigData("serversregistry")["serversregistry"]
        server_info = servers_config[self.serveur]

        # Définition des chemins
        base_dir = Path(__file__).parents[4]

        kubejs_export_dir = Path(__file__).parents[3] / "data" / "frontierstest"

        self.save_dir = base_dir / "saves" / server_info["serverDir"]
        self.frontier_path = self.save_dir / "mapfrontiers" / "frontiers.dat"
        self.balrogdatadir = self.save_dir / "balrogdata"
        self.collections_json_path = self.balrogdatadir / "collections.json"
        self.geojson_path = self.balrogdatadir / "frontiers_polygons.geojson"

    def load_nbt_collections(self) -> tuple[list[nbtlib.Compound], dict, dict]:
        if not self.collections_json_path.exists():
            raise FileNotFoundError(
                f"Impossible de trouver : {self.collections_json_path}"
            )

        with open(self.collections_json_path, encoding="utf-8") as f:
            raw_collections = json.load(f)

        nbt_collections = []
        collections_by_id = {}        # Mapping {collection_id: nom_collection}
        collections_personal_map = {} # Mapping {collection_id: personal_status}

        col_defaults = {
            "color": -4449351,
            "created": self.now,
            "modified": self.now,
            "lifetime": "PERSISTENT",
            "personal": 0,
            "owner.UUID": "71882b98-712c-4bbf-86ea-858112fa6c6f",
            "owner.username": "balrog329",
            "visibility.fullscreenBanner": 1,
            "visibility.fullscreenName": 1,
            "visibility.fullscreenOwner": 0,
            "visibility.fullscreenZoom": 256,
            "visibility.minimapBanner": 1,
            "visibility.minimapName": 1,
            "visibility.minimapOwner": 0,
            "visibility.minimapZoom": 256,
            "visibility.visible": 0,
            "visibility.webmapBanner": 1,
            "visibility.webmapName": 1,
            "visibility.webmapOwner": 0,
            "visibility.webmapZoom": 256,
        }

        for col in raw_collections:
            for key, default_val in col_defaults.items():
                if col.get(key) is None:
                    col[key] = default_val

            col_id = col["id"]
            col_name = col["name"]

            # Indexation par UUID de collection
            collections_by_id[col_id] = col_name
            collections_personal_map[col_id] = col["personal"]

            collection_nbt = nbtlib.Compound({
                "id": nbtlib.String(col_id),
                "name": nbtlib.String(col_name),
                "color": nbtlib.Int(col["color"]),
                "created": nbtlib.Long(col["created"]),
                "modified": nbtlib.Long(col["modified"]),
                "lifetime": nbtlib.String(col["lifetime"]),
                "personal": nbtlib.Byte(col["personal"]),
                "owner": nbtlib.Compound({
                    "UUID": nbtlib.String(col["owner.UUID"]),
                    "username": nbtlib.String(col["owner.username"]),
                }),
                "visibility": nbtlib.Compound({
                    "fullscreenBanner": nbtlib.Byte(col["visibility.fullscreenBanner"]),
                    "fullscreenName": nbtlib.Byte(col["visibility.fullscreenName"]),
                    "fullscreenOwner": nbtlib.Byte(col["visibility.fullscreenOwner"]),
                    "fullscreenZoom": nbtlib.Int(col["visibility.fullscreenZoom"]),
                    "minimapBanner": nbtlib.Byte(col["visibility.minimapBanner"]),
                    "minimapName": nbtlib.Byte(col["visibility.minimapName"]),
                    "minimapOwner": nbtlib.Byte(col["visibility.minimapOwner"]),
                    "minimapZoom": nbtlib.Int(col["visibility.minimapZoom"]),
                    "visible": nbtlib.Byte(col["visibility.visible"]),
                    "webmapBanner": nbtlib.Byte(col["visibility.webmapBanner"]),
                    "webmapName": nbtlib.Byte(col["visibility.webmapName"]),
                    "webmapOwner": nbtlib.Byte(col["visibility.webmapOwner"]),
                    "webmapZoom": nbtlib.Int(col["visibility.webmapZoom"]),
                }),
            })

            nbt_collections.append(collection_nbt)

        print(f"📁 [Collections] Loaded {len(collections_by_id)} collections (Indexed by UUID)")
        return nbt_collections, collections_by_id, collections_personal_map

    def convert(self) -> nbtlib.File:
        nbt_collections, collections_by_id, collections_personal_map = self.load_nbt_collections()

        if not self.geojson_path.exists():
            raise FileNotFoundError(f"Impossible de trouver : {self.geojson_path}")

        with open(self.geojson_path, encoding="utf-8") as f:
            data = json.load(f)

        nbt_frontiers = []
        seen_ids = set()  # <-- NOUVEAU : Suivi des UUIDs uniques
        duplicates_count = 0

        print("\n--- Début de la résolution par collectionId ---")
        for idx, feat in enumerate(data.get("features", []), start=1):
            props = feat.get("properties", {})
            geom = feat.get("geometry", {})

            # --- GESTION ET DÉDOUBLONNAGE DE L'ID ---
            raw_id = props.get("id")

            # Si l'ID est absent, non valide ou déjà vu -> On régénère un UUID v4 unique
            if not raw_id or raw_id in seen_ids:
                frontier_id = str(uuid.uuid4())
                if raw_id in seen_ids:
                    duplicates_count += 1
            else:
                frontier_id = str(raw_id)

            seen_ids.add(frontier_id)
            # ----------------------------------------

            prop_defaults = {
                "name1": "",
                "name2": "",
                "dimension": "minecraft:overworld",
                "color": -12566464,
                "created": self.now,
                "modified": self.now,
                "owner.UUID": "71882b98-712c-4bbf-86ea-858112fa6c6f",
                "owner.username": "balrog329",
            }

            for key, default_val in prop_defaults.items():
                if props.get(key) is None:
                    props[key] = default_val

            target_collection_id = props.get("collectionId")

            if target_collection_id in collections_by_id:
                group_name = collections_by_id[target_collection_id]
                status_msg = f"OK -> '{group_name}'"
            else:
                target_collection_id = list(collections_by_id.keys())[0]
                group_name = collections_by_id[target_collection_id]
                status_msg = f"FALLBACK -> '{group_name}'"

            target_personal = collections_personal_map.get(target_collection_id, 0)

            if geom.get("type") == "Polygon":
                coords = geom.get("coordinates", [])
                if not coords:
                    continue
                ring = coords[0]
            elif geom.get("type") == "MultiPolygon":
                coords = geom.get("coordinates", [])
                if not coords or not coords[0]:
                    continue
                ring = coords[0][0]
            else:
                continue

            if ring[0] != ring[-1]:
                ring.append(ring[0])

            vertices = [
                nbtlib.Compound({
                    "X": nbtlib.Int(int(x)),
                    "Y": nbtlib.Int(70),
                    "Z": nbtlib.Int(int(-y)),
                })
                for x, y in ring
            ]

            frontier = nbtlib.Compound({
                "id": nbtlib.String(frontier_id),  # <-- Utilisation de l'ID garanti unique
                "collectionId": nbtlib.String(target_collection_id),
                "name1": nbtlib.String(props["name1"]),
                "name2": nbtlib.String(props["name2"]),
                "dimension": nbtlib.String(props["dimension"]),
                "mode": nbtlib.String("Vertex"),
                "color": nbtlib.Int(props["color"]),
                "created": nbtlib.Long(props["created"]),
                "modified": nbtlib.Long(props["modified"]),
                "lifetime": nbtlib.String("PERSISTENT"),
                "personal": nbtlib.Byte(target_personal),
                "inheritCollectionBanner": nbtlib.Byte(1),
                "owner": nbtlib.Compound({
                    "UUID": nbtlib.String(props["owner.UUID"]),
                    "username": nbtlib.String(props["owner.username"]),
                }),
                "vertices": nbtlib.List[nbtlib.Compound](vertices),
                "visibility": nbtlib.Compound({
                    "announceInChat": nbtlib.Byte(0),
                    "announceInTitle": nbtlib.Byte(0),
                    "fullscreenBannerVisible": nbtlib.Byte(0),
                    "fullscreenBiome": nbtlib.Byte(1),
                    "fullscreenCollectionVisible": nbtlib.Byte(1),
                    "fullscreenDay": nbtlib.Byte(1),
                    "fullscreenNameVisible": nbtlib.Byte(1),
                    "fullscreenNight": nbtlib.Byte(1),
                    "fullscreenOwnerVisible": nbtlib.Byte(0),
                    "fullscreenTopo": nbtlib.Byte(1),
                    "fullscreenUnderground": nbtlib.Byte(1),
                    "fullscreenVisible": nbtlib.Byte(1),
                    "mentionCollection": nbtlib.Byte(1),
                    "minimapBannerVisible": nbtlib.Byte(0),
                    "minimapBiome": nbtlib.Byte(1),
                    "minimapCollectionVisible": nbtlib.Byte(1),
                    "minimapDay": nbtlib.Byte(1),
                    "minimapNameVisible": nbtlib.Byte(1),
                    "minimapNight": nbtlib.Byte(1),
                    "minimapOwnerVisible": nbtlib.Byte(0),
                    "minimapTopo": nbtlib.Byte(1),
                    "minimapUnderground": nbtlib.Byte(1),
                    "minimapVisible": nbtlib.Byte(1),
                    "visible": nbtlib.Byte(1),
                    "webmapBannerVisible": nbtlib.Byte(0),
                    "webmapBiome": nbtlib.Byte(1),
                    "webmapCollectionVisible": nbtlib.Byte(1),
                    "webmapDay": nbtlib.Byte(1),
                    "webmapNameVisible": nbtlib.Byte(1),
                    "webmapNight": nbtlib.Byte(1),
                    "webmapOwnerVisible": nbtlib.Byte(0),
                    "webmapTopo": nbtlib.Byte(1),
                    "webmapUnderground": nbtlib.Byte(1),
                    "webmapVisible": nbtlib.Byte(1),
                }),
            })

            nbt_frontiers.append(frontier)

        print(f"⚠️ [Dédoublonnage] {duplicates_count} doublons d'UUIDs corrigés !")
        print(f"✔ [Total Frontiers] {len(nbt_frontiers)} polygones générés avec des UUIDs uniques.\n")

        root = nbtlib.Compound({
            "collections": nbtlib.List[nbtlib.Compound](nbt_collections),
            "frontiers": nbtlib.List[nbtlib.Compound](nbt_frontiers),
            "Version": nbtlib.Int(12),
        })

        return nbtlib.File(root)

    def save(self) -> None:
        nbt_file = self.convert()
        self.frontier_path.parent.mkdir(parents=True, exist_ok=True)
        nbt_file.save(self.frontier_path, gzipped=True)
        print(f"✔ Conversion réussie : {self.frontier_path}")

    def __call__(self, *args, **kwargs):
        self.save()


if __name__ == "__main__":
    converter = GeojsonToNbt()
    converter()