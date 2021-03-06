import React from 'react';
import propTypes from 'prop-types';
import MdClose from 'react-icons/lib/md/close';

import i18n from '~shared/data/i18n';
import e2e from '~shared/data/e2e';

import './SearchBar.css';

class SearchBar extends React.Component {
  state = {
    inputValue: this.props.searchValue,
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onFormSubmit(this.state.inputValue);
  }

  handleChange = (e) => {
    const { value } = e.currentTarget;
    this.setState(() => ({ inputValue: value }));
    if (value === '' && this.props.searchValue !== '') {
      this.props.onCancelSearch();
    }
  }

  handleCancelSearchClicked = () => {
    const { onCancelSearch } = this.props;
    this.setState(() => ({ inputValue: '' }));
    onCancelSearch();
  }

  render() {
    const { inputValue } = this.state;
    const { albumsCount } = this.props;
    const placeholder = `${i18n.SEARCH_IN_ALBUMS_COLLECTION} (${albumsCount})`;
    return (
      <form className="albums-page__search-bar" onSubmit={this.handleSubmit}>
        <input
          id={e2e.DISCOVER_PAGE_SEARCH_INPUT_ID}
          placeholder={placeholder}
          className="albums-page__search-input"
          type="text"
          value={inputValue}
          onChange={this.handleChange}
        />
        <button
          type="button"
          disabled={inputValue === ''}
          id="cancel-search"
          className="albums-page__cancel-search round-button"
          onClick={this.handleCancelSearchClicked}
        >
          <MdClose />
        </button>
      </form>
    );
  }
}

SearchBar.propTypes = {
  searchValue: propTypes.string.isRequired,
  albumsCount: propTypes.number.isRequired,
  onFormSubmit: propTypes.func.isRequired,
  onCancelSearch: propTypes.func.isRequired,
};

export default SearchBar;
