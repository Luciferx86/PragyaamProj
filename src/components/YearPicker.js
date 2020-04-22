import React from 'react';
import ReactNative, { Picker } from 'react-native';

const YearPicker = (props) => {
    return (
        <Picker
            selectedValue={props.selectedValue}
            style={{ height: 50, width: 150 }}
            onValueChange={(itemValue, itemIndex) => props.onValueChange(itemValue)}
        >
            {getAllYears()}
        </Picker>
    )
}

const getAllYears = () => {
    var allYears = [];
    for (var i = 1990; i <= 2020; i++) {
        allYears.push(<Picker.item label={i.toString()} value={i.toString()} key={i} />)
    }
    return allYears;
}

export default YearPicker;