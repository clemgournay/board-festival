
import { TextureLoader } from '../vendors/three/build/three.module.js';
import { FBXLoader } from '../vendors/three/examples/jsm/loaders/FBXLoader.js';
import { OBJLoader } from '../vendors/three/examples/jsm/loaders/OBJLoader.js';

import { ENV } from '../env.js';

export class Loader {


  constructor(game) {
    this.game = game;
    this.loadedAssets = {data: {}, meshes: {}, textures: {}, audios: {}, boards: {}};
  }

  async load(assets) {
    for (let asset of assets) {
      switch (asset.type) {
        case 'mesh':
          const mesh = await this.loadMesh(`./assets/meshes/${asset.id}.fbx`);
          this.loadedAssets.meshes[asset.id] = mesh;
        break;
        case 'texture':
          const texture = await this.loadTexture(asset.src);
          this.loadedAssets.textures[asset.id] = texture;
        break;
        case 'audio':
          const audio = await this.loadAudio(`./assets/audios/${asset.id}.mp3`);
          this.loadedAssets.audios[asset.id] = audio;
        break;
        case 'data':
          const data = await this.loadJSON(asset.src);
          this.loadedAssets.data[asset.id] = data;
        break;
        case 'board':
          const boardMesh = await this.loadMesh(`${ENV.apiURL}/boards/${asset.id}/mesh.fbx`);
          const boardData = await this.loadJSON(`${ENV.apiURL}/boards/${asset.id}/data.json`);
          const boardBgm = await this.loadAudio(`${ENV.apiURL}/boards/${asset.id}/bgm.mp3`);
          this.loadedAssets.boards[asset.id] = {mesh: boardMesh, data: boardData, bgm: boardBgm};
        break;
      }
    }
    return this.loadedAssets;
  }

  async loadMesh(src) {
    let loader;
    const ext = src.split(/[#?]/)[0].split('.').pop().trim();
    switch (ext) {
      case 'obj':
        loader = new OBJLoader();
      break;
      case 'fbx':
        loader = new FBXLoader();
      break;
      default:
        loader = new OBJLoader();
      break;
    }
    return await loader.loadAsync(src);
  }

  async loadTexture(src) {
    const loader = new TextureLoader();
    const texture = await loader.loadAsync(src); 
    return texture;
  }

  async loadAudio(src) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.src = src;
      audio.oncanplay = function () {
        resolve(this);
      }
      audio.onerror = function (e) {
        reject(e);
      }
    });

  }

  async loadJSON(src) {
    return new Promise((resolve, reject) => {
      fetch(src)
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((reason) => reject(reason))
    });
  }

}