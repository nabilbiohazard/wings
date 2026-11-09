import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import {NECKLACE_HOLES,ringNecklaceRotation} from '../lib/necklace-holes.ts';

test('ring charms point outward at every attachment, including the upper sides',()=>{
  for(const hole of NECKLACE_HOLES){
    const angle=ringNecklaceRotation(hole.x,hole.y)*Math.PI/180;
    const dx=-Math.sin(angle),dy=Math.cos(angle);
    assert(dx*(hole.x-300)+dy*(hole.y-300)>0);
    assert(Math.abs(dx*((hole.y-300)/(250*250))-dy*((hole.x-300)/(232*232)))<1e-12);
  }
  assert.equal(ringNecklaceRotation(300,550),0);
  assert.equal(ringNecklaceRotation(532,300),-90);
  assert.equal(ringNecklaceRotation(68,300),90);
  assert.equal(ringNecklaceRotation(300,50),-180);
});
test('store and builder attachment coordinates stay identical',()=>{
  assert.deepEqual(NECKLACE_HOLES,JSON.parse(fs.readFileSync(new URL('../wordpress/wings-commerce/necklace-holes.json',import.meta.url))));
});
