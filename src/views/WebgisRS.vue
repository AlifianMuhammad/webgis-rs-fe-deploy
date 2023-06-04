<template>
  <div class="wrapper">
    <div class="sidebar">
      <div class="sidebar-header">
        <h1 class="sidebar-title">WebGIS Rumah Sakit</h1>
        <p class="sidebar-subtitle">Kota Semarang, Jawa Tengah - Indonesia</p>
      </div>
      <div class="sidebar-section" v-if="informasiRS.length > 0">
        <h2 class="sidebar-section-title">Nearest Hospital Result</h2>
        <div
          v-for="(rs, index) in informasiRS"
          :key="index"
          class="card"
          @click="logClickedCoordinate(rs.koordinat)"
        >
          <div class="card-body">
            <div class="hospital-card">
              <div
                class="hospital-photo"
                :style="{ backgroundImage: `url('/${rs.nama}.jpg')` }"
              ></div>
              <div class="hospital-details">
                <h4 class="hospital-name">{{ rs.nama }}</h4>
                <p class="hospital-distance">{{ rs.jarak }} KM</p>
                <p class="hospital-info">{{ rs.kecamatan }}</p>
              </div>
              <a
                :href="`https://www.google.com/maps/dir/${rs.user[0]},${rs.user[1]}/${rs.koordinat[0]},${rs.koordinat[1]}`"
                target="_blank"
                class="green-side d-flex align-items-center justify-content-center"
              >
                <img
                  src="/route.png"
                  class="direction-icon"
                  alt="Direction Icon"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="sidebar-section" v-if="sidebarRS.length > 0">
        <h2 class="sidebar-section-title">Hospital Details</h2>
        <div
          v-for="(rs, index) in sidebarRS"
          :key="index"
          class="card"
          @click="logClickedCoordinate(rs.koordinat)"
        >
          <div class="custom-card-body">
            <div class="custom-hospital-card">
              <div
                class="custom-hospital-photo custom-hospital-photo-sidebarRS"
                :style="{ backgroundImage: `url('/${rs.nama}.jpg')` }"
              ></div>
              <div class="custom-hospital-details">
                <h4 class="custom-hospital-name">{{ rs.nama }}</h4>
                <table class="custom-hospital-table">
                  <tr>
                    <td><strong>Jarak</strong></td>
                    <td>{{ rs.jarak }} KM</td>
                  </tr>
                  <tr>
                    <td><strong>Kelas</strong></td>
                    <td>{{ rs.kelas }}</td>
                  </tr>
                  <tr>
                    <td><strong>Kode RS</strong></td>
                    <td>{{ rs.kode }}</td>
                  </tr>
                  <tr>
                    <td><strong>Jenis</strong></td>
                    <td>{{ rs.jenis }}</td>
                  </tr>
                  <tr>
                    <td><strong>Alamat</strong></td>
                    <td>{{ rs.alamat }}</td>
                  </tr>
                  <tr>
                    <td><strong>Kelurahan</strong></td>
                    <td>{{ rs.kelurahan }}</td>
                  </tr>
                  <tr>
                    <td><strong>Kecamatan</strong></td>
                    <td>{{ rs.kecamatan }}</td>
                  </tr>
                  <tr>
                    <td><strong>Kodepos</strong></td>
                    <td>{{ rs.kodepos }}</td>
                  </tr>
                </table>
              </div>
              <a
                :href="`https://www.google.com/maps/dir/${rs.user[0]},${rs.user[1]}/${rs.koordinat[0]},${rs.koordinat[1]}`"
                target="_blank"
                class="custom-route-button"
              >
                <img
                  src="/route.png"
                  class="custom-direction-icon"
                  alt="Direction Icon"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="sidebar-section">
        <h2 class="sidebar-section-title">Find Rumah Sakit by Name</h2>
        <n-space vertical round type="primary">
          <n-select
            placeholder="Find Hospital"
            filterable
            :options="rumahSakitListValue"
            @update:value="findRS"
          />
        </n-space>
      </div>
      <div class="sidebar-section">
        <h2 class="sidebar-section-title">Find the Nearest Rumah Sakit</h2>
        <n-space vertical round type="primary">
          <n-select
            placeholder="Search"
            filterable
            :options="spesialisListValue"
            @update:value="closestRS"
          />
        </n-space>
      </div>
      <div class="sidebar-section">
        <button class="btn btn-success" @click="showAllHospitals">
          Show All Hospital
        </button>
      </div>
    </div>
    <div class="map-container">
      <div id="map"></div>
      <div class="loading-overlay" v-if="isLoading">
        <span class="loading-spinner">
          <span
            class="spinner-border spinner-border-lg"
            role="status"
            aria-hidden="true"
          ></span>
        </span>
      </div>
    </div>
  </div>
