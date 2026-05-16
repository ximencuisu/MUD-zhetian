import type { CombatBuff } from '../types/game';

/**
 * Buff/Debuff effect definitions for skills.
 * Maps skill IDs to the buff/debuff effect they should apply.
 */export interface BuffEffectDef {
	  buff: Omit<CombatBuff, 'duration'> & { duration: number };
	  /** For DoT (damage over time) effects — damage per turn */
	  dotDamage?: number;
	  /** For skill-level scaling */
	  scalePerSkillLevel?: number;
	  /** For special multi-stat buffs, additional stats to modify */
	  additionalEffects?: Array<{ stat: string; value: number }>;
	  /** Special effect type: stun/freeze/silence/poison/bleed/fear */
	  effectType?: 'stun' | 'freeze' | 'silence' | 'poison' | 'bleed' | 'fear';
	  /** Chance to apply stun/freeze (0-100) */
	  effectChance?: number;
	  /** Lifesteal: heal % of damage dealt (buff on self) */
	  lifestealPercent?: number;
	  /** Heal per turn (buff) */
	  healPerTurn?: number;
	  /** Bonus damage multiplier on next hit (freeze) */
	  bonusDmgOnHit?: number;
	  /** Silence: reduce enemy attack multiplier */
	  silenceAtkMult?: number;
	}

