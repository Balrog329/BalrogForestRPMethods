from pathlib import Path
import nbtlib
import pandas as pd
from shapely.geometry import LineString, Polygon
import geopandas as gpd
from src.utils.ReadConfig import loadConfigData

class NbtFrontiersToGeoJson():

    def __call__(self, *args, **kwargs):
        self.serveur = input("Clé du serveur : ")
        self.save_dir = Path(Path(__file__).parents[4]) / "saves" / loadConfigData("serversregistry")["serversregistry"][self.serveur]["serverDir"]
        self.frontier_path = Path(self.save_dir) / "mapfrontiers" / "frontiers.dat"
        self.balrogdata_dir = Path(self.save_dir) / "balrogdata"

        self.base_treatment()


    def nbt_to_json(self,tag):
        if hasattr(tag, "items"):
            return {k: self.nbt_to_json(v) for k, v in tag.items()}
        elif isinstance(tag, list):
            return [self.nbt_to_json(i) for i in tag]
        else:
            return tag


    def frontier_dat_to_json(self, dat_path: Path) -> dict:
        nbt_data = nbtlib.load(dat_path)
        return self.nbt_to_json(nbt_data)


    def create_line(self, row):
        points = row.get("points")
        if isinstance(points, list) and len(points) >= 2:
            coords = [(float(p["X"]), -float(p["Z"])) for p in points]
            return LineString(coords)
        return None


    def create_polygon(self, row):
        vertices = row.get("vertices")
        if isinstance(vertices, list) and len(vertices) >= 3:
            coords = [(float(v["X"]), -float(v["Z"])) for v in vertices]
            return Polygon(coords)
        return None


    def create_gdf(self, df: pd.DataFrame, geometry: str = "poly") -> gpd.GeoDataFrame:
        mode_target = "Vertex" if geometry == "poly" else "Path"
        df_filtered = df[df["mode"] == mode_target].copy()

        if df_filtered.empty:
            return gpd.GeoDataFrame(crs="OGC:CRS84")

        # Génération des géométries
        if geometry == "poly":
            geoms = df_filtered.apply(self.create_polygon, axis=1)
        else:
            geoms = df_filtered.apply(self.create_line, axis=1)

        # Nettoyage des objets complexes
        cols_to_drop = ["vertices", "points", "owner", "visibility", "pathStyle"]
        df_filtered = df_filtered.drop(columns=cols_to_drop, errors="ignore")

        # Assemblage du GeoDataFrame avec la géométrie
        gdf = gpd.GeoDataFrame(df_filtered, geometry=geoms, crs="OGC:CRS84")

        # Filtrage des géométries invalides
        return gdf[gdf.geometry.notnull() & gdf.geometry.is_valid]


    def export_geojson(self, gdf: gpd.GeoDataFrame, filename: str):
        """Exporte spécifiquement les GeoDataFrames en GeoJSON."""
        if gdf.empty:
            print(f"⚠️ Aucun élément à exporter pour : {filename}")
            return

        output_path = Path(self.balrogdata_dir) / f"{filename}.geojson"
        gdf.to_file(output_path, driver="GeoJSON")
        print(f"✔ Export GeoJSON réussi ({len(gdf)} entités) : {output_path}")


    def export_json(self, df: pd.DataFrame, filename: str):
        """Exporte les DataFrames classiques (collections, etc.) en JSON standard."""
        output_path = Path(self.balrogdata_dir) / f"{filename}.json"
        df.to_json(
            output_path, orient="records", indent=2, force_ascii=False
        )
        print(f"✔ Export JSON réussi : {output_path}")


    def base_treatment(self):
        data = self.frontier_dat_to_json(Path(self.frontier_path))
        df_frontiers = pd.DataFrame(data.get("frontiers", []))

        # Export des données attributaires/tables secondaires
        if "collections" in data:
            self.export_json(pd.json_normalize(data["collections"]), "collections")

        if not df_frontiers.empty and "owner" in df_frontiers.columns:
            self.export_json(pd.json_normalize(df_frontiers["owner"]), "owners")

        # Export des couches géographiques
        gdf_polygons = self.create_gdf(df_frontiers, geometry="poly")
        self.export_geojson(gdf_polygons, filename="frontiers_polygons")

        gdf_lines = self.create_gdf(df_frontiers, geometry="line")
        self.export_geojson(gdf_lines, filename="frontiers_lines")


NbtFrontiersToGeoJson().__call__()