import {Board} from "./kore/Board";
import { Direction } from "./kore/Direction";
import { ShipyardAction } from "./kore/ShipyardAction";
import { KoreIO } from "./kore/KoreIO";


var fs = require('fs');
const debug_stream = fs.createWriteStream('log_debug.txt');

const io = new KoreIO();
// agent.run takes care of running your code per tick
io.run((board: Board): Board => {
    const me = board.currentPlayer;
    const turn = board.step;
    const spawnCost = board.configuration.spawnCost;
    let koreLeft = me.kore;

    const gameStatsStr =
    `turn: ${turn} shipyard0 maxSpawn: ${me.shipyards[0].maxSpawn}` + '\n';
    
    debug_stream.write(gameStatsStr);

    for (let shipyard of me.shipyards) {
        if (shipyard.shipCount > 10) {
            const dir = Direction.fromIndex(turn % 4);
            const action = ShipyardAction.launchFleetWithFlightPlan(2, dir.toChar());
            shipyard.setNextAction(action);
        } else if (koreLeft > spawnCost * shipyard.maxSpawn) {
            const action = ShipyardAction.spawnShips(shipyard.maxSpawn);
            shipyard.setNextAction(action);
            koreLeft -= spawnCost * shipyard.maxSpawn;
        } else if (koreLeft > spawnCost) {
            const action = ShipyardAction.spawnShips(1);
            shipyard.setNextAction(action);
            koreLeft -= spawnCost;
        }
    }

    // nextActions will be pulled off of your shipyards
    return board;
});


