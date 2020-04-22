import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, Button, Alert } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Dialog, ProgressDialog } from "react-native-simple-dialogs";
import { TextInput } from 'react-native-gesture-handler';
import { Actions } from 'react-native-router-flux';
import MyAutoComplete from './components/MyAutoCompleteInput';
import words from 'an-array-of-english-words';
import YearPicker from './components/YearPicker';

import SingleListItem from './components/SingleListItem';

class App extends Component {


  constructor(props) {
    super(props);
    this.state = {
      search: 'alien',
      data: [],
      hideList: true,
      showDialog: false,
      startYear: '2005',
      endYear: '2020',
      nowLoading: false,
      autoFillData: ['this is not it', 'this is not it', 'this is not it', 'this is not it']
    };
  }

  findFilms = (query) => {
    var crData = [];
    var allRequests = [];
    console.log("making call");
    if (query.length > 4) {
      this.setState({
        nowLoading: true
      })
      for (var i = parseInt(this.state.startYear); i <= parseInt(this.state.endYear); i++) {
        allRequests.push(this.getFilmsPerYear(query, i));
      }
      Promise.all(allRequests).then((allData) => {
        console.log(allData.length);
        allData.forEach((data) => {
          if (!data) {
            console.log("found null");
          } else {
            for (var i = 0; i < 5; i++) {
              console.log(data[i]);
              if (data[i]) {
                crData.push({ title: data[i].Title, year: data[i].Year })
              }
            }
            console.log(data);
          }
        })
        this.setState({
          nowLoading: false,
          data: crData
        });
      })
    } else {
      this.setState({
        data: []
      });

    }
  }

  getFilmsPerYear(query, i) {

    return new Promise((resolve, reject) => {
      fetch('http://www.omdbapi.com/?type=movie&s=' + query.trim() + '&apikey=7803ca7a&y=' + i).then((res) => {
        return res.json();
      }).then((data) => {
        if (data.Search) {
          resolve(data.Search);
        } else {
          resolve(null);
        }
      })
    }).catch((err) => {
      this.setState({
        nowLoading: false,
        data: []
      })
      console.log("err: " + err);
    });

  }

  componentDidMount() {
    console.log("comDidMount");
    // this.findFilms(this.state.search);
  }

  render() {

    return (
      <View style={styles.container}>
        <MyAutoComplete
          data={this.state.autoFillData}
          value={this.state.search}
          hideList={this.state.hideList}
          onChange={(text) => {
            this.updateAutofillData(text);
            this.setState({ search: text, hideList: false })
          }}
          onSelectItem={(text) => {
            this.setState({
              search: text,
              hideList: true
            })
          }}
        />
        {/* <TouchableOpacity onPress={() => {
          () => {
            this.setState({
              showDialog: true
            })
          }
        }}> */}
        <View style={{ alignSelf: 'center', alignItems: 'center', marginTop: 170 }}>
          <Text>Range : </Text>
          <Text style={{ fontSize: 20 }}>{this.state.startYear + ' - ' + this.state.endYear}</Text>
        </View>
        <View style={{ marginTop: 10, zIndex: 3 }}>
          <Button
            title="Edit"
            onPress={() => {
              this.setState({
                showDialog: true
              })
            }}
          />
        </View>
        {/* </TouchableOpacity> */}
        <View style={{ marginTop: 20, zIndex: 1 }}>
          <Button title="Search Movies" onPress={() => {
            this.setState({
              hideList: true
            })
            this.findFilms(this.state.search)
          }}
          />
        </View>

        {this.state.data.length != 0 ?
          <FlatList
            data={this.state.data}
            style={{ marginBottom: 20, height: 300, borderWidth: 2, width: 300, marginTop: 30 }}
            renderItem={({ item, i }) => (
              <SingleListItem name={item.title} year={item.year} onPress={() => {
                Actions.movieDetail({ movieName: item.title })
              }} />
            )
            }
            keyExtractor={({ id }, index) => id
            }
          /> :
          <View
            style={{
              marginBottom: 20,
              height: 300,
              borderWidth: 2,
              width: 300,
              marginTop: 30,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <Text> No Result </Text>
          </View>
        }


        < Dialog
          title="Set Year Range"
          animationType="fade"
          contentStyle={
            {
              alignItems: "center",
              justifyContent: "center",
            }
          }
          // onTouchOutside={() => this.setState({ showDialog: false })}
          visible={this.state.showDialog}
        >
          <View>
            <View style={{ borderWidth: 2, width: 300, flexDirection: 'row' }}>
              <View style={{ width: 100, borderWidth: 2, flex: 1, alignItems: 'center' }}>
                <Text>From</Text>
                <YearPicker selectedValue={this.state.startYear} onValueChange={(itemValue) => {
                  this.setState({
                    startYear: itemValue
                  })
                }} />
              </View>
              <View style={{ width: 100, borderWidth: 2, flex: 1, alignItems: 'center' }}>
                <Text>To</Text>
                <YearPicker selectedValue={this.state.endYear} onValueChange={(itemValue) => {
                  this.setState({
                    endYear: itemValue
                  })
                }} />
              </View>

            </View>
            <View style={{ marginTop: 20 }}>
              <Button title="OK" onPress={() => this.checkYearRange()} />
            </View>
          </View>
        </Dialog >
        <ProgressDialog message="Fetching Movies..." visible={this.state.nowLoading} />
      </View >

    );
  }

  checkYearRange() {
    if (this.state.startYear <= this.state.endYear) {
      this.setState({
        showDialog: false
      })
    } else {
      Alert.alert(
        'Invalid Range'
      )
    }
  }

  updateAutofillData(query) {
    if (query[query.length - 1] != " " && query.length != 0) {
      var q = query.toLowerCase();
      var allWords = q.split(" ");
      var lastWord = allWords[allWords.length - 1];
      var remainingWords = allWords.splice(0, allWords.length - 1).join(" ");
      var allRes = words.filter(d => RegExp('^' + lastWord).test(d)).splice(0, 10)
      for (var i = 0; i < allRes.length; i++) {
        allRes[i] = remainingWords + " " + allRes[i];
      }
      this.setState({
        autoFillData: allRes
      });
    } else {
      this.setState({
        autoFillData: []
      })
    }
  }


}


const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width: Dimensions.get('window').width,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default App;
