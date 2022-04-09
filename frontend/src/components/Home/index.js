import Banner from "./Banner";
import MainView from "./MainView";
import React from "react";
import Tags from "./Tags";
import agent from "../../agent";
import { connect } from "react-redux";
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER,
  CHANGE_TAB
} from "../../constants/actionTypes";

const Promise = global.Promise;

const mapStateToProps = (state) => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token,
});

const mapDispatchToProps = (dispatch) => ({
  onClickTag: (tag, pager, payload) =>
    dispatch({ type: APPLY_TAG_FILTER, tag, pager, payload }),
  onLoad: (tab, pager, payload) =>
    dispatch({ type: HOME_PAGE_LOADED, tab, pager, payload }),
  onUnload: () => dispatch({ type: HOME_PAGE_UNLOADED }),
  onSearch: title =>
    dispatch({ type: CHANGE_TAB, tab: 'all', pager: agent.Items.byTitle, payload: agent.Items.byTitle(title) })
});

class Home extends React.Component {
  constructor() {
    super();
    this.state = {searchText: ""};
  }
    
  setSearchText(searchText) {
    this.setState({ searchText });    
  }
    
  componentWillMount() {
    const tab = this.props.token ? "feed" : "all";
    const itemsPromise = this.props.token ? agent.Items.feed : agent.Items.all;

    this.props.onLoad(
      tab,
      itemsPromise,
      Promise.all([agent.Tags.getAll(), itemsPromise()])
    );
  }

  componentDidUpdate() {
    //? debounce
     if (this.state.searchText.length > 2) {       
       this.props.onSearch(this.state.searchText);
     }
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
      <div className="home-page">
        <Banner setSearchText={(searchText) => this.setSearchText(searchText) } />

        <div className="container page">
          <Tags tags={this.props.tags} onClickTag={this.props.onClickTag} />
          <MainView />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
