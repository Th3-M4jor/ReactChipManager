import React from 'react';
import { MDBRow, MDBCol, MDBContainer, MDBInput, } from 'mdbreact';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
// eslint-disable-next-line
import { BattleChip } from './ChipLibrary';
import { LibraryChip } from './battlechip';
import './App.css';
import './Battlechip.css';



function cmp(a, b) {
    if (a > b) return +1;
    if (a < b) return -1;
    return 0;
}

export class Library extends React.Component {
    state = {
        sortBy: "Name",
        nameSearch: "",
    }

    static rightClickedChipName = "";

    
    sortSelectChanged = (e) => { this.setState({ sortBy: e.target.value }); }

    searchChangedEvent = (e) => { this.setState({ nameSearch: e.target.value }) }


    /**
     * @private
     * @param {BattleChip[]} list
     * @returns {BattleChip[]}
     */
    sortChips(list) {
        switch (this.state.sortBy) {
            case "Name":
                return list.sort((a, b) => cmp(a.TypeSortPos, b.TypeSortPos) || cmp(a.Name, b.Name));
            case "Element":
                return list.sort((a, b) => cmp(a.Element[0], b.Element[0]) || cmp(a.Name, b.Name));
            case "MaxDamage":
                return list.sort((a, b) => cmp(b.MaxDamage, a.MaxDamage) || cmp(a.Name, b.Name));
            case "AverageDamage":
                return list.sort((a, b) => cmp(b.AvgDamage, a.AvgDamage) || cmp(a.Name, b.Name));
            case "Skill":
                return list.sort((a, b) => cmp(a.SkillSortPos, b.SkillSortPos) || cmp(a.Name, b.Name));
            case "Range":
                return list.sort((a, b) => cmp(a.RangeSortPos, b.RangeSortPos) || cmp(a.Name, b.Name));
            default:
                throw Error("Invalid sort option");
        }
    }


    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.active !== true) {
            return false;
        }
        if (this.state.sortBy !== nextState.sortBy || this.state.nameSearch !== nextState.nameSearch) {
            return true;
        }
        return false;
    }

    OnShowContextMenu = () => {
        let target = document.querySelector(".chipHover:hover");
        if (target === null) {
            return;
        }
        Library.rightClickedChipName = target.id.slice(0, -2);
    }

    onHideContextMenu = () => {
        Library.rightClickedChipName = "";
    }

    onMenuItemClick = () => {
        if (Library.rightClickedChipName !== "") {
            let chip = BattleChip.getChip(Library.rightClickedChipName);
            chip.Owned++; this.props.msgCallback(`You now own ${chip.Owned} copies of ${chip.Name}`);
        }
        Library.rightClickedChipName = "";
    }

    render() {

        let chips = BattleChip.libraryAsArray();
        chips = this.sortChips(chips);

        /** @type {JSX.Element[]} */
        let toRender = [];

        if (this.state.nameSearch !== "") {

            chips.reduce((toRender, chip) => {
                if (chip.Name.toLocaleLowerCase().startsWith(this.state.nameSearch.toLocaleLowerCase())) {
                    toRender.push(
                        <LibraryChip chipName={chip.Name} msgCallback={this.props.msgCallback} key={chip.Name} />
                    );
                }
                return toRender;
            }, toRender)
            if (toRender.length === 0) {
                toRender = "Nothing matched your search";
            }
        } else {
            toRender = chips.map((chip) => {
                return (
                    <LibraryChip chipName={chip.Name} msgCallback={this.props.msgCallback} key={chip.Name} />
                )
            });
        }
        let libraryStatus = (this.props.active ? "Folder activefolder" : "Folder");
        return (
            <MDBContainer fluid>
                <MDBRow>
                    <MDBCol size="10" className="debug nopadding">
                        <MDBContainer className={libraryStatus} id="fullLibrary" fluid>
                            <MDBRow center className="sticky-top" style={{ backgroundColor: "gray" }}>
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
                            </MDBRow>
                            <ContextMenuTrigger id="LibraryContextMenu">
                                {toRender}
                            </ContextMenuTrigger>
                            <ContextMenu id="LibraryContextMenu" hideOnLeave onShow={this.OnShowContextMenu} onHide={this.onHideContextMenu}
                                className="RightClickMenu">
                                <MenuItem onClick={this.onMenuItemClick} className="RightClickMenuItem">
                                    <span className="noselect">Add copy to Pack</span>
                                </MenuItem>
                            </ContextMenu>
                        </MDBContainer>
                    </MDBCol>
                    <MDBCol size="2" className="debug nopadding">
                    
                        <span unselectable="on" className="Chip">Sort By</span><br />
                        <select value={this.state.sortBy} onChange={this.sortSelectChanged} style={{ width: "100%" }} className="browser-default custom-select">
                            <option value="Name">Name</option>
                            <option value="Element">Element</option>
                            <option value="MaxDamage">MaxDamage</option>
                            <option value="AverageDamage">AverageDamage</option>
                            <option value="Skill">Skill</option>
                            <option value="Range">Range</option>
                        </select>
                        <MDBInput type="text" value={this.state.nameSearch} size="sm" background="white" label="Search" onChange={this.searchChangedEvent} />
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        );
    }
}


