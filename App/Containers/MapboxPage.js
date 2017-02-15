// @flow

import React, { Component } from 'react'
import Mapbox, { MapView } from 'react-native-mapbox-gl'
import { StyleSheet, Text, StatusBar, View, ScrollView } from 'react-native'
import Button from 'react-native-button'

const accessToken = 'pk.eyJ1Ijoib3Jlb2Zpc2giLCJhIjoiY2l6N3MzYzZuMDBjNDJxcWlyM2RvZXZndCJ9.4y5XT0IHkZauuY1WYwfsmg'
Mapbox.setAccessToken(accessToken)

export default class MapboxPage extends Component {
  state = {
    center: {
      latitude: 39.91530680884284,
      longitude: 116.38745139383069
    },
    zoom: 11,
    location: {
      latitude: 39.91530680884284,
      longitude: 116.38745139383069
    },
    userTrackingMode: Mapbox.userTrackingMode.none,
    annotations: [{
      coordinates: [39.52052634, 116.27686958312988],
      type: 'point',
      title: 'This is marker 1',
      subtitle: 'It has a rightCalloutAccessory too',
      rightCalloutAccessory: {
        source: { uri: 'https://cldup.com/9Lp0EaBw5s.png' },
        height: 25,
        width: 25
      },
      annotationImage: {
        source: { uri: 'https://cldup.com/CnRLZem9k9.png' },
        height: 25,
        width: 25
      },
      id: 'marker1'
    }, {
      coordinates: [39.514541341726175, 116.30579452514648],
      type: 'point',
      title: 'Important!',
      subtitle: 'Neat, this is a custom annotation image',
      annotationImage: {
        source: { uri: 'https://cldup.com/7NLZklp8zS.png' },
        height: 25,
        width: 25
      },
      id: 'marker2'
    }, {
      coordinates: [[39.56572150042782, 116.29429321289062], [39.543485405490695, 116.30218963623047], [39.528266950429735, 116.30218963623047], [39.528266950429735, 116.29154663085938], [39.53633186448861, 116.28983001708984], [39.54465591168391, 116.28914337158203], [39.549337730454826, 116.2870834350586]],
      type: 'polyline',
      strokeColor: '#00FB00',
      strokeWidth: 4,
      strokeAlpha: 0.5,
      id: 'foobar'
    }, {
      coordinates: [[39.549857912194386, 116.26820068359375], [39.541924698522055, 116.2735221862793], [39.535681504432264, 116.27523880004883], [39.5315190495212, 116.27438049316406], [39.529177554196376, 116.27180557250975], [39.52345355209305, 116.27438049316406], [39.519290332250544, 116.27455215454102], [39.51369559554873, 116.27729873657227], [39.51200407096382, 116.27850036621094], [39.51031250340588, 116.28691177368163], [39.51031250340588, 116.29154663085938]],
      type: 'polygon',
      fillAlpha: 1,
      strokeColor: '#ffffff',
      fillColor: '#0000ff',
      id: 'zap'
    }]
  };

  onRegionDidChange = (location) => {
    this.setState({ currentZoom: location.zoomLevel })
    this.setState({location: location})
    console.log('onRegionDidChange', location)
  };
  onRegionWillChange = (location) => {
    console.log('onRegionWillChange', location)
  };
  onUpdateUserLocation = (location) => {
    console.log('onUpdateUserLocation', location)
  };
  onOpenAnnotation = (annotation) => {
    console.log('onOpenAnnotation', annotation)
  };
  onRightAnnotationTapped = (e) => {
    console.log('onRightAnnotationTapped', e)
  };
  onLongPress = (location) => {
    console.log('onLongPress', location)
  };
  onTap = (location) => {
    console.log('onTap', location)
  };
  onChangeUserTrackingMode = (userTrackingMode) => {
    this.setState({ userTrackingMode })
    console.log('onChangeUserTrackingMode', userTrackingMode)
  };

  componentWillMount () {
    this._offlineProgressSubscription = Mapbox.addOfflinePackProgressListener(progress => {
      console.log('offline pack progress', progress)
    })
    this._offlineMaxTilesSubscription = Mapbox.addOfflineMaxAllowedTilesListener(tiles => {
      console.log('offline max allowed tiles', tiles)
    })
    this._offlineErrorSubscription = Mapbox.addOfflineErrorListener(error => {
      console.log('offline error', error)
    })
  }

