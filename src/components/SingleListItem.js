import React from 'react';
import ReactNative, { View, Image, Text, TouchableOpacity } from 'react-native';

const SingleListItem = (props) => {
    return (
        <TouchableOpacity onPress = {props.onPress}>
            <View style={{ borderWidth: 2, width: 300 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require('../AppAssets/movieicon.png')} style={{ width: 35, height: 35, marginTop: 5, marginLeft: 5 }} />
                    <Text>   </Text>
                    <Text style={{ fontSize: 20, marginRight: 20, width: 250 }}>{props.name}</Text>
                </View>
                <Text style={{ marginLeft: 50 }}>{props.year}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default SingleListItem;