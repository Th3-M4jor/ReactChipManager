const URL = "https://spartan364.hopto.org/chips.json";


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


const damageRegex = /(\d+)d(\d+)/;

const elementsEnum = {
    Fire: 0,
    Aqua: 1,
    Elec: 2,
    Wood: 3,
    Wind: 4,
    Sword: 5,
    Break: 6,
    Cursor: 7,
    Recovery: 8,
    Invis: 9,
    Object: 10,
    Null: 11,
}

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
        /** @private
         *  @type {number[]}
         */
        this._element = chipObj.Element.map((elem) => {
            return elementsEnum[elem];
        });
        /** @private */this._skills = chipObj.Skills;
        /** @private */this._range = chipObj.Range;
        /** @private */this._damage = chipObj.Damage;
        /** @private */this._type = chipObj.Type;
        /** @private */this._hits = chipObj.Hits;
        /** @private */this._description = chipObj.Description;
        /** @private */this._all = chipObj.All;
        /** @private */this._avgDamage = 0;
        /** @private */this._maxDamage = 0;
        let dice = damageRegex.exec(this._damage);
        if(dice !== null) {
            //average damage is determined by average die roll (always half max face value + 0.5) * number of dice
            this._avgDamage = Math.floor((( +dice[2] / 2) + 0.5) * (+dice[1]));
            this._maxDamage = +dice[2] * +dice[1];
        }
        
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

    get AvgDamage() {
        return this._avgDamage;
    }

    get MaxDamage() {
        return this._maxDamage;
    }

    get Range() {
        return this._range;
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