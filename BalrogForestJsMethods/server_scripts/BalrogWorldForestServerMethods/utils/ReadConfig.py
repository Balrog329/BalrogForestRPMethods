import json
from pathlib import Path

KUBEJS_DIR = Path(__file__).parents[3]

def getConfigjsonFile(json_name):
    return Path(KUBEJS_DIR) / "config" / f"{json_name}.json"


def loadConfigData(json_name):
    file = getConfigjsonFile(json_name)
    return readjsonFile(file)


def readjsonFile(file):
    with open(file, "r") as json_data:
        return json.load(json_data)