export const SKILL_BUFF_EFFECTS: Record<string, BuffEffectDef> = {
  // ── 通用增益技能 ──

  'body_shield': {
    buff: {
      id: 'defense_up', name: '源力护体',
      description: '护体罡气环绕，防御大幅提升',
      type: 'buff', stat: 'defense', value: 15,
      icon: '🛡️', sourceSkill: 'body_shield',
    },
    duration: 3,
    scalePerSkillLevel: 2,
  },

  'spring_burst': {
    buff: {
      id: 'power_surge', name: '命泉爆发',
      description: '命泉之力爆发，攻击力大幅提升',
      type: 'buff', stat: 'attack', value: 20,
      icon: '💥', sourceSkill: 'spring_burst',
    },
    duration: 4,
    scalePerSkillLevel: 3,
  },

  'void_mirror_gaze': {
    buff: {
      id: 'crit_up', name: '虚空镜映',
      description: '映照敌方弱点，暴击率大增',
      type: 'buff', stat: 'critRate', value: 15,
      icon: '🔮', sourceSkill: 'void_mirror_gaze',
    },
    duration: 3,
    scalePerSkillLevel: 1,
  },

  'taixuan_void_step': {
    buff: {
      id: 'dodge_up', name: '虚影残形',
      description: '残影迷惑敌人，闪避大幅提升',
      type: 'buff', stat: 'dodge', value: 20,
      icon: '🌪️', sourceSkill: 'taixuan_void_step',
    },
    duration: 3,
    scalePerSkillLevel: 2,
  },

  // ── 九秘 ──

  'secret_lin': {
    buff: {
      id: 'lin_secret', name: '临字秘',
      description: '临字秘加持全身，攻击暴击暴涨',
      type: 'buff', stat: 'attack', value: 30,
      icon: '✨', sourceSkill: 'secret_lin',
    },
    duration: 5,
    scalePerSkillLevel: 4,
    additionalEffects: [
      { stat: 'critRate', value: 10 },
      { stat: 'critDmg', value: 20 },
    ],
  },

  'secret_jie': {
    buff: {
      id: 'jie_secret', name: '皆字秘',
      description: '皆字秘加持，身如流光，闪避速度暴涨',
      type: 'buff', stat: 'dodge', value: 30,
      icon: '⚡', sourceSkill: 'secret_jie',
    },
    duration: 4,
    scalePerSkillLevel: 3,
  },

  'secret_dou': {
    buff: {
      id: 'dou_secret', name: '斗字秘',
      description: '斗字秘越战越强，每回合攻击力递增',
      type: 'buff', stat: 'attack', value: 10,
      icon: '⚔️', sourceSkill: 'secret_dou',
    },
    duration: 6,
    scalePerSkillLevel: 2,
  },

  'taixuan_xing_zi': {
    buff: {
      id: 'xing_secret', name: '太玄行字秘',
      description: '行字秘奥义，速度无双如流光掠影',
      type: 'buff', stat: 'dodge', value: 40,
      icon: '💨', sourceSkill: 'taixuan_xing_zi',
    },
    duration: 3,
    scalePerSkillLevel: 5,
  },

  // ── 攻击技能减益（debuff on enemy） ──

  'green_lotus_fire': {
    buff: {
      id: 'burning', name: '青莲圣火',
      description: '青莲之火灼烧，每回合受到额外火焰伤害',
      type: 'debuff', stat: 'none', value: 0,
      icon: '🔥', sourceSkill: 'green_lotus_fire',
    },
    duration: 3,
    dotDamage: 15,
    scalePerSkillLevel: 3,
  },

  'ancient_king_fist': {
    buff: {
      id: 'armor_break', name: '破甲',
      description: '古皇拳劲穿透防御，防御大幅降低',
      type: 'debuff', stat: 'defense', value: -12,
      icon: '💢', sourceSkill: 'ancient_king_fist',
    },
    duration: 2,
    scalePerSkillLevel: -2, // 技能等级越高，破甲越强（value叠加）
  },

  'holy_light_palm': {
    buff: {
      id: 'light_burn', name: '圣光灼烧',
      description: '圣光之力灼烧阴邪，每回合受到额外伤害',
      type: 'debuff', stat: 'none', value: 0,
      icon: '☀️', sourceSkill: 'holy_light_palm',
    },
    duration: 2,
    dotDamage: 20,
    scalePerSkillLevel: 4,
  },

  'divine_power_surge': {
    buff: {
      id: 'stagger', name: '震退',
      description: '神力冲击震退敌人，命中率降低',
      type: 'debuff', stat: 'hit', value: -10,
      icon: '💫', sourceSkill: 'divine_power_surge',
    },
    duration: 2,
    scalePerSkillLevel: -1,
  },

  'ancient_dragon_fist': {
    buff: {
      id: 'dragon_vein', name: '龙脉震荡',
      description: '龙劲震荡，令敌人内息混乱，闪避降低',
      type: 'debuff', stat: 'dodge', value: -15,
      icon: '🐉', sourceSkill: 'ancient_dragon_fist',
    },
    duration: 2,
    scalePerSkillLevel: -2,
  },

  // ── 宗门技能效果 ──

  // 摇光 — 眩晕
  'yg_sect_attack': {
    buff: {
      id: 'stun_yg', name: '眩晕',
      description: '被摇光秘术击中，头晕目眩无法行动',
      type: 'debuff', stat: 'none', value: 0,
      icon: '💫', sourceSkill: 'yg_sect_attack',
    },
    duration: 1,
    effectType: 'stun',
    effectChance: 30,
  },

  // 摇光 — 恐惧
  'yg_sage_attack': {
    buff: {
      id: 'fear_yg', name: '恐惧',
      description: '被摇光圣威笼罩，心生恐惧战力下降',
      type: 'debuff', stat: 'none', value: 0,
      icon: '😨', sourceSkill: 'yg_sage_attack',
    },
    duration: 1,
    effectType: 'fear',
    effectChance: 50,
  },

  // 摇光 — 隐殇（隐身+暴击）
  'yg_secret_attack': {
    buff: {
      id: 'stealth_crit_yg', name: '隐殇',
      description: '隐入虚空，下次攻击必定暴击',
      type: 'buff', stat: 'critRate', value: 100,
      icon: '👁️', sourceSkill: 'yg_secret_attack',
    },
    duration: 2,
    additionalEffects: [
      { stat: 'critDmg', value: 100 },
    ],
  },

  // 摇光王 — 闪避 escape
  'yg_king_escape': {
    buff: {
      id: 'dodge_escape_yg', name: '闪避提升',
      description: '摇光王身法，闪避大幅提升',
      type: 'buff', stat: 'dodge', value: 50,
      icon: '🌪️', sourceSkill: 'yg_king_escape',
    },
    duration: 2,
    scalePerSkillLevel: 3,
  },

  // 姬家 — 隐秘+下次暴击
  'ji_sect_escape': {
    buff: {
      id: 'stealth_crit_ji', name: '虚空隐匿',
      description: '隐匿于虚空中，下次攻击必定暴击',
      type: 'buff', stat: 'critRate', value: 100,
      icon: '🌫️', sourceSkill: 'ji_sect_escape',
    },
    duration: 1,
  },

  // 太玄 — 闪避 escape
  'tx_sect_escape': {
    buff: {
      id: 'dodge_escape_tx', name: '流光掠影',
      description: '太玄身法如流光掠影，闪避大幅提升',
      type: 'buff', stat: 'dodge', value: 30,
      icon: '💨', sourceSkill: 'tx_sect_escape',
    },
    duration: 2,
    scalePerSkillLevel: 3,
  },

  // 紫府 — 石化（眩晕）
  'zf_sect_array': {
    buff: {
      id: 'petrify_zf', name: '石化',
      description: '被紫府大阵困住，无法行动',
      type: 'debuff', stat: 'none', value: 0,
      icon: '🗿', sourceSkill: 'zf_sect_array',
    },
    duration: 1,
    effectType: 'stun',
    effectChance: 100,
  },

  // 紫府 — 吸神（吸血回复）
  'zf_sect_attack': {
    buff: {
      id: 'siphon_life_zf', name: '吸神',
      description: '吸收神力，攻击恢复生命',
      type: 'buff', stat: 'none', value: 0,
      icon: '💜', sourceSkill: 'zf_sect_attack',
    },
    duration: 3,
    lifestealPercent: 5,
    scalePerSkillLevel: 1,
  },

  // 姜家 — 反弹（用 lifesteal 反伤效果，简化处理）
  'jg_sect_attack': {
    buff: {
      id: 'thorn_armor_jg', name: '荆棘护体',
      description: '反弹部分受到的伤害',
      type: 'buff', stat: 'none', value: 0,
      icon: '🛡️', sourceSkill: 'jg_sect_attack',
    },
    duration: 3,
    additionalEffects: [
      { stat: 'dodge', value: 10 },
    ],
  },

  // ── 妖族 ──

  // 妖族 — 流血
  'yao_mortal_attack': {
    buff: {
      id: 'bleed_yao', name: '流血',
      description: '伤口撕裂，每回合持续失血',
      type: 'debuff', stat: 'none', value: 0,
      icon: '🩸', sourceSkill: 'yao_mortal_attack',
    },
    duration: 3,
    dotDamage: 8,
    effectType: 'bleed',
    scalePerSkillLevel: 2,
  },

  // 妖族 — 燃烧
  'yao_sect_attack': {
    buff: {
      id: 'burn_yao', name: '妖火灼烧',
      description: '妖火焚身，每回合受到火焰伤害',
      type: 'debuff', stat: 'none', value: 0,
      icon: '🔥', sourceSkill: 'yao_sect_attack',
    },
    duration: 3,
    dotDamage: 12,
    effectType: 'poison',
    scalePerSkillLevel: 3,
  },

  // 妖族 — 群烧
  'yao_king_attack': {
    buff: {
      id: 'burn_king_yao', name: '妖焰滔天',
      description: '滔天妖焰焚烧一切，每回合受到大量火焰伤害',
      type: 'debuff', stat: 'none', value: 0,
      icon: '🔥', sourceSkill: 'yao_king_attack',
    },
    duration: 3,
    dotDamage: 20,
    effectType: 'poison',
    scalePerSkillLevel: 4,
  },

  // ── 帝经 ──

  // 姬家虚空经 — 放逐
  'emperor_ji_void': {
    buff: {
      id: 'banish_ji', name: '虚空放逐',
      description: '被放逐到虚空裂隙中，无法行动',
      type: 'debuff', stat: 'none', value: 0,
      icon: '🌀', sourceSkill: 'emperor_ji_void',
    },
    duration: 3,
    effectType: 'stun',
    effectChance: 100,
  },

  // 紫府帝经 — 困敌大阵（持续伤害+眩晕）
  'emperor_zifu_purple': {
    buff: {
      id: 'purple_array_zf', name: '紫帝困天阵',
      description: '被紫帝大阵困住，无法行动并持续受创',
      type: 'debuff', stat: 'none', value: 0,
      icon: '🔮', sourceSkill: 'emperor_zifu_purple',
    },
    duration: 2,
    effectType: 'stun',
    effectChance: 100,
    dotDamage: 25,
    scalePerSkillLevel: 5,
  },

  // 青帝经 — 吸血
  'emperor_yao_green': {
    buff: {
      id: 'lifesteal_yao_emperor', name: '青帝轮回',
      description: '青帝轮回之力，造成伤害时恢复生命',
      type: 'buff', stat: 'none', value: 0,
      icon: '🌿', sourceSkill: 'emperor_yao_green',
    },
    duration: 5,
    lifestealPercent: 50,
    scalePerSkillLevel: 3,
  },

  // 摇光帝经 — 无双（必暴+无视防御）
  'emperor_yaoguan_huang': {
    buff: {
      id: 'unstoppable_yg', name: '摇光无双',
      description: '摇光帝威浩荡，必定暴击无视防御',
      type: 'buff', stat: 'critRate', value: 100,
      icon: '👑', sourceSkill: 'emperor_yaoguan_huang',
    },
    duration: 3,
    additionalEffects: [
      { stat: 'critDmg', value: 100 },
    ],
  },
};

