import { DEG_PER_RAD } from './consts.ts'

/**
 * given the origin heading and (origin and target positions)
 * return the target's bearing from the origin in degrees
 * with the top of the screen being 0, then going clockwise around the origin
 * ie forwards is 0, right is 90, behind is 180, left is 270
 * @param  originHeading heading of the origin in degrees
 * @param  originX       HTML X coordinate
 * @param  originY       HTML Y coordinate (y gets bigger going down the screen)
 * @param  targetX       HTML X coordinate
 * @param  targetY       HTML Y coordinate (y gets bigger going down the screen)
 * @return               bearing in degrees
 */
export default function getBearing(
  originHeading:number,
  originX:number,
  originY:number,
  targetX:number,
  targetY:number,
) {
  let angle = Math.atan2( //get the angle from the origin to the target
    targetX - originX,
    originY - targetY
  ) * DEG_PER_RAD //convert to degrees

  angle -= originHeading //subtract the origin's heading

  angle %= 360 //modulo by 360 to keep our values between -359 and 359

  //force the angle to be positive between 0 and 359
  if(angle < 0) {
    angle += 360
  }

  return angle
}
