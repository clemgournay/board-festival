import { Vector3 } from '../vendors/three/build/three.module.js';

export const FindAngle = (v1, v2, v3) => {
  const dx1 = v3.x - v2.x;
  const dz1 = v3.z - v2.z; 
  const angle1 = Math.atan2(dx1, dz1);

  const dx2 = v1.x - v2.x;
  const dz2 = v1.z - v2.z;
  const angle2 = Math.atan2(dx2, dz2);

  return angle2 - angle1;
}
export const ParseCoordinates = (coordinates) => {
  const parts = coordinates.split('_');
  const x = parseInt(parts[0]);
  const y = parseInt(parts[1]);
  const z = parseInt(parts[2]);
  return new Vector3(x, y, z);
}