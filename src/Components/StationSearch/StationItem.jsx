import React, {Component} from 'react';
import StationTrainTable from './StationTrainTable.jsx';
import axios from 'axios';
import {createArrivals,filterTrains} from './Helpers/StationQuery';


class StationItem extends Component {
    constructor(){
        super()
        this.state = {
            inboundTrains:[],
            outboundTrains:[]
        }
    }


    render() {
        var stationServices = this.props.stationServices.map((transportType,index) =>{
            return(
                <li key={index}>
                {transportType}
                </li>
            )
        });

        return (

            <li>
                <div>

                    <h1>{this.props.stationName}</h1>
                    <p>Methods of transport offered: </p>
                    <ul>
                    {stationServices}
                    </ul>

                    <StationTrainTable outboundTrains={this.state.outboundTrains} inboundTrains={this.state.inboundTrains} handleRefresh={this.handleTimeTableClick} />
                        
                </div>

            </li>
        );
    }
    /// Stop the rerender ///
    componentDidMount(){
    var url = createArrivals(this.props.stationId);
    console.log(url);
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

    handleTimeTableClick = () => {

    console.log("click");
   // console.log(stationId);
    var url = createArrivals(this.props.stationId);
    console.log(url);
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
    

	
}

export default StationItem;
