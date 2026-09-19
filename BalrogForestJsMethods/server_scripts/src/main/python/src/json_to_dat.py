
from pathlib import Path

import nbtlib
from nbtlib import tag

from src.utils.ReadConfig import readjsonFile, getdataJsonFile



def convert_to_nbt(value):
    """Convertit récursivement une structure Python en structure .dat"""

    if isinstance(value, dict):
        return tag.Compound({
            str(key): convert_to_nbt(subvalue)
            for key, subvalue in value.items()
        })

    if isinstance(value, list):
        if not value:
            return tag.List[tag.String]([])

        converted_values = [
            convert_to_nbt(item)
            for item in value
        ]

        first_type = type(converted_values[0])

        if all(type(item) is first_type for item in converted_values):
            return tag.List[first_type](converted_values)

        # Les listes NBT doivent contenir des éléments du même type.
        return tag.List[tag.String]([
            tag.String(str(item))
            for item in value
        ])

    # À tester avant int, car bool hérite de int en Python.
    if isinstance(value, bool):
        return tag.Byte(1 if value else 0)

    if isinstance(value, int):
        return tag.Int(value)

    if isinstance(value, float):
        return tag.Double(value)

    if value is None:
        return tag.String("")

    return tag.String(str(value))


def json_to_dat(json_name):
    json_path = Path(getdataJsonFile(json_name))

    data = readjsonFile(json_path)

    print(f"Base JSON chargée : {json_path}")

    nbt_data = convert_to_nbt(data)

    dat_path = json_path.with_suffix(".dat")

    # Écriture du fichier NBT
    nbt_file = nbtlib.File(nbt_data,gzipped=True)

    nbt_file.save(dat_path)

    print(f"Fichier DAT créé : {dat_path}")

    return dat_path


json_to_dat("foret_de_palissonais_management_book")