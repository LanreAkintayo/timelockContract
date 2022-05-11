const currentTime = require("./currentTime")

async function increaseTime(duration) {
 console.log("Moving blocks...")
 await network.provider.send("evm_increaseTime", [duration])

 console.log(`Moved forward in time ${duration} seconds`)
}

async function increaseTimeTo(target) {
 let now = await currentTime();
 if (target < now)
   throw Error(
     `Cannot increase current time(${now}) to a moment in the past(${target})`
   );
 let diff = target - now;
 const result = await increaseTime(diff);

 return result;
}

module.exports = increaseTimeTo