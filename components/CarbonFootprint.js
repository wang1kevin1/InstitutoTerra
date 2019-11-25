import React, {useState, Component, } from 'react';
import {Text, View, Image, FlatList, ActivityIndicator} from 'react-native';


class CarbonFootprint extends Component {
    state = {
        planeData: [],
        loading: true
    }
    async componentDidMount() {
        try{
            const aviationApiCall = await fetch('https://aviation-edge.com/v2/public/flights?key=760fd0-cefe7a&limit=30000')
            const flight = await aviationApiCall.json();
            this.setState({planeData: flight.results, loading:false});
        } catch(err){
            cobnsole.log("Error fetching data -------------------", err);
        }
    }
    renderItem(data){
        return <View>
            <Text >{data.item.iataCode}</Text>
            <Text>Damn it</Text> 
        </View>
    }
    render() {
        const {planeData, loading} = this.state;
        if(!loading){
            return <FlatList
                    data = {planeData}
                    renderItem = {this.renderItem}
                    keyExtractor={(item) => item.iataCode}
                    />
        } else{
            return<ActivityIndicator />
        }
    }
}

export default CarbonFootprint