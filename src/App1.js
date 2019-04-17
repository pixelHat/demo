import React, { Component } from 'react';
import './App.css';

const l = [
    {id: 1,
     name: "Python"
    },
    {id: 2,
     name: "Haskell"
    },
    {id: 3,
     name: "Go"
    },
];

function isSearched(searchTerm) {
    return function(item) {
        return item.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
}
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: l,
            searchTerm: "",
        };

        this.onSearchChange = this.onSearchChange.bind(this);
    }

    render() {
        const {searchTerm, list} = this.state;
        return (
            <div className="App">
                <Search value={searchTerm} onChange={this.onSearchChange} />
                <Table list={list} pattern={searchTerm} />
            </div>
        );
    }

    onSearchChange(event) {
        this.setState({searchTerm: event.target.value})
    }
}

const Search = ({value, onChange, children}) =>
    <form>
        <input type="text"
               value={value}
               onChange={onChange}/>
    </form>

class Table extends Component {
    render() {
        const {list, pattern} = this.props;
        return (
            <ul>
            {list.filter(isSearched(pattern)).map(item =>
                <li key={item.id}>{item.name}</li>
            )}
            </ul>
        );
    }
}

class Button extends Component {
    render() {
        const {
            onClick,
            className = '',
            children,
        } = this.props;

        return (
            <button onClick={onClick}
                    className={className}
                    type="button">
                {children}
            </button>
        );
    }
}
export default App;
