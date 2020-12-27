import getBearing from "../getBearing"

it("returns the expected results with an origin of 0", () => {
  expect(getBearing(0,0,0,-1)).toEqual(0)
  expect(getBearing(0,0,1,-1)).toEqual(45)
  expect(getBearing(0,0,1,0)).toEqual(90)
  expect(getBearing(0,0,1,1)).toEqual(135)
  expect(getBearing(0,0,0,1)).toEqual(180)
  expect(getBearing(0,0,-1,1)).toEqual(225)
  expect(getBearing(0,0,-1,0)).toEqual(270)
  expect(getBearing(0,0,-1,-1)).toEqual(315)
})


it("returns the expected results with a non 0 origin", () => {
  expect(getBearing(10,10,10,9)).toEqual(0)
  expect(getBearing(10,10,11,9)).toEqual(45)
  expect(getBearing(10,10,11,10)).toEqual(90)
  expect(getBearing(10,10,11,11)).toEqual(135)
  expect(getBearing(10,10,10,11)).toEqual(180)
  expect(getBearing(10,10,9,11)).toEqual(225)
  expect(getBearing(10,10,9,10)).toEqual(270)
  expect(getBearing(10,10,9,9)).toEqual(315)
})
