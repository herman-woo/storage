cover_modification_factors = {
    1: {"type":"quantitative","description": "Operational (New Conditions) only Cover", "factor":  0.85},
    2: {"type":"quantitative","description": "Historical (New Conditions) only Cover", "factor":  0.65},
    3: {"type":"quantitative","description": "Excess of Indemnity", "factor":  0.80},
    4: {"type":"quantitative","description": "D&O Insuring Agreement Cover", "factor":  1.15},
    5: {"type":"quantitative","description": "SBU Policy", "factor":  0.85}}

# Example usage
def get_cover_mod_info(item):
    return cover_modification_factors.get(item, {"description": "Unknown", "factor": 0})

# Example call
# print(get_naics_info(111))  # {'description': 'Crop production', 'premium': 6700}