</template>

<style>
@import "ol/ol.css";

/* Common styles */

.wrapper {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: row;
}

.map-container {
  width: 75%;
  height: 100vh;
}

#map {
  width: 100%;
  height: 100%;
}

.sidebar {
  width: 25%;
  height: 100vh;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-y: auto;
}

.sidebar > div {
  width: 100%;
}

/* Sidebar header */
.sidebar > div:first-child {
  padding: 30px 20px;
  margin-bottom: 10px;
  background-color: #028d6c;
}

.sidebar > div:first-child h1 {
  font-family: "Plus Jakarta Sans";
  font-size: 28px;
  font-weight: bold;
  color: white;
  text-align: left;
  margin: 0;
}

.sidebar > div:first-child p {
  font-size: 14px;
  margin: 0;
  color: white;
  text-align: left;
  padding: 5px 0;
}

/* Sidebar content */
.sidebar > div:not(:first-child) {
  padding: 10px 20px;
  width: 100%;
  box-sizing: border-box;
}

.sidebar h2 {
  font-family: "Plus Jakarta Sans";
  font-size: 20px;
  margin-bottom: 10px;
  color: #028d6c;
  text-align: left;
  width: 100%;
}
.sidebar-section button {
  width: 100%;
  margin-top: 10px;
  font-family: "Plus Jakarta Sans", sans-serif;
}

.sidebar-section-title {
  margin-bottom: 10px;
  color: #028d6c;
  font-family: "Plus Jakarta Sans", sans-serif;
  font-size: 20px;
}
.card {
  margin-bottom: 20px;
}

.hospital-card {
  display: flex;
  align-items: center;
}
.hospital-photo-sidebarRS {
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  margin-bottom: 10px;
}

.hospital-photo {
  width: 80px;
  height: 100px;
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  margin-right: 10px;
  max-width: 1197px;
}

.hospital-details {
  flex: 2;
  min-width: 0; /* Added to allow text overflow */
}

.hospital-name {
  font-size: 15px;
  font-weight: 800;
  font-family: "Plus Jakarta Sans", sans-serif;
  text-align: left;
  margin-bottom: 5px;
  white-space: nowrap; /* Prevents text from wrapping */
  overflow: hidden; /* Hides overflowing text */
  text-overflow: ellipsis; /* Adds an ellipsis (...) to indicate text overflow */
}

.hospital-distance {
  font-size: 13px;
  font-weight: 600;
  font-family: "Plus Jakarta Sans", sans-serif;
  text-align: left;
  margin-bottom: 5px;
  white-space: nowrap; /* Prevents text from wrapping */
  overflow: hidden; /* Hides overflowing text */
  text-overflow: ellipsis; /* Adds an ellipsis (...) to indicate text overflow */
}
.hospital-info {
  font-size: 13px;
  font-weight: 400;
  font-family: "Plus Jakarta Sans", sans-serif;
  text-align: left;
  margin-bottom: 5px;
  white-space: nowrap; /* Prevents text from wrapping */
  overflow: hidden; /* Hides overflowing text */
  text-overflow: ellipsis; /* Adds an ellipsis (...) to indicate text overflow */
}