  componentWillUnmount () {
    this._offlineProgressSubscription.remove()
    this._offlineMaxTilesSubscription.remove()
    this._offlineErrorSubscription.remove()
  }

  addNewMarkers = () => {
    // Treat annotations as immutable and create a new one instead of using .push()
    this.setState({
      annotations: [ ...this.state.annotations, {
        coordinates: [39.53312, 116.289],
        type: 'point',
        title: 'This is a new marker',
        id: 'foo'
      }, {
        'coordinates': [[39.549857912194386, 116.26820068359375], [39.541924698522055, 116.2735221862793], [39.535681504432264, 116.27523880004883], [39.5315190495212, 116.27438049316406], [39.529177554196376, 116.27180557250975], [39.52345355209305, 116.27438049316406], [39.519290332250544, 116.27455215454102], [39.51369559554873, 116.27729873657227], [39.51200407096382, 116.27850036621094], [39.51031250340588, 116.28691177368163], [39.51031250340588, 116.29154663085938]],
        'type': 'polygon',
        'fillAlpha': 1,
        'fillColor': '#000000',
        'strokeAlpha': 1,
        'id': 'new-black-polygon'
      }]
    })
  };

  updateMarker2 = () => {
    // Treat annotations as immutable and use .map() instead of changing the array
    this.setState({
      annotations: this.state.annotations.map(annotation => {
        if (annotation.id !== 'marker2') { return annotation }
        return {
          coordinates: [39.514541341726175, 116.30579452514648],
          'type': 'point',
          title: 'New Title!',
          subtitle: 'New Subtitle',
          annotationImage: {
            source: { uri: 'https://cldup.com/7NLZklp8zS.png' },
            height: 25,
            width: 25
          },
          id: 'marker2'
        }
      })
    })
  };

  removeMarker2 = () => {
    this.setState({
      annotations: this.state.annotations.filter(a => a.id !== 'marker2')
    })
  };

  render () {
    StatusBar.setHidden(true)
    return (
      <View style={styles.container}>
        <MapView
          ref={map => { this._map = map }}
          style={styles.map}
          initialCenterCoordinate={this.state.center}
          initialZoomLevel={this.state.zoom}
          initialDirection={0}
          rotateEnabled
          scrollEnabled
          zoomEnabled
          showsUserLocation
          logoIsHidden
          attributionButtonIsHidden
          annotationsPopUpEnabled={false}
          styleURL={Mapbox.mapStyles.satellite}
          userTrackingMode={this.state.userTrackingMode}
          annotations={this.state.annotations}
          annotationsAreImmutable
          onChangeUserTrackingMode={this.onChangeUserTrackingMode}
          onRegionDidChange={this.onRegionDidChange}
          onRegionWillChange={this.onRegionWillChange}
          onOpenAnnotation={this.onOpenAnnotation}
          onRightAnnotationTapped={this.onRightAnnotationTapped}
          onUpdateUserLocation={this.onUpdateUserLocation}
          onLongPress={this.onLongPress}
          onTap={this.onTap}
        />

        <View style={styles.leftSidebar}>
          <Button style={styles.smallButtonText} containerStyle={styles.smallButtonContainer} onPress={() => this._map && this._map.setDirection(0)}>
            Direction
          </Button>
          <Button style={styles.smallButtonText} containerStyle={styles.smallButtonContainer} onPress={() => this._map && this._map.setZoomLevel(6)}>
            Zoom6
          </Button>
          <Button style={styles.smallButtonText} containerStyle={styles.smallButtonContainer} onPress={() => this._map && this._map.setCenterCoordinate(39.2489, 116.0447)}>
            Beijing
          </Button>
          <Button style={styles.smallButtonText} containerStyle={styles.smallButtonContainer} onPress={() => this._map && this._map.setCenterCoordinateZoomLevel(35.68829, 139.77492, 14)}>
            Tokyo
          </Button>
          <Button style={styles.smallButtonText} containerStyle={styles.smallButtonContainer} onPress={() => this._map && this._map.easeTo({ pitch: 30 })}>
            30
          </Button>
          <Button style={styles.smallButtonText} containerStyle={styles.smallButtonContainer} onPress={() => this._map && this._map.setVisibleCoordinateBounds(39.512, 116.427, 39.574, 116.125, 100, 0, 0, 0)}>
            Bounds
          </Button>
          <Button style={styles.smallButtonText} containerStyle={styles.smallButtonContainer} onPress={() => this._map && this._map.getCenterCoordinateZoomLevel((location) => {
            this.setState({location: location})
            console.log(location)
          })}>
            GetLoc
          </Button>
          <Button style={styles.smallButtonText} containerStyle={styles.smallButtonContainer} onPress={() => this._map && this._map.getDirection((direction) => {
            console.log(direction)
          })}>
            GetDire
          </Button>
          <Button style={styles.smallButtonText} containerStyle={styles.smallButtonContainer} onPress={() => this._map && this._map.getBounds((bounds) => {
            console.log(bounds)
          })}>
            GetBou
          </Button>
        </View>

        <View style={styles.rightSidebar}>
          <Button style={styles.smallButtonText} containerStyle={styles.smallButtonContainer} onPress={this.addNewMarkers}>
            Marker1
          </Button>
          <Button style={styles.smallButtonText} containerStyle={styles.smallButtonContainer} onPress={this.updateMarker2}>
            Marker2
          </Button>
          <Button style={styles.smallButtonText} containerStyle={styles.smallButtonContainer} onPress={() => this._map && this._map.selectAnnotation('marker1')}>
            OpenM1
          </Button>
          <Button style={styles.smallButtonText} containerStyle={styles.smallButtonContainer} onPress={() => this._map && this._map.deselectAnnotation()}>
            Deselect
          </Button>
          <Button style={styles.smallButtonText} containerStyle={styles.smallButtonContainer} onPress={this.removeMarker2}>
            RemoveM2
          </Button>
          <Button style={styles.smallButtonText} containerStyle={styles.smallButtonContainer} onPress={() => this.setState({ annotations: [] })}>
            RemoveAll
          </Button>
          <Button style={styles.smallButtonText} containerStyle={styles.smallButtonContainer} onPress={() => this.setState({ userTrackingMode: Mapbox.userTrackingMode.followWithHeading })}>
            Set userTrackingMode to followWithHeading
          </Button>
        </View>

        <ScrollView style={styles.scrollView}>
          {this._renderButtons()}
        </ScrollView>
      </View>
    )
  }

