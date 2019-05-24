import {SimpleMeshLayer, ScenegraphLayer} from '@deck.gl/mesh-layers';

import {
  GreatCircleLayer,
  S2Layer,
  H3ClusterLayer,
  H3HexagonLayer,
  TripsLayer
  // KMLLayer
} from '@deck.gl/geo-layers';

import {_GPUGridLayer as GPUGridLayer} from '@deck.gl/aggregation-layers';
import {_NewGridLayer as NewGridLayer} from '@deck.gl/aggregation-layers';
import * as h3 from 'h3-js';

import {registerLoaders} from '@loaders.gl/core';
import {PLYLoader} from '@loaders.gl/ply';
import {GLTFScenegraphLoader, GLTFEnvironment} from '@luma.gl/addons';
import GL from '@luma.gl/constants';

import * as dataSamples from '../data-samples';

registerLoaders([GLTFScenegraphLoader, PLYLoader]);

const GLTF_BASE_URL =
  'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/luma.gl/examples/gltf/';

const CUBE_FACE_TO_DIRECTION = {
  [GL.TEXTURE_CUBE_MAP_POSITIVE_X]: 'right',
  [GL.TEXTURE_CUBE_MAP_NEGATIVE_X]: 'left',
  [GL.TEXTURE_CUBE_MAP_POSITIVE_Y]: 'top',
  [GL.TEXTURE_CUBE_MAP_NEGATIVE_Y]: 'bottom',
  [GL.TEXTURE_CUBE_MAP_POSITIVE_Z]: 'front',
  [GL.TEXTURE_CUBE_MAP_NEGATIVE_Z]: 'back'
};

const IMAGE_BASED_LIGHTING_ENVIRONMENT = {
  brdfLutUrl: `${GLTF_BASE_URL}/brdfLUT.png`,
  getTexUrl: (type, dir, mipLevel) =>
    `${GLTF_BASE_URL}/papermill/${type}/${type}_${CUBE_FACE_TO_DIRECTION[dir]}_${mipLevel}.jpg`
};

const SimpleMeshLayerExample = {
  layer: SimpleMeshLayer,
  props: {
    id: 'mesh-layer',
    data: dataSamples.points,
    mesh:
      'https://raw.githubusercontent.com/uber-web/loaders.gl/e8e7f724cc1fc1d5882125b13e672e44e5ada14e/modules/ply/test/data/cube_att.ply',
    sizeScale: 40,
    getPosition: d => d.COORDINATES,
    getColor: d => [Math.random() * 255, Math.random() * 255, Math.random() * 255],
    getTransformMatrix: d => [
      Math.random() * 4 - 2,
      Math.random() * 4 - 2,
      Math.random() * 4 - 2,
      0,
      Math.random() * 4 - 2,
      Math.random() * 4 - 2,
      Math.random() * 4 - 2,
      0,
      Math.random() * 4 - 2,
      Math.random() * 4 - 2,
      Math.random() * 4 - 2,
      0,
      0,
      0,
      Math.random() * 10000,
      1
    ]
  }
};

const ScenegraphLayerExample = {
  layer: ScenegraphLayer,
  props: {
    id: 'scenegraph-layer',
    data: dataSamples.points,
    pickable: true,
    sizeScale: 50,
    scenegraph:
      'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
    getPosition: d => d.COORDINATES,
    getOrientation: d => [Math.random() * 360, Math.random() * 360, Math.random() * 360],
    getTranslation: d => [0, 0, Math.random() * 10000],
    getScale: [1, 1, 1],
    _lighting: 'flat'
  }
};

const ScenegraphLayerPbrExample = {
  layer: ScenegraphLayer,
  props: {
    id: 'scenegraph-layer-pbr',
    data: dataSamples.points,
    pickable: true,
    sizeScale: 50,
    scenegraph:
      'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
    getPosition: d => d.COORDINATES,
    getOrientation: d => [Math.random() * 360, Math.random() * 360, Math.random() * 360],
    getTranslation: d => [0, 0, Math.random() * 10000],
    getScale: [1, 1, 1],
    _lighting: 'pbr'
  }
};

const TEN_POINTS = dataSamples.points.slice(0, 10);

