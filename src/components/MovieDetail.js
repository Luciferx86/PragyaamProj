import React, { Component } from 'react';
import Reactnative, { View, Text, Dimensions, Image, Keyboard } from 'react-native';
import MyAutoComplete from './MyAutoCompleteInput';

class MovieDetail extends Component {
    state = {
        movieName: '',
        posterLink: '.',
        releaseYear: '',
        cast: '',
        director: '',
        autoFillData: [],
        search: '',
        hideList: true
    }
    componentDidMount() {
        this.fetchMovie(this.props.movieName);
    }
    render() {
        return (
            <View style={{
                alignContent: 'center',
                alignItems: 'center',
                flex: 1,
                height: Dimensions.get('window').height,
                width: Dimensions.get('window').width
            }}>
                <MyAutoComplete
                    data={this.state.autoFillData}
                    value={this.state.search}
                    hideList={this.state.hideList}
                    onChange={(text) => {
                        this.setState({ search: text, hideList: false })
                        this.updateAutofillData(text);

                    }}
                    onSelectItem={(text) => {

                        Keyboard.dismiss()
                        this.fetchMovie(text);
                        this.setState({
                            hideList: true,
                            search: text
                        });
                    }}
                />
                <View style={{ marginTop: 100 }}>
                    <Image
                        resizeMode='contain'
                        source={this.state.posterLink != "N/A" ? { uri: this.state.posterLink } : require('../AppAssets/noposter.jpg')}
                        style={{ width: 300, height: 300 }} />
                </View>
                <View style={{ marginTop: 30 }}>
                    <Text style={{ fontSize: 20, textAlign: 'center' }}>{this.state.movieName}</Text>
                </View>
                <View style={{ marginTop: 20, alignItems: 'center' }}>
                    <Text style={{ fontSize: 20 }}>Year of Release:</Text>
                    <Text>{this.state.releaseYear}</Text>
                </View>
                <View style={{ marginTop: 20, alignItems: 'center', width: 300 }}>
                    <Text style={{ fontSize: 20 }}>Cast:</Text>
                    <Text style={{ textAlign: 'center' }}>{this.state.cast}</Text>
                </View>
                <View style={{ marginTop: 20, alignItems: 'center' }}>
                    <Text style={{ fontSize: 20 }}>Director:</Text>
                    <Text>{this.state.director}</Text>
                </View>
            </View>
        )
    }

    updateAutofillData(query) {
        if (query.length > 4) {
            fetch('http://www.omdbapi.com/?type=movie&s=' + query + '&apikey=7803ca7a').then((res) => {
                return res.json();
            }).then((data) => {
                if (data.Search) {
                    var allSuggestions = [];
                    data.Search.forEach((val) => {
                        allSuggestions.push(val.Title);
                    })
                }
                this.setState({
                    autoFillData: allSuggestions
                });
            }).catch((err) => {
                this.setState({
                    nowLoading: false,
                    data: []
                })
                console.log(err);
            });
        }
    }


    fetchMovie(movieName) {
        fetch('http://www.omdbapi.com/?type=movie&t=' + movieName + '&apikey=7803ca7a').then((res) => {
            return res.json();
        }).then((data) => {
            this.setState({
                movieName: data.Title,
                releaseYear: data.Year,
                posterLink: data.Poster,
                cast: data.Actors,
                director: data.Director
            })
        }).catch((err) => {
            this.setState({
                nowLoading: false,
                data: []
            })
            console.log(err);
        });
    }
}

export default MovieDetail;
