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

/**
 * @typedef FolderChipObj
 * @type {object}
 * @property {string} Name
 * @property {boolean} Used
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

    /** @private */static _FOLDER_LIMIT = 10;

    /**
     * @private
     * @type {FolderChipObj[]}
     */
    static _FOLDER = [];


    /** @private
     * @type {Map<string, BattleChip>}
     */
    static _library = new Map();


    static getFolderSize() {
        return BattleChip._FOLDER_LIMIT;
    }

    /**
     * 
     * @param {number} newSize 
     */
    static setFolderSize(newSize) {
        if (newSize < BattleChip._FOLDER.length) {
            throw new Error("You must remove chips from your folder before you can lower this number");
        }
        BattleChip._FOLDER_LIMIT = newSize;
    }

    static getFolder() {
        return BattleChip._FOLDER;
    }

    static async loadChips() {
        BattleChip._library.clear();
        let body = await fetch(URL);
        let result = await body.json();
        result.forEach(chip => {
            BattleChip._library.set(chip.Name.toLocaleLowerCase(), new BattleChip(chip));
        });
        return true;
    }

    /**
     * @returns {BattleChip[]} an array of all battlechips
     */
    static libraryAsArray() {
    return [...BattleChip._library.values()];
}

    /**
    * 
    * @param {string} name
    * 
    * @returns {BattleChip} a battlechip if there is one
    * 
    * @throws if an improper chip name was used
    */
    static getChip(name) {
        if (!BattleChip._library.has(name?.toLocaleLowerCase())) {
            throw new Error("Bad chip name");
        }
        return BattleChip._library.get(name.toLocaleLowerCase());
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

            if(this._skills[0] == "None") {
                this._skills[0] = "--";
            }
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
        if (newCt < this._used) {
            this._used = newCt;
        }
        this._owned = newCt;
    }

    /**
     * @param {number} newCt
     */
    set Used(newCt) {
        if (newCt > this._owned) {
            throw new Error("Cannot set used count higher than owned count");
        }
        this._used = newCt;
    }

    /**
     * the full text of the chip as written in the official Chip Library
     */
    get All() {
        return this._all;
    }

    addToFolder() {
        let unused = this._owned - this._used;
        if (unused > 0 && BattleChip._FOLDER_LIMIT > BattleChip._FOLDER.length) {
            BattleChip._FOLDER.push({ Name: this.Name, Used: false });
            this._owned--;
        } else {
            throw new Error("Cannot add that to your folder, either not enough unused, too many in your folder, or your folder has too many chips already");
        }
    }

    /**
     * Remove a specified chip from the folder and return it to the pack, as used or unused
     * 
     * @param {string} name 
     * @param {boolean} used
     */
    static returnToPack(name, used) {
        let chipIndex = -1;
        for(let i = 0; i < BattleChip._FOLDER.length; i++) {
            if(BattleChip._FOLDER[i].Name === name) {
                chipIndex = i;
            }
        }
        if(chipIndex < 0) {
            throw new Error("Could not find specified chip");
        }
        BattleChip._FOLDER.splice(chipIndex, 1);
        let chip = BattleChip.getChip(name);
        chip.Owned++;
        if(used) {
            chip.Used++;
        }
    }

    /**
     * 
     * @param {number} index 
     */
    static returnToPackByIndex(index) {
        let chip = BattleChip._FOLDER.splice(index, 1)[0];
        let packChip = BattleChip.getChip(chip.Name);
        packChip.Owned++;
        if(chip.Used) {
            packChip.Used++;
        }
    }

    /**
     * reset all used chips to unused
     */
    static jackOut() {
        BattleChip._FOLDER.forEach((chip) => {
            chip.Used = false;
        });
        BattleChip._library.forEach((chip) => {
            chip.Used = 0;
        });
    }


}