.green-side {
  width: 50px;
  height: 100px;
  background-color: #028d6c;
  border-radius: 0 4px 4px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.custom-card-body {
  display: flex;
  justify-content: center;
}

.custom-hospital-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
}

.custom-hospital-photo-sidebarRS {
  width: 100%;
  height: 150px;
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  margin-bottom: 10px;
}

.custom-hospital-details {
  width: 100%;
}

.custom-hospital-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  font-family: "Plus Jakarta Sans", sans-serif;
}

.custom-hospital-table {
  border: #ccc 1px solid;
  text-align: left;
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
}

.custom-hospital-table td {
  border: #ccc 0.5px solid;
  padding: 5px;
  font-size: 13px;
  font-weight: 400;
  font-family: "Plus Jakarta Sans", sans-serif;
}

.custom-hospital-table td:first-child {
  font-weight: bold;
}

.custom-route-button {
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: green;
  color: white;
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.custom-route-button:hover {
  background-color: darkgreen;
}

.custom-direction-icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.direction-icon {
  width: 20px;
  height: 20px;
  fill: #fff;
}
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(
    0,
    0,
    0,
    0.5
  ); /* Set the background color and opacity as desired */
  z-index: 9999;
  font-family: "Plus Jakarta Sans", sans-serif; /* Use the desired font family */
  color: #fff; /* Set the font color */
}

.loading-spinner {
  font-size: 3rem; /* Adjust the size of the loading spinner */
}

/* Responsive styles */
@media screen and (max-width: 1197px) {
  .hospital-photo {
    display: none;
  }
}

@media screen and (max-width: 774px) {
  .wrapper {
    flex-direction: column-reverse;
  }

  .map-container {
    width: 100%;
    height: 75vh;
  }

  .sidebar {
    width: 100%;
    height: 25vh;
    overflow-y: scroll;
    padding-top: 15px;
  }

  .hospital-photo {
    display: block;
  }
  .sidebar-header {
    display: none;
  }
}
</style>

<script>
// Import Vue.js 3 libraries
import { onMounted, onUpdated, ref, shallowRef } from "vue";

// Import OpenLayers libraries
import Map from "ol/Map";
import View from "ol/View";
import Feature from "ol/Feature";
import Collection from "ol/Collection";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { BingMaps, Vector } from "ol/source";
import Point from "ol/geom/Point";
import { GeoJSON } from "ol/format";
import XYZ from "ol/source/XYZ";
import {
  FeatureService,
  GetFeaturesBySQLParameters,
  TransportationAnalystResultSetting,
  TransportationAnalystParameter,
  FindClosestFacilitiesParameters,
  NetworkAnalystService,
} from "@supermap/iclient-ol";
import {
  Icon,
  Style,
  Stroke,
  Circle as CircleStyle,
  Text,
  Fill,
} from "ol/style";

