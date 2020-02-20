const URL = "http://spartan364.hopto.org/chips.json";


/**
 * @typedef chipProps
 * @type {object}
 * @property {string} Name
 * @property {string[]} Element
 * @property {string[]} Skills
 * @property {string} Range
 * @property {string} Damage
 * @property {("Standard"|"Mega"|"Giga")} Type
 * @property {string} Hits
 * @property {string} Description
 * @property {string} All
 * 
 */




/**
 * @class LibraryChip represents a full battlechip's data
 */
export class BattleChip {
    /**
     * 
     * @param {chipProps} chipObj the raw chip data
     */
    constructor(chipObj) {
        /** @private */this._name = chipObj.Name;
        /** @private */this._element = chipObj.Element;
        /** @private */this._skills = chipObj.Skills;
        /** @private */this._range = chipObj.Range;
        /** @private */this._damage = chipObj.Damage;
        /** @private */this._type = chipObj.Type;
        /** @private */this._hits = chipObj.Hits;
        /** @private */this._description = chipObj.Description;
        /** @private */this._all = chipObj.All;
    }

    get Name() {
        return this._name;
    }

    get Element() {
        return this._element;
    }

    get Skill() {
        if(this._skills.length > 1) return "Varies";
        else return this._skills[0];
    }

    get Damage() {
        return this._damage;
    }

    get Type() {
        return this._type;
    }

    get Hits() {
        return this._hits;
    }

    get Description() {
        return this._description;
    }

    /**
     * the full text of the chip as written in the official Chip Library
     */
    get All() {
        return this._all;
    }


}

/**@type {Map<string, LibraryChip>} */
var library = new Map();


export async function loadChips() {
    library.clear();
    let body = await fetch(URL);
    let result = await body.json();
    result.forEach(chip => {
        library.set(chip.Name.toLocaleLowerCase(), new BattleChip(chip));
    });
    return true;
}

/**
 * 
 * @param {string} name
 * 
 * @returns {BattleChip} a battlechip if there is one
 * 
 * @throws if an improper chip name was used
 */
export function getChip(name) {
    if (!library.has(name?.toLocaleLowerCase())) {
        throw new Error("Bad chip name");
    }
    return library.get(name.toLocaleLowerCase());
}

/**
 * @returns {BattleChip[]} an array of all battlechips
 */
export function libraryAsArray() {
    return [...library.values()];
}