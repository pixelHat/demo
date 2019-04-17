import React, {Component} from 'react';
import {sortBy} from 'lodash';
import Button from './Button';

const SORTS = {
    NONE: list => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: list => sortBy(list, 'author'),
    COMMENTS: list => sortBy(list, 'num_comments').reverse(),
    POINTS: list => sortBy(list, 'points').reverse(),
};

const Sort = ({sortKey, activeSortKey, onSort, children}) => {
  const sortClass = ['button-inline'];
  if (sortKey === activeSortKey) {
      sortClass.push('button-active');
  }
  return (
      <a
          onClick={() => onSort(sortKey)}
          className={sortClass.join(' ')}
          >
          {children}
      </a>
  );
}

export default class Table extends Component {
  constructor(props) {
      super(props);
      this.state = {
          sortKey: 'NONE',
          isSortReverse: false,
      };
      this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    this.setState(state => {
      const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
      return {sortKey, isSortReverse};
    });
  }

  render() {
      const {
          list,
          onDismiss
      } = this.props;
      const {
          sortKey,
          isSortReverse,
      } = this.state;
      const sortedList = SORTS[sortKey](list);
      const reversedSortedList = isSortReverse ? sortedList.reverse() : sortedList;
      return (
        <table className={this.props.className}>
        <thead>
          <tr>
            <th>
              <Sort
                sortKey={'TITLE'}
                onSort={this.onSort}
                activeSortKey={sortKey}
                >
                Title
              </Sort>
            </th>
            <th>
              <Sort
                sortKey={'AUTHOR'}
                onSort={this.onSort}
                activeSortKey={sortKey}
                >
                Author
              </Sort>
            </th>
            <th>
              <Sort
                sortKey={'COMMENTS'}
                onSort={this.onSort}
                activeSortKey={sortKey}
                >
                Comments
              </Sort>
            </th>
            <th>
              <Sort
                sortKey={'POINTS'}
                onSort={this.onSort}
                activeSortKey={sortKey}
                >
                Points
              </Sort>
            </th>
          </tr>
          </thead>
          <tbody>
          {reversedSortedList.map(item =>
            <tr key={item.objectID}>
              <td><a href={item.url}>{item.title}</a></td>
              <td>{item.author}</td>
              <td>{item.num_comments}</td>
              <td>{item.points}</td>
            </tr>
          )}
        </tbody>
        </table>
      )
  }
}