// Import Naive UI libraries
import { NButton, NDropdown, NCard, NSelect, NSpace, NTable } from "naive-ui";
export default {
  components: {
    NButton,
    NDropdown,
    NCard,
    NSelect,
    NSpace,
    NTable,
  },
  setup() {
    // Declare variables
    let featureRS;
    let labelVectorLayer;
    let userCoordinates;
    const map = shallowRef();
    const spesialisList = ref([]);
    const spesialisListValue = ref([]);
    const rumahSakitListValue = ref([]);
    const informasiRS = ref([]);
    const sidebarRS = ref([]);
    const isLoading = ref(true);

    // Declare constant URLs and API key
    const SPESIALIS_LABEL_KEY_URL =
      "https://perfect-seal-belt.cyclic.app/spesialislabelkey";
    const SPESIALIS_LABEL_VALUE_URL =
      "https://perfect-seal-belt.cyclic.app/spesialislabelvalue";
    const RUMAH_SAKIT_URL = "https://perfect-seal-belt.cyclic.app/rumahsakit";
    const HOSPITAL_FEATURES_SERVICES_URL =
      "https://iserver.supermap.id/iserver/services/data-webgis_rs_server/rest/data/";

    const BING_MAPS_API_KEY =
      "Aug_jpyeictKv9-blHjr0OJOy-hYRR_5bIWhecGYlywC_F6p0LMvQ0Ye8J95tSJt";

    const NETWORK_DATASET_SERVICE_URL =
      "https://iserver.supermap.id/iserver/services/transportationAnalyst-SpatialDataWebGISRS/rest/networkanalyst/Data_WebGIS_Network@Data_WebGIS";

    const MAPBOX_ACCESS_TOKEN =
      "pk.eyJ1IjoiYWxpZmlhbm11aGFtbWFkIiwiYSI6ImNsaWNpemZnYjBjYm0zZ21xZWZwdjNvZnkifQ.ryiZUmhKwg56ACLen8zC6Q";

    let resultLayer = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        image: new Icon({
          src: "/RSv2.png",
        }),
      }),
    });

    let pathLayer = new VectorLayer({
      source: new Vector(),
      style: new Style({
        stroke: new Stroke({
          color: "rgba(22, 160, 133, 1)",
          width: 7.5,
        }),
      }),
    });

    async function showAllHospitals() {
      informasiRS.value = [];
      sidebarRS.value = [];
      isLoading.value = true;
      // Remove the path layers from the map
      map.value.removeLayer(pathLayer);
      map.value.removeLayer(labelVectorLayer);

      // Filter the list of hospital features to include only those with IDs in the selectedHospitalIDs array
      const selectedHospitalFeatures = featureRS.features;

      console.log(selectedHospitalFeatures);

      // Clear the result layer and add the selected hospital features to it
      resultLayer.getSource().clear();
      resultLayer.getSource().addFeatures(
        new GeoJSON().readFeatures({
          type: "FeatureCollection",
          features: selectedHospitalFeatures,
        })
      );
      map.value.getView().animate({
        zoom: 12,
        center: [110.42, -6.99],
        duration: 500,
        padding: [300, 300, 300, 300],
      });
      isLoading.value = false;
    }

    async function findRS(value) {
      isLoading.value = true;
      // Remove the path layers from the map
      map.value.removeLayer(pathLayer);
      map.value.removeLayer(labelVectorLayer);

      // Send a GET request to the server to get hospitals with the given name
      const response = await axios.get(
        `https://perfect-seal-belt.cyclic.app/rumahsakit/findRS/${value}`
      );
      const selectedHospitals = response.data;
      console.log(selectedHospitals);

      // Get the IDs of the selected hospitals
      const selectedHospitalIDs = selectedHospitals.data.map(
        (hospital) => hospital.smid
      );
      console.log(featureRS.features);
      // Filter the list of hospital features to include only those with IDs in the selectedHospitalIDs array
      const selectedHospitalFeatures = featureRS.features.filter((feature) => {
        const smid = feature.properties["SMID"];
        return selectedHospitalIDs.includes(parseInt(smid));
      });
      informasiRS.value = [];
      console.log(selectedHospitalFeatures);
      function convertFeaturesLabel(data) {
        let output = [];
        let i = 0;
        let obj = {};
        for (i = 0; i < data.length; i++) {
          obj = {};
          obj["nama"] = data[i].properties.NAME;
          obj["kecamatan"] = data[i].properties.KECAMATAN;
          obj["kelurahan"] = data[i].properties.KELURAHAN;
          obj["kelurahan"] = data[i].properties.KELURAHAN;
          obj["alamat"] = data[i].properties.ALAMAT;
          obj["jenis"] = data[i].properties.JENIS;
          obj["kelas"] = data[i].properties.KELAS;
          obj["kode"] = data[i].properties.KODE;
          obj["kodepos"] = data[i].properties.KODEPOS;
          obj["geometry"] = new Point([
            data[i].geometry.coordinates[0],
            data[i].geometry.coordinates[1],
          ]);
          obj["koordinat"] = [
            data[i].geometry.coordinates[1],
            data[i].geometry.coordinates[0],
          ];
          obj["user"] = [userCoordinates[0], userCoordinates[1]];
          obj["jarak"] = getDistance(
            data[i].geometry.coordinates[1],
            data[i].geometry.coordinates[0],
            userCoordinates[0],
            userCoordinates[1]
          ).toFixed(2);

          output.push(obj);
        }

        output.sort((a, b) => a.jarak - b.jarak);
        return output;
      }

      // Call the function to get an array of features with labels and distance
      const dataSidebar = convertFeaturesLabel(selectedHospitalFeatures);
      console.log(dataSidebar);
      sidebarRS.value = dataSidebar;
      // Clear the result layer and add the selected hospital features to it
      resultLayer.getSource().clear();
      resultLayer.getSource().addFeatures(
        new GeoJSON().readFeatures({
          type: "FeatureCollection",
          features: selectedHospitalFeatures,
        })
      );

      // Zoom the map to the extent of the result layer
      const extent = resultLayer.getSource().getExtent();
      const centerPoint = [
        (extent[0] + extent[2]) / 2,
        (extent[1] + extent[3]) / 2,
      ];
      map.value.getView().animate({
        zoom: 17,
        center: centerPoint,
        duration: 500,
      });
      isLoading.value = false;
    }

    // Define a function to calculate the distance between two points on Earth
    function getDistance(lat1, lon1, lat2, lon2) {
      // Set the radius of the Earth in kilometers
      const R = 6371;
      // Convert the differences in latitude and longitude to radians
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
      // Apply the Haversine formula to calculate the great-circle distance
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
          Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      // Return the distance in kilometers
      return distance;
    }

    // Helper function to convert degrees to radians
    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }

    // Define a success callback function for the getCurrentPosition method
    const successCallback = (position) => {
      // Extract the user's latitude and longitude coordinates from the position object
      const x = position.coords.latitude;
      const y = position.coords.longitude;
      // Store the coordinates in an array
      userCoordinates = [x, y];
    };

    // Define an error callback function for the getCurrentPosition method
    const errorCallback = (error) => {
      // Log the error to the console
      console.log(error);
    };

    // Call the getCurrentPosition method of the Geolocation API to get the user's location
    const dataKoor = navigator.geolocation.getCurrentPosition(
      successCallback,
      errorCallback
    );

    async function closestRS(value) {
      isLoading.value = true;
      // Make a GET request to the API to get hospitals with a specific specialist
      const res = await axios.get(
        `https://perfect-seal-belt.cyclic.app/spesialis/${value}`
      );
      const selected = res.data;

      // Extract the SMID of each hospital from the API response
      const rsid = selected.data.map((r) => r.smid);

      // Filter the features of the hospitals layer based on the SMID values
      const features = featureRS.features.filter((feature) => {
        const smid = feature.properties["SMID"];
        return rsid.includes(parseInt(smid));
      });

      const RSIcon = new Style({
        image: new Icon({
          src: "/RSv2.png",
        }),
      });

      // Clear any existing features from the result layer's source and add new features based on the provided features
      resultLayer.getSource().clear();
      resultLayer.getSource().addFeatures(
        new GeoJSON().readFeatures({
          type: "FeatureCollection",
          features: features,
        })
      );

      // Set the style for the result layer using the RSIcon style
      resultLayer.setStyle(RSIcon);

      map.value.removeLayer(pathLayer);
      // console.log(features);
      sidebarRS.value = [];
      // Convert the features to an array of objects with labels and distance
      function convertFeaturesLabel(data) {
        let output = [];
        let i = 0;
        let obj = {};
        for (i = 0; i < data.length; i++) {
          obj = {};
          obj["nama"] = data[i].properties.NAME;
          obj["kecamatan"] = data[i].properties.KECAMATAN;
          obj["alamat"] = data[i].properties.ALAMAT;
          obj["geometry"] = new Point([
            data[i].geometry.coordinates[0],
            data[i].geometry.coordinates[1],
          ]);
          obj["koordinat"] = [
            data[i].geometry.coordinates[1],
            data[i].geometry.coordinates[0],
          ];
          obj["user"] = [userCoordinates[0], userCoordinates[1]];
          obj["jarak"] = getDistance(
            data[i].geometry.coordinates[1],
            data[i].geometry.coordinates[0],
            userCoordinates[0],
            userCoordinates[1]
          ).toFixed(2);

          output.push(obj);
        }

        output.sort((a, b) => a.jarak - b.jarak);
        return output;
      }

      // Call the function to get an array of features with labels and distance
      const labelFeatures = convertFeaturesLabel(features);

      informasiRS.value = labelFeatures;

      function createStyle({ nama, jarak }) {
        // Create a style for a label on the map, using the provided name and distance values
        return new Style({
          text: new Text({
            font: "bold 16px 'Plus Jakarta Sans'",
            text: `${nama}\n${jarak} KM`,
            fill: new Fill({
              color: "#000", // black text color
            }),
            backgroundFill: new Fill({
              color: "#81CFBC", // green background color
              radius: 10, // rounded corners with a radius of 10%
              padding: [10, 10, 10, 10], // padding for the label text
            }),
            padding: [5, 5, 5, 5],
            radius: 10,
            offsetY: -100, // offset the label up to create space for the "button" effect
            textAlign: "center", // center the label text
            stroke: new Stroke({
              color: "#81CFBC", // green border color
              width: 2, // border width of 2px
            }),
          }),
        });
      }
      if (labelVectorLayer) {
        map.value.removeLayer(labelVectorLayer);
      }

      labelVectorLayer = new VectorLayer({
        source: new VectorSource({
          features: new Collection(
            labelFeatures.map((featureOptions) => {
              // Create a new feature with the provided geometry
              const feature = new Feature({
                geometry: featureOptions.geometry,
              });
              // Set the style for the feature using the createStyle function
              feature.setStyle(createStyle(featureOptions));
              return feature;
            })
          ),
          format: new GeoJSON(),
        }),
      });

      // Add the vector layer to the map
      map.value.addLayer(labelVectorLayer);

      // Create a point object using user's coordinates
      const eventPoint = new Point([userCoordinates[1], userCoordinates[0]]);
      // Create a string object to store the coordinates
      const eventPointString = {
        x: userCoordinates[1],
        y: userCoordinates[0],
      };

      // console.log(eventPointString);

      // Create a feature object using the point object
      const eventFeature = new Feature(eventPoint);

      // Create a style object for the event layer icon
      const eventIcon = new Style({
        image: new Icon({
          src: "/User.png",
        }),
      });
      console.log(eventFeature);
      // Create a vector source object using the feature object
      const eventSource = new Vector({
        features: [eventFeature],
      });
      console.log(eventSource);
      // Create a vector layer object using the vector source object
      const eventLayer = new VectorLayer({
        source: eventSource,
      });

      // Set the style for the event layer using the eventIcon style
      eventLayer.setStyle(eventIcon);

      // Converts the features array of objects' geometries to an array of coordinates.
      const featuresGeom = features.map((r) => r.geometry);
      const featuresCoordinates = featuresGeom.map((r) => r.coordinates);

      // console.log(featuresCoordinates);

      //Converts the array of coordinates into an array of objects.
      function convertToArrayOfObjects(data) {
        let output = [];
        let i = 0;
        let obj = {};
        for (i = 0; i < data.length; i++) {
          obj = {};
          obj["x"] = data[i][0];
          obj["y"] = data[i][1];

          output.push(obj);
        }

        return output;
      }

      let featuresCoordinatesObject =
        convertToArrayOfObjects(featuresCoordinates);
      // console.log(featuresCoordinatesObject);

      const resultSetting = new TransportationAnalystResultSetting({
        // Set the properties for the result settings object
        returnEdgeFeatures: true,
        returnEdgeGeometry: true,
        returnEdgeIDs: true,
        returnNodeFeatures: true,
        returnNodeGeometry: true,
        returnNodeIDs: true,
        returnPathGuides: true,
        returnRoutes: true,
      });

      const analystParameter = new TransportationAnalystParameter({
        // Set the properties for the analyst parameter object
        resultSetting: resultSetting,
        weightFieldName: "SmLength",
      });

      const findClosestFacilitiesParameters =
        new FindClosestFacilitiesParameters({
          event: eventPointString,
          expectFacilityCount: 1,
          facilities: featuresCoordinatesObject,
          parameter: analystParameter,
        });

      new NetworkAnalystService(
        NETWORK_DATASET_SERVICE_URL
      ).findClosestFacilities(
        findClosestFacilitiesParameters,
        function (serviceResult) {
          serviceResult.result.facilityPathList.map(function (result) {
            // iterating over the facilityPathList array in the serviceResult object and performing operations on each element
            pathLayer.getSource().clear(); // clearing the source of the pathLayer
            pathLayer
              .getSource()
              .addFeatures(new GeoJSON().readFeatures(result.route)); // adding the features to the source of the pathLayer using the GeoJSON format

            const pathLayerExtent = pathLayer.getSource().getExtent(); // getting the extent of the source of the pathLayer
            map.value.getView().fit(pathLayerExtent, {
              duration: 500,
              padding: [150, 150, 150, 150],
            }); // fitting the view of the map to the extent of the pathLayer source with animation of duration 500ms

            map.value.addLayer(pathLayer); // adding the pathLayer back to the map
          });
        }
      );

      map.value.addLayer(eventLayer); // adding the eventLayer to the map
      isLoading.value = false;
    }

    function logClickedCoordinate(coordinate) {
      isLoading.value = true;
      map.value.removeLayer(pathLayer);
      pathLayer.getSource().clear();
      const userPositionString = {
        x: userCoordinates[1],
        y: userCoordinates[0],
      };
      console.log(userPositionString);

      const singleHospitalObject = [[coordinate[1], coordinate[0]]];
      console.log(singleHospitalObject);

      function convertToArrayOfObjects(data) {
        let output = [];
        let i = 0;
        let obj = {};
        for (i = 0; i < data.length; i++) {
          obj = {};
          obj["x"] = data[i][0];
          obj["y"] = data[i][1];

          output.push(obj);
        }

        return output;
      }

      let featuresCoordinatesObject =
        convertToArrayOfObjects(singleHospitalObject);
      console.log(featuresCoordinatesObject);

      const resultSetting = new TransportationAnalystResultSetting({
        // Set the properties for the result settings object
        returnEdgeFeatures: true,
        returnEdgeGeometry: true,
        returnEdgeIDs: true,
        returnNodeFeatures: true,
        returnNodeGeometry: true,
        returnNodeIDs: true,
        returnPathGuides: true,
        returnRoutes: true,
      });

      const analystParameter = new TransportationAnalystParameter({
        // Set the properties for the analyst parameter object
        resultSetting: resultSetting,
        weightFieldName: "SmLength",
      });

      const findClosestFacilitiesParameters =
        new FindClosestFacilitiesParameters({
          event: userPositionString,
          expectFacilityCount: 1,
          facilities: featuresCoordinatesObject,
          parameter: analystParameter,
        });

      new NetworkAnalystService(
        NETWORK_DATASET_SERVICE_URL
      ).findClosestFacilities(
        findClosestFacilitiesParameters,
        function (serviceResult) {
          serviceResult.result.facilityPathList.map(function (result) {
            // iterating over the facilityPathList array in the serviceResult object and performing operations on each element
            pathLayer.getSource().clear(); // clearing the source of the pathLayer
            pathLayer
              .getSource()
              .addFeatures(new GeoJSON().readFeatures(result.route)); // adding the features to the source of the pathLayer using the GeoJSON format

            const pathLayerExtent = pathLayer.getSource().getExtent(); // getting the extent of the source of the pathLayer
            map.value.getView().fit(pathLayerExtent, {
              duration: 500,
              padding: [75, 75, 75, 75],
            }); // fitting the view of the map to the extent of the pathLayer source with animation of duration 500ms

            map.value.addLayer(pathLayer); // adding the pathLayer back to the map
          });
        }
      );
      isLoading.value = false;
    }

    onMounted(() => {
      isLoading.value = true;
      // Use Promise.all to fetch all URLs at once and set reactive variables once all requests have been completed
      axios.get(SPESIALIS_LABEL_KEY_URL).then((result) => {
        spesialisList.value = result.data.spesialislabelkey;
      });

      axios.get(SPESIALIS_LABEL_VALUE_URL).then((result) => {
        spesialisListValue.value = result.data.spesialislabelvalue;
      });

      axios.get(RUMAH_SAKIT_URL).then((result) => {
        rumahSakitListValue.value = result.data.rumahsakit;
      });

      // Create a new Map object and add Bing Maps layer and a result layer
      map.value = new Map({
        target: "map",
        view: new View({
          center: [110.42, -6.99],
          zoom: 13,
          projection: "EPSG:4326",
        }),
      });

      // let bingMapLayer = new TileLayer({
      //   visible: true,
      //   preload: Infinity,
      //   source: new BingMaps({
      //     key: BING_MAPS_API_KEY,
      //     imagerySet: "Road",
      //   }),
      // });

      // map.value.addLayer(bingMapLayer);
      let mapboxLayer = new TileLayer({
        visible: true,
        opacity: 0.75,
        preload: Infinity,
        source: new XYZ({
          url: "https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWxpZmlhbm11aGFtbWFkIiwiYSI6ImNsaWNpemZnYjBjYm0zZ21xZWZwdjNvZnkifQ.ryiZUmhKwg56ACLen8zC6Q",
          attributions: '© <a href="https://www.mapbox.com/">Mapbox</a>',
          tilePixelRatio: 2,
          projection: "EPSG:3857",
          tileSize: 512,
          maxZoom: 20,
        }),
      });

      map.value.addLayer(mapboxLayer);
      map.value.addLayer(resultLayer);

      // Define parameters for querying features
      const sqlParam = new GetFeaturesBySQLParameters({
        toIndex: 26,
        queryParameter: {
          name: "Rumah_Sakit_Semarang@webgis_rs_server",
          attributeFilter: "1 = 1",
        },
        datasetNames: ["webgis_rs_server:Rumah_Sakit_Semarang"],
      });

      // Query feature service using SuperMap's FeatureService class and add features to result layer
      new FeatureService(HOSPITAL_FEATURES_SERVICES_URL).getFeaturesBySQL(
        sqlParam,
        function (serviceResult) {
          // console.log(serviceResult);
          resultLayer
            .getSource()
            .addFeatures(
              new GeoJSON().readFeatures(serviceResult.result.features)
            );
          featureRS = serviceResult.result.features;
        }
      );
      isLoading.value = false;
    });
    return {
      isLoading,
      featureRS,
      spesialisList,
      spesialisListValue,
      rumahSakitListValue,
      informasiRS,
      sidebarRS,
      findRS,
      closestRS,
      logClickedCoordinate,
      showAllHospitals,
    };
  },
};
</script>