  _renderButtons () {
    return (
      <View>
        <Text>Tracking mode = {this.state.userTrackingMode}, Zoom: {this.state.zoom}</Text>
        <Text>Lat: {this.state.location.latitude}, Lon: {this.state.location.longitude}</Text>
        <View style={styles.rowView}>
          <Button style={styles.smallButtonText} containerStyle={styles.smallButtonContainer} onPress={() => {
            Mapbox.addOfflinePack({
              name: 'test',
              type: 'bbox',
              bounds: [0, 0, 0, 0],
              minZoomLevel: 13,
              maxZoomLevel: 18,
              metadata: { anyValue: 'you wish' },
              styleURL: Mapbox.mapStyles.dark
            }).then(() => {
              console.log('Offline pack added')
            }).catch(err => {
              console.log(err)
            })
          }}>
            Create offline
          </Button>
          <Button style={styles.smallButtonText} containerStyle={styles.smallButtonContainer} onPress={() => {
            Mapbox.getOfflinePacks()
                .then(packs => {
                  console.log(packs)
                })
                .catch(err => {
                  console.log(err)
                })
          }}>
            Get offline
          </Button>
          <Button style={styles.smallButtonText} containerStyle={styles.smallButtonContainer} onPress={() => {
            Mapbox.removeOfflinePack('test')
                .then(info => {
                  if (info.deleted) {
                    console.log('Deleted', info.deleted)
                  } else {
                    console.log('No packs to delete')
                  }
                })
                .catch(err => {
                  console.log(err)
                })
          }}>
            Remove 'test' pack
          </Button>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch'
  },
  map: {
    flex: 1
  },
  scrollView: {
    flex: 1,
    maxHeight: 120
  },
  rowView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  leftSidebar: {
    position: 'absolute',
    top: 10,
    left: 10,
    flex: 1
  },
  rightSidebar: {
    position: 'absolute',
    top: 10,
    right: 10,
    flex: 1
  },
  bigButtonContainer: {
    height: 36,
    marginBottom: 5,
    marginLeft: 60,
    marginRight: 60,
    borderRadius: 5,
    backgroundColor: '#73BCF1',
    justifyContent: 'center'
  },
  bigButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '300'
  },
  smallButtonContainer: {
    width: 50,
    height: 40,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#73BCF1',
    justifyContent: 'center'
  },
  smallButtonText: {
    color: '#FFFFFF',
    fontSize: 10
  }
})
