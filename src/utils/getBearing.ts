/**
 * given the origin and target positions
 * return the target's bearing from the origin in degrees
 * with the top of the screen being 0, then going clockwise around the origin
 * ie forwards is 0, right is 90, behind is 180, left is 270
 * @param  originX HTML X coordinate
 * @param  originY HTML Y coordinate (y gets bigger going down the screen)
 * @param  targetX HTML X coordinate
 * @param  targetY HTML Y coordinate (y gets bigger going down the screen)
 * @return         bearing in degrees
 */
export default function getBearing(
  originX,
  originY,
  targetX,
  targetY,
) {
  let angle = Math.atan2(
    targetX - originX,
    originY - targetY
  ) * 180 / Math.PI
  if(angle < 0) {
    angle += 360
  }

  return angle
}
