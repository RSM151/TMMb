import React from 'react';
import './App.css';

class ListItem extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div class='ListItem' onClick={() => window.open('https://www.themoviedb.com/' + this.props.type + '/' + this.props.dbID)}>
        <img alt='' src={this.props.imageUrl} />
        <div>
          <div class='ListItemTitle'>
            
    <p><strong>{this.props.title}</strong><br></br>{this.props.desc}</p>
          </div>
    <div class='ListItemTitle'><p><div class='rating'>{this.props.rating}</div></p></div>
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
    this.state = { query: '', sort: ['BST', 'Heap'], sortType: '', opts: ['Movie', 'Person', 'Year', 'Genre'], opts2: ['Popularity', 'Box Office', 'Rating', 'Budget'], sel1: '', sel2: '' };
    this.setState();

    this.handleTextBoxChange = this.handleTextBoxChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handeSubmit = this.handeSubmit.bind(this);
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
      this.setState({sortType: event.target.id});
  }

  handeSubmit(event) {
    event.preventDefault();
    alert("Query: " + this.state.query + "; Type: " + this.state.sel1 + "; Filter: " + this.state.sel2);

  }

  render() {
    return (
      <div className="SearchPanel" class='SearchPanel'>
        <form onSubmit={this.handeSubmit}>
        <img alt='logo' src='Logo.png' />
          <TextBox id='test' value={this.state.query} onChange={this.handleTextBoxChange} />
          <div id='optionsbox'>
            <OptionList id='Search Type' options={this.state.opts} selected={this.state.sel1} handleRadioChange={this.handleRadioChange} />
            <OptionList id='Sort By' options={this.state.opts2} selected={this.state.sel2} handleRadioChange={this.handleRadioChange} />
            <OptionList id='Using' options={this.state.sort} selected={this.state.sortType} handleRadioChange={this.handleRadioChange} />
          </div>
          <input type="submit" id="SearchButton" value="Search" />
        </form>
      </div>
    );
  }
};

function App(props) {
  return (
    <div id="App">
      <div class='SearchPanel'><SearchPanel /></div>
      <div id='spacer'></div>
      <div id='test'><ListItem rating='83%' imageUrl="https://image.tmdb.org/t/p/w300_and_h450_bestv2/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" dbID='157336' type='movie' title='Interstellar' desc='The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.' />
      <ListItem imageUrl="https://image.tmdb.org/t/p/w1280/sOxr33wnRuKazR9ClHek73T8qnK.jpg" dbID='106646' title='The Wolf of Wall Street' type='movie' desc="A New York stockbroker refuses to cooperate in a large securities fraud case involving corruption on Wall Street, corporate banking world and mob infiltration. Based on Jordan Belfort's autobiography."/>
      <ListItem imageUrl="https://image.tmdb.org/t/p/w1280/gThaIXgpCm3PCiXwFNDBJCme85y.jpg" title='Tom Cruise' desc='American actor. sdlhfslkdhflksdhflkadshflkdsahflkh' type='person' dbID='500'/>
      <ListItem imageUrl="https://image.tmdb.org/t/p/w1280/gThaIXgpCm3PCiXwFNDBJCme85y.jpg" title='Tim Cruise' desc='American actor. sdlhfslkdhflksdhflkadshflkdsahflkh'/>
      </div>
    </div>
  );
}

export default App;
