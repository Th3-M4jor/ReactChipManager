import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { MDBContainer, MDBNav, MDBNavItem, MDBNavLink, MDBTabContent, MDBTabPane, } from 'mdbreact';
import './App.css';
import './Battlechip.css';
import { Library, Pack } from './Library';
import { loadChips } from './ChipLibrary';


class App extends React.Component {
  state = {
    chipsLoaded: false,
    activeTab: "Pack",
    pack: {},
    folders: [[]],
    updateText: "",
  }


  modificationTimeout = null;

  componentDidMount() {
    loadChips().then(() => {
      this.setState({
        chipsLoaded: true,
        activeTab: "Library",
        pack: {},
        folders: [[]],
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
        folders: state.folders,
        updateText: `${state.pack[chipName]} ${chipName} total are now in your pack`,
      }
    });
    this.modificationTimeout = setTimeout(() => {
      this.setState({
        updateText: "",
      });
    }, 15000);
  }

  /**
   * 
   * @param {string} chipName 
   */
  removeFromPack(chipName) {
    clearTimeout(this.modificationTimeout);
    this.setState((state, props) => {

      if(state.pack[chipName] > 1) {
        state.pack[chipName] -= 1;
      } else {
        delete state.pack[chipName];
      }

      return {
        chipsLoaded: state.chipsLoaded,
        activeTab: state.activeTab,
        pack: state.pack,
        folders: state.folders,
        updateText: `A copy of ${chipName} has been removed from your pack`,
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
      <MDBContainer style={{ backgroundColor: "#00637b", padding: "5px", maxWidth: "100%" }}>
        <div style={{ backgroundColor: "#ffbd18", fontFamily: "Lucida Console", margin: "5px", color: "#FFFFFF", fontWeight: "bold" }}>
          {this.state.activeTab} <span style={{ float: "right", color: "red" }}>{this.state.updateText}</span>
        </div>
        <Router>
            <div style={{ backgroundColor: "#4abdb5", padding: "10px"}}>
              <MDBNav className="nav-tabs" tabs header>
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
                  <MDBContainer fluid>

                    <Pack contents={this.state.pack} removeCallback={(chipName) => {this.removeFromPack(chipName)}} addToFolderCallback={(chipName, folderNum) => {}} active={this.state.activeTab === "Pack"} numFolders={this.state.folders.length}/>

                  </MDBContainer>
                </MDBTabPane>
                <MDBTabPane tabId="Library" role="tabpanel">
                  
                    <Library addToPackCallback={(chipName) => { this.addToPack(chipName) }} active={this.state.activeTab === "Library"}/>
                  
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
