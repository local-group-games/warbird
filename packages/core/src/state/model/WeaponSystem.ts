export interface Weapon {
  projectileVelocity: number;
  fireRate: number;
  lastFireTime: number;
  energyCost: number;
}

export interface WeaponSystem {
  activeWeapon: number;
  weapons: Weapon[];
}
