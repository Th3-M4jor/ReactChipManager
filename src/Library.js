import React from 'react';
import { MDBRow, MDBCol, MDBContainer, } from 'mdbreact';
// eslint-disable-next-line
import { libraryAsArray, getChip, BattleChip } from './ChipLibrary';
import { LibraryChip, Packchip } from './battlechip';
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
    }


    sortSelectChanged(event) {
        this.setState({sortBy: event.target.value});
    }


    /**
     * @private
     * @param {BattleChip[]} list
     * @returns {BattleChip[]}
     */
    sortChips(list) {
        switch(this.state.sortBy) {
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

    render() {
        if (!this.props.addToPackCallback) {
            throw new Error("missing add to pack callback");
        }
        let chips = libraryAsArray();
        chips = this.sortChips(chips);
        let toRender = chips.map((chip) => {
            return (
                <LibraryChip chipName={chip.Name} addToPackCallback={this.props.addToPackCallback} key={chip.Name}/>
            )
        });
        return (
            <MDBContainer fluid>
                <MDBRow>
                    <MDBCol size="11" className="debug">
                        <MDBContainer className="Folder" id="fullLibrary" fluid>
                            <MDBRow center className="sticky-top" style={{ backgroundColor: "gray" }}>
                                <MDBCol size="2" className="debug Chip nopadding">
                                    <span style={{ whiteSpace: "nowrap" }}>NAME</span>
                                </MDBCol>
                                <MDBCol size="2" className="debug Chip nopadding">
                                    SKILL
                        </MDBCol>
                                <MDBCol size="2" className="debug Chip nopadding">
                                    DAMAGE
                        </MDBCol>
                                <MDBCol size="2" className="debug Chip nopadding">
                                    RANGE
                        </MDBCol>
                                <MDBCol size="1" className="debug Chip nopadding">
                                    HITS
                        </MDBCol>
                                <MDBCol size="1" className="debug Chip nopadding">

                                </MDBCol>
                            </MDBRow>
                            {toRender}
                        </MDBContainer>
                    </MDBCol>
                    <MDBCol size="1" className="debug nopadding">
                        <span unselectable="off">Sort By</span><br/>
                        <select value={this.state.sortBy} onChange={(e) => {this.sortSelectChanged(e)}} style={{width:"100%"}}>
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


export class Pack extends React.Component {
    render() {
        if (typeof this.props.contents != 'object') {
            throw new Error("No pack set");
        }

        /**@type {BattleChip[]} */
        let chipList = [];

        for (const property in this.props.contents) {
            chipList.push(getChip(property));
        }
        chipList.sort((a, b) => a.Name.localeCompare(b.Name));

        let chips = chipList.map((chip) => {
            return (
                <Packchip chipName={chip.Name} chipCount={this.props.contents[chip.Name]} key={chip.Name}/>
            );
        });
        /*
        let chips = libraryAsArray().filter((chip) => chip.Owned > 0);
        chips = chips.sort((a, b) => a.Name.localeCompare(b.Name));
        let toRender = chips.map((chip) => {
            return (
                <PackChip chipName={chip.Name}/>
            )
        });
        */
        return (
            <MDBContainer id="fullPack" className="Folder" fluid>
                <MDBRow center className="sticky-top" style={{ backgroundColor: "gray" }}>
                    <MDBCol size="2" className="debug Chip">
                        NAME
                    </MDBCol>
                    <MDBCol size="2" className="debug Chip">
                        SKILL
                    </MDBCol>

                    <MDBCol size="2" className="debug Chip">
                        DAMAGE
                    </MDBCol>
                    <MDBCol size="2" className="debug Chip">
                        RANGE
                    </MDBCol>
                    <MDBCol size="1" className="debug Chip">
                        HITS
                    </MDBCol>
                    <MDBCol size="1" className="debug Chip">

                    </MDBCol>
                    <MDBCol size="1" className="debug Chip">

                    </MDBCol>
                </MDBRow>
                {chips}
            </MDBContainer>
        );
    }
}