const ScenegraphLayerPbrIblExample = {
  layer: ScenegraphLayer,
  props: {
    id: 'scenegraph-layer-pbr-ibl',
    data: TEN_POINTS,
    pickable: true,
    sizeScale: 50,
    scenegraph:
      'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
    getPosition: d => d.COORDINATES,
    getOrientation: [0, 0, 90],
    getTranslation: [0, 0, 1000],
    getScale: [10, 10, 10],
    _lighting: 'pbr',
    _imageBasedLightingEnvironment: ({gl}) =>
      new GLTFEnvironment(gl, IMAGE_BASED_LIGHTING_ENVIRONMENT)
  }
};

const GRID_LAYER_PROPS = {
  getData: () => dataSamples.points,
  props: {
    id: 'gpu-grid-layer',
    cellSize: 200,
    opacity: 1,
    extruded: true,
    pickable: false,
    getPosition: d => d.COORDINATES
  }
};

const GPUGridLayerExample = Object.assign({}, {layer: GPUGridLayer}, GRID_LAYER_PROPS);
const NewGridLayerExample = Object.assign({}, {layer: NewGridLayer}, GRID_LAYER_PROPS);

const GPUGridLayerPerfExample = (id, getData) => ({
  layer: GPUGridLayer,
  getData,
  props: {
    id: `gpuGridLayerPerf-${id}`,
    cellSize: 200,
    opacity: 1,
    extruded: true,
    pickable: false,
    getPosition: d => d
  }
});

const GreatCircleLayerExample = {
  layer: GreatCircleLayer,
  getData: () => dataSamples.greatCircles,
  props: {
    id: 'greatCircleLayer',
    getSourcePosition: d => d.source,
    getTargetPosition: d => d.target,
    getSourceColor: [64, 255, 0],
    getTargetColor: [0, 128, 200],
    widthMinPixels: 5,
    pickable: true
  }
};

const S2LayerExample = {
  layer: S2Layer,
  props: {
    data: dataSamples.s2cells,
    // data: ['14','1c','24','2c','34','3c'],
    opacity: 0.6,
    getS2Token: f => f.token,
    getFillColor: f => [f.value * 255, (1 - f.value) * 255, (1 - f.value) * 128, 128],
    getElevation: f => Math.random() * 1000,
    pickable: true
  }
};

const H3ClusterLayerExample = {
  layer: H3ClusterLayer,
  props: {
    data: ['882830829bfffff'],
    getHexagons: d => h3.kRing(d, 6),
    getLineWidth: 100,
    stroked: true,
    filled: false
  }
};

const H3HexagonLayerExample = {
  layer: H3HexagonLayer,
  props: {
    // data: h3.kRing('891c0000003ffff', 4), // Pentagon sample, [-143.478, 50.103]
    data: h3.kRing('882830829bfffff', 4), // SF
    getHexagon: d => d,
    getColor: (d, {index}) => [255, index * 5, 0],
    getElevation: d => Math.random() * 1000
  }
};

const TripsLayerExample = {
  layer: TripsLayer,
  propTypes: {
    currentTime: {
      type: 'range',
      step: 12,
      min: 0,
      max: 1200
    },
    trailLength: {
      type: 'range',
      step: 12,
      min: 0,
      max: 1200
    }
  },
  props: {
    id: 'trips-layer',
    data: dataSamples.SFTrips,
    getPath: d =>
      d.waypoints.map(p => [p.coordinates[0], p.coordinates[1], p.timestamp - 1554772579000]),
    getColor: [253, 128, 93],
    opacity: 0.8,
    widthMinPixels: 5,
    rounded: true,
    trailLength: 600,
    currentTime: 500
  }
};

/* eslint-disable quote-props */
export default {
  'Mesh Layers': {
    SimpleMeshLayer: SimpleMeshLayerExample,
    ScenegraphLayer: ScenegraphLayerExample,
    'ScenegraphLayer (PBR)': ScenegraphLayerPbrExample,
    'ScenegraphLayer (PBR+IBL)': ScenegraphLayerPbrIblExample
  },
  'Geo Layers': {
    S2Layer: S2LayerExample,
    H3ClusterLayer: H3ClusterLayerExample,
    H3HexagonLayer: H3HexagonLayerExample,
    GreatCircleLayer: GreatCircleLayerExample,
    TripsLayer: TripsLayerExample
  },
  'Experimental Core Layers': {
    GPUGridLayer: GPUGridLayerExample,
    NewGridLayer: NewGridLayerExample,
    'GPUGridLayer (1M)': GPUGridLayerPerfExample('1M', dataSamples.getPoints1M),
    'GPUGridLayer (5M)': GPUGridLayerPerfExample('5M', dataSamples.getPoints5M)
  }
};
