var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");
var roleBuilder = require("role.builder");

module.exports.loop = function () {
  //   var tower = Game.getObjectById("aa92655424bae709f8d3a4fe");
  //   if (tower) {
  //     var closestDamagedStructure = tower.pos.findClosestByRange(
  //       FIND_STRUCTURES,
  //       {
  //         filter: (structure) => structure.hits < structure.hitsMax,
  //       }
  //     );
  //     if (closestDamagedStructure) {
  //       tower.repair(closestDamagedStructure);
  //     }

  //     var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  //     if (closestHostile) {
  //       tower.attack(closestHostile);
  //     }
  //   }

  //memory mgmt
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("Clearing non-existing creep memory:", name);
    }
  }
  //get harvesters
  // console.log(JSON.stringify(Game.rooms));
  var harvesters = Object.entries(Game.creeps).filter(
    (creep) => creep[1].memory.role === "harvester"
  );
  // console.log(JSON.stringify(harvesters));
  // console.log(JSON.stringify(Game.creeps));
  // console.log(Object.keys(Game.rooms)[0].energyAvailable);
  //spawn harvester if <2 and enough energy
  if (harvesters.length < 2) {
    if (Game.rooms[Object.keys(Game.rooms)[0]].energyAvailable >= 300) {
      var newName = "Harvester" + Game.time;
      console.log("Spawning new harvester: " + newName);
      Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
        memory: { role: "harvester" },
      });
    }
  }

  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (creep.memory.role == "harvester") {
      roleHarvester.run(creep);
    }
    if (creep.memory.role == "upgrader") {
      roleUpgrader.run(creep);
    }
    if (creep.memory.role == "builder") {
      roleBuilder.run(creep);
    }
  }

  if (Game.spawns["Spawn1"].spawning) {
    var spawningCreep = Game.creeps[Game.spawns["Spawn1"].spawning.name];
    Game.spawns["Spawn1"].room.visual.text(
      "🛠️" + spawningCreep.memory.role,
      Game.spawns["Spawn1"].pos.x + 1,
      Game.spawns["Spawn1"].pos.y,
      { align: "left", opacity: 0.8 }
    );
  }
};
