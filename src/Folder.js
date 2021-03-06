import React from 'react';
import { MDBRow, MDBCol, MDBContainer, MDBTooltip, MDBBtn, MDBInput } from 'mdbreact';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { BattleChip } from './ChipLibrary';
import { ElementImage } from "./ElementImage";
import { FolderWebSocket } from "./FolderWebSocket";
import './App.css';
import './Battlechip.css';


function cmp(a, b) {
    if (a > b) return +1;
    if (a < b) return -1;
    return 0;
}


class FolderChip extends React.Component {

    usedChanged = () => {
        BattleChip.getFolder()[this.props.folderIndex].Used = !BattleChip.getFolder()[this.props.folderIndex].Used;
        FolderWebSocket.folderUpdated();
        this.forceUpdate();
    }

    addChipToPack = () => {
        let name = BattleChip.returnToPackByIndex(this.props.folderIndex);
        this.props.msgCallback(`A copy of ${name} has been returned to your pack`);
    }

    stopPropagation = (e) => {e.stopPropagation()};

    render() {
        let folderChip = BattleChip.getFolder()[this.props.folderIndex];
        let chip = BattleChip.getChip(folderChip.Name);
        let type = "";
        if (folderChip.Used) {
            type = "UsedChip";
        } else {
            switch (chip.Type) {
                case "Standard":
                default:
                    type = "Chip";
                    break;
                case "Support":
                    type = "SupportChip";
                    break;
                case "Mega":
                    type = "Mega";
                    break;
                case "Giga":
                    type = "Giga";
                    break;
            }
        }
        return (
            <MDBTooltip domElement>
                <div onDoubleClick={this.addChipToPack} className={type + " noselect chipHover"} id={`F1_${this.props.folderIndex}`}>
                    <MDBRow center>
                        <MDBCol size="1" className="debug nopadding">
                            {this.props.folderIndex + 1}
                        </MDBCol>
                        <MDBCol size="3" className="debug nopadding">
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
                        <div onDoubleClick={this.stopPropagation}>
                            <input
                                name="chipUsed"
                                type="checkbox"
                                checked={folderChip.Used}
                                onChange={this.usedChanged}
                            />
                        </div>
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

    constructor(props) {
        super(props);
        this.state = {
            sortBy: "Name",
            folderLimit: BattleChip.getFolderSize(),
        }
        this.rightClickedIndex = -1;
    }


    sortSelectChanged(event) {
        this.setState({ sortBy: event.target.value });
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.active;
    }

    emptyFolder() {
        this.props.modalOpen("Are you sure you want to empty your folder?", () => {
            let count = BattleChip.emptyFolder();
            this.props.msgCallback(`${count} chips have been returned to your pack`);
        });
    }

    joinOrLeave() {
        if(FolderWebSocket.inFolderGroup()) {
            this.props.modalOpen("Are you sure you want to leave the group?", () => {
                FolderWebSocket.disconnect();
                this.props.msgCallback(`Successfully disconnected`);
            });
        } else {
            this.props.groupModalOpen();
        }
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
        let toRender = chips.map((_, index) => {
            return (
                <FolderChip folderIndex={index} msgCallback={this.props.msgCallback} key={`F1C_${index}`}/>
            );
        });
        let folderStatus = (this.props.active ? "Folder activefolder" : "Folder");
        return (
            <MDBContainer fluid>
                <MDBRow>
                    <MDBCol size="10" className="debug nopadding">
                        <MDBContainer className={folderStatus} id="folder1" fluid>
                            <MDBRow center className="sticky-top" style={{ backgroundColor: "gray" }}>
                                <MDBCol size="1" className="debug Chip nopadding">

                                </MDBCol>
                                <MDBCol size="3" className="debug Chip nopadding">
                                    <span style={{ whiteSpace: "nowrap" }}>NAME</span>
                                </MDBCol>
                                <MDBCol size="2" className="debug Chip nopadding">
                                    SKILL
                        </MDBCol>
                                <MDBCol size="1" className="debug Chip nopadding">
                                    DMG
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
                            <ContextMenuTrigger id="FolderContextMenu">
                                {toRender}
                            </ContextMenuTrigger>
                            <ContextMenu id="FolderContextMenu" hideOnLeave onShow={() => {
                                let target = document.querySelector(".chipHover:hover");
                                if(target === null) {return;}
                                this.rightClickedIndex = +target.id.substring(3);
                            }} onHide={() => {
                                this.rightClickedIndex = -1;
                            }} className="RightClickMenu">
                                <MenuItem onClick={() => {
                                    if(this.rightClickedIndex < 0 || BattleChip.getFolder().length <= this.rightClickedIndex) {
                                        return;
                                    }
                                    let name = BattleChip.returnToPackByIndex(this.rightClickedIndex);
                                    this.rightClickedIndex = -1;
                                    this.props.msgCallback(`A copy of ${name} has been returned to your pack`);
                                }} className="RightClickMenuItem">
                                <span className="noselect">Return to Pack</span>
                                </MenuItem>
                            </ContextMenu>
                        </MDBContainer>
                    </MDBCol>
                    <MDBCol size="2" className="debug nopadding">
                        <MDBInput
                            label="Chip Limit"
                            background = "white"
                            style={{ width: "100%" }}
                            type="number"
                            name="folderLimit"
                            value={this.state.folderLimit}
                            step="1"
                            min={BattleChip.getFolder().length}
                            max="100"
                            onChange={(e) => { BattleChip.setFolderSize(e.target.valueAsNumber); this.setState({ folderLimit: BattleChip.getFolderSize() }); }}
                        />
                        <span unselectable="on" className="Chip">Sort By</span><br />
                        <select value={this.state.sortBy} onChange={(e) => { this.sortSelectChanged(e) }} style={{ width: "100%" }} className="browser-default custom-select">
                            <option value="Name">Name</option>
                            <option value="Element">Element</option>
                            <option value="MaxDamage">MaxDamage</option>
                            <option value="AverageDamage">AverageDamage</option>
                            <option value="Skill">Skill</option>
                            <option value="Range">Range</option>
                        </select>
                        <br />
                        <br />
                        <div className="centerContent">
                            <MDBBtn onClick={() => {
                                let count = BattleChip.jackOut();
                                this.props.msgCallback(`${count} chips have been marked as unused`);
                            }} color="blue-grey"
                            >
                                <span className="Chip">Jack Out</span>
                            </MDBBtn>
                            <MDBBtn onClick={() => { this.emptyFolder() }} color="blue-grey">
                                <span className="Chip">Clear Folder</span>
                            </MDBBtn>
                            <MDBBtn onClick={() => {this.joinOrLeave()}} color="blue-grey">
                                <span className="Chip">{FolderWebSocket.inFolderGroup() ? "Leave" : "Join"} Folder Group</span>
                            </MDBBtn>
                        </div>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>

        );
    }
}