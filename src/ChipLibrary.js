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
};

const skillsEnum = {
    Sense: 0,
    Info: 1,
    Coding: 2,
    Strength: 3,
    Speed: 4,
    Stamina: 5,
    Charm: 6,
    Bravery: 7,
    Affinity: 8,
    Varies: 9,
    None: 10,
};

const rangesEnum = {
    Far: 0,
    Near: 1,
    Close: 2,
    Self: 3,
}

const chipTypeEnum = {
    Standard: 0,
    Mega: 1,
    Giga: 2,
    Dark: 3,
}

/**
 * @class BattleChip represents a full battlechip's data
 */
export class BattleChip {
    

    /** @private */static _NUM_IN_FOLDER = 0;
    /** @private */static _FOLDER_LIMIT = 10;

    static getFolderSize() {
        return BattleChip._FOLDER_LIMIT;
    }

    /**
     * 
     * @param {number} newSize 
     */
    static setFolderSize(newSize) {
        if(newSize < BattleChip._NUM_IN_FOLDER) {
            throw new Error("You must remove chips from your folder before you can lower this number");
        }
    }

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
        /** @private
         *  @type {number} */
        this._skillSortPos = 0;
        if (this._skills.length > 1) {
            this._skillSortPos = skillsEnum.Varies;
        } else {
            this._skillSortPos = skillsEnum[this._skills[0]];
        }
        /** @private */this._avgDamage = 0;
        /** @private */this._maxDamage = 0;
        let dice = damageRegex.exec(this._damage);
        if (dice !== null) {
            //average damage is determined by average die roll (always half max face value + 0.5) * number of dice
            this._avgDamage = Math.floor(((+dice[2] / 2) + 0.5) * (+dice[1]));
            this._maxDamage = +dice[2] * +dice[1];
        }
        /**@private 
         * @type {number}
         */
        this._chipTypeSortPos = chipTypeEnum[this._type];
        /**
         * @private
         * @type {number}
         */
        this._chipRangeSortPos = rangesEnum[this._range];


        /** @private */this._owned = 0;
        /** @private */this._used = 0;
        /** @private */this._inFolder = 0;

    }

    get Name() {
        return this._name;
    }

    get Element() {
        return this._element;
    }

    get Skill() {
        if (this._skills.length > 1) return "Varies";
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

    get RangeSortPos() {
        return this._chipRangeSortPos;
    }

    get TypeSortPos() {
        return this._chipTypeSortPos;
    }

    get SkillSortPos() {
        return this._skillSortPos;
    }

    get Owned() {
        return this._owned;
    }

    get Used() {
        return this._used;
    }

    /**
     * @param {number} newCt
     */
    set Owned(newCt) {
        if(newCt < this._used) {
            this._used = newCt;
        }
        this._owned = newCt;
    }

    /**
     * @param {number} newCt
     */
    set Used(newCt) {
        if(newCt > this._owned) {
            throw new Error("Cannot set used count higher than owned count");
        }
        this._used = newCt;
    }

    get InFolder() {
        return this._inFolder;
    }

    /**
     * the full text of the chip as written in the official Chip Library
     */
    get All() {
        return this._all;
    }

    addToFolder() {
        let unused = this._owned - this._used - this._inFolder;
        if(unused > 0 && BattleChip._FOLDER_LIMIT > BattleChip._NUM_IN_FOLDER) {
            this._inFolder++;
            BattleChip._NUM_IN_FOLDER++;
        } else {
            throw new Error("Cannot add that to your folder, either not enough unused, or too many in your folder or your folder has too many chips already");
        }
    }


}

/**@type {Map<string, BattleChip>} */
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