
from pathlib import Path

import nbtlib
import json

def frontierToJson(world_dir_name : str, world_real_name: str) -> Path:
    out_file = (Path(__file__).parents[3]/ "data" / "frontiers" / f"{world_real_name}_frontiers.json")
    front_mc_data = nbtlib.load(Path(__file__).parents[4] / "saves" / world_dir_name / "mapfrontiers" / "frontiers.dat")
    json_data = nbtToJson(front_mc_data)
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(json_data, f, indent=2)
    
    return Path(out_file)
    

def nbtToJson(tag):
    if hasattr(tag, "items"):
        return {k: nbtToJson(v) for k, v in tag.items()}
    elif isinstance(tag, list):
        return [nbtToJson(i) for i in tag]
    else:
        return tag
    

frontierToJson("PALISSONAIS", "Forêt de Palissonais")