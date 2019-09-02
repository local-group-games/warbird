export interface Weapon {
  fireRate: number;
  lastFireTime: number;
  energyCost: number;
}

export interface WeaponSystem {
  weapons: Weapon[];
}
