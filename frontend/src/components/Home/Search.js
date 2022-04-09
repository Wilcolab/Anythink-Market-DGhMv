import { useState, useEffect } from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import { CHANGE_TAB } from '../../constants/actionTypes';

const mapStateToProps = state => ({
  ...state.itemList
});

const mapDispatchToProps = dispatch => ({
  onSearch: title =>
    dispatch({ type: CHANGE_TAB, tab: 'all', pager: agent.Items.byTitle, payload: agent.Items.byTitle(title) })
});

const Search = props => {
  console.log(props);
  const { onSearch } = props;
  const [searchText, setSearchText] = useState('');

  const handleChange = e => {
    //? remove spaces
    setSearchText(e.target.value);
  };

  useEffect(() => {
    //? debounce
    if (searchText.length > 2) {
      onSearch(searchText);
    }
  }, [searchText, onSearch]);

  //? UI changes
  return <input id="search-box" type="text" placeholder="Search" onChange={handleChange} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
