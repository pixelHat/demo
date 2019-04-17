import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {sortBy} from 'lodash';
import './App.css';
import Search from './components/Search';
import Table from './components/Table';
import Button from './components/Button';
import Loading from './components/Loading';


const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '10';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;

const updateSearchTopStoriesState = (hits, page) => (prevState) => {
  const {searchKey, results} = prevState;
  const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];

  const updatedHits = [
      ...oldHits,
      ...hits,
  ];
  return {
      results: {
          ...results,
          [searchKey]: {hits: updatedHits, page},
      },
      isLoading: false,
  };
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
        results: null,
        searchKey: '',
        searchTerm: DEFAULT_QUERY,
        error: null,
        isLoading: false,
    };

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onSearchSubmit(event) {
      this.setState((state) => {return {searchKey: state.searchTerm}});

      const {searchTerm} = this.state;
      if (this.needsToSearchTopStories(searchTerm)) {
          this.fetchSearchTopStories(searchTerm);
      }

      event.preventDefault();
  }

  onDismiss(id) {
    const {searchKey, results} = this.state;
    const {hits, page} = results[searchKey];
    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    this.setState({
        results: {
            ...results,
            [searchKey]: {hits: updatedHits, page},
        }
    });
  }

  setSearchTopStories(result) {
      const {hits, page} = result;
      this.setState(updateSearchTopStoriesState(hits, page));
  }

  fetchSearchTopStories(searchTerm, page = 0) {
      this.setState({isLoading: true});
      fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => this.setState({error}));
  }

  componentDidMount() {
      const {searchTerm} = this.state;
      this.setState({searchKey: searchTerm});
      this.fetchSearchTopStories(searchTerm);
  }

  render() {
    const { searchTerm, results, searchKey,
            error, isLoading } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search
            className="search-input"
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        <div className="interactions">
          <TableWithError
            className="table"
            error={error}
            list={list}
            onDismiss={this.onDismiss}
            />
        </div>
            <div className="interactions">
                <ButtonWithLoading
                    className="button is-link"
                    isLoading={isLoading}
                    onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
                >
                    More
                </ButtonWithLoading>
            </div>
      </div>
    );
  }
}

const withLoading = (Component) => ({isLoading, ...rest}) =>
  isLoading ? <Loading /> : <Component {...rest} />

const withError = (Component) => ({error, ...rest}) =>
  error ? <p>Something went wrong.</p> : <Component {...rest} />

const ButtonWithLoading = withLoading(Button);
const TableWithError = withError(Table);


export default App;
export {
    Button,
    Search,
    Table,
};
