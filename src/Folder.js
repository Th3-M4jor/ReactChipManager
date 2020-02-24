import React from 'react';
import { MDBRow, MDBCol, MDBContainer, MDBTooltip} from 'mdbreact';
// eslint-disable-next-line
import { BattleChip } from './ChipLibrary';
import { ElementImage } from "./ElementImage";
import './App.css';
import './Battlechip.css';

function cmp(a, b) {
    if (a > b) return +1;
    if (a < b) return -1;
    return 0;
}


class FolderChip extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {used: this.props.used};
    }
    
    usedChanged() {
        this.setState((state) => {
           return {
               used: !state.used,
           }  
        });
    }

    render() {
        if (!this.props.chipName) {
            throw new Error("missing chipName");
        }

        let chip = BattleChip.getChip(this.props.chipName.toLocaleLowerCase());
        let type = "";
        switch (chip.Type) {
            case "Giga":
                type = "Giga";
                break;
            case "Mega":
                type = "Mega";
                break;
            case "Standard":
            default:
                type = "Chip";
                break;
        }
        return (
            <MDBTooltip domElement>
                <div onDoubleClick={() => { BattleChip.returnToFolder(chip.Name, this.state.used); this.props.msgCallback(`You now own ${chip.Owned} copies of ${chip.Name}`) }} className={type + " noselect"}>
                    <MDBRow center>
                        <MDBCol size="2" className="debug nopadding">
                            <span style={{ whiteSpace: "nowrap" }}>{chip.Name}</span>
                        </MDBCol>
                        <MDBCol size="2" className="debug nopadding">
                            {chip.Skill}
                        </MDBCol>

                        <MDBCol size="1" className="debug nopadding">
                            {chip.Damage}
                        </MDBCol>
                        <MDBCol size="1" className="debug centercontent nopadding">
                            {chip.Range}
                        </MDBCol>
                        <MDBCol size="1" className="debug nopadding centercontent">
                        <span style={{ whiteSpace: "nowrap" }}>{chip.Hits}</span>
                        </MDBCol>
                        <MDBCol size="1" className="debug centerContent nopadding">
                            <ElementImage element={chip.Element} />
                        </MDBCol>
                        <MDBCol size="1" className="debug centerContent nopadding">
                        <input
                            name="chipUsed"
                            type="checkbox"
                            checked={this.state.used}
                            onChange={() => {this.usedChanged()}} />
                        </MDBCol>
                    </MDBRow>
                </div>
                <span>{chip.Description}</span>
            </MDBTooltip>
        );
    }
}

/**
 * @typedef FolderChipObj
 * @type {object}
 * @property {string} Name
 * @property {boolean} Used
 */

export class Folder extends React.Component {

    state = {
        sortBy: "Name",
    }


    sortSelectChanged(event) {
        this.setState({ sortBy: event.target.value });
    }


    /**
     * @private
     * @param {FolderChipObj[]} list
     * @returns {FolderChipObj[]}
     */
    sortChips(list) {
        switch (this.state.sortBy) {
            case "Name":
                return list.sort((a, b) => cmp(BattleChip.getChip(a.Name).TypeSortPos, BattleChip.getChip(b.Name).TypeSortPos) || cmp(a.Name, b.Name));
            case "Element":
                return list.sort((a, b) => cmp(BattleChip.getChip(a.Name).Element[0], BattleChip.getChip(b.Name).Element[0]) || cmp(a.Name, b.Name));
            case "MaxDamage":
                return list.sort((a, b) => cmp(BattleChip.getChip(b.Name).MaxDamage, BattleChip.getChip(a.Name).MaxDamage) || cmp(a.Name, b.Name));
            case "AverageDamage":
                return list.sort((a, b) => cmp(BattleChip.getChip(b.Name).AvgDamage, BattleChip.getChip(a.Name).AvgDamage) || cmp(a.Name, b.Name));
            case "Skill":
                return list.sort((a, b) => cmp(BattleChip.getChip(a.Name).SkillSortPos, BattleChip.getChip(b.Name).SkillSortPos) || cmp(a.Name, b.Name));
            case "Range":
                return list.sort((a, b) => cmp(BattleChip.getChip(a.Name).RangeSortPos, BattleChip.getChip(b.Name).RangeSortPos) || cmp(a.Name, b.Name));
            default:
                throw Error("Invalid sort option");
        }
    }

    render() {
        let chips = BattleChip.getFolder();
        chips = this.sortChips(chips);
        let toRender = chips.map((chip) => {
            return (
                <FolderChip chipName={chip.Name} used={chip.Used} msgCallback={this.props.msgCallback} />
            );
        });
        let folderStatus = (this.props.active ? "Folder activefolder" : "Folder");
        return (
            <MDBContainer fluid>
                <MDBRow>
                    <MDBCol size="11" className="debug nopadding">
                        <MDBContainer className={folderStatus} id="folder1" fluid>
                            <MDBRow center className="sticky-top" style={{ backgroundColor: "gray" }}>
                                <MDBCol size="2" className="debug Chip nopadding">
                                    <span style={{ whiteSpace: "nowrap" }}>NAME</span>
                                </MDBCol>
                                <MDBCol size="2" className="debug Chip nopadding">
                                    SKILL
                        </MDBCol>
                                <MDBCol size="1" className="debug Chip nopadding">
                                    DAMAGE
                        </MDBCol>
                                <MDBCol size="1" className="debug Chip nopadding">
                                    RANGE
                        </MDBCol>
                                <MDBCol size="1" className="debug Chip nopadding">
                                    HITS
                        </MDBCol>
                                <MDBCol size="1" className="debug Chip nopadding">

                                </MDBCol>
                                <MDBCol size="1" className="debug Chip nopadding">
                                    USED
                                </MDBCol>
                            </MDBRow>
                            {toRender}
                        </MDBContainer>
                    </MDBCol>
                    <MDBCol size="1" className="debug nopadding">
                        <span unselectable="on">Sort By</span><br />
                        <select value={this.state.sortBy} onChange={(e) => { this.sortSelectChanged(e) }} style={{ width: "100%" }}>
                            <option value="Name">Name</option>
                            <option value="Element">Element</option>
                            <option value="MaxDamage">MaxDamage</option>
                            <option value="AverageDamage">AverageDamage</option>
                            <option value="Skill">Skill</option>
                            <option value="Range">Range</option>
                        </select>

                    </MDBCol>
                </MDBRow>
            </MDBContainer>

        );
    }
}