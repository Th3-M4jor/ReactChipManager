import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { MDBTable, MDBTableBody, MDBTableHead, MDBContainer, MDBRow, MDBCol, MDBTooltip, MDBNav, MDBNavItem, MDBNavLink, MDBTabContent, MDBTabPane } from 'mdbreact';
import './App.css';
import './Battlechip.css';
import { Packchip, LibraryChip } from './battlechip';
import { Library, Pack } from './Library';
import { loadChips } from './ChipLibrary';


class App extends React.Component {
  state = {
    chipsLoaded: false,
    activeTab: "Pack",
    pack: {},
    hand: [],
    folder: [],
    updateText: "",
  }


  modificationTimeout = null;

  componentDidMount() {
    loadChips().then(() => {
      this.setState({
        chipsLoaded: true,
        activeTab: "Library",
        pack: {},
        hand: [],
        folder: [],
        updateText: "",
      })
    });
  }

  toggle = tab => e => {
    if (this.state.activeTab !== tab) {
      clearTimeout(this.modificationTimeout);
      this.setState({
        activeTab: tab,
        updateText: "",
      });
    }
  }


  /**
   * 
   * @param {string} chipName 
   */
  addToPack(chipName) {
    clearTimeout(this.modificationTimeout);
    this.setState((state, props) => {
      if (typeof state.pack[chipName] != 'number') {
        state.pack[chipName] = 1;
      } else {
        state.pack[chipName] += 1;
      }
      return {
        chipsLoaded: state.chipsLoaded,
        activeTab: state.activeTab,
        pack: state.pack,
        hand: state.hand,
        folder: state.folder,
        updateText: `${state.pack[chipName]} ${chipName} total are now in your pack`,
      }
    });
    this.modificationTimeout = setTimeout(() => {
      this.setState({
        updateText: "",
      });
    }, 15000);
  }

  render() {

    if (!this.state.chipsLoaded) {
      return null;
    }
    return (
      <MDBContainer style={{ backgroundColor: "#00637b", padding: "5px", maxWidth: "800px" }}>
        <div style={{ backgroundColor: "#ffbd18", fontFamily: "Lucida Console", margin: "5px", color: "#FFFFFF", fontWeight: "bold" }}>
          {this.state.activeTab} <span style={{ float: "right", color: "red" }}>{this.state.updateText}</span>
        </div>
        <Router>
            <div style={{ backgroundColor: "#4abdb5", padding: "10px", width:"100%", border:"1px solid red" }}>
              <MDBNav className="nav-tabs" tabs header>
                <MDBNavItem active={this.state.activeTab === "Hand"} className={this.state.activeTab === "Hand" ? "activeTab" : "inactiveTab"} tag="div">
                  <MDBNavLink to="#" active={this.state.activeTab === "Hand"} onClick={this.toggle("Hand")} role="tab" >
                    Hand
            </MDBNavLink>
                </MDBNavItem>
                <MDBNavItem active={this.state.activeTab === "Folder1"} className={this.state.activeTab === "Folder1" ? "activeTab" : "inactiveTab"} tag="div">
                  <MDBNavLink to="#" active={this.state.activeTab === "Folder1"} onClick={this.toggle("Folder1")} role="tab">
                    Folder1
            </MDBNavLink>
                </MDBNavItem>
                <MDBNavItem active={this.state.activeTab === "Pack"} className={this.state.activeTab === "Pack" ? "activeTab" : "inactiveTab"} tag="div">
                  <MDBNavLink to="#" active={this.state.activeTab === "Pack"} onClick={this.toggle("Pack")} role="tab">
                    Pack
            </MDBNavLink>
                </MDBNavItem>
                <MDBNavItem active={this.state.activeTab === "Library"} className={this.state.activeTab === "Library" ? "activeTab" : "inactiveTab"} tag="div">
                  <MDBNavLink to="#" active={this.state.activeTab === "Library"} onClick={this.toggle("Library")} role="tab">
                    Library
            </MDBNavLink>
                </MDBNavItem>
              </MDBNav>
              <MDBTabContent activeItem={this.state.activeTab}>
                <MDBTabPane tabId="Hand" role="tabpanel">
                  <MDBContainer>
                    <div style={{
                      borderRadius: "8px", backgroundColor: "#00637b", textAlign: "center", paddingLeft: "3px", paddingRight: "1px", minWidth: "400px", overflowX: "scroll",
                      fontFamily: "Lucida Console", fontWeight: "bold", fontSize: "16px", color: "white", overflowY: "scroll", minHeight: "200px", maxHeight: "80vh"
                    }}>

                    </div>
                  </MDBContainer>
                </MDBTabPane>
                <MDBTabPane tabId="Folder1" role="tabpanel">
                  <MDBContainer>
                    <div style={{
                      borderRadius: "8px", backgroundColor: "#00637b", textAlign: "center", paddingLeft: "3px", paddingRight: "1px", minWidth: "400px", overflowX: "scroll",
                      fontFamily: "Lucida Console", fontWeight: "bold", fontSize: "16px", color: "white", overflowY: "scroll", minHeight: "200px", maxHeight: "80vh"
                    }}>

                    </div>
                  </MDBContainer>
                </MDBTabPane>
                <MDBTabPane tabId="Pack" role="tabpanel">
                  <MDBContainer>
                    <Pack contents={this.state.pack} />
                  </MDBContainer>
                </MDBTabPane>
                <MDBTabPane tabId="Library" role="tabpanel">
                  <MDBContainer fluid>
                    <Library addToPackCallback={(chipName) => { this.addToPack(chipName) }} />
                  </MDBContainer>
                </MDBTabPane>
              </MDBTabContent>
            </div>
          
        </Router>
      </MDBContainer>
    );
  }
}

/*
 
 <div style={{ backgroundColor: "#4abdb5", textAlign: "right", padding: "10px" }}>
            Pack
        <div style={{
              borderRadius: "8px", backgroundColor: "#00637b", textAlign: "left", paddingLeft: "3px", paddingRight: "1px",
              fontFamily: "Lucida Console", fontWeight: "bold", fontSize: "16px", color: "white", overflowY: "scroll", maxHeight: "500px", minHeight: "200px"
            }}>


              <Battlechip chipName="FireSword" />
            </div>
          </div>

 */
export default App;
