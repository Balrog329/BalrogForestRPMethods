
import pandas as pd
from pathlib import Path
import json
import geopandas as gpd
from sympy.physics.units import length

# json_path = r"E:\dossier_jeux\minecraft\Balrog_worlds\balrog_worlds\saves\PALISSONAIS\balrogdata\collections.json"
#
# with open(json_path, 'r') as f:
#     data = json.load(f)
#
# print(data)
# df = pd.json_normalize(data)
#
# #df.to_excel(r"E:\dossier_jeux\minecraft\Balrog_worlds\balrog_worlds\saves\PALISSONAIS\balrogdata\collections.xlsx")
#
# print(df)

gpkg_path = r"E:\dossier_jeux\minecraft\Balrog_world_forest_management\VIDAILLAT\SIG\cadastre.gpkg"

idus = []

gdf = gpd.read_file(gpkg_path)
print(gdf.length)

print(gdf["name1"])

for data in gdf["name1"]:
    print(data)
    idus.append(data)

print(idus)
print(len(idus))