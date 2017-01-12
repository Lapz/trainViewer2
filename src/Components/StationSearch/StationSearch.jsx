import React, {Component} from 'react';
import axios from 'axios';
import SearchBar from './SearchBar.jsx';
import {
  createStationQueryUrl,
  createArrivals,
  getHubStationCodes,
  filterTrains,
  completeMatches,
  filterHubIDS,
  createHubStationUrl,
  hubIDStationRequest
} from './Helpers/StationQuery';
import StationItemContainer from './StationItemContainer.jsx'
import {Link} from 'react-router';
class StationSearch extends Component {
  constructor() {
    super()

    this.state = {
      stations: [],
      inboundTrains: [],
      outboundTrains: [],
      error: false
    }
  }

  render() {
    return (
      <div className="wrapper">
        <SearchBar handleSubmitText={this.handleSubmitText}/>
        <Link to="/">Tube Service Status</Link>

        {(this.state.error === false)
          ? <StationItemContainer stationArray={this.state.stations} handleTimeTableClick={this.handleTimeTableClick} inboundTrains={this.state.inboundTrains} outboundTrains={this.state.outboundTrains}/>
          : <p>
            Their was an error</p>
}

      </div>
    )
  }
//////////// CUSTOM METHODS ////////////////////
  handleTimeTableClick = (stationId) => {
    console.log(stationId);
    var url = createArrivals(stationId);
    axios.get(url)
    .then((response) =>{
      //console.log(response);
      var newOutboundTrains,newInboundTrains;
      
      [newOutboundTrains, newInboundTrains] = filterTrains(response.data);
      console.log(newInboundTrains,newOutboundTrains);
      
      this.setState({
        inboundTrains:newInboundTrains,
        outboundTrains:newOutboundTrains
      })
      
      
  
    })
  }

  handleSubmitText = (text) => {
    console.log(text);
    var normalIDS;
    var url = createStationQueryUrl(text);
    axios
      .get(url)
      .then((response) => {
        console.log(response);

        var matchesArrayByType = completeMatches(response);

        return matchesArrayByType;

      })
      .then((array) => {
        var hubIds = array[0]
        normalIDS = array[1];

        var getRequests = hubIds.map((hub, index) => {
          var hubID = hub.id

          return axios.get(`https://api.tfl.gov.uk/StopPoint/${hubID}/`)
        })

        return getRequests
      })
      .then((arrayOfGetReq) => {

        return axios.all(arrayOfGetReq)
      })
      .then((arrayOfResults) => {
        var results = arrayOfResults.map((item, index) => {
          var hubStations = filterHubIDS(item);
          return hubStations
        })

        var results = [...results];
        return results;
      })
      .then((hubData) => {
        console.log(hubData)

        var mergedArray = [
          ...hubData,
          ...normalIDS
        ];
        var flattendArray = []
          .concat
          .apply([], mergedArray)
        console.log(mergedArray);
        console.log(flattendArray)
        this.setState({stations: flattendArray, error: false})
      })
      .catch((error) => {
        console.log(error);
        this.setState({error: true})
      })
  }
}

export default StationSearch