/**
 * Get the scaled buff/debuff stats based on skill level.
 * Returns a CombatBuff ready to be added to playerBuffs/targetDebuffs.
 */
export function createScaledBuff(
  skillId: string,
  skillLevel: number
): CombatBuff | null {
  const def = SKILL_BUFF_EFFECTS[skillId];
  if (!def) return null;

  const scaledValue = def.scalePerSkillLevel
    ? def.buff.value + def.scalePerSkillLevel * (skillLevel - 1)
    : def.buff.value;

  const computedDotDamage = def.dotDamage
    ? def.dotDamage + (def.scalePerSkillLevel || 0) * (skillLevel - 1)
    : undefined;	  const { scalePerSkillLevel, additionalEffects, ...rest } = def;
	
	  return {
	    ...def.buff,
	    value: scaledValue,
	    duration: def.duration,
	    dotDamage: computedDotDamage,
	    effectType: def.effectType,
	    lifestealPercent: def.lifestealPercent,
	    healPerTurn: def.healPerTurn,
	    bonusDmgOnHit: def.bonusDmgOnHit,
	  };
}

/**
 * Get DoT damage for a skill at a given level.
 */
export function getDotDamage(skillId: string, skillLevel: number): number {
  const def = SKILL_BUFF_EFFECTS[skillId];
  if (!def || !def.dotDamage) return 0;
  return def.dotDamage + (def.scalePerSkillLevel || 0) * (skillLevel - 1);
}

/**
 * Get additional multi-stat effects for a skill at a given level.
 */
export function getAdditionalEffects(skillId: string, skillLevel: number): Array<{ stat: string; value: number }> {
  const def = SKILL_BUFF_EFFECTS[skillId];
  if (!def || !def.additionalEffects) return [];
  return def.additionalEffects.map(e => ({
    stat: e.stat,
    value: e.value + (def.scalePerSkillLevel || 0) * (skillLevel - 1),
  }));
}

/**
 * Check if a skill has a debuff effect (applied to enemy).
 */
export function hasDebuffEffect(skillId: string): boolean {
  const def = SKILL_BUFF_EFFECTS[skillId];
  return def?.buff.type === 'debuff';
}

/**
 * Check if a skill has a buff effect (applied to self).
 */
export function hasBuffEffect(skillId: string): boolean {
  const def = SKILL_BUFF_EFFECTS[skillId];
  return def?.buff.type === 'buff';
}
