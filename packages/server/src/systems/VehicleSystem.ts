import {
  Arsenal,
  Body,
  Bullet,
  Capacitor,
  Expireable,
  Player,
  PlayerInputs,
} from "@warbird/core";
import { System } from "@warbird/ecs";
import { PhysicsSystem } from "./PhysicsSystem";

const VEHICLE_BASE_TURN = 0.05;
const VEHICLE_BASE_THRUST = 10;
const VEHICLE_AFTERBURNER_THRUST_MODIFIER = 2;
const VEHICLE_ENERGY_COST_PER_THRUST_PER_S = 2;

export function getVehicleThrust(inputs: PlayerInputs) {
  return (
    (Number(inputs.thrustForward) - Number(inputs.thrustReverse)) *
    (inputs.afterburners ? VEHICLE_AFTERBURNER_THRUST_MODIFIER : 1) *
    VEHICLE_BASE_THRUST
  );
}

export function getVehicleTurn(input: PlayerInputs) {
  return (Number(input.turnLeft) - Number(input.turnRight)) * VEHICLE_BASE_TURN;
}

export class VehicleSystem extends System<{}, { physics: PhysicsSystem }> {
  private inputsToApply: Player[] = [];

  query = {};

  applyInput(player: Player) {
    this.inputsToApply.push(player);
  }

  execute() {
    const deltaTimeS = this.world.clock.deltaTime / 1000;

    let player: Player | undefined;

    while ((player = this.inputsToApply.pop())) {
      const { vehicleId, input } = player;

      if (!vehicleId) {
        continue;
      }

      const vehicle = this.world.getEntityById(vehicleId);

      if (!vehicle) {
        continue;
      }

      const body = vehicle.getComponent(Body);
      const arsenal = vehicle.getComponent(Arsenal);
      const capacitor = vehicle.getComponent(Capacitor);

      if (input.thrustForward || input.thrustReverse) {
        const thrust = getVehicleThrust(input);
        const cost =
          Math.abs(thrust) * VEHICLE_ENERGY_COST_PER_THRUST_PER_S * deltaTimeS;

        if (capacitor.energy >= cost) {
          this.world.systems.physics.applyForceToBody(vehicle, 0, thrust);
          capacitor.energy -= cost;
        }
      }

      if (input.turnLeft || input.turnRight) {
        const turn = getVehicleTurn(input);
        this.world.systems.physics.rotateBody(vehicle, turn);
      }

      if (input.activateWeapon) {
        const weapon = arsenal.weapons[arsenal.activeWeapon];

        if (weapon) {
          if (
            capacitor.energy >= weapon.energyCost &&
            this.world.clock.currentTime - weapon.lastFireTime >=
              weapon.fireRate * 100
          ) {
            const bullet = new Bullet();
            const bulletBody = bullet.getComponent(Body);
            const bulletExpireable = bullet.getComponent(Expireable);
            const s = Math.sin(body.angle);
            const c = Math.cos(body.angle);

            bulletExpireable.lifeTimeMs = 1000;

            bulletBody.x = -body.height * s + body.x;
            bulletBody.y = body.height * c + body.y;
            bulletBody.velocityX =
              -weapon.projectileVelocity * s + body.velocityX;
            bulletBody.velocityY =
              weapon.projectileVelocity * c + body.velocityY;

            this.world.addEntity(bullet);

            weapon.lastFireTime = this.world.clock.currentTime;
            capacitor.energy -= weapon.energyCost;
          }
        }
      }
    }
  }
}
