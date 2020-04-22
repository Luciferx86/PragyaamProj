import React from 'react';
import ReactNative, { View, TouchableOpacity, Text } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';


const MyAutoComplete = (props) => {
    return (
        <View style={{
            // marginTop: 50,
            height: 180,
            position: 'absolute',
            top: 0,
            marginTop: 30,
            // flex: 1,
            // borderWidth: 2,
            width: 300,
            zIndex: 5
        }}>
            <Autocomplete
                data={props.data}
                placeholder="Movie Name..."
                value={props.value}
                hideResults={props.hideList}
                onChangeText={props.onChange}
                renderItem={({ item, i }) => (
                    <TouchableOpacity onPress={() => { props.onSelectItem(item) }}>
                        <Text>{item}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

export default MyAutoComplete;