import { render } from '@testing-library/react';
import React from 'react';
import './App.css';

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    let url;
    if (this.props.imagePath === '') {
      url = "notfound.png";
    }
    else {
      url = "https://image.tmdb.org/t/p/original" + this.props.imagePath;
    }
    let popularity = (parseFloat(this.props.rating) * 10.0).toFixed(0);
    this.state = { imageUrl: url, popularity: popularity };
  }

  render() {
    return (
      <div class='ListItem' onClick={() => window.open('https://www.themoviedb.com/' + this.props.type + '/' + this.props.dbID)}>
        <img alt='' src={this.state.imageUrl} />
        <div>
          <div class='ListItemTitle'>

            <p><strong>{this.props.title}</strong><br></br>{this.props.desc}</p>
          </div>
          <div class='ListItemOther'><p><strong>Rating:</strong><div class='rating'>{this.state.popularity}%</div></p></div>
          <div class='other'></div>
        </div>
      </div>
    );
  }
};

function OptionList(props) {
  const optList = props.options.map((option) =>
    <div>
      <input type='radio' checked={props.selected === option} id={option} onChange={props.handleRadioChange} />
      <label for={option} value={option}>{option}</label>
    </div>
  );

  return (
    <div class='OptionList'>
      <text>{props.id}</text>
      {optList}
    </div>
  );
}

class TextBox extends React.Component {
  render() {
    return (<input type="text" value={this.props.value} id={this.props.id} onChange={this.props.onChange} />);
  }
}

class SearchPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sort: ['BST', 'Heap'], opts: ['Movie', 'Person', 'Year', 'Genre'], opts2: ['Popularity', 'Box Office', 'Rating', 'Budget'] };
  }


  render() {
    return (
      <div className="SearchPanel" class='SearchPanel'>
        <form onSubmit={this.props.handleSubmit}>
          <img alt='logo' src='Logo.png' />
          <TextBox id='test' value={this.props.query} onChange={this.props.handleTextBoxChange} />
          <div id='optionsbox'>
            <OptionList id='Search Type' options={this.state.opts} selected={this.props.sel1} handleRadioChange={this.props.handleRadioChange} />
            <OptionList id='Sort By' options={this.state.opts2} selected={this.props.sel2} handleRadioChange={this.props.handleRadioChange} />
            <OptionList id='Using' options={this.state.sort} selected={this.props.sortType} handleRadioChange={this.props.handleRadioChange} />
          </div>
          <input type="submit" id="SearchButton" value="Search" />
        </form>
      </div>
    );
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();



    this.handleTextBoxChange = this.handleTextBoxChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getInitialState() {
    return { query: '', sortType: '', listObjs: [], sel1: '', sel2: '', sort: ['BST', 'Heap'], opts: ['Movie', 'Person', 'Year', 'Genre'], opts2: ['Popularity', 'Box Office', 'Rating', 'Budget'] };
  }

  handleTextBoxChange(event) {
    this.setState({ query: event.target.value });
  }

  handleRadioChange(event) {
    if (this.state.opts.includes(event.target.id))
      this.setState({ sel1: event.target.id })
    else if (this.state.opts2.includes(event.target.id))
      this.setState({ sel2: event.target.id })
    else
      this.setState({ sortType: event.target.id });
  }


  handleSubmit(event) {
    event.preventDefault();

    let filter, dataStructure;

    switch (this.state.sel2) {
      case 'Popularity':
        filter = 1;
        break;
      case 'Box Office':
        filter = 2;
        break;
      case 'Rating':
        filter = 3;
        break;
      case 'Budget':
        filter = 4;
        break;
    }

    switch (this.state.sortType) {
      case 'BST':
        dataStructure = 1;
      default:
        dataStructure = 2;
    }

    const params = {
      query: this.state.query.trim().replace(' ', '+'),
      type: this.state.sel1,
      filter: filter,
      dataStructure: dataStructure
    };

    fetch('http://localhost:8080/api', {
      method: "POST",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    }).then(res => res.json()).then(data => {
      console.log("Data: ");
      console.log(data);
      this.setState({ listObjs: data })
      console.log(this.state.listObjs);
    });

  }

  render() {
    let movies;
    if (this.state.listObjs) {
      movies = this.state.listObjs.map((movie) => {
        return <ListItem type='movie' dbID={movie['id']} budget={movie['budget']} imagePath={movie['image path']} desc={movie['overview']} popularity={movie['popularity']} rating={movie['rating']} revenue={movie['revenue']} title={movie['title']} />
      });
    }
    return (
      <div id="App">
        <div class='SearchPanel'><SearchPanel query={this.state.query} sortType={this.state.sortType} sel1={this.state.sel1} sel2={this.state.sel2} handleRadioChange={this.handleRadioChange}
          handleSubmit={this.handleSubmit} handleTextBoxChange={this.handleTextBoxChange} /></div>
        <div id='spacer'></div>
        <div id='test'>
          {movies}
        </div>
      </div>
    );
  }
};

export default App;
